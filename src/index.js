const config = require('./config/config.json');
const { Client, IntentsBitField } = require('discord.js');
const eventHandler = require('./handlers/eventHandler');
const cron = require('node-cron');

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
    console.log('guildMemberAdd 이벤트가 호출되었습니다');
    const channelID = '1265224199509901374';
    const channel = client.channels.cache.get(channelID);
    if (channel) {
        console.log(`Sending welcome message to ${member.user.tag}`);
        channel.send(`안녕하세요, ${member}님! 닉네임을 \`본명 (학년)\`으로 바꿔주세요.`);
    }

    const role = member.guild.roles.cache.find(role => role.name === '1학년'); // 'Newbie'는 역할 이름입니다.
    if (role) {
        console.log(`Assigning role '1학년' to ${member.user.tag}`);
        await member.roles.add(role);
    }
});

cron.schedule('0 0 1 * *', () => {
    const channelID = '1263159851740172479';
    const channel = client.channels.cache.get(channelID);
    if (channel) {
        channel.send("매달 1일 자정에 보내지는 메시지");
    }
    else {
        console.log("채널을 찾을 수 없습니다");
    }
}, {
    scheduled: true,
    timezone: "Asia/Seoul"
});

client.login(config.token);