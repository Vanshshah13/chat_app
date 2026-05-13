import type { NextFunction, Request, Response } from "express";
import type { IUser } from "../model/user.js";
import jwt, { type JwtPayload } from "jsonwebtoken";

export interface AuthenticatedRequest extends Request {
    user?: IUser | null
}

export const isAuth = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            res.status(401).json({
                message: "Please login - No auth headers"
            })
            return;
        }

        const token = authHeader.split(" ")[1];

        const decodedValue = jwt.verify(token as string, process.env.JWT_SECRET as string) as JwtPayload

        if (!decodedValue) {
            res.status(401).json({
                message: 'Token Verification Failed'
            })
            return;
        }

        req.user = decodedValue.user;

        next();
    } catch (error) {
        res.status(401).json({
            message : 'Please login - jwt error'
        })
    }
}