const { ApplicationCommandOptionType, PermissionFlagsBits } = require('discord.js');

module.exports = {
    name: '킥',
    description: '유저를 서버에서 추방합니다.',
    devOnly: false,
    testOnly: false,
    deleted: false,
    options: [
        {
            name: '유저',
            description: '킥 할 유저',
            required: true,
            type: ApplicationCommandOptionType.Mentionable,
        },
        {
            name: '이유',
            description: '킥을 하는 이유',
            type: ApplicationCommandOptionType.String,
        },
    ],
    permissionRequired: [PermissionFlagsBits.Administrator],
    botPermissions: [PermissionFlagsBits.Administrator],

    callback: (client, interaction) => {
        interaction.reply(`kick..`);
    },
};