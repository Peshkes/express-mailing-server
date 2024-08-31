const TelegramBot = require('node-telegram-bot-api');
const fs = require('fs');
const config = require('../api/config');
const db = require("../api/db/dbConfig");

// Инициализация бота
const bot = new TelegramBot(config.telegramToken, {polling: false});

const sendTelegramMessage = async (chatId, message, mediaPath = null) => {
    try {
        if (mediaPath) {
            const extension = mediaPath.split('.').pop().toLowerCase();
            const isPhoto = ['jpg', 'jpeg', 'png'].includes(extension);

            if (isPhoto) {
                await bot.sendPhoto(chatId, fs.createReadStream(mediaPath), {caption: message});
            } else {
                await bot.sendVideo(chatId, fs.createReadStream(mediaPath), {caption: message});
            }
        } else {
            await bot.sendMessage(chatId, message);
        }
        console.log('Сообщение отправлено в Telegram');
    } catch (error) {
        console.error('Ошибка при отправке сообщения в Telegram:', error);
    }
};

const processTelegramMessages = async (messages) => {
    for (const messageObj of messages) {
        let {phoneNumber, chatId, message, mediaPath} = messageObj;

        if (!chatId) {
            console.log(`Chat ID для ${phoneNumber} не найден`);
            continue;
        }

        await sendTelegramMessage(chatId, message, mediaPath);

        await new Promise(resolve => setTimeout(resolve, 500));
    }
};

module.exports = {
    sendTelegramMessage,
    processTelegramMessages
};