require('dotenv').config();
const { EmbedBuilder, SlashCommandBuilder } = require('discord.js');
const { addField, addEmptyField, addTitleOnlyField, createErrorEmbed, nodeFetch, sendEmbedWithPagination } = require('../helpers');

const PUBG_THUMBNAIL = 'https://res.cloudinary.com/dko04cygp/image/upload/v1676216030/gamiverse/pubg/pubg_djuxe9.png';
const PLATFORM = [
    { name: 'Kakao', value: 'kakao' },
    { name: 'PlayStation', value: 'psn' },
    { name: 'Stadia', value: 'stadia' },
    { name: 'Steam', value: 'steam' },
    { name: 'Xbox', value: 'xbox' }
];

const createPUBGEmbed = (player, stats, { title, data, page }) => {
    return new EmbedBuilder()
        .setColor('#F2A900')
        .setTitle(`${player.data.attributes.name} | ${player.data.attributes.shardId}`)
        .setDescription(player.data.id)
        .setThumbnail(PUBG_THUMBNAIL)
        .addFields(
            addField('Best Rank Point', stats.data.attributes.bestRankPoint, {
                sticker: ':medal:'
            }),
            addEmptyField(),
            addTitleOnlyField(title),
            addField('Top 10s', data.top10s, {
                sticker: ':first_place:'
            }),
            addField('Wins', data.wins, {
                sticker: ':trophy:'
            }),
            addField('Losses', data.losses, {
                sticker: ':x:'
            }),
            addField('Kills', data.kills, {
                sticker: ':gun:'
            }),
            addField('Headshot Kills', data.headshotKills, {
                sticker: ':skull_crossbones:'
            }),
            addField('Assists', data.assists, {
                sticker: ':handshake:'
            })
        )
        .setFooter({ text: `PUBG | Page ${page.current} of ${page.total}` });
};

module.exports = {
    data: new SlashCommandBuilder()
        .setName('pubg')
        .setDescription('Get player stats from PUBG')
        .addStringOption(option =>
            option
                .setName('platform')
                .setDescription('The platform that the player is playing on')
                .setChoices(...PLATFORM)
                .setRequired(true)
        )
        .addStringOption(option => option.setName('accountid').setDescription('The account id of the player').setRequired(true)),
    async execute(interaction) {
        try {
            const argPlatform = interaction.options.getString('platform');
            const argAccountId = interaction.options.getString('accountid').trim().toLowerCase();
            const reqInit = {
                method: 'GET',
                headers: {
                    Accept: 'application/vnd.api+json',
                    Authorization: `Bearer ${process.env.PUBG_TOKEN}`
                }
            };
            const player = await nodeFetch(`https://api.pubg.com/shards/${argPlatform}/players/${argAccountId}`, reqInit);

            const notFoundTitles = ['Bad Request', 'Not Found'];
            if (player.errors) {
                const { title, detail } = player.errors[0];
                if (notFoundTitles.includes(title)) {
                    const embed = createErrorEmbed(
                        PUBG_THUMBNAIL,
                        `Sorry, we couldn't find a \`${argPlatform}\` player with account id \`${argAccountId}\`. Please check that you have entered the correct platform and account id and try again`,
                        'PUBG'
                    );
                    return await interaction.reply({ embeds: [embed] });
                }

                const embed = createErrorEmbed(PUBG_THUMBNAIL, `${title}: ${detail}`, 'PUBG');
                return await interaction.reply({ embeds: [embed] });
            }

            const stats = await nodeFetch(`https://api.pubg.com/shards/${argPlatform}/players/${argAccountId}/seasons/lifetime`, reqInit);
            const { solo, duo, squad } = stats.data.attributes.gameModeStats;
            const soloFPP = stats.data.attributes.gameModeStats['solo-fpp'];
            const duoFPP = stats.data.attributes.gameModeStats['duo-fpp'];
            const squadFPP = stats.data.attributes.gameModeStats['squad-fpp'];

            const embeds = [
                createPUBGEmbed(player, stats, { title: 'Solo', data: solo, page: { current: 1, total: 6 } }),
                createPUBGEmbed(player, stats, { title: 'Solo FPP', data: soloFPP, page: { current: 2, total: 6 } }),
                createPUBGEmbed(player, stats, { title: 'Duo', data: duo, page: { current: 3, total: 6 } }),
                createPUBGEmbed(player, stats, { title: 'Duo FPP', data: duoFPP, page: { current: 4, total: 6 } }),
                createPUBGEmbed(player, stats, { title: 'Squad', data: squad, page: { current: 5, total: 6 } }),
                createPUBGEmbed(player, stats, { title: 'Squad FPP', data: squadFPP, page: { current: 6, total: 6 } })
            ];

            await interaction.deferReply();
            await sendEmbedWithPagination(interaction, embeds);
        } catch (err) {
            const embed = createErrorEmbed(
                PUBG_THUMBNAIL,
                [
                    'This error can be caused by:',
                    '1. API token expired',
                    '2. Invalid API token',
                    '3. Rate limit exceeded',
                    '4. Internal server error',
                    '5. Server is under maintenance',
                    'Please contact the developer if the error persists.'
                ].join('\n'),
                'PUBG'
            );

            await interaction.reply({ embeds: [embed] });
        }
    }
};
