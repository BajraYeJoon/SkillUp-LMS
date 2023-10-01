import express, { NextFunction, Request, Response } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

require("dotenv").config();

export const app = express();

//body parser -- for cloudnary
app.use(express.json({ limit: "50mb" }));

//cookie parser -- when catching the cookie from the frontend
app.use(cookieParser());

//cors -- to give the access for the api to be hit other than the localhost specified by us
app.use(
  cors({
    origin: process.env.ORIGIN,
  })
);

//For testin the APIs
app.get("/", (req: Request, res: Response, next: NextFunction) => {
  res.status(200).json({
    success: true,
    message: "API is working",
  });
});

//Unknow route handler
app.all("*", (req: Request, res: Response, next: NextFunction) => {
  const err = new Error(`Can't find ${req.originalUrl} on this server`);
});
