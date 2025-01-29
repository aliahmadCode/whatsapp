import { Request, Response } from "express";
import { NormalResponse } from "../interfaces/UserInterface.js";
import { User } from "../models/User.js";
import { MessageStatus, MessageType } from "../interfaces/MessageEnums.js";
import { Message } from "../models/Message.js";
import { AppDataSource } from "../index.js";

export interface MessageStates {
    id?: string;
    message?: string;
    sender?: User | string;
    receiver?: User | string;
    message_type?: MessageType;
    message_status?: MessageStatus;
    updatedAt?: Date;
    createdAt?: Date;
}

export const sendMesage = async (
    req: Request<{}, {}, MessageStates, {}>,
    res: Response<NormalResponse>,
): Promise<any> => {
    try {
        const { message, sender, receiver } = req.body;

        const _message = new Message();
        const messageRepo = await AppDataSource.getRepository(Message);
        const userRepo = await AppDataSource.getRepository(User);

        const _sender = await userRepo.findOne({
            where: { id: sender as string },
        });
        if (!_sender) {
            return res.status(400).json({
                message: "Sender User not exists!",
                success: false,
                data: _sender,
            });
        }

        const _receiver = await userRepo.findOne({
            where: { id: receiver as string },
        });
        if (!_receiver) {
            return res.status(400).json({
                message: "Sender User not exists!",
                success: false,
                data: _receiver,
            });
        }

        if (message === "") {
            return res.status(400).json({
                message: "Message could'nt be empty",
                success: false,
                data: message,
            });
        }

        _message.message = message as string;
        _message.sender = _sender;
        _message.receiver = _receiver;

        const resultMessage = await messageRepo.save(_message);

        return res.status(200).json({
            message: "Message Created",
            success: true,
            data: resultMessage,
        });
    } catch (error) {
        return res.status(500).json({
            message: "server error",
            success: false,
            error: error,
        });
    }
};
