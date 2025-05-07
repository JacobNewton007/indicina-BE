export const BASE_PATH = "/api";

const ROUTES: { V1_PATH: string; WILD_CARD: string; HOME: string } = {
  V1_PATH: `${BASE_PATH}/v1`,
  HOME: "/health/ping",
  WILD_CARD: "/*",
};

export default ROUTES;
