import express, { Request, Response } from "express";
import dotenv from "dotenv";
import { dbConnect } from "./utils/initialize.js";
import { userRouter } from "./routes/User.js";
import { DataSource } from "typeorm";
import { User } from "./models/User.js";
import { messageRouter } from "./routes/Message.js";

dotenv.config(); // environment variables

export const PORT: string | number = process.env.PORT || 3000;
export const app = express();

export const AppDataSource = new DataSource({
    type: "postgres",
    host: process.env.DB_HOST,
    port: 5432,
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    entities: [User],
    synchronize: true,
    logging: false,
});

app.use(express.json());

app.get("/programmer", (req: Request, res: Response) => {
    res.status(200).json({
        name: "Ali Ahmad",
        visual: "https://github.com/aliahmadCode/",
    });
});

app.use("/api/user/", userRouter);
app.use("/api/message/", messageRouter);

dbConnect()
    .then(() => {
        app.listen(PORT, () => {
            console.log(`db connected\nListening on the port ${PORT}`);
        });
    })
    .catch((err) => {
        console.log(err);
        process.exit(1);
    });

/*

200 OK
201 Created
204 No Content

301 Moved Permanently
302 Found
304 Not Modified

400 Bad Request
401 Unauthorized
403 Forbidden
404 Not Found
422 Unprocessable Entity

500 Internal Server Error
502 Bad Gateway
503 Service Unavailable
504 Gateway Timeout

 */
