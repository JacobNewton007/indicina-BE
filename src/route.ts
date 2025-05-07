import { Router } from "express";
import { Request, Response } from "express";
import ROUTES from "./const.routes";
import shortnerRouter from "./shortner/route";
const { WILD_CARD, HOME }: { WILD_CARD: string; HOME: string } = ROUTES;

export function testRoute(_req: Request, res: Response) {
  return res.status(200).json({ message: "PONG" });
}

const testRouter = Router();
testRouter.all(HOME, testRoute);

export function routeNotFound(_req: Request, res: Response) {
  return res.status(401).json({ message: "Route not exist" });
}

const invalidRoutes = Router();
invalidRoutes.all(WILD_CARD, routeNotFound);

const versionOneRouter: Router[] = [testRouter, shortnerRouter, invalidRoutes];

export default versionOneRouter;
