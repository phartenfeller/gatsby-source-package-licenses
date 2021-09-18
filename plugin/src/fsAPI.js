const path = require('path');
const { statSync } = require('fs');
const { getUrl, getLicense } = require('./extractors');
const Logger = require('./logger');
const { readFile, asyncReadDir } = require('./asyncedFs');

const ROOT_PATH = './node_modules';

// build license info object
async function createLicenseInfo(packagePath, manifest, logger) {
  try {
    const obj = {};

    const licensePath = path.join(packagePath, 'LICENSE');
    const licenseData = await readFile(licensePath);

    if (licenseData.exists) {
      obj.licenseText = licenseData.content;
    } else {
      obj.licenseText = null;
    }

    obj.package = manifest.name;
    obj.version = manifest.version;
    obj.license = getLicense(manifest);
    obj.url = getUrl(manifest);
    obj.identifier = `${obj.package}@${obj.version}`;

    return obj;
  } catch (e) {
    logger.error(`Error in createLicenseInfo for "${packagePath}" => ${e}`);
    return null;
  }
}

async function getLicenseInfo(packagePath, logger, goDeeper = false) {
  const manifestPath = path.join(packagePath, 'package.json');
  const packageData = await readFile(manifestPath);

  // sometimes folders in node_modules have subfolders for each module
  // then they don't have a package.json file
  // so scan the subfolders again
  if (!packageData.exists && goDeeper === true) {
    logger.debug(`Going deeper for => ${packagePath}`);
    try {
      const directories = await asyncReadDir(packagePath);

      const licenses = await Promise.all(
        directories.map((dir) => {
          const dirPath = path.join(packagePath, dir);
          return getLicenseInfo(dirPath, logger, false);
        })
      );
      return licenses;
    } catch (e) {
      logger.error(`Could not read directory from path => ${packagePath}`);
      return null;
    }
  }

  // if package.json was found
  return createLicenseInfo(
    packagePath,
    JSON.parse(packageData.content),
    logger
  );
}

async function getLicenses(reporter = null, level = 1) {
  const logger = new Logger(reporter, level);

  // get directories located in node_modules
  const directories = await asyncReadDir(ROOT_PATH);

  // filter out dot folders
  const packageList = directories.filter((dir) => !dir.startsWith('.'));
  logger.debug(`${packageList.length} packages found in node_modules`);

  const licenses = await Promise.all(
    packageList.map((packagePath) => {
      const joinedPath = path.join(ROOT_PATH, packagePath);
      if (statSync(joinedPath).isDirectory()) {
        return getLicenseInfo(joinedPath, logger, true);
      }
      return null;
    })
  );

  // flatten array structure and remove empty values
  const cleaned = licenses.flat(1).filter((l) => !!l);

  return cleaned;
}

module.exports = getLicenses;
