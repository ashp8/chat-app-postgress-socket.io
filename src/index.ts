import express, {Express} from 'express';
import http, {Server as HttpServer} from 'http';
import {Server as IoServer} from 'socket.io';
import { ChatController } from './controllers/chat.controller';
import { db } from './database';

const app:Express = express();
const server: HttpServer = http.createServer(app);

const io: IoServer = new IoServer(server, {
    cors: {
        origin: '*'
    }
});

app.use(express.json());

const ioContext = new ChatController(io);

app.get('/', (req, res)=>{
    return res.send("Hello, World!");
});
app.get('/messages', ioContext.getAllMessages);

db.sequelize.authenticate().then(()=>{
    server.listen(3000, ()=>{
        console.log(`Server started at port 3000`);
    })
}).catch((error)=>{
    console.log("Unable to Connect to the database: ", error);
});
