import {
    addUser,
    deleteAllUser,
    deleteUser,
    editUser,
    getAllUser,
    getUser,
} from "../controllers/User.js";
import express, { Request, Response } from "express";

export const userRouter = express.Router();

userRouter.get("/get", getAllUser);
userRouter.get("/get/:id", getUser);
userRouter.post("/add", addUser); // can be registered
userRouter.patch("/edit/:id", editUser);
userRouter.delete("/delete", deleteAllUser);
userRouter.delete("/delete/:id", deleteUser);


