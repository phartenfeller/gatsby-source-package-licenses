const getLicenses = require('./fsAPI');

// just for testing the scanning with node ./src/cliTest.js
async function main() {
  const licenses = await getLicenses(null, 2);
  console.log(licenses[0]);
}

main();
