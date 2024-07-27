const { ApplicationCommandOptionType, PermissionFlagsBits } = require('discord.js');

module.exports = {
    name: 'kick',
    description: 'Kicks a memeber.',
    devOnly: true,
    testOnly: false,
    deleted: false,
    options: [
        {
            name: 'target-user',
            description: 'the user to kick',
            required: true,
            type: ApplicationCommandOptionType.Mentionable,
        },
        {
            name: 'reason',
            description: 'the reason for kicking',
            type: ApplicationCommandOptionType.String,
        },
    ],
    permissionRequired: [PermissionFlagsBits.Administrator],
    botPermissions: [PermissionFlagsBits.Administrator],

    callback: (client, interaction) => {
        interaction.reply(`kick..`);
    },
};