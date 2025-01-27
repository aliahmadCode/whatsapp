import express, { Request, Response } from "express";
import { addUser, editUser, deleteUser } from "@/controllers/User.js";

export const userRouter = express.Router();

userRouter.get("/add", addUser);
userRouter.get("/edit:id", editUser);
userRouter.get("/delete:id", editUser);
