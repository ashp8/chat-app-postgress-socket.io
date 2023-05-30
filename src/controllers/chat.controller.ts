
import { Request, Response } from 'express';
import { Op } from 'sequelize';
import {Server, Socket} from 'socket.io';
import { ChatMessage } from '../models/ChatMessage';
import { User } from '../models/User';

export class ChatController{
    socketLists:any = {};
    constructor(private io: Server){
        this.init();
    }

    private async init(){
        this.io.on("connection", (socket: Socket)=>{
            console.log(`Client Connect ID:[${socket.id}]`);
            this.socketLists[`${socket.id}`] = false;

            socket.on('chat:message', async(message: ChatMessage)=>{
                if(this.socketLists[socket.id]){

                    const recipientUser = await User.findOne({where: {
                        username: message.recipientUsername
                    }});
                    const currentUser = await User.findOne({where: {
                        username: message.senderUsername
                    }});
                    if(recipientUser && currentUser){
                        await ChatMessage.create({...message});
                        this.io.to(recipientUser.socket_id).emit('chat:message', message);
                    }else{
                        console.log(`User ${message.recipientUsername} not found!`);
                    }
                }
                else{
                    socket.emit("chat:message", "User not valid!");
                }

            });

            socket.on('socket:auth', async ({username})=>{
                const user = await User.findOne({where: {username}});
                if(!user){
                    console.log('user not valid!');
                    socket.conn.close();
                };
                this.socketLists[socket.id] = true;
                await user?.update({socket_id: socket.id});
            });

            socket.on('disconnect', async ()=>{
                const user = await User.findOne({where: {socket_id: socket.id}});
                user?.update({socket_id: null});
                console.log(`Client [${socket.id}] disconnected`);
                delete this.socketLists[socket.id];
            })
        });
    }

    public async getAllMessages(req: Request, res: Response){
        const {su, ru} = req.query || {};
        if(su === undefined || ru === undefined) return res.json({message: "error "});
        const messages: ChatMessage[] = await ChatMessage.findAll({
            limit: 10,
            order: [ [ 'createdAt', 'DESC' ]],
            where: {
                [Op.or]: [
                    {
                        sender_username: su,
                        recipient_username: ru

                    },
                    {
                        sender_username: ru,
                        recipient_username: su
                    }
                ]
            }
        });
        return res.json(messages);
    }
}