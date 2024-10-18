const fs = require('fs');
const discord = require('discord.js');
const ffmpegPath = require('ffmpeg-static');
const { Player } = require('discord-player');

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

// Initialize player
const player = new Player(client);
client.player = player;

// Load config from environment variables
client.config = {
    game: process.env.GAME,
    prefix: process.env.PREFIX,
    token_bot: process.env.TOKEN_BOT
};

// Load emojis and filters
client.emotes = require('./config/emojis.json');
client.filters = require('./config/filters.json');
client.commands = new discord.Collection();

// Load events
fs.readdir('./events/', (err, files) => {
    if (err) return console.error(err);
    files.forEach(file => {
        const event = require(`./events/${file}`);
        let eventName = file.split(".")[0];
        console.log(`Loading event ${eventName}`);
        client.on(eventName, event.bind(null, client));
    });
});

// Load player events
fs.readdir('./player-events/', (err, files) => {
    if (err) return console.error(err);
    files.forEach(file => {
        const event = require(`./player-events/${file}`);
        let eventName = file.split(".")[0];
        console.log(`Loading player event ${eventName}`);
        client.player.on(eventName, event.bind(null, client));
    });
});

// Load commands
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

// Log the path to FFmpeg to ensure it's found
console.log(`FFmpeg Path: ${ffmpegPath}`);

// Log in to Discord with the bot's token
client.login(client.config.token_bot);
