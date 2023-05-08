import { Sequelize } from "sequelize";
import { ChatMessage, initChatMessageModel } from "../models/ChatMessage";
import { User,initUserModel} from "../models/User";
const sequelize = new Sequelize({
    dialect: 'postgres',
    database: 'chat-app',
    username: 'postgres',
    password: 'postgres'
});

export const db = {
    sequelize,
    ChatMessage,
    
}

export const connectToDatabase = async ()=>{
    await sequelize.authenticate();
    await sequelize.sync();
    console.log("Database Connected!");
}

initChatMessageModel(sequelize);
initUserModel(sequelize);