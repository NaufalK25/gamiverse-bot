require('dotenv').config();
const { EmbedBuilder, SlashCommandBuilder } = require('discord.js');
const { addField, addEmptyField, createErrorEmbed, humanizeDate, nodeFetch } = require('../helpers');

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
                const embed = createErrorEmbed(CHESS_THUMBNAIL, `Player with username \`${argUsername}\` doesn't exist`, 'Chess.com');
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
                    addEmptyField(),
                    addField('Status', player.status),
                    addField('League', player.league || 'None'),
                    addEmptyField(),
                    addField('Last Online', humanizeDate(player.last_online)),
                    addField('Member Since', humanizeDate(player.joined))
                )
                .setFooter({ text: 'Chess.com' });

            interaction.reply({ embeds: [embed] });
        } catch (err) {
            const embed = createErrorEmbed(
                CHESS_THUMBNAIL,
                ['This error can be caused by:', '1. Rate limit exceeded', '2. Internal server error', '3. Server is under maintenance', 'Please contact the developer if the error persists.'].join(
                    '\n'
                ),
                'Chess.com'
            );

            interaction.reply({ embeds: [embed] });
        }
    }
};
