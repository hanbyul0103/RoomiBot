const config = require('./config/config.json');
const { Client, IntentsBitField } = require('discord.js');
const eventHandler = require('./handlers/eventHandler');
const songChannel = require("../data/suggestionSong");

const client = new Client({
    intents: [
        IntentsBitField.Flags.Guilds,
        IntentsBitField.Flags.GuildMembers,
        IntentsBitField.Flags.GuildMessages,
        IntentsBitField.Flags.MessageContent,
    ],
});

eventHandler(client);

client.on("messageCreate", async (message) => {
    if (message.author.bot) return;

    const channelId = songChannel.getSuggestionSongChannel();

    if (message.channelId !== channelId) return;
    console.log(message.author.id);

    const channel = client.channels.cache.get(channelId);

    channel.permissionOverwrites.edit(message.author.id, {
        SendMessages: false,
    });
});

client.login(config.token);