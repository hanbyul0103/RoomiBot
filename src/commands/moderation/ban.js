const { ApplicationCommandOptionType, PermissionFlagsBits } = require('discord.js');

module.exports = {
    name: '밴',
    description: '유저를 서버에서 영구 추방합니다.',
    devOnly: true,
    testOnly: false,
    deleted: false,
    options: [
        {
            name: '유저',
            description: '밴 할 유저',
            required: true,
            type: ApplicationCommandOptionType.Mentionable,
        },
        {
            name: '이유',
            description: '밴을 하는 이유',
            type: ApplicationCommandOptionType.String,
        },
    ],
    permissionRequired: [PermissionFlagsBits.Administrator],
    botPermissions: [PermissionFlagsBits.Administrator],

    callback: (client, interaction) => {
        interaction.reply(`ban..`);
    },
};