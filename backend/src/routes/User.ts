import { addUser, deleteUser, editUser } from "../controllers/User.js";
import express, { Request, Response } from "express";

export const userRouter = express.Router();

userRouter.get("/add", addUser);
userRouter.post("/edit:id", editUser);
userRouter.delete("/delete:id", deleteUser);
