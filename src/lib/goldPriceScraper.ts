
/**
 * Gold Price Fetcher Utility
 * Primary: gold-era.eg (via WordPress REST API — CORS-enabled)
 * Fallback: gold.g.apised.com API
 */

import { GoldPrice } from "@/types/gold";
import axios from "axios";

/**
 * Primary method: Fetch gold prices from gold-era.eg via WordPress REST API
 * Returns buy prices for 24K and 21K gold (EGP per gram)
 */
async function fetchPricesFromGoldEra(): Promise<GoldPrice | null> {
  try {
    console.log("Fetching gold prices from gold-era.eg...");

    const response = await fetch(
      "https://gold-era.eg/wp-json/wp/v2/pages?slug=gold-price&_fields=content"
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch: ${response.status}`);
    }

    const data = await response.json();

    if (!data || !data[0]?.content?.rendered) {
      console.error("Unexpected response structure from gold-era.eg");
      return null;
    }

    const html: string = data[0].content.rendered;

    // Parse buy prices from the Ninja Table rows
    const k24Match = html.match(/Local Gold 24<\/td><td>([\d,.]+)<\/td>/);
    const k21Match = html.match(/Local Gold 21<\/td><td>([\d,.]+)<\/td>/);

    if (!k24Match || !k21Match) {
      console.error("Could not find price data in gold-era.eg response");
      return null;
    }

    const k24 = Math.round(parseFloat(k24Match[1].replace(/,/g, "")));
    const k21 = Math.round(parseFloat(k21Match[1].replace(/,/g, "")));

    console.log(`gold-era.eg prices — 24K: ${k24} EGP, 21K: ${k21} EGP`);

    return {
      k24,
      k21,
      lastUpdated: new Date(),
    };
  } catch (error) {
    console.error("Error fetching from gold-era.eg:", error);
    return null;
  }
}

/**
 * Fallback method: Fetch from gold.g.apised.com API
 */
async function fetchPricesFromAPI(): Promise<GoldPrice | null> {
  try {
    console.log("Falling back to gold.g.apised.com API...");

    const config = {
      method: "get",
      maxBodyLength: Infinity,
      url: "https://gold.g.apised.com/v1/latest?metals=XAU&base_currency=EGP&weight_unit=gram",
      headers: {
        "x-api-key": "sk_382C6f3E73d0e3B68c625776BA59cFfb8BcDb36ccD613126",
      },
    };

    const response = await axios.request(config);

    if (
      response.data?.status === "success" &&
      response.data?.data?.metal_prices?.XAU
    ) {
      const metalPrices = response.data.data.metal_prices.XAU;
      const k24 = Math.round(metalPrices.price_24k);
      const k21 = Math.round(metalPrices.price_21k);

      console.log(`API fallback prices — 24K: ${k24} EGP, 21K: ${k21} EGP`);

      return { k24, k21, lastUpdated: new Date() };
    }

    return null;
  } catch (error) {
    console.error("Error fetching from gold.g.apised.com API:", error);
    return null;
  }
}

/**
 * Main function: gold-era.eg primary → API fallback → hardcoded default
 */
export async function getGoldPrices(): Promise<GoldPrice> {
  try {
    const primary = await fetchPricesFromGoldEra();
    if (primary) return primary;

    console.log("Primary source failed, trying API fallback...");
    const fallback = await fetchPricesFromAPI();
    if (fallback) return fallback;

    console.log("All sources failed, using default prices");
    return { k21: 3700, k24: 4200, lastUpdated: new Date() };
  } catch (error) {
    console.error("Unexpected error in getGoldPrices:", error);
    return { k21: 0, k24: 0, lastUpdated: new Date() };
  }
}

/** @deprecated kept for compatibility — use getGoldPrices() instead */
export async function scrapeGoldPrices() {
  return getGoldPrices();
}
