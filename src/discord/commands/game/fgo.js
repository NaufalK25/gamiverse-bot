const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { addField, addTitleOnlyField, createErrorEmbed } = require('../../utils/embed');
const fgoScrap = require('../../../scrap/fgo');

const FGO_THUMBNAIL = 'https://res.cloudinary.com/dko04cygp/image/upload/v1697880408/gamiverse/fgo/fgo.png';
const SERVER = [
    { name: 'JP', value: 'jp' },
    { name: 'NA', value: 'na' }
];

const getClassPositionSticker = classPosition => {
    const classPositionStickers = {
        All: ':snowflake:',
        Saber: ':crossed_swords:',
        Archer: ':bow_and_arrow:',
        Lancer: ':closed_umbrella:',
        Rider: ':racehorse:',
        Caster: ':book:',
        Assassin: ':dagger:',
        Berserker: ':boom:',
        Extra: ':jigsaw:'
    };

    return classPositionStickers[classPosition];
};

module.exports = {
    data: new SlashCommandBuilder()
        .setName('fgo')
        .setDescription('Get master stats from Fate/Grand Order')
        .addStringOption(option =>
            option
                .setName('server')
                .setDescription('The server that the master is playing on')
                .setChoices(...SERVER)
                .setRequired(true)
        )
        .addStringOption(option => option.setName('userid').setDescription('The user id of the master').setMinLength(9).setMaxLength(9).setRequired(true)),
    async execute(interaction) {
        try {
            const argServer = interaction.options.getString('server');
            const argUserId = interaction.options.getString('userid');
            const response = await fgoScrap(`https://rayshift.io/${argServer}/${argUserId}`);

            const master = response.master;

            if (!response.success) {
                const embed = createErrorEmbed(
                    FGO_THUMBNAIL,
                    `Sorry, we couldn't find a \`${argServer.toUpperCase()}\` master with user id \`${argUserId}\`. Please check that you have entered the correct server and user id and try again`,
                    'FGO'
                );

                await interaction.reply({ embeds: [embed] });
            }

            const mainDeck = master.decks[Object.keys(master.decks)[0]];
            const servantFields = mainDeck.map(servant =>
                addField(`${servant.name} (Lv. ${servant.lv}) ${servant.skill.first}/${servant.skill.second}/${servant.skill.third} NP ${servant.np}`, servant.classPosition, {
                    sticker: getClassPositionSticker(servant.classPosition)
                })
            );

            const embed = new EmbedBuilder()
                .setColor('#4A65BE')
                .setTitle(`${master.server} | ${master.name} (Lv. ${master.lv}) | ${master.userId}`)
                .setDescription(`*${master.tagline}*`)
                .setURL(`https://rayshift.io/${master.server.toLowerCase()}/${master.userId}`)
                .setThumbnail(FGO_THUMBNAIL)
                .addFields(addTitleOnlyField('Main Deck'), ...servantFields)
                .setFooter({ text: 'Fate/Grand Order' });

            await interaction.reply({ embeds: [embed] });
        } catch (err) {
            console.log(err);
            const embed = createErrorEmbed(
                FGO_THUMBNAIL,
                ['This error can be caused by:', '1. Internal server error', '2. Server is under maintenance', 'Please contact the developer if the error persists.'].join('\n'),
                'FGO'
            );

            await interaction.reply({ embeds: [embed] });
        }
    }
};
