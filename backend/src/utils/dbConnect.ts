import { DataSource } from "typeorm";

export const dbConnect = async () => {
    const AppDataSource = new DataSource({
        type: "postgres",
        host: process.env.DB_HOST,
        username: process.env.DB_USERNAME,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
    });

    AppDataSource.initialize()
        .then(() => {
            console.log("postgres has connected.");
        })
        .catch((err: Error) => {
            console.error("Error during Data source initialization", err);
            throw new Error(err.message);
        });
};
