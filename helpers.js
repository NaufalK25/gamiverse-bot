const generateField = (name, value, inline = true, option = { highlight: true }) => ({
    name,
    value: option.highlight ? `\`${value}\`` : `${value}`,
    inline
});

module.exports = {
    generateField
};
