import { Request, Response } from "express";
import { NormalResponse, UserStates } from "../interfaces/UserInterface.js";
import { User } from "../models/User.js";
import { AppDataSource } from "../index.js";
import bcrypt from "bcryptjs";
import { generatetoken } from "../utils/token.js";

export const getAllUser = async (
  req: Request,
  res: Response<NormalResponse>,
): Promise<any> => {
  try {
    const userRepo = AppDataSource.getRepository(User);
    const users = await userRepo.find({
      relations: ["sendMessages", "receivedMessages"],
    });

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
    const user = await userRepo.findOne({
      where: { id },
      relations: ["sendMessages", "receivedMessages"],
    });

    if (!user) {
      return res.status(400).json({
        message: "User not exists",
        success: false,
        data: user,
      });
    }
    return res.status(200).json({
      message: "User Fetched Successfully",
      success: true,
      data: user,
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
  req: Request<{}, {}, UserStates, {}>,
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
    password = await bcrypt.hash(password as string, salt);

    user.email = email as string;
    user.password = password as string;
    user.username = username as string;
    user.phone = phone as string;

    let resultUser = await userRepo.save(user);

    return res.status(200).json({
      message: "User created successfully",
      success: true,
      data: resultUser,
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
