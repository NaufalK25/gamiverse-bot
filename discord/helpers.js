const { CommandInteraction, ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder } = require('discord.js');

const addField = (name, value, option = { inline: true, highlight: true, sticker: null }) => {
    let { inline, highlight, sticker } = option;
    if (inline === undefined) inline = true;
    if (highlight === undefined) highlight = true;

    value = highlight ? `\`${value}\`` : `${value}`;

    if (sticker) {
        value = `${sticker} ${value}`;
    }

    return {
        name,
        value,
        inline
    };
};

const addEmptyField = () => {
    return addTitleOnlyField('\u200B');
};

const addTitleOnlyField = title => {
    return addField(title, '\u200B', { inline: false, highlight: false });
};

const createErrorEmbed = (thumbnail, desc, footerText) => {
    return new EmbedBuilder().setColor('#FFCCCC').setTitle('Error').setThumbnail(thumbnail).setDescription(desc).setFooter({ text: footerText });
};

const createPrevNextButtonRow = embeds => {
    const prevButton = new ButtonBuilder().setCustomId('prev').setLabel('Prev').setStyle(ButtonStyle.Primary).setDisabled(true);
    const nextButton = new ButtonBuilder()
        .setCustomId('next')
        .setLabel('Next')
        .setStyle(ButtonStyle.Primary)
        .setDisabled(embeds.length === 1);

    return {
        prevButton,
        nextButton,
        row: new ActionRowBuilder().addComponents([prevButton, nextButton])
    };
};

const createEmbedPagination = (embeds, row, collector, { prevButton, nextButton }) => {
    let index = 0;
    collector.on('collect', async i => {
        if (i.customId === 'next') {
            index++;
            prevButton.setDisabled(false);
            if (index === embeds.length - 1) nextButton.setDisabled(true);
        } else if (i.customId === 'prev') {
            index--;
            nextButton.setDisabled(false);
            if (index === 0) prevButton.setDisabled(true);
        }

        await i.update({ embeds: [embeds[index]], components: [row] });
    });
};

const sendEmbedWithPagination = async (interaction, embeds) => {
    const { prevButton, nextButton, row } = createPrevNextButtonRow(embeds);
    const msg = await interaction.reply({ embeds: [embeds[0]], components: [row] });
    const filterCustomId = i => i.customId === 'prev' || i.customId === 'next';
    const collector = msg.createMessageComponentCollector({ filter: filterCustomId, time: 60000 });

    createEmbedPagination(embeds, row, collector, { prevButton, nextButton });
};

const nodeFetch = async (url, init = {}) => {
    const { default: fetch } = await import('node-fetch');
    const res = await fetch(url, init);
    const data = await res.json();
    return data;
};

module.exports = {
    addField,
    addEmptyField,
    addTitleOnlyField,
    createErrorEmbed,
    nodeFetch,
    sendEmbedWithPagination
};
