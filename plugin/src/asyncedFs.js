const fs = require('fs');

function asyncReadDir(dirPath) {
  return new Promise((resolve, reject) => {
    fs.readdir(dirPath, (err, files) => {
      if (err) {
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

module.exports = {
  asyncReadDir,
  asyncReadFile,
  readFile,
};
