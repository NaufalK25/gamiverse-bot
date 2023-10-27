const { EmbedBuilder, SlashCommandBuilder } = require('discord.js');
const { addField } = require('../utils/embed');

module.exports = {
    data: new SlashCommandBuilder().setName('contact').setDescription('Get contact information for the developer'),
    async execute(interaction) {
        const embed = new EmbedBuilder()
            .setColor('#404EED')
            .setTitle('Contact Information')
            .addFields(
                addField('GitHub', 'NaufalK25', {
                    sticker: ':cat:'
                }),
                addField('Discord', 'NaufalK#3934', {
                    sticker: ':speech_balloon:'
                }),
                addField('Telegram', '@NaufalK25', {
                    sticker: ':speech_balloon:'
                })
            )
            .setFooter({ text: 'Gamiverse Bot' });

        return await interaction.reply({
            embeds: [embed],
            content: ['https://github.com/NaufalK25/gamiverse-bot', 'https://discordapp.com/users/619852756534034432', 'https://t.me/NaufalK25'].join('\n')
        });
    }
};
