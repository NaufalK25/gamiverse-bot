module.exports = bot => {
    bot.onText(/\/docs/, async (msg, match) => {
        const chatId = msg.chat.id;

        const text = ['<a href="https://github.com/NaufalK25/gamiverse-bot">Docs</a>'];

        bot.sendMessage(chatId, text.join('\n'), {
            parse_mode: 'HTML'
        });
    });
};
