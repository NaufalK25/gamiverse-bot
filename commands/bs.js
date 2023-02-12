require('dotenv').config();
const { EmbedBuilder, SlashCommandBuilder } = require('discord.js');
const { addField, nodeFetch } = require('../helpers');

const BS_THUMBNAIL = 'https://res.cloudinary.com/dko04cygp/image/upload/v1676125350/gamiverse/bs/bs_huba5c.png';

module.exports = {
    data: new SlashCommandBuilder()
        .setName('bs')
        .setDescription('Get the player profile from Brawl Stars')
        .addStringOption(option => option.setName('tag').setDescription('The player tag (without #)').setRequired(true)),
    async execute(interaction) {
        try {
            const argTag = interaction.options.getString('tag').trim().toUpperCase();
            const player = await nodeFetch(`https://api.brawlstars.com/v1/players/%23${argTag}`, {
                method: 'GET',
                headers: {
                    Accept: 'application/json',
                    Authorization: `Bearer ${process.env.BS_TOKEN}`
                }
            });

            if (player.reason === 'notFound') {
                const embed = new EmbedBuilder()
                    .setColor('#FFCCCC')
                    .setTitle('Error')
                    .setThumbnail(BS_THUMBNAIL)
                    .setDescription(`Player with tag \`#${argTag}\` doesn't exist`)
                    .setFooter({ text: 'Brawl Stars' });

                return interaction.reply({ embeds: [embed] });
            }

            const embed = new EmbedBuilder()
                .setColor('#F5C04A')
                .setTitle(`${player.expLevel} | ${player.name} | ${player.tag}`)
                .setThumbnail(BS_THUMBNAIL)
                .addFields(
                    addField('Solo Victories', player.soloVictories),
                    addField('Duo Victories', player.duoVictories),
                    addField('3v3 Victories', player['3vs3Victories']),
                    addField('\u200B', '\u200B', false, { highlight: false }),
                    addField('Trophies', player.trophies),
                    addField('Highest Trophies', player.highestTrophies)
                )
                .setFooter({ text: 'Brawl Stars' });

            interaction.reply({ embeds: [embed] });
        } catch (err) {
            const embed = new EmbedBuilder()
                .setColor('#FFCCCC')
                .setTitle('Error')
                .setThumbnail(BS_THUMBNAIL)
                .setDescription(
                    [
                        'This error can be caused by:',
                        '1. API token expired',
                        '2. Invalid API token',
                        '3. Rate limit exceeded',
                        '4. Internal server error',
                        '5. Server is under maintenance',
                        'Please contact the developer if the error persists.'
                    ].join('\n')
                )
                .setFooter({ text: 'Brawl Stars' });

            interaction.reply({ embeds: [embed] });
        }
    }
};
