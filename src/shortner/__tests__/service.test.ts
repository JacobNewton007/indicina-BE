import { ShortnerService } from "../service";
import redisClient from "../../config/redis";
import { nanoid } from "nanoid";
import { BadException } from "../../config/error";

jest.mock("../../config/redis", () => ({
  get: jest.fn(),
  set: jest.fn(),
  keys: jest.fn(),
}));
jest.mock("nanoid");

describe("ShortnerService", () => {
  let shortnerService: ShortnerService;
  const mockNanoid = nanoid as jest.MockedFunction<typeof nanoid>;
  const mockRedisGet = redisClient.get as jest.MockedFunction<
    typeof redisClient.get
  >;
  const mockRedisSet = redisClient.set as jest.MockedFunction<
    typeof redisClient.set
  >;

  beforeEach(() => {
    jest.clearAllMocks();
    shortnerService = new ShortnerService();
  });

  describe("encodeUrl", () => {
    const validUrl = "https://indicina.co";
    const shortPath = "cTKY46Pn";
    const expectedShortUrl = `http://short.est/${shortPath}`;

    it("should encode a new valid URL", async () => {
      mockRedisGet.mockResolvedValueOnce(null);
      mockNanoid.mockReturnValueOnce(shortPath);
      mockRedisSet.mockResolvedValue("OK");

      const result = await shortnerService.encodeUrl(validUrl);

      expect(result).toBe(expectedShortUrl);
      expect(mockRedisGet).toHaveBeenCalledWith(`url:${validUrl}`);
      expect(mockNanoid).toHaveBeenCalledTimes(1);
      expect(mockRedisSet).toHaveBeenCalledWith(`path:${shortPath}`, validUrl);
      expect(mockRedisSet).toHaveBeenCalledWith(`url:${validUrl}`, shortPath);
      expect(mockRedisSet).toHaveBeenCalledWith(
        `stats:${shortPath}`,
        expect.any(String)
      );
    });

    it("should return existing short URL if URL already encoded", async () => {
      mockRedisGet.mockResolvedValueOnce(shortPath);

      const result = await shortnerService.encodeUrl(validUrl);

      expect(result).toBe(expectedShortUrl);
      expect(mockRedisGet).toHaveBeenCalledWith(`url:${validUrl}`);
      expect(mockNanoid).not.toHaveBeenCalled();
      expect(mockRedisSet).not.toHaveBeenCalled();
    });

    it("should return BadException for invalid URL format", async () => {
      const invalidUrl = "not-a-valid-url";
      const result = await shortnerService.encodeUrl(invalidUrl);

      expect(result).toBeInstanceOf(BadException);
      expect((result as BadException).message).toBe("Invalid URL format");
      expect(mockRedisGet).not.toHaveBeenCalled();
      expect(mockNanoid).not.toHaveBeenCalled();
      expect(mockRedisSet).not.toHaveBeenCalled();
    });

    it("should return BadException if URL is missing", async () => {
      const result = await shortnerService.encodeUrl("");

      expect(result).toBeInstanceOf(BadException);
      expect((result as BadException).message).toBe("URL is required");
      expect(mockRedisGet).not.toHaveBeenCalled();
      expect(mockNanoid).not.toHaveBeenCalled();
      expect(mockRedisSet).not.toHaveBeenCalled();
    });
  });

  describe("decodeUrl", () => {
    const shortPath = "cTKY46Pn";
    const originalUrl = "https://indicina.co";

    it("should decode a valid short URL path", async () => {
      mockRedisGet.mockResolvedValueOnce(originalUrl);

      const result = await shortnerService.decodeUrl(shortPath);

      expect(result).toBe(originalUrl);
      expect(mockRedisGet).toHaveBeenCalledWith(`path:${shortPath}`);
    });

    it("should return BadException if short URL path not found", async () => {
      mockRedisGet.mockResolvedValueOnce(null);
      const result = await shortnerService.decodeUrl(shortPath);

      expect(result).toBeInstanceOf(BadException);
      expect((result as BadException).message).toBe("URL not found");
      expect(mockRedisGet).toHaveBeenCalledWith(`path:${shortPath}`);
    });

    it("should return BadException if short URL is missing", async () => {
      const result = await shortnerService.decodeUrl("");

      expect(result).toBeInstanceOf(BadException);
      expect((result as BadException).message).toBe("Short URL is required");
      expect(mockRedisGet).not.toHaveBeenCalled();
    });
  });
});
