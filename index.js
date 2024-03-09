const TelegramBot = require('node-telegram-bot-api');

const token = '6755071690:AAFYYRrQJc1o_NPNUKQavOuc9ILSl428f5U';

const bot = new TelegramBot(token, { polling: true });

bot.onText(/\/start/, (msg) => {
    const chatId = msg.chat.id;
    bot.sendPhoto(chatId, './img/sticker.webp');

    bot.sendMessage(chatId, 'Здорова чушка!');

});

bot.on('message', (msg) => {
    console.log(msg)
    const chatId = msg.chat.id;
    const text = msg.text
    // bot.sendMessage(chatId, 'Здорова чушка!');
});