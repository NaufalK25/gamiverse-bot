require('dotenv').config();
const express = require('express');

const server = express();

server.all('/', (req, res) => {
    res.send('Bot is running!');
});

function keepAlive() {
    server.listen(process.env.PORT || 3000, () => {
        console.log('Server is ready.');
    });
}

module.exports = keepAlive;
