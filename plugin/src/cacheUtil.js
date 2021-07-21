const crypto = require('crypto');
const { readFile } = require('./asyncedFs');

// returns a hash of the file contents
function checksumBuilder(text, fn = 'sha256') {
  return crypto.createHash(fn).update(text).digest('hex');
}

async function hashCacheFile(cacheFile, reporter) {
  const { exists, content } = await readFile(`./${cacheFile}`);

  if (!exists) {
    reporter.warn(`File "${cacheFile}" not found, caching is disabled...`);
    return { success: false, hash: null };
  }

  const hash = checksumBuilder(cacheFile + content);
  return { success: true, hash };
}

module.exports = hashCacheFile;
