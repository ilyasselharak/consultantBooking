import { Request, Response, NextFunction, RequestHandler } from "express";
import Permission from "../models/PermissionModel";
import jwt from "jsonwebtoken";
import { verifyJWT } from "../../utils/jwt";

declare global {
  namespace Express {
    interface Request {
      user?: {
        role: string;
        id: string;
      };
    }
  }
}
// only super admin and any staff added by super admin can access this route 
export const onlySuperAdmin = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({
      message: "Access denied. No token provided.",
    });
  }

  const user = verifyJWT(token) as { role: string; id: string } | null;

  if (!user) {
    return res.status(401).json({
      message: "Access denied. Invalid token.",
    });
  }

  req.user = user;

  if (user.role !== "super_admin") {
  } else {
    next();
  }
};


