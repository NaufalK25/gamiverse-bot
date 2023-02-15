require('dotenv').config();
const fs = require('node:fs');
const path = require('node:path');
const TelegramBot = require('node-telegram-bot-api');

const bot = new TelegramBot(process.env.TG_TOKEN, { polling: true });

const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
    const filePath = path.join(commandsPath, file);
    const command = require(filePath);

    command(bot);
}

console.log('Bot started');

module.exports = bot;
