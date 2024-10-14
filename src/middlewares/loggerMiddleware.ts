import { Request, Response, NextFunction } from "express";

const logger = (req: Request, res: Response, next: NextFunction) => {
  console.log(
    `${req.method} ${req.protocol}://${req.get("host")}${
      req.originalUrl
    } ${new Date().toISOString()} ${req.secure}`
  );
  // console.log(req);
  next();
};

export default logger;
