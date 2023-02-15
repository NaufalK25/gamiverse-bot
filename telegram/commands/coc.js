require('dotenv').config();
const { nodeFetch } = require('../helpers');

module.exports = bot => {
    bot.onText(/\/coc (.+)/, async (msg, match) => {
        const chatId = msg.chat.id;
        const tag = match[1].trim().toUpperCase();
        const player = await nodeFetch(`https://api.clashofclans.com/v1/players/%23${tag}`, {
            method: 'GET',
            headers: {
                Accept: 'application/json',
                Authorization: `Bearer ${process.env.COC_TOKEN}`
            }
        });

        if (player.reason === 'notFound') {
            return bot.sendMessage(chatId, `Sorry, we couldn't find a player with the tag <b>${tag}</b>. Please check that you have entered the correct tag and try again`, {
                parse_mode: 'HTML'
            });
        }

        if (player.reason === 'accessDenied.invalidIp') {
            const notAllowedIP = player.message.split(' ').at(-1);
            return bot.sendMessage(
                chatId,
                `Sorry, the server IP address is not allowed: <b>${notAllowedIP}</b>. Please contact the developer to add this IP address to the list of allowed IP addresses.`,
                {
                    parse_mode: 'HTML'
                }
            );
        }

        if (player.reason) {
            return bot.sendMessage(chatId, `${player.reason}: ${player.message}`, {
                parse_mode: 'HTML'
            });
        }

        const text = [
            `<b>Player</b>: ${player.name} ${player.tag}`,
            `<b>Level</b>: ${player.expLevel}`,
            `<b>TH</b>: ${player.townHallLevel}`,
            `<b>Clan</b>: ${player.clan ? `${player.clan.name} ${player.clan.tag}` : 'None'}`,
            `<b>League</b>: ${player.league ? player.league.name : 'None'}`,
            `<b>Trophies</b>: ${player.trophies}`,
            `<b>Best Trophies</b>: ${player.bestTrophies}`,
            `<b>War Stars</b>: ${player.warStars}`,
            `<b>Total Attack Wins</b>: ${player.achievements.find(achievement => achievement.name === 'Conqueror').value}`,
            `<b>Total Defense Wins</b>: ${player.achievements.find(achievement => achievement.name === 'Unbreakable').value}`,
            `<b>Total Donations</b>: ${player.achievements.find(achievement => achievement.name === 'Friend in Need').value}`
        ];

        bot.sendMessage(chatId, text.join('\n'), {
            parse_mode: 'HTML'
        });
    });
};
