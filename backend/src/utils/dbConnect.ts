import { DataSource } from "typeorm";

export const AppDataSource = new DataSource({
    type: "postgres",
    host: process.env.DB_HOST,
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
});

export const dbConnect = async () => {
    AppDataSource.initialize()
        .then(() => {
            return;
        })
        .catch((err: Error) => {
            throw new Error(err.message);
        });
};
