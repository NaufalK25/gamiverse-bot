require('dotenv').config();
const { nodeFetch } = require('../helpers');

const PLATFORM = [
    { name: 'Kakao', value: 'kakao' },
    { name: 'PlayStation', value: 'psn' },
    { name: 'Stadia', value: 'stadia' },
    { name: 'Steam', value: 'steam' },
    { name: 'Xbox', value: 'xbox' }
];

const getPlatformName = platform => PLATFORM.find(({ name }) => name.toLowerCase() === platform.toLowerCase());

module.exports = bot => {
    bot.onText(/\/pubg (.+) (.+)/, async (msg, match) => {
        const chatId = msg.chat.id;
        const argPlatform = match[1];
        const platform = getPlatformName(argPlatform).value;

        if (!platform) {
            return bot.sendMessage(
                chatId,
                `Sorry, the platform you entered is not valid. Please enter one of the following platforms: <b>Kakao</b>, <b>PlayStation</b>, <b>Stadia</b>, <b>Steam</b>, or <b>Xbox</b> (case insensitive)`,
                {
                    parse_mode: 'HTML'
                }
            );
        }

        const accountId = match[2].trim().toLowerCase();
        const reqInit = {
            method: 'GET',
            headers: {
                Accept: 'application/vnd.api+json',
                Authorization: `Bearer ${process.env.PUBG_TOKEN}`
            }
        };
        const player = await nodeFetch(`https://api.pubg.com/shards/${platform}/players/${accountId}`, reqInit);

        const notFoundTitles = ['Bad Request', 'Not Found'];
        if (player.errors) {
            const { title, detail } = player.errors[0];
            if (notFoundTitles.includes(title)) {
                return bot.sendMessage(
                    chatId,
                    `Sorry, we couldn't find a <b>${platform}</b> player with account id <b>${accountId}</b>. Please check that you have entered the correct platform and account id and try again`,
                    {
                        parse_mode: 'HTML'
                    }
                );
            }

            return bot.sendMessage(chatId, `${title}: ${detail}`, {
                parse_mode: 'HTML'
            });
        }

        const stats = await nodeFetch(`https://api.pubg.com/shards/${platform}/players/${accountId}/seasons/lifetime`, reqInit);
        const { solo, duo, squad } = stats.data.attributes.gameModeStats;

        const text = [
            `<b>Name</b>: ${player.data.attributes.name}`,
            `<b>Platform</b>: ${player.data.attributes.shardId}`,
            `<b>Account ID</b>: ${player.data.id}`,
            `<b>Solo</b>:`,
            `    <b>Top 10s</b>: ${solo.top10s}`,
            `    <b>Wins</b>: ${solo.wins}`,
            `    <b>Losses</b>: ${solo.losses}`,
            `    <b>Kills</b>: ${solo.kills}`,
            `    <b>Assists</b>: ${solo.assists}`,
            `<b>Duo</b>:`,
            `    <b>Top 10s</b>: ${duo.top10s}`,
            `    <b>Wins</b>: ${duo.wins}`,
            `    <b>Losses</b>: ${duo.losses}`,
            `    <b>Kills</b>: ${duo.kills}`,
            `    <b>Assists</b>: ${duo.assists}`,
            `<b>Squad</b>:`,
            `    <b>Top 10s</b>: ${squad.top10s}`,
            `    <b>Wins</b>: ${squad.wins}`,
            `    <b>Losses</b>: ${squad.losses}`,
            `    <b>Kills</b>: ${squad.kills}`,
            `    <b>Assists</b>: ${squad.assists}`
        ];

        bot.sendMessage(chatId, text.join('\n'), {
            parse_mode: 'HTML'
        });
    });
};
