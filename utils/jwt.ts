import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";


export const signToken = (data: { id: string , role: string}) => {
    return jwt.sign(data, process.env.JWT_SECRET!, {
        expiresIn: process.env.JWT_EXPIRES_IN,
    });
};



export const verifyJWT = (token: string) => {
    return jwt.verify(token, process.env.JWT_SECRET!);
}