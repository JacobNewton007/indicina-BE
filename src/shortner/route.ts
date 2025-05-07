import { Router } from "express";
import { shortnerController } from "./controller";
export const BASE_AUTH_ROUTE = "/shortner";
const shortnerRoute = (path: string) => `${BASE_AUTH_ROUTE}${path}`;

const shortnerRouter = Router();

shortnerRouter.post(shortnerRoute("/encode"), (req, res) =>
  shortnerController.encodeUrl(req, res)
);
shortnerRouter.get(shortnerRoute("/decode"), (req, res) =>
  shortnerController.decodeUrl(req, res)
);
shortnerRouter.get(shortnerRoute("/"), (req, res) =>
  shortnerController.redirect(req, res)
);
shortnerRouter.get(shortnerRoute("/list"), (req, res) =>
  shortnerController.getAllUrls(req, res)
);
shortnerRouter.get(shortnerRoute("/statistics"), (req, res) =>
  shortnerController.getStats(req, res)
);

export default shortnerRouter;
