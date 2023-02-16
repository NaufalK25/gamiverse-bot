const { EmbedBuilder, SlashCommandBuilder } = require('discord.js');
const { addField } = require('../helpers');

module.exports = {
    data: new SlashCommandBuilder().setName('contact').setDescription('Get contact information for the developer'),
    async execute(interaction) {
        const embed = new EmbedBuilder()
            .setColor('#404EED')
            .setTitle('Contact Information')
            .addFields(
                addField('Email', 'naufalkateni2001@gmail.com', {
                    sticker: ':envelope:'
                }),
                addField('Discord', 'NaufalK#3934', {
                    sticker: ':speech_balloon:'
                }),
                addField('Telegram', '@NaufalK25', {
                    sticker: ':speech_balloon:'
                }),
                addField('GitHub', 'NaufalK25', {
                    sticker: ':cat:'
                })
            )
            .setFooter({ text: 'Gamiverse' });

        return interaction.reply({ embeds: [embed] });
    }
};
