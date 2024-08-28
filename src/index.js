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

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'your_username',
    password: 'your_password',
    database: 'your_database'
});

const spotifyApi = new SpotifyWebApi({
    clientId: 'your_spotify_client_id',
    clientSecret: 'your_spotify_client_secret'
});

async function authenticateSpotify() {
    try {
        const data = await spotifyApi.clientCredentialsGrant();
        spotifyApi.setAccessToken(data.body['access_token']);
        console.log('스포티파이 인증 성공');
    } catch (error) {
        console.error('스포티파이 인증 실패:', error);
    }
}

async function isSongExplicit(title, artist) {
    try {
        const result = await spotifyApi.searchTracks(`track:${title} artist:${artist}`);
        if (result.body.tracks.items.length > 0) {
            const track = result.body.tracks.items[0];
            return track.explicit;
        } else {
            console.log('노래를 찾을 수 없습니다.');
            return null;
        }
    } catch (error) {
        console.error('스포티파이 검색 중 오류 발생:', error);
        return null;
    }
}

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

client.on('messageCreate', async (message) => {
    if (message.channel.id === "채널_ID") {
        if (!message.author.bot) {
            const [title, artist] = message.content.split(' ');

            const isExplicit = await isSongExplicit(title, artist);

            if (isExplicit === false) {
                const query = `INSERT INTO songs (user_id, username, song_title, artist) VALUES (?, ?, ?, ?)`;
                const values = [message.author.id, message.author.username, title, artist];

                connection.query(query, values, (err) => {
                    if (err) {
                        console.error('데이터 삽입 중 오류 발생:', err);
                    } else {
                        console.log('노래 제목과 가수가 성공적으로 삽입되었습니다.');
                    }
                });
            } else if (isExplicit === true) {
                message.reply('이 곡은 연령 제한이 있어 신청이 불가능합니다.');
            } else {
                message.reply('노래를 찾을 수 없거나 검색 중 오류가 발생했습니다.');
            }
        }
    }
});

client.login(config.token);

authenticateSpotify();