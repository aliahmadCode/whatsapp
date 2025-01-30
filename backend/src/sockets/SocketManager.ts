import { Server, Socket } from "socket.io";
import { AppDataSource } from "../index.js";
import { Message } from "../models/Message.js";
import { User } from "../models/User.js";
import { MessageStatus, MessageType } from "../interfaces/MessageEnums.js";

/* export const io = new Server({
    cors: {
        methods: ["GET", "POST", "PATCH", "DELETE", "PUT"],
        origin: "http://localhost:5173",
    },
});
 */

interface ILogin {
  name?: string;
  userId: string;
}

interface ISend {
  senderId: string;
  receiverId: string;
  message: string;
}

export class SocketManager {
  private _io: Server;
  private _map: Map<string, ILogin>;
  constructor() {
    this._io = new Server({
      cors: {
        methods: ["GET", "POST", "PATCH", "DELETE", "PUT"],
        origin: "http://localhost:3000",
      },
    });

    this._map = new Map();
  }

  get io() {
    return this._io;
  }
  initialize(): void {
    this._io.on("connection", (socket: Socket) => {
      socket.on("message_login", (data: ILogin) => {
        this._map.set(data.userId, {
          userId: socket.id,
        });
        socket.emit("isLogin", "Logged In");
      });

      socket.on("message_send", async (data: ISend) => {
        const { senderId, receiverId, message } = data;
        console.log("the send", data);
        const messageRepo = await AppDataSource.getRepository(Message);
        const sender = await AppDataSource.getRepository(User).findOne({
          where: { id: senderId },
        });
        const receiver = await AppDataSource.getRepository(
          User,
        ).findOne({ where: { id: receiverId } });

        if (!sender || !receiver) {
          return socket.emit("message_error", "Invalid Users");
        }

        const msg = new Message();
        msg.sender = sender;
        msg.receiver = receiver;
        msg.message_type = MessageType.TEXT;
        msg.message = message;

        const receiverSocketId: ILogin | undefined =
          this._map.get(receiverId);

        if (receiverSocketId && receiverSocketId.userId) {
          msg.message_status = MessageStatus.DELIVERED;
          const resultMessage: Message = await messageRepo.save(msg);
          return this._io
            .to(receiverSocketId.userId)
            .emit("message_receive", {
              userId: receiverId,
              message,
              senderId: senderId,
              createdAt: resultMessage.createdAt,
              status: resultMessage.message_status
            });
        }
        msg.message_status = MessageStatus.SENT;
        const resultMessage: Message = await messageRepo.save(msg);
        // assuming that the sender is connected for now
        return this._io.to(senderId).emit("message_receive", {
          status: resultMessage.message_status,
          message: resultMessage.message
        })
      });

      socket.on("disconnect", () => {
        this._map.forEach((val, key) => {
          const id = socket.id;
          if (val.userId === id) {
            const isDeleted = this._map.delete(key);
            if (isDeleted) {
              console.log(`User with id: ${id} is disconnected`);
            } else {
              console.log(
                `User with id: ${id} is disconnected, but somehow id is not deleted`,
              );
            }
          }
        });
      });
    });
  }
}
