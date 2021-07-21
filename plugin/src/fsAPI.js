const fs = require('fs');
const path = require('path');
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
    }

    obj.package = manifest.name;
    obj.version = manifest.version;
    obj.license = manifest.license;
    obj.url = manifest.homepage;
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
    const licenses = directories.map((dir) => {
      const dirPath = path.join(packagePath, dir);
      return getLicenseInfo(dirPath, logger, false);
    });
    return Promise.all(licenses);
  }
  logger.debug(`Data found for => ${packagePath}`);
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

  const content = await getLicenseInfo(
    path.join(ROOT_PATH, packageList[0]),
    logger,
    true
  );
  console.log(content);
}

getLicenses(null, 2);
