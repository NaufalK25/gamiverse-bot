require('dotenv').config();
const { EmbedBuilder, SlashCommandBuilder } = require('discord.js');
const { addField, addEmptyField, addTitleOnlyField, createErrorEmbed, humanizeDate, nodeFetch } = require('../helpers');

const D2_THUMBNAIL = 'https://res.cloudinary.com/dko04cygp/image/upload/v1676363551/gamiverse/d2/d2_segzwy.png';
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

const getPlatformName = platform => PLATFORM.find(({ value }) => value === platform).name;

module.exports = {
    data: new SlashCommandBuilder()
        .setName('d2')
        .setDescription('Get player stats from Destiny 2')
        .addStringOption(option =>
            option
                .setName('platform')
                .setDescription('The platform that the player is playing on')
                .setChoices(...PLATFORM.map(({ name, value }) => ({ name, value })))
                .setRequired(true)
        )
        .addStringOption(option => option.setName('membershipid').setDescription('The membership id of the player').setRequired(true)),
    async execute(interaction) {
        try {
            const argPlatform = interaction.options.getString('platform');
            const argMembershipId = interaction.options.getString('membershipid').trim();
            const reqInit = {
                method: 'GET',
                headers: {
                    'X-API-Key': process.env.D2_API_KEY
                }
            };
            const player = await nodeFetch(`https://www.bungie.net/Platform/Destiny2/${argPlatform}/Profile/${argMembershipId}/?components=100`, reqInit);

            const notFoundErrorCodes = [7, 18, 217];
            if (player.ErrorCode !== 1) {
                if (notFoundErrorCodes.includes(player.ErrorCode)) {
                    const embed = createErrorEmbed(D2_THUMBNAIL, `\`${getPlatformName(argPlatform)}\` player with membership id \`${argMembershipId}\` not found.`, 'Destiny 2');
                    return interaction.reply({ embeds: [embed] });
                }

                const embed = createErrorEmbed(D2_THUMBNAIL, `${player.ErrorStatus}: ${player.Message}`, 'Destiny 2');
                return interaction.reply({ embeds: [embed] });
            }

            const playerStats = player.Response.profile.data;

            const embed = new EmbedBuilder()
                .setColor('#A9B1B9')
                .setTitle(`${playerStats.userInfo.displayName} | ${getPlatformName(argPlatform)}`)
                .setDescription(playerStats.userInfo.membershipId)
                .setURL(`https://www.bungie.net/${playerStats.versionsOwned}/en/User/Profile/${argPlatform}/${argMembershipId}?bgn=${playerStats.userInfo.bungieGlobalDisplayName}`)
                .setThumbnail(D2_THUMBNAIL)
                .addFields(
                    addField('Last Played', humanizeDate(new Date(playerStats.dateLastPlayed)), {
                        sticker: ':calendar:'
                    }),
                    addEmptyField()
                );

            for (const [idx, characterId] of playerStats.characterIds.entries()) {
                const character = await nodeFetch(`https://www.bungie.net/Platform/Destiny2/${argPlatform}/Profile/${argMembershipId}/Character/${characterId}/?components=200`, reqInit);
                const characterStats = character.Response.character.data;

                embed.addFields(
                    addTitleOnlyField(`Character ${idx + 1}`),
                    addField('Class', CLASS[characterStats.classType], {
                        sticker: ':shield:'
                    }),
                    addField('Race', RACE[characterStats.raceType], {
                        sticker: ':cat:'
                    }),
                    addField('Gender', GENDER[characterStats.genderType], {
                        sticker: `:${characterStats.gender !== 3 ? GENDER[characterStats.genderType].toLowerCase() : 'no_entry'}_sign:`
                    }),
                    addField('Light', characterStats.light, {
                        sticker: ':star:'
                    })
                );
            }

            embed.setFooter({ text: 'Destiny 2' });

            interaction.reply({ embeds: [embed] });
        } catch (err) {
            console.error(err);
            const embed = createErrorEmbed(
                D2_THUMBNAIL,
                [
                    'This error can be caused by:',
                    '1. API key expired',
                    '2. Invalid API key',
                    '3. Rate limit exceeded',
                    '4. Internal server error',
                    '5. Server is under maintenance',
                    'Please contact the developer if the error persists.'
                ].join('\n'),
                'Destiny 2'
            );

            interaction.reply({ embeds: [embed] });
        }
    }
};
