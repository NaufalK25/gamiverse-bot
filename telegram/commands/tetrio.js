const { humanizeDate, nodeFetch } = require('../helpers');

module.exports = bot => {
    bot.onText(/\/tetrio (.+)/, async (msg, match) => {
        const chatId = msg.chat.id;
        const username = match[1].trim().toLowerCase();
        const player = await nodeFetch(`https://ch.tetr.io/api/users/${username}`);

        if (!player.success) {
            return bot.sendMessage(chatId, `Sorry, we couldn't find a player with the username <b>${username}</b>. Please check that you have entered the correct username and try again`, {
                parse_mode: 'HTML'
            });
        }

        const playerStats = player.data.user;

        const text = [
            `<b>Username:</b> <a href="https://ch.tetr.io/u/${playerStats.username}">${playerStats.username}</a>`,
            `<b>Country:</b> ${playerStats.country || 'None'}`,
            `<b>Member Since:</b> ${humanizeDate(new Date(playerStats.ts))}`,
            `<b>Games Played:</b> ${playerStats.league.gamesplayed}`,
            `<b>Games Won:</b> ${playerStats.league.gameswon}`,
            `<b>Rank:</b> ${playerStats.league.rank.toUpperCase()}`,
            `<b>Best Rank:</b> ${playerStats.league.bestrank?.toUpperCase() || playerStats.league.rank.toUpperCase()}`
        ];

        bot.sendMessage(chatId, text.join('\n'), {
            parse_mode: 'HTML'
        });
    });
};
