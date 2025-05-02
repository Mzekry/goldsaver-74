
/**
 * Gold Price Scraper Utility
 * This utility fetches gold prices from egypt.gold-era.com/gold-price/
 */

import { GoldPrice } from "@/types/gold";

interface ScrapedGoldPrices {
  k24: number;
  k21: number;
  timestamp: Date;
}

export async function scrapeGoldPrices(): Promise<ScrapedGoldPrices | null> {
  try {
    console.log("Fetching gold prices from egypt.gold-era.com...");
    
    // Fetch the HTML content from the website
    const response = await fetch("https://egypt.gold-era.com/gold-price/", {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch: ${response.status}`);
    }

    const html = await response.text();
    console.log("Retrieved HTML content, parsing prices...");

    // Extract prices using regex patterns
    const k24PriceMatch = html.match(/24 قيراط<\/td>\s*<td[^>]*>(\d+,?\d*)/);
    const k21PriceMatch = html.match(/21 قيراط<\/td>\s*<td[^>]*>(\d+,?\d*)/);

    if (!k24PriceMatch || !k21PriceMatch) {
      console.error("Could not find price data in the HTML content");
      return null;
    }

    // Parse the matched prices
    const k24Price = parseInt(k24PriceMatch[1].replace(/,/g, ""), 10);
    const k21Price = parseInt(k21PriceMatch[1].replace(/,/g, ""), 10);

    console.log(`Scraped prices - 24K: ${k24Price} EGP, 21K: ${k21Price} EGP`);
    
    return {
      k24: k24Price,
      k21: k21Price,
      timestamp: new Date()
    };
  } catch (error) {
    console.error("Error scraping gold prices:", error);
    return null;
  }
}

export async function getGoldPrices(): Promise<GoldPrice> {
  try {
    // Try to scrape prices first
    const scrapedPrices = await scrapeGoldPrices();
    
    if (scrapedPrices) {
      return {
        k24: scrapedPrices.k24,
        k21: scrapedPrices.k21,
        lastUpdated: scrapedPrices.timestamp
      };
    }
    
    // Fallback to API if scraping fails
    console.log("Scraping failed, falling back to API...");
    return await fetchPricesFromAPI();
  } catch (error) {
    console.error("Error getting gold prices:", error);
    // Return fallback prices
    return {
      k21: 3700,
      k24: 4200,
      lastUpdated: new Date()
    };
  }
}

// Fallback API method
async function fetchPricesFromAPI(): Promise<GoldPrice> {
  try {
    const response = await fetch('https://api.metalpriceapi.com/v1/latest?api_key=18fc1e4f794c2bc5ec149d84fe2501a2&base=USD&currencies=XAU', {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch gold prices from API');
    }
    
    const data = await response.json();
    
    // XAU is the code for 1 troy ounce of gold (31.1035 grams)
    const goldPricePerOunceUSD = 1 / data.rates.XAU;
    const goldPricePerGramUSD = goldPricePerOunceUSD / 31.1035;
    
    // Convert to EGP (approximate exchange rate)
    const usdToEgp = 48.5; // Approximate exchange rate
    const goldPricePerGramEGP = goldPricePerGramUSD * usdToEgp;
    
    // 24K is pure gold, 21K is 21/24 = 87.5% pure
    const k24Price = Math.round(goldPricePerGramEGP);
    const k21Price = Math.round(k24Price * (21/24));
    
    return {
      k21: k21Price,
      k24: k24Price,
      lastUpdated: new Date()
    };
  } catch (error) {
    console.error("Error fetching from API:", error);
    throw error;
  }
}
