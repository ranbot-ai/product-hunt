#!/usr/bin/env node

require('dotenv').config();
const ProductHuntAPI = require('./utils/api');
const { exportToCSV, generateFilename } = require('./utils/csv');

/**
 * Main function to fetch and export Product Hunt products
 */
async function main() {
  try {
    console.log('🚀 Starting Product Hunt Daily Fetcher...\n');

    // Validate environment variables
    const apiToken = process.env.PRODUCT_HUNT_API_TOKEN;
    if (!apiToken) {
      throw new Error('PRODUCT_HUNT_API_TOKEN is not set in .env file');
    }

    // Configuration
    const limit = parseInt(process.env.PRODUCTS_LIMIT) || 20;
    const outputDir = process.env.OUTPUT_DIR || './output';

    console.log(`📅 Fetching today's products...`);
    console.log(`📊 Limit: ${limit} products\n`);

    // Initialize API client
    const api = new ProductHuntAPI(apiToken);

    // Fetch today's products
    const products = await api.getTodaysPosts(limit);

    if (products.length === 0) {
      console.log('⚠️  No products found for today.');
      return;
    }

    console.log(`✅ Found ${products.length} products\n`);

    // Display top 5 products
    console.log('🏆 Top 5 Products by Votes:');
    products.slice(0, 5).forEach((product, index) => {
      console.log(`  ${index + 1}. ${product.name} - ${product.votesCount} votes`);
    });
    console.log('');

    // Export to CSV
    const filename = generateFilename();
    console.log(`💾 Exporting to CSV: ${filename}`);

    const filePath = await exportToCSV(products, outputDir, filename);

    console.log(`✅ Successfully exported to: ${filePath}\n`);
    console.log('🎉 Done!');

  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

// Run the main function
main();
