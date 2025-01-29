import express from "express";
import { sendMesage } from "../controllers/Message.js";
export const messageRouter = express.Router();

messageRouter.get("/send", sendMesage);
