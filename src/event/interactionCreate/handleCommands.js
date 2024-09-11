const { devs, testServer } = require('../../../src/config/config.json');
const getLocalCommands = require('../../utils/getLocalCommands');

module.exports = async (client, interaction) => {
    if (!interaction.isChatInputCommand()) return;

    const localCommands = getLocalCommands();

    try {
        const commandObject = localCommands.find((cmd) => cmd.name === interaction.commandName);

        if (!commandObject) {
            console.log(`Command ${interaction.commandName} not found`);
            return;
        }

        // Dev-only check
        if (commandObject.devOnly) {
            if (!interaction.member || !devs.includes(interaction.member.id)) {
                console.log(`User ${interaction.member?.id} is not a developer`);
                interaction.reply({
                    content: `당신은 이 명령어를 사용할 수 없습니다.`,
                    ephemeral: true,
                });
                return;
            }
        }

        // Test-server-only check
        if (commandObject.testOnly) {
            if (!interaction.guild || interaction.guild.id !== testServer) {
                console.log(`Command attempted in wrong server: ${interaction.guild?.id}`);
                interaction.reply({
                    content: '이 명령어는 이 서버에서 실행할 수 없습니다.',
                    ephemeral: true,
                });
                return;
            }
        }

        // Permissions check
        if (commandObject.permissionsRequired?.length) {  // Fix the typo from `lenght` to `length`
            if (!interaction.member) {
                console.log('interaction.member is undefined');
                interaction.reply({
                    content: '당신의 권한이 충분하지 않습니다.',
                    ephemeral: true,
                });
                return;
            }
            
            for (const permission of commandObject.permissionsRequired) {
                if (!interaction.member.permissions.has(permission)) {  // Fix the typo from `memeber` to `member`
                    console.log(`User ${interaction.member.id} lacks permission: ${permission}`);
                    interaction.reply({
                        content: '당신의 권한이 충분하지 않습니다.',
                        ephemeral: true,
                    });
                    return;
                }
            }
        }

        // Bot permissions check
        if (commandObject.botPermissions?.length) {  // Fix the typo from `lenght` to `length`
            const bot = interaction.guild?.members?.me;  // Fix the typo from `memeber` to `members`
            
            if (!bot) {
                console.log('Bot member object is undefined');
                interaction.reply({
                    content: "봇의 권한이 충분하지 않습니다.",
                    ephemeral: true,
                });
                return;
            }

            for (const permission of commandObject.botPermissions) {
                if (!bot.permissions.has(permission)) {
                    console.log(`Bot lacks permission: ${permission}`);
                    interaction.reply({
                        content: "봇의 권한이 충분하지 않습니다.",
                        ephemeral: true,
                    });
                    return;
                }
            }
        }

        // Execute the command callback
        await commandObject.callback(client, interaction);

    } catch (error) {
        console.log(`[HandleCommands] There was an error running this command: ${error.message}`);
    }
};
