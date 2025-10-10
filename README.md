# Product Hunt Daily Fetcher

Automatically fetch daily Product Hunt products and export them to CSV format, sorted by vote count.

## Features

- 📊 Fetches daily released products from Product Hunt
- 🗳️ Sorts products by upvote count
- 📄 Exports data to CSV format
- ⏰ Designed for automated daily execution
- 🔐 Secure API token management via environment variables

## Prerequisites

- Node.js (version 14 or higher)
- npm or yarn
- Product Hunt API token

## Setup Instructions

### 1. Clone or Download the Repository

```bash
git clone <your-repo-url>
cd product-hunt
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment Variables

1. Copy the example environment file:
   ```bash
   cp .env.example .env
   ```

2. Edit `.env` and add your Product Hunt API token:
   ```
   PRODUCT_HUNT_API_TOKEN=your_actual_token_here
   ```

### 4. Get Your Product Hunt API Token

1. Go to [Product Hunt API Dashboard](https://www.producthunt.com/v2/oauth/applications)
2. Create a new application
3. Copy your API token
4. Paste it in your `.env` file

## Usage

### Manual Run

To fetch today's products manually:

```bash
npm start
```

This will create a CSV file in the `output/` directory with the format: `products_YYYY-MM-DD.csv`

### Automated Daily Run (Cron Job)

#### On macOS/Linux:

1. Open your crontab:
   ```bash
   crontab -e
   ```

2. Add a daily job (runs at 11:59 PM daily):
   ```bash
   59 23 * * * cd /path/to/product-hunt && /usr/local/bin/node src/index.js
   ```

3. Make sure to use the full path to your node binary (find it with `which node`)

#### On Windows (Task Scheduler):

1. Open Task Scheduler
2. Create a new Basic Task
3. Set it to run daily
4. Action: Start a program
5. Program: `node`
6. Arguments: `src/index.js`
7. Start in: `C:\path\to\product-hunt`

## Output Format

The CSV file contains the following columns:

| Column | Description |
|--------|-------------|
| Rank | Position based on votes |
| Name | Product name |
| Tagline | Product tagline |
| Votes | Number of upvotes |
| Comments | Number of comments |
| URL | Product Hunt URL |
| Website | Product website URL |
| Topics | Product categories/topics |
| Created At | Launch date |

## Project Structure

```
product-hunt/
├── src/
│   ├── index.js          # Main script
│   └── utils/
│       ├── api.js        # Product Hunt API client
│       └── csv.js        # CSV export utilities
├── output/               # Generated CSV files (git-ignored)
├── .env                  # Your API configuration (git-ignored)
├── .env.example          # Example configuration
├── .gitignore            # Git ignore rules
├── package.json          # Project dependencies
└── README.md             # This file
```

## Troubleshooting

### "Unauthorized" Error
- Check that your API token is correct in the `.env` file
- Ensure your Product Hunt application has the necessary permissions

### "Module not found" Error
- Run `npm install` to install all dependencies

### No Output Directory
- The script will automatically create the `output/` directory if it doesn't exist

## Contributing

Feel free to submit issues or pull requests to improve this project!

## License

MIT
