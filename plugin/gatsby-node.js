const getLicenses = require('./src/fsAPI');

exports.sourceNodes = async (
  { actions, store, createNodeId, cache, reporter, createContentDigest },
  configOptions
) => {
  const { createNode } = actions;

  const licenses = await getLicenses(reporter, 1);

  for (let i = 0; i <= licenses.length; i += 1) {
    const license = licenses[i];

    if (!license) {
      reporter.warn(`Skipping license for i => ${i}`);
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
      createNode(node);
    }
  }
};
