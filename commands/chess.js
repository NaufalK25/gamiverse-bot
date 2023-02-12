require('dotenv').config();
const { EmbedBuilder, SlashCommandBuilder } = require('discord.js');
const { addField, humanizeDate, nodeFetch } = require('../helpers');

const CHESS_THUMBNAIL = 'https://res.cloudinary.com/dko04cygp/image/upload/v1676176840/gamiverse/chess/chess_xopl8k.png';

module.exports = {
    data: new SlashCommandBuilder()
        .setName('chess')
        .setDescription('Get the player profile from Chess.com')
        .addStringOption(option => option.setName('username').setDescription('The username of the player').setRequired(true)),
    async execute(interaction) {
        try {
            const argUsername = interaction.options.getString('username').trim().toLowerCase();
            const player = await nodeFetch(`https://api.chess.com/pub/player/${argUsername}`);

            if (player.code === 0) {
                const embed = new EmbedBuilder()
                    .setColor('#FFCCCC')
                    .setTitle('Error')
                    .setThumbnail(CHESS_THUMBNAIL)
                    .setDescription(`Player with username \`${argUsername}\` doesn't exist`)
                    .setFooter({ text: 'Chess.com' });

                return interaction.reply({ embeds: [embed] });
            }

            const country = await nodeFetch(player.country);

            const embed = new EmbedBuilder()
                .setColor('#779556')
                .setTitle(player.username)
                .setURL(player.url)
                .setThumbnail(CHESS_THUMBNAIL)
                .addFields(
                    addField('Followers', player.followers),
                    addField('Country', country.name || 'None'),
                    addField('\u200B', '\u200B', false, { highlight: false }),
                    addField('Status', player.status),
                    addField('League', player.league || 'None'),
                    addField('\u200B', '\u200B', false, { highlight: false }),
                    addField('Last Online', humanizeDate(player.last_online)),
                    addField('Member Since', humanizeDate(player.joined))
                )
                .setFooter({ text: 'Chess.com' });

            interaction.reply({ embeds: [embed] });
        } catch (err) {
            const embed = new EmbedBuilder()
                .setColor('#FFCCCC')
                .setTitle('Error')
                .setThumbnail(CHESS_THUMBNAIL)
                .setDescription(
                    [
                        'This error can be caused by:',
                        '1. Rate limit exceeded',
                        '2. Internal server error',
                        '3. Server is under maintenance',
                        'Please contact the developer if the error persists.'
                    ].join('\n')
                )
                .setFooter({ text: 'Chess.com' });

            interaction.reply({ embeds: [embed] });
        }
    }
};
