require('dotenv').config();
const { EmbedBuilder, SlashCommandBuilder } = require('discord.js');
const { addField, addEmptyField, createErrorEmbed, nodeFetch } = require('../helpers');

const BS_THUMBNAIL = 'https://res.cloudinary.com/dko04cygp/image/upload/v1676125350/gamiverse/bs/bs_huba5c.png';

module.exports = {
    data: new SlashCommandBuilder()
        .setName('bs')
        .setDescription('Get player stats from Brawl Stars')
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
                const embed = createErrorEmbed(BS_THUMBNAIL, `Player with tag \`#${argTag}\` not found`, 'Brawl Stars');
                return interaction.reply({ embeds: [embed] });
            }

            if (player.reason === 'accessDenied.invalidIp') {
                const invalidIP = player.message.split(' ').at(-1);
                const embed = createErrorEmbed(BS_THUMBNAIL, `Invalid IP Adress: \`${invalidIP}\``, 'Brawl Stars');
                return interaction.reply({ embeds: [embed] });
            }

            if (player.reason) {
                const embed = createErrorEmbed(BS_THUMBNAIL, `${player.reason}: ${player.message}`, 'Brawl Stars');
                return interaction.reply({ embeds: [embed] });
            }

            const embed = new EmbedBuilder()
                .setColor('#F5C04A')
                .setTitle(`${player.expLevel} | ${player.name} | ${player.tag}`)
                .setThumbnail(BS_THUMBNAIL)
                .addFields(
                    addField('Solo Victories', player.soloVictories, {
                        sticker: ':crossed_swords:'
                    }),
                    addField('Duo Victories', player.duoVictories, {
                        sticker: ':crossed_swords:'
                    }),
                    addField('3v3 Victories', player['3vs3Victories'], {
                        sticker: ':crossed_swords:'
                    }),
                    addEmptyField(),
                    addField('Trophies', player.trophies, {
                        sticker: ':trophy:'
                    }),
                    addField('Highest Trophies', player.highestTrophies, {
                        sticker: ':trophy:'
                    })
                )
                .setFooter({ text: 'Brawl Stars' });

            interaction.reply({ embeds: [embed] });
        } catch (err) {
            const embed = createErrorEmbed(
                BS_THUMBNAIL,
                [
                    'This error can be caused by:',
                    '1. API token expired',
                    '2. Invalid API token',
                    '3. Rate limit exceeded',
                    '4. Internal server error',
                    '5. Server is under maintenance',
                    'Please contact the developer if the error persists.'
                ].join('\n'),
                'Brawl Stars'
            );

            interaction.reply({ embeds: [embed] });
        }
    }
};
