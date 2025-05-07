import express from "express";
import helmet from "helmet";
import ROUTES from "../const.routes";
import versionOneRouter from "../route";
import cors from "cors";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());

app.use(helmet());
app.disable("x-powered-by");

app.use(ROUTES.V1_PATH, versionOneRouter);

export default app;
