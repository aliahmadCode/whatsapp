import { DataSource } from "typeorm";
import { AppDataSource } from "../index.js";

export const dbConnect = async () => {
    AppDataSource.initialize()
        .then(() => {
            return;
        })
        .catch((err: Error) => {
            console.log(err);
            throw new Error(err.message);
        });
};
