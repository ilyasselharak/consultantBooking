import { validationResult, Result, ValidationError } from "express-validator";
import { Request, Response, NextFunction } from "express";
const validatorMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const errors: Result<ValidationError> = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};


export default validatorMiddleware