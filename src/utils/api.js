const axios = require('axios');

/**
 * Product Hunt API Client
 */
class ProductHuntAPI {
  constructor(apiToken) {
    this.apiToken = apiToken;
    this.baseURL = 'https://api.producthunt.com/v2/api/graphql';
  }

  /**
   * Fetch posts for a specific date
   * @param {string} date - Date in YYYY-MM-DD format
   * @param {number} limit - Number of products to fetch
   * @returns {Promise<Array>} Array of products
   */
  async getPostsByDate(date, limit = 20) {
    const query = `
      query GetPosts($postedAfter: DateTime!, $postedBefore: DateTime!) {
        posts(
          order: VOTES
          postedAfter: $postedAfter
          postedBefore: $postedBefore
          first: ${limit}
        ) {
          edges {
            node {
              id
              name
              tagline
              description
              url
              votesCount
              commentsCount
              website
              createdAt
              topics {
                edges {
                  node {
                    name
                  }
                }
              }
              thumbnail {
                url
              }
            }
          }
        }
      }
    `;

    // Calculate date range (start and end of the specified day)
    const postedAfter = `${date}T00:00:00Z`;
    const postedBefore = `${date}T23:59:59Z`;

    try {
      const response = await axios.post(
        this.baseURL,
        {
          query,
          variables: {
            postedAfter,
            postedBefore
          }
        },
        {
          headers: {
            'Authorization': `Bearer ${this.apiToken}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.data.errors) {
        throw new Error(`API Error: ${JSON.stringify(response.data.errors)}`);
      }

      const posts = response.data.data.posts.edges.map(edge => edge.node);

      // Sort by votes count (descending)
      posts.sort((a, b) => b.votesCount - a.votesCount);

      return posts;
    } catch (error) {
      if (error.response) {
        throw new Error(`API request failed: ${error.response.status} - ${error.response.statusText}`);
      }
      throw error;
    }
  }

  /**
   * Get today's posts
   * @param {number} limit - Number of products to fetch
   * @returns {Promise<Array>} Array of products
   */
  async getTodaysPosts(limit = 20) {
    const today = new Date().toISOString().split('T')[0];
    return this.getPostsByDate(today, limit);
  }
}

module.exports = ProductHuntAPI;
