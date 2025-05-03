
/**
 * Gold Price Fetcher Utility
 * This utility fetches gold prices from the gold.g.apised.com API
 * with fallback to scraping from egypt.gold-era.com
 */

import { GoldPrice } from "@/types/gold";
import axios from "axios";

interface ScrapedGoldPrices {
  k24: number;
  k21: number;
  timestamp: Date;
}

/**
 * Primary method: Fetch gold prices from gold.g.apised.com API
 */
async function fetchPricesFromAPI(): Promise<GoldPrice | null> {
  try {
    console.log("Fetching gold prices from gold.g.apised.com API...");
    
    const config = {
      method: 'get',
      maxBodyLength: Infinity,
      url: 'https://gold.g.apised.com/v1/latest?metals=XAU&base_currency=EGP&weight_unit=gram',
      headers: { 
        'x-api-key': 'sk_382C6f3E73d0e3B68c625776BA59cFfb8BcDb36ccD613126'
      }
    };

    const response = await axios.request(config);
    
    // Parse the API response to extract 24K and 21K gold prices
    if (response.status.success) {
      console.log("Successfully fetched prices from gold.g.apised.com API");
      
      // XAU represents pure gold (24K)
      const k24Price = Math.round(response.data.metal_prices.XAU.price_24k);
      // 21K is 87.5% pure (21/24)
      const k21Price = Math.round(k24Price * (21/24));
      
      return {
        k24: k24Price,
        k21: k21Price,
        lastUpdated: new Date()
      };
    } else {
      console.error("Invalid response format from gold.g.apised.com API");
      console.clear();
      console.error(response.data.metal_prices.XAU.price_24k);
      console.error(response.data.status);
      console.error(response.data);
      return null;
    }
  } catch (error) {
    console.error("Error fetching from gold.g.apised.com API:", error);
    console.error(response.data);
    return null;
  }
}

/**
 * Fallback method: Scrape gold prices from egypt.gold-era.com
 */
export async function scrapeGoldPrices(): Promise<ScrapedGoldPrices | null> {
  try {
    console.log("Falling back to scraping from egypt.gold-era.com...");
    
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

/**
 * Main function to get gold prices with a multi-level fallback mechanism
 */
export async function getGoldPrices(): Promise<GoldPrice> {
  try {
    // Try the API first (primary method)
    console.log("Attempting to get gold prices...");
    const apiPrices = await fetchPricesFromAPI();
    
    if (apiPrices) {
      return apiPrices;
    }
    
    // If API fails, try scraping (secondary method)
    console.log("API failed, falling back to scraping...");
    const scrapedPrices = await scrapeGoldPrices();
    
    if (scrapedPrices) {
      return {
        k24: scrapedPrices.k24,
        k21: scrapedPrices.k21,
        lastUpdated: scrapedPrices.timestamp
      };
    }
    
    // If both methods fail, return fallback prices
    console.log("All methods failed, using fallback prices");
    return {
      k21: 3700,
      k24: 4200,
      lastUpdated: new Date()
    };
  } catch (error) {
    console.error("Error getting gold prices:", error);
    // Return fallback prices in case of any unhandled errors
    return {
      k21: 00.00,
      k24: 00.00,
      lastUpdated: new Date()
    };
  }
}
