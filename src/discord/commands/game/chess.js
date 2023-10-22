require('dotenv').config();
const { EmbedBuilder, SlashCommandBuilder, time, TimestampStyles } = require('discord.js');
const { addEmptyField, addField, createErrorEmbed } = require('../../utils/embed');
const { nodeFetch } = require('../../../utils/general');

const CHESS_THUMBNAIL = 'https://res.cloudinary.com/dko04cygp/image/upload/v1676176840/gamiverse/chess/chess_xopl8k.png';

module.exports = {
    data: new SlashCommandBuilder()
        .setName('chess')
        .setDescription('Get player stats from Chess.com')
        .addStringOption(option => option.setName('username').setDescription('The username of the player').setRequired(true)),
    async execute(interaction) {
        try {
            const argUsername = interaction.options.getString('username').trim().toLowerCase();
            const player = await nodeFetch(`https://api.chess.com/pub/player/${argUsername}`);

            if (player.code === 0) {
                const embed = createErrorEmbed(
                    CHESS_THUMBNAIL,
                    `Sorry, we couldn't find a player with the username \`${argUsername}\`. Please check that you have entered the correct username and try again`,
                    'Chess.com'
                );
                return await interaction.reply({ embeds: [embed] });
            }

            const country = await nodeFetch(player.country);

            const embed = new EmbedBuilder()
                .setColor('#779556')
                .setTitle(player.username)
                .setURL(player.url)
                .setThumbnail(CHESS_THUMBNAIL)
                .addFields(
                    addField('Followers', player.followers, {
                        sticker: ':busts_in_silhouette:'
                    }),
                    addField('Country', country.name || 'None', {
                        sticker: `:flag_${country.code.toLowerCase()}:`
                    }),
                    addEmptyField(),
                    addField('Status', player.status, {
                        sticker: ':star:'
                    }),
                    addField('League', player.league || 'None', {
                        sticker: ':trophy:'
                    }),
                    addEmptyField(),
                    addField('Last Online', time(player.last_online, TimestampStyles.RelativeTime), {
                        highlight: false,
                        sticker: ':calendar:'
                    }),
                    addField('Member Since', time(player.joined, TimestampStyles.RelativeTime), {
                        highlight: false,
                        sticker: ':calendar:'
                    })
                )
                .setFooter({ text: 'Chess.com' });

            await interaction.deferReply();
            await interaction.editReply({ embeds: [embed] });
        } catch (err) {
            const embed = createErrorEmbed(
                CHESS_THUMBNAIL,
                ['This error can be caused by:', '1. Rate limit exceeded', '2. Internal server error', '3. Server is under maintenance', 'Please contact the developer if the error persists.'].join(
                    '\n'
                ),
                'Chess.com'
            );

            await interaction.reply({ embeds: [embed] });
        }
    }
};
