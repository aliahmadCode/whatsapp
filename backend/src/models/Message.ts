import {
    BaseEntity,
    Column,
    CreateDateColumn,
    Entity,
    JoinColumn,
    ManyToOne,
    PrimaryGeneratedColumn,
    Relation,
    UpdateDateColumn,
} from "typeorm";
import { User } from "./User.js";

import { MessageStatus, MessageType } from "../interfaces/MessageEnums.js";

@Entity()
export class Message {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column("text")
    message: string;

    @Column({
        type: "enum",
        enum: MessageType,
        default: MessageType.TEXT,
    })
    message_type: MessageType;

    @Column({
        type: "enum",
        enum: MessageStatus,
        default: MessageStatus.SENT,
    })
    message_status: MessageStatus;

    @ManyToOne(() => User, (user) => user.sendMessages)
    @JoinColumn({ name: "sender_id" })
    sender: Relation<User>;

    @ManyToOne(() => User, (user) => user.receivedMessages)
    @JoinColumn({ name: "receiver_id" })
    receiver: Relation<User>;

    @UpdateDateColumn({ type: "timestamp" })
    updatedAt: Date;

    @CreateDateColumn({ type: "timestamp" })
    createdAt: Date;
}
