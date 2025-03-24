const { ButtonBuilder, ButtonStyle, ActionRowBuilder, PermissionsBitField, ChannelType } = require('discord.js');

module.exports = async (client, interaction) => {
    if (!interaction.isButton()) return;

    const userChoice = choices.find(({ name }) => name === interaction.customId);
    if (userChoice) {
        const guild = interaction.guild;
        const role = guild.roles.cache.find(role => role.name === userChoice.role);

        const permissionOverwrites = [
            {
                id: guild.id,
                deny: [PermissionsBitField.Flags.ViewChannel],
            },
            {
                id: interaction.user.id,
                allow: [PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.SendMessages],
            },
        ];

        const newChannel = await guild.channels.create({
            name: `${userChoice.name} 문의`,
            type: ChannelType.GuildText,
            reason: '채팅 생성',
            permissionOverwrites
        });

        await interaction.reply({
            content: `<#${newChannel.id}> 채널로 이동해주세요.`,
            ephemeral: true,
        });

        if (role) {
            const buttons = close.map(({ name, emoji }) =>
                new ButtonBuilder()
                    .setCustomId(name)
                    .setLabel(name)
                    .setStyle(ButtonStyle.Primary)
                    .setEmoji(emoji)
            );

            const button = new ActionRowBuilder().addComponents(buttons);
            await newChannel.send({ content: `${role}, ${interaction.user}`, components: [button] });
        }
    } else if (interaction.customId === '닫기') {
        await interaction.channel.delete();
    }
};