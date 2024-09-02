const express = require('express');
const cors = require('cors');
const helmet = require('helmet');

require('./telegramBot/botConfig');

const clientRoutes = require('../routes/clientRouter');
const messageRoutes = require('../routes/messageRouter');
const cron = require("node-cron");
const {sendScheduledMessages} = require("../services/sendingService");

cron.schedule('* * * * *', async () => {
    console.log('Checking for scheduled messages...');
    const result = await sendScheduledMessages();
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

module.exports = server;