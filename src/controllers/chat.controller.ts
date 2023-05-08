
import { Request, Response } from 'express';
import { Op } from 'sequelize';
import {Server, Socket} from 'socket.io';
import { ChatMessage } from '../models/ChatMessage';
import { User } from '../models/User';

export class ChatController{
    constructor(private io: Server){
        this.init();
    }

    private async init(){
        this.io.on("connection", (socket: Socket)=>{
            console.log(`Client Connect ID:[${socket.id}]`);

            socket.on('chat:message', async(message: ChatMessage)=>{
                const recipientUser = await User.findOne({where: {
                    username: message.recipientUsername
                }});
                if(recipientUser){
                    await ChatMessage.create({...message});
                    this.io.to(recipientUser.socket_id).emit('chat:message', message);
                }else{
                    console.log(`User ${message.recipientUsername} not found!`);
                }

            });

            socket.on('socket:auth', async ({username})=>{
                const user = await User.findOne({where: {username}});
                if(!user){
                    console.log('user not valid!');
                };
                await user?.update({socket_id: socket.id});
            });

            socket.on('disconnect', async ()=>{
                const user = await User.findOne({where: {socket_id: socket.id}});
                user?.update({socket_id: null});
                console.log(`Client [${socket.id}] disconnected`);
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