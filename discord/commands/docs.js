const { EmbedBuilder, SlashCommandBuilder } = require('discord.js');
const { addField } = require('../helpers');

module.exports = {
    data: new SlashCommandBuilder().setName('docs').setDescription('Get documentation for the bot'),
    async execute(interaction) {
        return interaction.reply({ content: 'https://github.com/NaufalK25/gamiverse' });
    }
};
