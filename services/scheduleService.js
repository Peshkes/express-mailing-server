const db = require("../api/db/dbConfig");
const cron = require('node-cron');
const {sendMessageImmediately} = require("./sendingService");

async function getScheduledMessages() {
    try {
        const currentTimestamp = Math.floor(Date.now() / 1000);
        return await db('messages')
            .where('sending_date', '<=', currentTimestamp).first();
    } catch (err) {
        throw new Error(`Failed to retrieve scheduled messages: ${err.message}`);
    }
}

async function sendScheduledMessages() {
    try {
        const message = await getScheduledMessages();
        return await sendMessageImmediately(message.message_text, message.recipient_type_id, message.media_path);
    } catch (err) {
        console.error(`Failed to send scheduled messages: ${err.message}`);
    }
}

cron.schedule('* * * * *', async () => {
    console.log('Checking for scheduled messages...');
    const result = await sendScheduledMessages();
    console.log(result);
});