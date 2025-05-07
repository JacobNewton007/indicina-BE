import { BadException } from "../config/error";
import ShortnerService, { IShortnerService } from "./service";

export class ShortnerController {
  constructor(private readonly shortnerService: IShortnerService) {}

  public async encodeUrl(req: any, res: any) {
    const { url } = req.body;
    const shortUrl = await this.shortnerService.encodeUrl(url);
    if (shortUrl instanceof BadException) {
      return res
        .status(400)
        .json({ message: shortUrl.message, statusCode: 400, status: "fail" });
    }
    return res.status(200).json({
      data: shortUrl,
      status: "success",
      message: "URL encoded successfully",
    });
  }

  public async decodeUrl(req: any, res: any) {
    const { shortUrl } = req.query;
    const url = await this.shortnerService.decodeUrl(shortUrl);
    if (url instanceof BadException) {
      return res
        .status(400)
        .json({ message: url.message, statusCode: 400, status: "fail" });
    }
    return res.status(200).json({
      data: url,
      status: "success",
      message: "URL decoded successfully",
    });
  }

  public async redirect(req: any, res: any) {
    const { shortUrl } = req.query;
    const url = await this.shortnerService.redirect(shortUrl);
    if (url instanceof BadException) {
      return res
        .status(400)
        .json({ message: url.message, statusCode: 400, status: "fail" });
    }
    return res.status(200).json({
      data: url,
      status: "success",
      message: "URL redirected successfully",
    });
  }

  public async getStats(req: any, res: any) {
    const { shortUrl } = req.query;
    const stats = await this.shortnerService.getStats(shortUrl);
    if (stats instanceof BadException) {
      return res
        .status(400)
        .json({ message: stats.message, statusCode: 400, status: "fail" });
    }
    return res.status(200).json({
      data: stats,
      status: "success",
      message: "URL stats retrieved successfully",
    });
  }
  public async getAllUrls(_req: any, res: any) {
    const urls = await this.shortnerService.getAllUrls();
    if (urls instanceof BadException) {
      return res
        .status(400)
        .json({ message: urls.message, statusCode: 400, status: "fail" });
    }
    return res.status(200).json({
      data: urls,
      status: "success",
      message: "All URLs retrieved successfully",
    });
  }
}

export default ShortnerController;
const shortnerServiceInstance = new ShortnerService();
export const shortnerController = new ShortnerController(
  shortnerServiceInstance
);
