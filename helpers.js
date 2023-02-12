const { EmbedBuilder } = require('discord.js');

const addField = (name, value, inline = true, option = { highlight: true }) => ({
    name,
    value: option.highlight ? `\`${value}\`` : `${value}`,
    inline
});

const createErrorEmbed = (thumbnail, desc, footerText) => {
    return new EmbedBuilder().setColor('#FFCCCC').setTitle('Error').setThumbnail(thumbnail).setDescription(desc).setFooter({ text: footerText });
};

const humanizeDate = unixTimestamp => {
    const date = new Date(unixTimestamp * 1000);

    const currentDate = new Date();
    const diffInMilliseconds = currentDate - date;
    const diffInSeconds = diffInMilliseconds / 1000;
    const diffInMinutes = diffInSeconds / 60;
    const diffInHours = diffInMinutes / 60;
    const diffInDays = diffInHours / 24;
    const diffInMonths = diffInDays / 30.44;
    const diffInYears = diffInDays / 365.25;

    if (diffInYears >= 1) {
        return `${Math.floor(diffInYears)} year${diffInYears >= 2 ? 's' : ''} ago`;
    } else if (diffInMonths >= 1) {
        return `${Math.floor(diffInMonths)} month${diffInMonths >= 2 ? 's' : ''} ago`;
    } else if (diffInDays >= 1) {
        return `${Math.floor(diffInDays)} day${diffInDays >= 2 ? 's' : ''} ago`;
    } else if (diffInHours >= 1) {
        return `${Math.floor(diffInHours)} hour${diffInHours >= 2 ? 's' : ''} ago`;
    } else if (diffInMinutes >= 1) {
        return `${Math.floor(diffInMinutes)} minute${diffInMinutes >= 2 ? 's' : ''} ago`;
    } else if (diffInSeconds >= 1) {
        return `${Math.floor(diffInSeconds)} second${diffInSeconds >= 2 ? 's' : ''} ago`;
    } else {
        return 'Just now';
    }
};

const nodeFetch = async (url, init = {}) => {
    const { default: fetch } = await import('node-fetch');
    const res = await fetch(url, init);
    const data = await res.json();
    return data;
};

module.exports = {
    addField,
    createErrorEmbed,
    humanizeDate,
    nodeFetch
};
