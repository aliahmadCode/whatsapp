import express from "express";
import { getAllMessage, sendMesage } from "../controllers/Message.js";
export const messageRouter = express.Router();

messageRouter.get("/get", getAllMessage);
messageRouter.post("/send", sendMesage);
