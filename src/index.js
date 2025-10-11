#!/usr/bin/env node

require('dotenv').config();
const ProductHuntAPI = require('./utils/api');
const { exportToCSV, generateFilename } = require('./utils/csv');

/**
 * Main function to fetch and export Product Hunt products
 */
async function main() {
  const startTime = Date.now();

  try {
    console.log('🚀 Product Hunt Daily Fetcher');
    console.log('─'.repeat(50));

    // Validate environment variables
    const apiToken = process.env.PRODUCT_HUNT_API_TOKEN;
    if (!apiToken) {
      throw new Error('PRODUCT_HUNT_API_TOKEN is not set in .env file');
    }

    // Configuration
    const limit = parseInt(process.env.PRODUCTS_LIMIT) || 20;
    const outputDir = process.env.OUTPUT_DIR || './output';
    const today = new Date().toISOString().split('T')[0];

    console.log(`📅 Date: ${today}`);
    console.log(`📊 Fetch limit: ${limit} products`);
    console.log('');

    // Initialize API client
    console.log('🔄 Fetching products from Product Hunt API...');
    const api = new ProductHuntAPI(apiToken);

    // Fetch today's products
    const products = await api.getTodaysPosts(limit);

    if (products.length === 0) {
      console.log('⚠️  No products found for today');
      console.log('   This might be normal if products haven\'t been released yet');
      console.log('');
      return;
    }

    console.log(`✅ Successfully fetched ${products.length} product${products.length > 1 ? 's' : ''}`);
    console.log('');

    // Display top 5 products
    const topCount = Math.min(5, products.length);
    console.log(`🏆 Top ${topCount} Products by Votes:`);
    products.slice(0, topCount).forEach((product, index) => {
      console.log(`   ${index + 1}. ${product.name} - ${product.votesCount.toLocaleString()} vote${product.votesCount !== 1 ? 's' : ''}`);
    });
    console.log('');

    // Export to CSV
    const filename = generateFilename();
    console.log(`💾 Exporting data:`);
    console.log(`   → File: ${filename}`);

    const filePath = await exportToCSV(products, outputDir, filename);

    console.log(`   → Path: ${filePath}`);
    console.log('   ✅ Export complete');
    console.log('');

    // Summary
    const duration = ((Date.now() - startTime) / 1000).toFixed(2);
    console.log('📊 Summary:');
    console.log(`   • Products fetched: ${products.length}`);
    console.log(`   • CSV file created: ${filename}`);
    console.log(`   • Duration: ${duration}s`);
    console.log('');
    console.log('✅ All operations completed successfully');

  } catch (error) {
    console.error('');
    console.error('❌ Error occurred:');
    console.error(`   ${error.message}`);
    console.error('');
    process.exit(1);
  }
}

// Run the main function
main();
