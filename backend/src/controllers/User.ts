import { Request, Response } from "express";
import { UserBeforeCreation } from "../interfaces/UserInterface.js";

// adding user
export const addUser = async (
    req: Request<{}, {}, UserBeforeCreation, {}>,
    res: Response,
): Promise<any> => {
    const { username, password, email, phone } = req.body;

    return res.status(200).json({
        message: "/add user",
    });
};

export const editUser = async (
    req: Request,
    res: Response<{ message: string }>,
): Promise<any> => {
    console.log(req.body);
    return res.status(200).json({
        message: "/add user",
    });
};

export const deleteUser = async (
    req: Request,
    res: Response<{ message: string }>,
): Promise<any> => {
    console.log(req.body);
    return res.status(200).json({
        message: "/delete user",
    });
};
