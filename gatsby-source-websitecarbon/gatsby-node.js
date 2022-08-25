/**
 * ============================================================================
 * Helper functions and constants
 * ============================================================================
 */

const WEBSITECARBONBADGE_NODE_TYPE = `WebsiteCarbonBadge`
 
// helper function for creating nodes
const createNodeFromData = (item, nodeType, helpers) => {
    const nodeMetadata = {
        id: helpers.createNodeId(`${nodeType}-${item.id}`),
        parent: null,
        children: [],
        internal: {
            type: nodeType,
            content: JSON.stringify(item),
            contentDigest: helpers.createContentDigest(item),
        },
    }

    const node = Object.assign({}, item, nodeMetadata)
    helpers.createNode(node)
    return node
}

/**
 * ============================================================================
 * Verify plugin loads
 * ============================================================================
 */

exports.onPreInit = () => { /* Do something here */}

/**
 * ============================================================================
 * Link nodes together with a customized GraphQL Schema
 * ============================================================================
 */

exports.createSchemaCustomization = ({ actions }) => {
    const { createTypes } = actions
    createTypes(`
        type WebsiteCarbonBadge implements Node {
            id: ID!
            co2: String!
            percentage: String!
            url: String!
        }`
    )
}

/**
 * ============================================================================
 * Source and cache nodes from the API
 * ============================================================================
 */

 exports.sourceNodes = async function sourceNodes(
    {
        actions,
        cache,
        createContentDigest,
        createNodeId,
        getNodesByType,
        getNode,
    },
    pluginOptions
  ) {
    const { createNode, touchNode, deleteNode } = actions
    const helpers = Object.assign({}, actions, {
        createContentDigest,
        createNodeId,
    })
  
    // touch nodes to ensure they aren't garbage collected
    getNodesByType(WEBSITECARBONBADGE_NODE_TYPE).forEach(node => touchNode(node))
  
    // store the response from the API in the cache
    const cacheKey = `websitecarbon-${pluginOptions.url}`
    let sourceData = await cache.get(cacheKey)
  
    // fetch fresh data if nothing is found in the cache or a plugin option says not to cache data
    if (!sourceData) {
        const fetch = require('node-fetch');
        const response = await fetch(`https://api.websitecarbon.com/b?url=${encodeURIComponent(pluginOptions.url)}`);
        const data = await response.json();
        await cache.set(cacheKey, data)
        sourceData = { co2: data.c, percentage: data.p, url: pluginOptions.url }
    }
    
    // create Gatsby nodes for the data
    createNodeFromData(sourceData, WEBSITECARBONBADGE_NODE_TYPE, helpers)
    
    return
}
