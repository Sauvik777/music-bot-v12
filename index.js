const fs = require('fs');
const discord = require('discord.js');
const ffmpegPath = require('ffmpeg-static');
const { Player } = require('discord-player');
const client = new discord.Client({ disableMentions: 'everyone' });

// Initialize the Discord client with necessary intents
const client = new discord.Client({
    intents: [
        discord.GatewayIntentBits.Guilds,
        discord.GatewayIntentBits.GuildVoiceStates, // Required for voice state events
        discord.GatewayIntentBits.GuildMessages,
        discord.GatewayIntentBits.MessageContent // Needed if you're reading message content
    ],
    disableMentions: 'everyone'
});

const player = new Player(client);
client.player = player;
client.config = {
    game: process.env.GAME,
    prefix: process.env.PREFIX,
    token_bot: process.env.TOKEN_BOT
};
client.emotes = require('./config/emojis.json');
client.filters = require('./config/filters.json');
client.commands = new discord.Collection();

fs.readdir('./events/', (err, files) => {
    if (err) return console.error(err);
    files.forEach(file => {
        const event = require(`./events/${file}`);
        let eventName = file.split(".")[0];
        console.log(`Loading event ${eventName}`);
        client.on(eventName, event.bind(null, client));
    });
});

fs.readdir('./player-events/', (err, files) => {
    if (err) return console.error(err);
    files.forEach(file => {
        const event = require(`./player-events/${file}`);
        let eventName = file.split(".")[0];
        console.log(`Loading player event ${eventName}`);
        client.player.on(eventName, event.bind(null, client));
    });
});

fs.readdir('./commands/', (err, files) => {
    if (err) return console.error(err);
    files.forEach(file => {
        if (!file.endsWith(".js")) return;
        let props = require(`./commands/${file}`);
        let commandName = file.split(".")[0];
        console.log(`Loading command ${commandName}`);
        client.commands.set(commandName, props);
    });
});

client.login(client.config.token_bot);
