import { nanoid } from "nanoid";
import { BadException } from "../config/error";
import { createClient } from "redis";
import redisClient from "../config/redis";

export interface IShortnerService {
  encodeUrl(url: string): Promise<string | BadException>;
  decodeUrl(shortUrl: string): Promise<string | BadException>;
  getStats(shortUrl: string): Promise<any>;
  getAllUrls(): Promise<any>;
  redirect(shortUrl: string): Promise<string | BadException>;
}

export class ShortnerService implements IShortnerService {
  constructor() {}
  async encodeUrl(url: string): Promise<string | BadException> {
    try {
      if (!url) {
        return new BadException("URL is required");
      }
      try {
        new URL(url);
      } catch (err) {
        return new BadException("Invalid URL format");
      }

      const existingPath = await redisClient.get(`url:${url}`);
      console.log("existingPath", existingPath);

      if (existingPath) {
        const shortUrl = `http://short.est/${existingPath}`;
        return shortUrl;
      }
      const shortPath = this.generateShortPath();
      console.log("shortPath", shortPath);

      await redisClient.set(`path:${shortPath}`, url);

      await redisClient.set(`url:${url}`, shortPath);

      const stats = {
        createdAt: new Date().toISOString(),
        visits: 0,
        lastVisited: null,
      };

      await redisClient.set(`stats:${shortPath}`, JSON.stringify(stats));

      const shortUrl = `http://short.est/${shortPath}`;
      return shortUrl;
    } catch (error) {
      console.error("Error encoding URL:", error);
      return new BadException("Failed to encode URL");
    }
  }

  async decodeUrl(shortUrl: string): Promise<string | BadException> {
    try {
      if (!shortUrl) {
        return new BadException("Short URL is required");
      }
      const url = await redisClient.get(`path:${shortUrl}`);

      if (!url) {
        return new BadException("URL not found");
      }
      return url;
    } catch (error) {
      console.error("Error decoding URL:", error);
      return new BadException("Failed to decode URL");
    }
  }

  async redirect(shortUrl: string): Promise<string | BadException> {
    try {
      const originalUrl = await redisClient.get(`path:${shortUrl}`);
      if (!originalUrl) {
        return new BadException("URL not found");
      }
      const prevStats = await redisClient.get(`stats:${shortUrl}`);
      const stats = JSON.parse(prevStats || "{}");

      stats.visits = (stats.visits || 0) + 1;
      stats.lastVisited = new Date().toISOString();
      await redisClient.set(`stats:${shortUrl}`, JSON.stringify(stats));

      return originalUrl;
    } catch (er) {
      console.error("Error redirecting URL:", er);
      return new BadException("Failed to redirect URL");
    }
  }

  async getStats(shortUrl: string): Promise<any> {
    try {
      const stats = await redisClient.get(`stats:${shortUrl}`);
      if (!stats) {
        return new BadException("URL not found");
      }

      const originalUrl = await redisClient.get(`path:${shortUrl}`);
      if (!originalUrl) {
        return new BadException("Original URL not found");
      }

      const parsedStats = JSON.parse(stats);
      return {
        originalUrl,
        shortUrl: `http://short.est/${shortUrl}`,
        createdAt: parsedStats.createdAt || null,
        visits: parsedStats.visits || 0,
        lastVisited: parsedStats.lastVisited || null,
      };
    } catch (error) {
      console.error("Error getting stats:", error);
      return new BadException("Failed to get stats");
    }
  }

  async getAllUrls(): Promise<any> {
    try {
      const keys = await redisClient.keys("path:*");
      const urls = await Promise.all(
        keys.map(async (key) => {
          const shortPath = key.replace("path:", "");
          const originalUrl = await redisClient.get(key);
          const stats = JSON.parse(
            (await redisClient.get(`stats:${shortPath}`)) || "{}"
          );
          return {
            originalUrl,
            shortUrl: `http://short.est/${shortPath}`,
            createdAt: stats.createdAt || null,
            visits: stats.visits || 0,
            lastVisited: stats.lastVisited || null,
          };
        })
      );
      return urls;
    } catch (er) {
      console.error("Error getting all urls:", er);
      return new BadException("Failed to get all urls");
    }
  }
  private generateShortPath(): string {
    return nanoid(8);
  }
}

export default ShortnerService;
export const shortnerService = new ShortnerService();
