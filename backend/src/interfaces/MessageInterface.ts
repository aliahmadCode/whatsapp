import { User } from "../models/User.js";
import { MessageStatus, MessageType } from "./MessageEnums.js";

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
