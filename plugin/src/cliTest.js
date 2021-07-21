const getLicenses = require('./fsAPI');

async function main() {
  const licenses = await getLicenses(null, 2);
  console.log(licenses[0]);
}

main();
