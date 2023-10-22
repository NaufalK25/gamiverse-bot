require('dotenv').config();
const path = require('node:path');
const { REST, Routes } = require('discord.js');
const { getCommandFiles } = require('./utils/file');

const commands = [];
const commandsPath = path.join(__dirname, 'commands');
const commandFiles = getCommandFiles(commandsPath);

for (const { type, file } of commandFiles) {
    let filePath = path.join(commandsPath, file);

    if (type === 'game') {
        filePath = path.join(commandsPath, 'game', file);
    }

    const command = require(filePath);
    commands.push(command.data.toJSON());
}

const rest = new REST({ version: '10' }).setToken(process.env.DC_TOKEN);

(async () => {
    try {
        console.log(`Started refreshing ${commands.length} application (/) commands.`);

        const data = await rest.put(Routes.applicationCommands(process.env.DC_CLIENT_ID), { body: commands });

        console.log(`Successfully reloaded ${data.length} application (/) commands.`);
    } catch (error) {
        console.error(error);
    }
})();
