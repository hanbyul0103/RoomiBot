const { ApplicationCommandOptionType } = require("discord.js");

module.exports = {
    name: '노래신청채널',
    description: '노래 신청을 받을 채널을 선택합니다.',
    devOnly: true,
    testOnly: true,
    deleted: true,
    options: [
        {
            name: '노래',
            description: '노래 제목',
            required: true,
            type: ApplicationCommandOptionType.String,
        },
        {
            name: '가수',
            description: '가수',
            required: true,
            type: ApplicationCommandOptionType.String,
        },
    ],

    callback: async (client, interaction) => {
        const songName = interaction.options.get("노래")?.value;
        const singer = interaction.options.get("가수")?.value;
    }
}