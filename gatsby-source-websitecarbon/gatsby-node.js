/**
 * ============================================================================
 * Helper functions and constants
 * ============================================================================
 */

const WEBSITECARBONBADGE_NODE_TYPE = `WebsiteCarbonBadge`;

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
  };

  const node = Object.assign({}, item, nodeMetadata);
  helpers.createNode(node);
  return node;
};

/**
 * ============================================================================
 * Verify plugin loads
 * ============================================================================
 */

exports.onPreInit = () => {
  /* Do something here */
};

/**
 * ============================================================================
 * Link nodes together with a customized GraphQL Schema
 * ============================================================================
 */

exports.createSchemaCustomization = ({ actions }) => {
  const { createTypes } = actions;
  createTypes(`
        type WebsiteCarbonBadge implements Node {
          id: ID!
          url: String
          originalUrl: String
          green: Boolean
          bytes: Int
          cleanerThan: Float
          statistics: WebsiteCarbonBadgeStatistics
          timestamp: Int
        }
        type WebsiteCarbonBadgeStatistics implements Node {
          adjustedBytes: Float,
          energy: Float,
          co2: WebsiteCarbonBadgeCo2
        }
        type WebsiteCarbonBadgeCo2 implements Node {
          grid: WebsiteCarbonBadgeGrid
          renewable: WebsiteCarbonBadgeRenewable
        }
        type WebsiteCarbonBadgeGrid implements Node {
          grams: Float
          litres: Float
        }
        type WebsiteCarbonBadgeRenewable implements Node {
          grams: Float
          litres: Float
        }`);
};

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
  const { createNode, touchNode, deleteNode } = actions;
  const helpers = Object.assign({}, actions, {
    createContentDigest,
    createNodeId,
  });

  // touch nodes to ensure they aren't garbage collected
  getNodesByType(WEBSITECARBONBADGE_NODE_TYPE).forEach((node) =>
    touchNode(node)
  );

  // store the response from the API in the cache
  const cacheKey = `websitecarbon-${pluginOptions?.url?.replace(
    /[^A-Z0-9]/gi,
    "_"
  )}`;

  let sourceData = await cache.get(cacheKey);

  // fetch fresh data if nothing is found in the cache or a plugin option says not to cache data
  if (!sourceData || sourceData?.error || pluginOptions.nocache) {
    try {
      const fetch = require("node-fetch");
      const response = await fetch(
        `https://api.websitecarbon.com/site?url=${encodeURIComponent(
          pluginOptions?.url
        )}`
      );
      const data = await response.json();

      const round = (value, precision) => {
        return value && typeof value === "number"
          ? value.toFixed(precision ?? 0)
          : undefined;
      };

      // creating website carbon object
      sourceData = {
        url: data.url,
        originalUrl: pluginOptions?.url,
        green: data.green,
        bytes: data.bytes,
        cleanerThan: data.cleanerThan,
        statistics: {
          adjustedBytes: round(data.statistics?.adjustedBytes, 0),
          energy: round(data.statistics?.energy, 6),
          co2: {
            grid: {
              grams: round(data.statistics?.co2?.grid?.grams, 6),
              litres: round(data.statistics?.co2?.grid?.litres, 6),
            },
            renewable: {
              grams: round(data.statistics?.co2?.renewable?.grams, 6),
              litres: round(data.statistics?.co2?.renewable?.litres, 6),
            },
          },
        },
        timestamp: data.timestamp,
      };

      // no caching is set explicitly
      if (!pluginOptions.nocache) {
        await cache.set(cacheKey, sourceData);
      }
    } catch (err) {
      console.warn(
        "[gatsby-source-websitecarbon] plugin failed encountered an error."
      );

      sourceData = {
        originalUrl: pluginOptions?.url,
        error: true,
      };

      if (pluginOptions.verbose) {
        console.error(err);
      }
    }
  }

  if (pluginOptions.verbose) {
    console.log(sourceData);
  }

  // create Gatsby nodes for the data
  createNodeFromData(sourceData, WEBSITECARBONBADGE_NODE_TYPE, helpers);

  return;
};
