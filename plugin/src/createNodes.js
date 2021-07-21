const getLicenses = require('./fsAPI');

async function createNodes({ reporter, createNodeId, createContentDigest }) {
  const nodes = [];

  const licenses = await getLicenses(reporter, 1);

  for (let i = 0; i <= licenses.length; i += 1) {
    const license = licenses[i];

    if (!license) {
      // eslint-disable-next-line no-continue
      continue;
    } else if (!license.identifier) {
      reporter.warn(`Skipping license => ${JSON.stringify(license)}`);
    } else {
      const nodeContent = JSON.stringify(license);

      const nodeMeta = {
        id: createNodeId(`package-license-${license.identifier}`),
        parent: null,
        children: [],
        internal: {
          type: `PackageLicense`,
          content: nodeContent,
          contentDigest: createContentDigest(license),
        },
      };

      const node = { ...license, ...nodeMeta };
      nodes.push(node);
    }
  }
  return nodes;
}

module.exports = createNodes;
