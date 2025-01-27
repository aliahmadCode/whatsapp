import express, { Request, Response } from "express";
import dotenv from "dotenv";
import { dbConnect } from "./utils/dbConnect.js";
import { userRouter } from "./routes/User.js";

dotenv.config(); // environment variables

export const PORT: string | number = process.env.PORT || 3000;
export const app = express();

app.get("/programmer", (req: Request, res: Response) => {
    res.status(200).json({
        name: "Ali Ahmad",
        visual: "https://github.com/aliahmadCode/",
    });
});

app.use("/api/user/", userRouter);

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
