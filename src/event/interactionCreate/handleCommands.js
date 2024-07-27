const { devs, testServer } = require('../../../src/config/config.json');
const getLocalCommands = require('../../utils/getLocalCommands');

module.exports = async (client, interaction) => {
    if (!interaction.isChatInputCommand()) return;

    const localCommands = getLocalCommands();

    try {
        const commandObject = localCommands.find((cmd) => cmd.name === interaction.commandName);

        if (!commandObject) return;

        if (commandObject.devOnly) {
            if (!devs.includes(interaction.member.id)) {
                interaction.reply({
                    content: `당신은 이 명령어를 사용할 수 없습니다.`,
                    ephemeral: true,
                });

                return;
            }
        }

        if (commandObject.testOnly) {
            if (!(interaction.guild.id === testServer)) {
                interaction.reply({
                    content: '이 명령어는 이 서버에서 실행할 수 없습니다.',
                    ephemeral: true,
                });

                return;
            }
        }

        if (commandObject.permissionsRequired?.lenght) {
            for (const permission of commandObject.permissionsRequired) {
                if (!interaction.memeber.permissions.has(permission)) {
                    interaction.reply({
                        content: '당신의 권한이 충분하지 않습니다.',
                        ephemeral: true,
                    });

                    return;
                }
            }
        }

        if (commandObject.botPermissions?.lenght) {
            for (const permission of commandObject.botPermissions) {
                const bot = interaction.guild.memeber.me;

                if (!bot.permissions.has(permission)) {
                    interaction.reply({
                        content: "봇의 권한이 충분하지 않습니다.",
                        ephemeral: true,
                    });

                    return;
                }
            }
        }

        await commandObject.callback(client, interaction);

    } catch (error) {
        console.log(`[HandleCommands] There was an error running this command: ${error}`);
    }
};