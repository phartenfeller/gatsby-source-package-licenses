// different strategies to get a url from package.json
function getUrl(manifest) {
  if (manifest.homepage) return manifest.homepage;

  if (
    manifest.repository &&
    typeof manifest.repository === 'object' &&
    manifest.repository.url
  ) {
    if (manifest.repository.url.includes('.com')) {
      return manifest.repository.url.replace('.git', '');
    }
  }

  if (
    manifest.author &&
    typeof manifest.author === 'object' &&
    manifest.author.url &&
    typeof manifest.author.url === 'string'
  ) {
    return manifest.author.url;
  }

  return null;
}

// different strategies to get the license type from package.json
function getLicense(manifest) {
  if (typeof manifest.license === 'object') {
    if (manifest.license.type) return manifest.license.type;
    return null;
  }
  return manifest.license;
}

module.exports = { getUrl, getLicense };
