import express, { Request, Response } from "express";
import dotenv from "dotenv";
import { dbConnect } from "./utils/initialize.js";
import { userRouter } from "./routes/User.js";
import { DataSource } from "typeorm";
import { User } from "./models/User.js";
import { messageRouter } from "./routes/Message.js";
import { Message } from "./models/Message.js";
dotenv.config(); // environment variables
import { Server } from "socket.io";
import { createServer } from "node:http";
import cors from "cors";
import { SocketManager } from "./sockets/SocketManager.js";
import { createClient } from "redis";

export const app = express();
const server = createServer(app);
const socket = new SocketManager();

socket.io.attach(server);
socket.initialize();

const client = await createClient().on("error", (err) => {
  console.log("Can't connect to redis: ", err);
});

export const PORT: string | number = process.env.PORT || 3000;
export const SECRET_KEY: string = process.env.SECRET
  ? process.env.SECRET
  : process.exit(1);

export const AppDataSource = new DataSource({
  type: "postgres",
  host: process.env.DB_HOST,
  port: 5432,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,

  entities: [User, Message],
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

// get GET
// send POST
// delete DELETE
app.use("/api/message/", messageRouter);

// get GET
// get/:id GET
// delete DELETE
// delete/:id DELETE
// add POST
// * edit/:id PATCH
app.use("/api/user/", userRouter);

// here i am connecting redis, postgres, and then server
client.connect().then(() => {
  dbConnect()
    .then(() => {
      server.listen(PORT, () => {
        console.log(
          `redis connected\ndb connected\nListening on the port ${PORT}`,
        );
      });
    })
    .catch((err) => {
      console.log(err);

      socket.io.removeAllListeners();
      process.exit(1);
    });
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
