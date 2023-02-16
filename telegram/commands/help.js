module.exports = bot => {
    bot.onText(/\/help|\/start/, async (msg, match) => {
        const chatId = msg.chat.id;

        const text = [
            'Help:',
            '<b>/help</b>: Get help for the bot',
            '<b>/contact</b>: Get contact information for the developer',
            '<b>/docs</b>: Get documentation for the bot',
            '<b>/bs</b>: Get player stats from Brawl Stars',
            '<b>/chess</b>: Get player stats from Chess.com',
            '<b>/coc</b>: Get player stats from Clash of Clans',
            '<b>/cr</b>: Get player stats from Clash Royale',
            '<b>/d2</b>: Get player stats from Destiny 2',
            '<b>/pubg</b>: Get player stats from PUBG',
            '<b>/tetrio</b>: Get player stats from TETR.io'
        ];

        bot.sendMessage(chatId, text.join('\n'), {
            parse_mode: 'HTML'
        });
    });
};
