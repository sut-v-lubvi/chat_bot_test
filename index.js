const TelegramBot = require('node-telegram-bot-api');
const axios = require('axios');
const cheerio = require('cheerio');

const token = '6755071690:AAFYYRrQJc1o_NPNUKQavOuc9ILSl428f5U';

const bot = new TelegramBot(token, { polling: true });

bot.onText(/\/start/, (msg) => {
    const chatId = msg.chat.id;
    bot.sendPhoto(chatId, './img/sticker.webp');

    bot.sendMessage(chatId, 'Здорова чушка!');

});

bot.onText(/\/getdata/, async (msg) => {
    const chatId = msg.chat.id;

    const url = 'https://dzen.ru/a/X-hGvw0Md1msvlZB';
    try {
        const response = await axios.get(url);
        console.log(response)
        const $ = cheerio.load(response.data);
        const data = $('.publication-columns-layout__columns-container').text();
        console.log(`Данные с горнолыжного курорта: ${data}`)

        bot.sendMessage(chatId, `Данные с горнолыжного курорта: ${data}`);
    } catch (error) {
        console.error('Ошибка при получении данных:', error);
        bot.sendMessage(chatId, 'Произошла ошибка при получении данных с сайта горнолыжного курорта.');
    }
});

bot.on('message', (msg) => {
    const chatId = msg.chat.id;
    bot.sendMessage(chatId, 'Отправьте мне команду /getdata, чтобы получить данные с горнолыжного курорта.');});