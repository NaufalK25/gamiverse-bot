require('dotenv').config();
const { nodeFetch } = require('../helpers');

const PLATFORM = [
    { name: 'Xbox', value: '1' },
    { name: 'PlayStation', value: '2' },
    { name: 'Steam', value: '3' },
    { name: 'Blizzard', value: '4' },
    { name: 'Stadia', value: '5' },
    { name: 'Epic Games', value: '6' },
    { name: 'Demon', value: '10' },
    { name: 'Bungie', value: '254' }
];
const CLASS = {
    0: 'Titan',
    1: 'Hunter',
    2: 'Warlock',
    3: 'Unknown'
};
const RACE = {
    0: 'Human',
    1: 'Awoken',
    2: 'Exo',
    3: 'Unknown'
};
const GENDER = {
    0: 'Male',
    1: 'Female',
    2: 'Unknown'
};

const getPlatformName = platform => PLATFORM.find(({ name }) => name.toLowerCase() === platform.toLowerCase());

module.exports = bot => {
    bot.onText(/\/d2 (.+) (.+)/, async (msg, match) => {
        const chatId = msg.chat.id;
        const argPlatform = match[1];
        const platform = getPlatformName(argPlatform).value;

        if (!platform) {
            return bot.sendMessage(
                chatId,
                `Sorry, the platform you entered is not valid. Please enter one of the following platforms: <b>Xbox</b>, <b>PlayStation</b>, <b>Steam</b>, <b>Blizzard</b>, <b>Stadia</b>, <b>Epic Games</b>, <b>Demon</b>, <b>Bungie</b> (case insensitive)`,
                {
                    parse_mode: 'HTML'
                }
            );
        }

        const membershipId = match[2].trim().toLowerCase();
        const reqInit = {
            method: 'GET',
            headers: {
                'X-API-Key': process.env.D2_API_KEY
            }
        };
        const player = await nodeFetch(`https://www.bungie.net/Platform/Destiny2/${platform}/Profile/${membershipId}/?components=100`, reqInit);

        const notFoundErrorCodes = [7, 18, 217];
        if (player.ErrorCode !== 1) {
            if (notFoundErrorCodes.includes(player.ErrorCode)) {
                return bot.sendMessage(
                    chatId,
                    `Sorry, we couldn't find a <b>${platform}</b> player with membership id <b>${membershipId}</b>. Please check that you have entered the correct platform and membership id and try again`,
                    {
                        parse_mode: 'HTML'
                    }
                );
            }

            return bot.sendMessage(chatId, `${player.ErrorStatus}: ${player.Message}`, {
                parse_mode: 'HTML'
            });
        }

        const playerStats = player.Response.profile.data;

        const text = [
            `<b>Name:</b> <a href="https://www.bungie.net/${playerStats.versionsOwned}/en/User/Profile/${platform}/${membershipId}?bgn=${playerStats.userInfo.bungieGlobalDisplayName}">${playerStats.userInfo.displayName}</a>`,
            `<b>Platform:</b> ${PLATFORM.find(({ value }) => value === platform).name}`,
            `<b>Membership ID:</b> ${playerStats.userInfo.membershipId}`
        ];

        if (playerStats.characterIds.length > 0) {
            for (const [idx, characterId] of playerStats.characterIds.entries()) {
                const character = await nodeFetch(`https://www.bungie.net/Platform/Destiny2/${platform}/Profile/${membershipId}/Character/${characterId}/?components=200`, reqInit);
                const characterStats = character.Response.character.data;

                text.push(
                    ...[
                        `<b>Character ${idx + 1}</b>`,
                        `    <b>Class:</b> ${CLASS[characterStats.classType]}`,
                        `    <b>Race:</b> ${RACE[characterStats.raceType]}`,
                        `    <b>Gender:</b> ${GENDER[characterStats.genderType]}`,
                        `    <b>Light:</b> ${characterStats.light}`
                    ]
                );
            }
        }

        bot.sendMessage(chatId, text.join('\n'), {
            parse_mode: 'HTML'
        });
    });
};
