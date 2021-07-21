const hashCacheFile = require('./src/cacheUtil');
const createNodes = require('./src/createNodes');

function addNodes(nodes, createNode) {
  for (let i = 0; i < nodes.length; i += 1) {
    createNode(nodes[i]);
  }
}

exports.sourceNodes = async (
  { actions, createNodeId, cache, reporter, createContentDigest },
  configOptions
) => {
  let cacheHash = null;

  const { createNode } = actions;
  const { cacheFile } = configOptions;

  if (cacheFile) {
    // get hash of cacheFile
    const { success, hash } = await hashCacheFile(cacheFile, reporter);
    if (success) {
      cacheHash = hash;
      const data = await cache.get(hash);

      // if valid cache found
      if (Array.isArray(data) && data.length > 0) {
        reporter.info('Got licenses from cache');
        addNodes(data, createNode);
        return;
      }
    }
  }

  const nodes = await createNodes({
    reporter,
    createNodeId,
    createContentDigest,
  });

  if (cacheHash) {
    reporter.info('Adding licenses to cache');
    await cache.set(cacheHash, nodes);
  }

  addNodes(nodes, createNode);
};
