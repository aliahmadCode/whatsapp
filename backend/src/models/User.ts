import {
    Column,
    PrimaryGeneratedColumn,
    Entity,
    UpdateDateColumn,
    CreateDateColumn,
    BaseEntity,
} from "typeorm";

@Entity()
export class User extends BaseEntity {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column({
        type: "text",
        unique: true,
    })
    username: string;

    @Column({
        type: "text",
        unique: true,
    })
    email: string;

    @Column({
        type: "text",
    })
    password: string;

    @Column("text")
    phone: string;

    @UpdateDateColumn()
    updatedAt: Date;

    @CreateDateColumn()
    createdAt: Date;
}
