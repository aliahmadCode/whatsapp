import {
    Column,
    PrimaryGeneratedColumn,
    Entity,
    UpdateDateColumn,
    CreateDateColumn,
} from "typeorm";

@Entity()
export class User {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column({
        type: "text",
        length: 50,
        unique: true,
    })
    username: string;

    @Column({
        type: "text",
        length: 100,
        unique: true,
    })
    email: string;

    @Column({
        type: "text",
        length: 150,
    })
    password: string;

    @UpdateDateColumn()
    updatedAt: Date;

    @CreateDateColumn()
    createdAt: Date;
}
