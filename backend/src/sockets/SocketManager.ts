import { DisconnectReason, Server, Socket } from "socket.io";
import { AppDataSource, client } from "../index.js";
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

interface ILoginDisconnect {
  userId: string;
}

interface ISend {
  senderId: string;
  receiverId: string;
  message: string;
}

export class SocketManager {
  private _io: Server;
  constructor() {
    this._io = new Server({
      cors: {
        methods: ["GET", "POST", "PATCH", "DELETE", "PUT"],
        origin: "http://localhost:3000",
      },
    });
  }

  get io() {
    return this._io;
  }


  /*
   *
   * sockets
   *
   * (on)
   * message_login - data: ILoginDisconnect
   * disconnect - reason: DisconnectReason, data: ILoginDisconnect
   * message_send - data: ISend
   *
   * (emit)
   * message_error - data: string
   * message_receive - {status: string; message: string; createdAt: Date}
   *
   * redis
   *
   * (LIST)
   * pending_messages: {id: string; message: string; status: MessageStatus; createdAt: Date}
   *
   * */
  initialize(): void {
    this._io.on("connection", (socket: Socket) => {
      socket.on("message_login", async (data: ILoginDisconnect) => {
        await client.set(data.userId, socket.id);
        socket.to(socket.id).emit("isLogin", "Logged In");
      });

      // it will send the userId
      socket.on(
        "disconnect",
        async (reason: DisconnectReason, data: ILoginDisconnect) => {
          try {
            await client.del(data.userId);
            console.log(reason);
          } catch (err) {
            console.error("Redis delete user connectiona: ", err);
          }
        },
      );

      // socket handles message send
      socket.on("message_send", async (data: ISend) => {
        // from payload of message send
        const { senderId, receiverId, message } = data;

        // message repo
        const messageRepo = await AppDataSource.getRepository(Message);
        // finding sender user
        const sender = await AppDataSource.getRepository(User).findOne({
          where: { id: senderId },
        });

        // finding receiver user
        const receiver = await AppDataSource.getRepository(
          User,
        ).findOne({ where: { id: receiverId } });

        // if any one is not registered
        if (!sender || !receiver) {
          // emiting errors
          return socket.emit("message_error", "Invalid Users");
        }

        // msg object
        const msg = new Message();
        msg.sender = sender;
        msg.receiver = receiver;
        msg.message_type = MessageType.TEXT;
        msg.message = message;

        // the socket id
        const receiverSocketId: string | null =
          await client.get(receiverId);

        // found receiver in cache, means connected
        if (receiverSocketId) {
          msg.message_status = MessageStatus.DELIVERED;
          const resultMessage: Message = await messageRepo.save(msg);

          // sending to receiver
          this._io.to(receiverSocketId).emit("message_receive", {
            message,
            createdAt: resultMessage.createdAt,
            status: resultMessage.message_status,
          });

          // assuming that the sender is connected for now, and it should be
          // telling the sender about status, it is delivered
          return this._io.to(senderId).emit("message_receive", {
            status: resultMessage.message_status,
            message: resultMessage.message,
            createdAt: resultMessage.createdAt,
          });
        } else {
          // receiver is not connected, just send
          msg.message_status = MessageStatus.SENT;
          const resultMessage: Message = await messageRepo.save(msg);

          // message status is sent so pushed to list
          // so that when the receiver conencted, it will receive it
          await client.lPush(
            "pending_messages",
            JSON.stringify({
              id: resultMessage.id,
              message: resultMessage.message,
              status: resultMessage.message_status,
              createdAt: resultMessage.createdAt,
            }),
          );

          // assuming that the sender is connected for now, and it should be
          return this._io.to(senderId).emit("message_receive", {
            status: resultMessage.message_status,
            message: resultMessage.message,
            createdAt: resultMessage.createdAt,
          });
        }
      });
    });
  }
}
