const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder().setName('docs').setDescription('Get documentation for the bot'),
    async execute(interaction) {
        return await interaction.reply({ content: 'https://github.com/NaufalK25/gamiverse-bot' });
    }
};
