const TelegramBot = require('node-telegram-bot-api');
const config = require('../config');
const db = require('../db/dbConfig');

const bot = new TelegramBot(config.telegramToken, { polling: true });

const normalizePhoneNumber = (phoneNumber) => {
    return phoneNumber.replace(/\+/g, '').replace(/\s+/g, '');
};

const requestPhoneNumber = (chatId) => {
    const options = {
        reply_markup: {
            keyboard: [
                [{
                    text: "Отправить номер телефона",
                    request_contact: true
                }]
            ],
            one_time_keyboard: true,
            resize_keyboard: true
        }
    };
    bot.sendMessage(chatId, "Пожалуйста, отправьте свой номер телефона, чтобы мы могли проверить вашу регистрацию.", options);
};

const handlePhoneNumber = async (msg) => {
    const chatId = msg.chat.id;
    let phoneNumber = msg.contact?.phone_number;

    if (phoneNumber) {
        phoneNumber = normalizePhoneNumber(phoneNumber);
        try {
            const client = await db('clients')
                .whereRaw('REPLACE(phone_number, "+", "") = ?', [phoneNumber])
                .first();

            if (client) {
                if (client.chat_id) {
                    bot.sendMessage(chatId, "Вы уже зарегистрированы. Ожидайте рассылок.");
                } else {
                    await db('clients')
                        .where({ phone_number: phoneNumber })
                        .update({ chat_id: chatId });

                    bot.sendMessage(chatId, "Ваш номер был найден, вы добавлены в рассылку.");
                }
            } else {
                bot.sendMessage(chatId, "Вы не зарегистрированы. Пожалуйста, зарегистрируйтесь на рецепшене.");
                bot.sendMessage(chatId, "Нажмите кнопку ниже, чтобы повторно ввести номер.", {
                    reply_markup: {
                        keyboard: [
                            [{
                                text: "Авторизоваться",
                                request_contact: true
                            }]
                        ],
                        one_time_keyboard: true,
                        resize_keyboard: true
                    }
                });
            }
        } catch (error) {
            console.error('Ошибка при обработке номера телефона:', error);
            bot.sendMessage(chatId, "Произошла ошибка. Пожалуйста, попробуйте снова.");
        }
    } else {
        bot.sendMessage(chatId, "Пожалуйста, отправьте свой номер телефона.");
        requestPhoneNumber(chatId);
    }
};

bot.on('message', (msg) => {
    if (msg.contact) {
        handlePhoneNumber(msg);
    } else {
        requestPhoneNumber(msg.chat.id);
    }
});

module.exports = bot;