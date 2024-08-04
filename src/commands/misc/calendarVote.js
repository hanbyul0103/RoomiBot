const { ApplicationCommandOptionType, PermissionFlagsBits } = require('discord.js');

module.exports = {
    name: '투표',
    description: '이벤트 날짜를 추천합니다.',
    devOnly: false,
    testOnly: true,
    deleted: false,
    options: [
        {
            name: '이벤트',
            description: '투표할 이벤트를 선택하세요.',
            required: true,
            type: ApplicationCommandOptionType.String,
            choices: [
                { name: '엘리베이터의 주', value: 'e', },
                { name: '자유의 날', value: 'f', },
            ],
        },
        {
            name: '날짜',
            description: '날짜를 입력하세요.',
            require: true,
            type: ApplicationCommandOptionType.Number,
        },
    ],
    permissionRequired: [PermissionFlagsBits.Administrator],

    callback: async (client, interaction) => {
        
    },
};