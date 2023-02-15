require('dotenv').config();
const { nodeFetch } = require('../helpers');

module.exports = bot => {
    bot.onText(/\/bs (.+)/, async (msg, match) => {
        const chatId = msg.chat.id;
        const tag = match[1].trim().toUpperCase();
        const player = await nodeFetch(`https://api.brawlstars.com/v1/players/%23${tag}`, {
            method: 'GET',
            headers: {
                Accept: 'application/json',
                Authorization: `Bearer ${process.env.BS_TOKEN}`
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
            `<b>Solo Victories</b>: ${player.soloVictories}`,
            `<b>Duo Victories</b>: ${player.duoVictories}`,
            `<b>3v3 Victories</b>: ${player['3vs3Victories']}`,
            `<b>Trophies</b>: ${player.trophies}`,
            `<b>Highest Trophies</b>: ${player.highestTrophies}`
        ];

        bot.sendMessage(chatId, text.join('\n'), {
            parse_mode: 'HTML'
        });
    });
};
