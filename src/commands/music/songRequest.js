const { ApplicationCommandOptionType } = require("discord.js");
const fetch = require("node-fetch");
const { Buffer } = require("buffer");

// Spotify API 자격 증명
const SPOTIFY_CLIENT_ID = 'your_spotify_client_id';
const SPOTIFY_CLIENT_SECRET = 'your_spotify_client_secret';

module.exports = {
    name: '노래신청',
    description: '노래를 신청합니다.',
    devOnly: true,
    testOnly: true,
    deleted: false,
    options: [
        {
            name: '노래 제목',
            description: '신청할 노래의 제목',
            required: true,
            type: ApplicationCommandOptionType.String,
        },
        {
            name: '가수',
            description: '노래를 부른 가수',
            required: true,
            type: ApplicationCommandOptionType.String,
        }
    ],

    callback: async (client, interaction) => {

    }
}