require('dotenv').config();
const { nodeFetch } = require('../helpers');

module.exports = bot => {
    bot.onText(/\/cr (.+)/, async (msg, match) => {
        const chatId = msg.chat.id;
        const tag = match[1].trim().toUpperCase();

        const player = await nodeFetch(`https://api.clashroyale.com/v1/players/%23${tag}`, {
            method: 'GET',
            headers: {
                Accept: 'application/json',
                Authorization: `Bearer ${process.env.CR_TOKEN}`
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
            `<b>Arena</b>: ${player.arena ? player.arena.name : 'Arena 0'}`,
            `<b>Clan</b>: ${player.clan ? `${player.clan.name} ${player.clan.tag}` : 'None'}`,
            `<b>Total Donations</b>: ${player.totalDonations}`,
            `<b>Trophies</b>: ${player.trophies}`,
            `<b>Best Trophies</b>: ${player.bestTrophies}`,
            `<b>Battle Count</b>: ${player.battleCount}`,
            `<b>Wins</b>: ${player.wins}`,
            `<b>Losses</b>: ${player.losses}`,
            `<b>Three Crown Wins</b>: ${player.threeCrownWins}`
        ];

        bot.sendMessage(chatId, text.join('\n'), {
            parse_mode: 'HTML'
        });
    });
};
