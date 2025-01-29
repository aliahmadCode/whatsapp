import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { NormalResponse, UserStates } from "../interfaces/UserInterface.js";
import { SECRET_KEY } from "../index.js";

export const generatetoken = async (user: UserStates) => {
    try {
        const payload: { id: string; username: string; email: string } = {
            id: user.id as string,
            username: user.username as string,
            email: user.email as string,
        };
        return jwt.sign(payload, SECRET_KEY, { expiresIn: "1h" });
    } catch (error) {
        if (error instanceof Error) {
            throw new Error((error as Error).message);
        }
        throw new Error("Some unexpected error occured");
    }
};

export const verfifytoken = async (
    req: Request,
    res: Response<NormalResponse>,
    next: NextFunction,
) => {
    try {
        const token = req.headers["authorization"]?.split(" ")[1];
        if (!token) {
            return res.status(400).json({
                message: "Token is empty, Access Denied",
                success: false,
                data: token,
            });
        }

        jwt.verify(token, SECRET_KEY, (err, decodeduser) => {
            if (err) {
                return res.status(400).json({
                    message: "Invalid Token",
                    success: false,
                    data: token,
                });
            }

            req.user = decodeduser;
            next();
        });
    } catch (error) {
        return res.status(200).json({
            message: "server: Token verify error",
            success: false,
            error: error,
        });
    }
};
