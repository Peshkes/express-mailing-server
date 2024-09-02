const TelegramBot = require('node-telegram-bot-api');
const fs = require('fs');
const config = require('../api/config');
const db = require("../api/db/dbConfig");

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

//users, message_text, media_path
const processTelegramMessages = async (users, message_text, media_path) => {
    for (const user of users) {

        if (!user.chat_id) {
            console.log(`Chat ID для ${user.phone_number} не найден`);
            continue;
        }

        await sendTelegramMessage(user.chat_id, message_text, media_path);

        await new Promise(resolve => setTimeout(resolve, 500));
    }
};

module.exports = {
    sendTelegramMessage,
    processTelegramMessages
};