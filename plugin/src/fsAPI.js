const fs = require('fs');
const path = require('path');
const { getUrl, getLicense } = require('./extractors');
const Logger = require('./logger');

const EXCLUDED_FOLDERS = ['.bin', '.yarn-integrity'];
const ROOT_PATH = './node_modules';

function asyncReadDir(dirPath, logger) {
  return new Promise((resolve, reject) => {
    fs.readdir(dirPath, (err, files) => {
      if (err) {
        logger.error(`Could not read directory from path => ${dirPath}`);
        return reject(err);
      }
      return resolve(files);
    });
  });
}

function asyncReadFile(filePath) {
  return new Promise((resolve, reject) => {
    fs.readFile(filePath, 'utf8', (err, data) => {
      if (err) {
        return reject(err);
      }
      return resolve(data);
    });
  });
}

async function readFile(filePath) {
  try {
    const content = await asyncReadFile(filePath);
    return { exists: true, content };
  } catch (e) {
    return { exists: false, content: null };
  }
}

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

  if (!packageData.exists && goDeeper === true) {
    logger.debug(`Going deeper for => ${packagePath}`);
    const directories = await asyncReadDir(packagePath, logger);

    const licenses = await Promise.all(
      directories.map((dir) => {
        const dirPath = path.join(packagePath, dir);
        return getLicenseInfo(dirPath, logger, false);
      })
    );
    return licenses;
  }
  return createLicenseInfo(
    packagePath,
    JSON.parse(packageData.content),
    logger
  );
}

async function getLicenses(reporter = null, level = 1) {
  const logger = new Logger(reporter, level);

  const directories = await asyncReadDir(ROOT_PATH, logger);
  const packageList = directories.filter(
    (dir) => !EXCLUDED_FOLDERS.includes(dir)
  );
  logger.debug(`${packageList.length} packages found in node_modules`);

  const licenses = await Promise.all(
    packageList.map((packagePath) => {
      const joinedPath = path.join(ROOT_PATH, packagePath);
      return getLicenseInfo(joinedPath, logger, true);
    })
  );

  // flatten array structure and remove empty values
  const cleaned = licenses.flat(1).filter((l) => !!l);

  return cleaned;
}

module.exports = getLicenses;
