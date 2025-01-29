import {
    Column,
    PrimaryGeneratedColumn,
    Entity,
    UpdateDateColumn,
    CreateDateColumn,
    BaseEntity,
    OneToMany,
    Relation,
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
    sendMessages: Relation<Message[]>;

    @OneToMany(() => Message, (message) => message.receiver)
    receivedMessages: Relation<Message[]>;

    @Column({ type: "text", nullable: true })
    token: string;

    @UpdateDateColumn({ type: "timestamp" })
    updatedAt: Date;

    @CreateDateColumn({ type: "timestamp" })
    createdAt: Date;
}
