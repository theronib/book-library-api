import express, { NextFunction } from "express";
import routes from "./routes";
import path from "path";

const app = express();

app.use(express.json());
app.use("/uploads", express.static(path.resolve("src", "uploads", "avatars")));
app.use("/api", routes);

export default app;