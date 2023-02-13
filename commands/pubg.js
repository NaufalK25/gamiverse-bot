require('dotenv').config();
const { EmbedBuilder, SlashCommandBuilder } = require('discord.js');
const { addField, addEmptyField, createErrorEmbed, nodeFetch } = require('../helpers');

const PUBG_THUMBNAIL = 'https://res.cloudinary.com/dko04cygp/image/upload/v1676216030/gamiverse/pubg/pubg_djuxe9.png';

module.exports = {
    data: new SlashCommandBuilder()
        .setName('pubg')
        .setDescription('Get the player profile from PUBG')
        .addStringOption(option =>
            option
                .setName('platform')
                .setDescription('The platform that the player is playing on')
                .setChoices(
                    ...[
                        { name: 'Kakao', value: 'kakao' },
                        { name: 'PlayStation', value: 'psn' },
                        { name: 'Stadia', value: 'stadia' },
                        { name: 'Steam', value: 'steam' },
                        { name: 'Xbox', value: 'xbox' }
                    ]
                )
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

            if (player.errors) {
                const { title, detail } = player.errors[0];
                const embed = createErrorEmbed(PUBG_THUMBNAIL, `${title}: ${detail}`, 'PUBG');
                return interaction.reply({ embeds: [embed] });
            }

            const stats = await nodeFetch(`https://api.pubg.com/shards/${argPlatform}/players/${argAccountId}/seasons/lifetime`, reqInit);
            const { solo, duo, squad } = stats.data.attributes.gameModeStats;

            const embed = new EmbedBuilder()
                .setColor('#F2A900')
                .setTitle(`${player.data.attributes.name} | ${player.data.attributes.shardId}`)
                .setDescription(player.data.id)
                .addFields(
                    addField('Best Rank Point', stats.data.attributes.bestRankPoint),
                    addEmptyField(),
                    addField('Solo', '\u200B', false, { highlight: false }),
                    addField('Top 10s', solo.top10s),
                    addField('Wins', solo.wins),
                    addField('Losses', solo.losses),
                    addField('Kills', solo.kills),
                    addField('Assists', solo.assists),
                    addEmptyField(),
                    addField('Duo', '\u200B', false, { highlight: false }),
                    addField('Top 10s', duo.top10s),
                    addField('Wins', duo.wins),
                    addField('Losses', duo.losses),
                    addField('Kills', duo.kills),
                    addField('Assists', duo.assists),
                    addEmptyField(),
                    addField('Squad', '\u200B', false, { highlight: false }),
                    addField('Top 10s', squad.top10s),
                    addField('Wins', squad.wins),
                    addField('Losses', squad.losses),
                    addField('Kills', squad.kills),
                    addField('Assists', squad.assists),
                    addEmptyField()
                )
                .setThumbnail(PUBG_THUMBNAIL)
                .setFooter({ text: 'PUBG' });

            interaction.reply({ embeds: [embed] });
        } catch (err) {
            console.log(err);
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

            interaction.reply({ embeds: [embed] });
        }
    }
};
