const { EmbedBuilder } = require('discord.js');

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
    nodeFetch
};
