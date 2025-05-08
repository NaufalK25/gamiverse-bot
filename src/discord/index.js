require('dotenv').config();
const fs = require('node:fs');
const path = require('node:path');
const { Client, Collection, GatewayIntentBits } = require('discord.js');
// const keepAlive = require('./server');
const { getCommandFiles } = require('./utils/file');

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

const eventsPath = path.join(__dirname, 'events');
const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.js'));

for (const file of eventFiles) {
    const filePath = path.join(eventsPath, file);
    const event = require(filePath);
    if (event.once) {
        client.once(event.name, (...args) => event.execute(...args));
    } else {
        client.on(event.name, (...args) => event.execute(...args));
    }
}

client.commands = new Collection();
const commandsPath = path.join(__dirname, 'commands');
const commandFiles = getCommandFiles(commandsPath);

for (const { type, file } of commandFiles) {
    let filePath = path.join(commandsPath, file);

    if (type === 'game') {
        filePath = path.join(commandsPath, 'game', file);
    }

    const command = require(filePath);

    if ('data' in command && 'execute' in command) {
        client.commands.set(command.data.name, command);
    } else {
        console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
    }
}

// keepAlive();
client.login(process.env.DC_TOKEN);
