const { EmbedBuilder, SlashCommandBuilder } = require('discord.js');
const { addField, addTitleOnlyField } = require('../utils/embed');

module.exports = {
    data: new SlashCommandBuilder().setName('help').setDescription('Get help for the bot'),
    async execute(interaction) {
        const embed = new EmbedBuilder()
            .setColor('#404EED')
            .setTitle('Help')
            .addFields(
                addTitleOnlyField('General'),
                addField('/help', 'Get help for the bot', {
                    sticker: ':grey_question:'
                }),
                addField('/contact', 'Get contact information for the developer', {
                    sticker: ':envelope:'
                }),
                addField('/docs', 'Get documentation for the bot', {
                    sticker: ':books:'
                }),
                addTitleOnlyField('Game'),
                addField('/bs', 'Get player stats from Brawl Stars', {
                    sticker: ':gun:'
                }),
                addField('/chess', 'Get player stats from Chess.com', {
                    sticker: ':chess_pawn:'
                }),
                addField('/coc', 'Get player stats from Clash of Clans', {
                    sticker: ':crossed_swords:'
                }),
                addField('/cr', 'Get player stats from Clash Royale', {
                    sticker: ':crown:'
                }),
                addField('/d2', 'Get player stats from Destiny 2', {
                    sticker: ':shield:'
                }),
                addField('/fgo', 'Get player stats from Fate/Grand Order', {
                    sticker: ':globe_with_meridians:'
                }),
                addField('/genshin', 'Get player stats from Genshin Impact', {
                    sticker: ':mountain:'
                }),
                addField('/hsr', 'Get player stats from Honkai Star Rail', {
                    sticker: ':milky_way:'
                }),
                addField('/osu', 'Get player stats from osu!', {
                    sticker: ':musical_keyboard:'
                }),
                addField('/pubg', 'Get player stats from PUBG', {
                    sticker: ':gun:'
                }),
                addField('/tetrio', 'Get player stats from TETR.io', {
                    sticker: ':bricks:'
                })
            )
            .setFooter({ text: 'Gamiverse Bot' });

        return await interaction.reply({ embeds: [embed] });
    }
};
