import { Request, Response } from "express";
import {
    NormalResponse,
    UserBeforeCreation,
} from "../interfaces/UserInterface.js";
import { User } from "../models/User.js";
import { AppDataSource } from "../index.js";
import bcrypt from "bcryptjs";

export const getAllUser = async (
    req: Request,
    res: Response<NormalResponse>,
): Promise<any> => {
    try {
        const userRepo = AppDataSource.getRepository(User);
        const users = await userRepo.find();

        if (users.length === 0) {
            return res.status(200).json({
                message: "User Table Empty",
                success: false,
                data: users,
            });
        }

        return res.status(200).json({
            message: "Users Fetched Successfully",
            success: true,
            data: users,
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Internal Server Error",
            error: error,
            success: false,
        });
    }
};

export const getUser = async (
    req: Request<{ id: string }>,
    res: Response<NormalResponse>,
): Promise<any> => {
    try {
        const { id } = req.params;
        const userRepo = AppDataSource.getRepository(User);
        const users = await userRepo.findBy({
            id: id,
        });

        if (users.length === 0) {
            return res.status(200).json({
                message: "User Table Empty",
                success: false,
                data: users,
            });
        }

        return res.status(200).json({
            message: "User Fetched Successfully",
            success: true,
            data: users,
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Internal Server Error",
            error: error,
            success: false,
        });
    }
};

// adding user
export const addUser = async (
    req: Request<{}, {}, UserBeforeCreation, {}>,
    res: Response<NormalResponse>,
): Promise<any> => {
    try {
        let { username, password, email, phone } = req.body;
        const user = new User();

        const userRepo = AppDataSource.getRepository(User);

        const checkUser = await userRepo.find({
            where: [{ username: username }, { email: email }],
        });

        if (checkUser.length !== 0) {
            return res.status(400).json({
                message: "User Already Exists",
                success: false,
            });
        }
        const salt = await bcrypt.genSalt(10);
        password = await bcrypt.hash(password, salt);

        user.email = email;
        user.password = password;
        user.username = username;
        user.phone = phone;

        userRepo.save(user);

        return res.status(200).json({
            message: "User created successfully",
            success: true,
        });
    } catch (error) {
        console.log(error);

        return res.status(500).json({
            message: "Internal Server Error",
            error: error,
            success: false,
        });
    }
};

export const editUser = async (
    req: Request,
    res: Response<NormalResponse>,
): Promise<any> => {
    console.log(req.body);
    return res.status(200).json({
        message: "/add user",
        success: true,
    });
};

export const deleteAllUser = async (
    req: Request,
    res: Response<NormalResponse>,
): Promise<any> => {
    try {
        const userRepo = AppDataSource.getRepository(User);
        await userRepo.clear();

        return res.status(200).json({
            message: "All users deleted",
            success: true,
        });
    } catch (error) {
        return res.status(500).json({
            message: "Can't delete users",
            success: false,
            error: error,
        });
    }
};

export const deleteUser = async (
    req: Request<{ id: string }>,
    res: Response<NormalResponse>,
): Promise<any> => {
    try {
        const { id } = req.params;
        const userRepo = AppDataSource.getRepository(User);

        const users = await userRepo.findBy({
            id: id,
        });

        if (users.length === 0) {
            return res.status(200).json({
                message: "User Table Empty",
                success: false,
                data: users,
            });
        }

        await userRepo.delete(id);

        return res.status(200).json({
            message: "User deleted successfully",
            success: true,
        });
    } catch (error) {
        return res.status(500).json({
            message: "Can't delete user",
            success: false,
            error: error,
        });
    }
};
