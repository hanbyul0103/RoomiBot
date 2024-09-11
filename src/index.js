const config = require('./config/config.json');
const { Client, IntentsBitField } = require('discord.js');
const eventHandler = require('./handlers/eventHandler');

const client = new Client({
    intents: [
        IntentsBitField.Flags.Guilds,
        IntentsBitField.Flags.GuildMembers,
        IntentsBitField.Flags.GuildMessages,
        IntentsBitField.Flags.MessageContent,
    ],
});

eventHandler(client);

client.on('guildMemberAdd', async member => {
    const channelID = '1265224199509901374';
    const channel = client.channels.cache.get(channelID);
    if (channel) {
        channel.send(`${member}\n안녕하세요! 닉네임을 \`본명 (학년)\`으로 바꿔주세요.`);
    }

    const classRole = member.guild.roles.cache.find(role => role.name === '1학년');
    const studentRole = member.guild.roles.cache.find(role => role.name === "학생");
    if (classRole && studentRole) {
        await member.roles.add(classRole);
        await member.roles.add(studentRole);
    }
});

client.login(config.token);