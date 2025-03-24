const { ButtonBuilder, ButtonStyle, ActionRowBuilder, PermissionsBitField, ChannelType, EmbedBuilder } = require('discord.js');
const { choices, close } = require("../../commands/suggestion/suggestionEmbed");

module.exports = async (interaction) => {
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

        const categoryId = '1270048421373280367';
        if (categoryId) {
            await newChannel.setParent(categoryId, { lockPermissions: false });
        }

        await interaction.reply({
            content: `<#${newChannel.id}> 채널로 이동해주세요.`,
            ephemeral: true,
        });

        if (role) {
            const interactionUser = await guild.members.fetch(interaction.user.id);
            const currentTime = new Date().toLocaleTimeString('ko-KR', { hour12: false });

            const inChannelEmbed = new EmbedBuilder()
                .setTitle(`안녕하세요, ${interactionUser.nickname}님!\n문제가 해결되었다면 아래의 닫기 버튼을 눌러주세요`)
                .setFooter({ text: `${currentTime}` })
                .setColor('#FFFFFF');

            const buttons = close.map(({ name, emoji }) =>
                new ButtonBuilder()
                    .setCustomId(name)
                    .setLabel(name)
                    .setStyle(ButtonStyle.Primary)
                    .setEmoji(emoji)
            );

            const button = new ActionRowBuilder().addComponents(buttons);
            await newChannel.send({ content: `${role}, ${interaction.user}`, embeds: [inChannelEmbed], components: [button] });
        }
    } else if (interaction.customId === '닫기') {
        await interaction.channel.delete();
    }
};