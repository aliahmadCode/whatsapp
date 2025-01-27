import { addUser, deleteUser, editUser } from "../controllers/User.js";
import express, { Request, Response } from "express";

export const userRouter = express.Router();

userRouter.post("/add", addUser);
userRouter.patch("/edit:id", editUser);
userRouter.delete("/delete:id", deleteUser);
