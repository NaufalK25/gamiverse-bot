module.exports = bot => {
    bot.onText(/\/contact/, async (msg, match) => {
        const chatId = msg.chat.id;

        const text = [
            'Contact Information:',
            '<b>Email</b>: naufalkateni2001@gmail.com',
            '<b>Discord</b>: NaufalK#3934',
            '<b>Telegram</b>: @NaufalK25',
            '<b>Github</b>: <a href="https://github.com/NaufalK25">NaufalK25</a>'
        ];

        bot.sendMessage(chatId, text.join('\n'), {
            parse_mode: 'HTML'
        });
    });
};
