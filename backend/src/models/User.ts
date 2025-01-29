import {
    Column,
    PrimaryGeneratedColumn,
    Entity,
    UpdateDateColumn,
    CreateDateColumn,
    BaseEntity,
    OneToMany,
} from "typeorm";
import { Message } from "./Message.js";

@Entity()
export class User {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column({
        type: "varchar",
        length: 255,
        unique: true,
    })
    username: string;

    @Column({
        type: "varchar",
        length: 255,

        unique: true,
    })
    email: string;

    @Column({
        type: "varchar",
        length: 255,
    })
    password: string;

    @Column({
        type: "varchar",
        length: 255,
        unique: true,
    })
    phone: string;

    @OneToMany(() => Message, (message) => message.sender)
    sendMessages: Message[];

    @OneToMany(() => Message, (message) => message.receiver)
    receivedMessages: Message[];


    @UpdateDateColumn({ type: "timestamp" })
    updatedAt: Date;

    @CreateDateColumn({ type: "timestamp" })
    createdAt: Date;
}
