import { Sequelize, Model, DataType, DataTypes } from "sequelize";

export class ChatMessage extends Model{
    id!: number;
    text!: string;
    senderUsername!: string;
    recipientUsername!: string;
    createdAt!: Date;
};

export const initChatMessageModel = (sequelize: Sequelize) => {
    ChatMessage.init({
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        text: {
            type: DataTypes.STRING,
            allowNull: false
        },
        senderUsername: {
            type: DataTypes.STRING,
            allowNull: false,
            field: "sender_username"
        },
        recipientUsername: {
            type: DataTypes.STRING,
            allowNull: false,
            field: 'recipient_username'
        },
        createdAt: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW,
            field: 'created_at'
        }
    }, {
        sequelize,
        modelName: "ChatMessage",
        tableName: "chat_message",
        timestamps: false
    })
}