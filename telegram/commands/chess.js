const { humanizeDate, nodeFetch } = require('../helpers');

module.exports = bot => {
    bot.onText(/\/chess (.+)/, async (msg, match) => {
        const chatId = msg.chat.id;
        const username = match[1].trim().toLowerCase();

        const player = await nodeFetch(`https://api.chess.com/pub/player/${username}`);

        if (player.code === 0) {
            return bot.sendMessage(chatId, `Sorry, we couldn't find a player with the username <b>${username}</b>. Please check that you have entered the correct username and try again`, {
                parse_mode: 'HTML'
            });
        }

        const country = await nodeFetch(player.country);

        const text = [
            `<b>Username:</b> <a href="${player.url}">${player.username}</a>`,
            `<b>Followers:</b> ${player.followers}`,
            `<b>Country:</b> ${country.name || 'None'}`,
            `<b>Status:</b> ${player.status}`,
            `<b>League:</b> ${player.league || 'None'}`,
            `<b>Last Online:</b> ${humanizeDate(new Date(player.last_online * 1000))}`,
            `<b>Member Since:</b> ${humanizeDate(new Date(player.joined * 1000))}`
        ];

        bot.sendMessage(chatId, text.join('\n'), {
            parse_mode: 'HTML'
        });
    });
};
