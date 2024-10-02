const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const {EventEmitter} = require("node:events");

const emitter = new EventEmitter();
require('./telegramBot/botConfig');

const clientRoutes = require('../routes/clientRouter');
const messageRoutes = require('../routes/messageRouter');
const utilityRoutes = require('../routes/utilityRouter')

const cron = require("node-cron");
const {sendScheduledMessages} = require("../services/sendingService");

cron.schedule('* * * * *', async () => {
    console.log('Checking for scheduled messages...');
    const result = await sendScheduledMessages();
    emitter.emit('update', 'messages');
    if (result)
        console.log(result);
});

const server = express();

server.use(cors());
server.use(helmet());
server.use(express.json());

server.get('/', (req, res) => {
    res.send('Hello World!');
})

server.use('/client', clientRoutes);
server.use('/message', messageRoutes);
server.use('/utility', utilityRoutes);

server.get('/connect', (req, res) => {
    console.log('New client connected');

    res.writeHead(200, {
        'Connection': 'keep-alive',
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
    });

    res.write(`data: Connected to server\n\n`);

    emitter.on('update', (queryKey) => {
        res.write(`data: ${queryKey}\n\n`);
    });

    req.on('close', () => {
        console.log('Client disconnected');
        res.end();
    });
});


module.exports = server;