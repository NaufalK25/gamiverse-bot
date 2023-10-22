const fs = require('node:fs');
const path = require('node:path');

const getCommandFiles = commandsPath => {
    const generalCommandFiles = fs
        .readdirSync(commandsPath)
        .filter(file => file.endsWith('.js'))
        .map(file => ({ type: 'general', file }));
    const gameCommandFiles = fs
        .readdirSync(path.join(commandsPath, 'game'))
        .filter(file => file.endsWith('.js'))
        .map(file => ({ type: 'game', file }));
    return [...generalCommandFiles, ...gameCommandFiles];
};

module.exports = {
    getCommandFiles
};
