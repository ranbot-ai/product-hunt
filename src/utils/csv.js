const createCsvWriter = require('csv-writer').createObjectCsvWriter;
const fs = require('fs');
const path = require('path');

/**
 * Export products to CSV
 * @param {Array} products - Array of product objects
 * @param {string} outputDir - Output directory path
 * @param {string} filename - Output filename
 * @returns {Promise<string>} Path to the created CSV file
 */
async function exportToCSV(products, outputDir, filename) {
  // Ensure output directory exists
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  const filePath = path.join(outputDir, filename);

  const csvWriter = createCsvWriter({
    path: filePath,
    header: [
      { id: 'rank', title: 'Rank' },
      { id: 'name', title: 'Name' },
      { id: 'tagline', title: 'Tagline' },
      { id: 'votes', title: 'Votes' },
      { id: 'comments', title: 'Comments' },
      { id: 'url', title: 'URL' },
      { id: 'website', title: 'Website' },
      { id: 'topics', title: 'Topics' },
      { id: 'description', title: 'Description' },
      { id: 'createdAt', title: 'Created At' },
    ]
  });

  // Transform products data for CSV
  const records = products.map((product, index) => ({
    rank: index + 1,
    name: product.name,
    tagline: product.tagline || '',
    votes: product.votesCount,
    comments: product.commentsCount,
    url: product.url,
    website: product.website || '',
    topics: product.topics.edges.map(edge => edge.node.name).join(', '),
    description: product.description,
    createdAt: new Date(product.createdAt).toISOString()
  }));

  await csvWriter.writeRecords(records);

  return filePath;
}

/**
 * Generate filename based on date
 * @param {Date} date - Date object
 * @returns {string} Filename in format: products_YYYY-MM-DD.csv
 */
function generateFilename(date = new Date()) {
  const dateStr = date.toISOString().split('T')[0];
  return `products_${dateStr}.csv`;
}

module.exports = {
  exportToCSV,
  generateFilename
};
