const { ApplicationCommandOptionType, ButtonBuilder, ButtonStyle, ActionRowBuilder, PermissionsBitField, TextChannel } = require('discord.js');
const { EmbedBuilder } = require('discord.js');

const choices = [
    { name: "시설관리부", emoji: "🛠", role: "시설관리부" },
    { name: "생활지도부", emoji: "⏰", role: "생활지도부" },
    { name: "학습관리부", emoji: "💻", role: "학습관리부" },
    { name: "기타", emoji: "🎸", role: "자치회" },
];

const close = [
    { name: "닫기", emoji: "🔒" }
];

module.exports = {
    name: '티켓',
    description: '티켓을 업로드 할 채널을 선택하고 티켓을 보냅니다.',
    devOnly: true,
    testOnly: true,
    deleted: false,
    options: [
        {
            name: '채널',
            description: '등록할 채널의 이름',
            required: true,
            type: ApplicationCommandOptionType.Channel,
        },
    ],

    callback: async (client, interaction) => {
        const channelId = interaction.options.get("채널")?.value;
        const channel = await client.channels.fetch(channelId);

        await interaction.reply(`<#${channelId}> 채널로 설정되었습니다.`);

        const ticketEmbed = new EmbedBuilder()
            .setTitle('기숙사 내 파손된 물품 문의 & 건의사항')
            .setDescription('문의 시 시설관리, 학습관리, 생활지도 중 알맞은 버튼을 눌러주세요.\n그 외의 내용은 기타 버튼을 눌러주세요.\n닫기 버튼을 누르면 생성된 채널이 삭제됩니다.')
            .setColor('#FFFFFF');

        const buttons = choices.map(({ name, emoji }) =>
            new ButtonBuilder()
                .setCustomId(name)
                .setLabel(name)
                .setStyle(ButtonStyle.Primary)
                .setEmoji(emoji)
        );

        const row = new ActionRowBuilder().addComponents(buttons);
        await channel.send({ embeds: [ticketEmbed], components: [row] });

        const handleButtonInteraction = async (buttonInteraction) => {
            if (!buttonInteraction.isButton()) return;

            const userChoice = choices.find(({ name }) => name === buttonInteraction.customId);
            if (userChoice) {
                const guild = interaction.guild;
                const role = guild.roles.cache.find(role => role.name === userChoice.role);

                const permissionOverwrites = [
                    {
                        id: guild.id,
                        deny: [PermissionsBitField.Flags.ViewChannel],
                    },
                    {
                        id: buttonInteraction.user.id,
                        allow: [PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.SendMessages],
                    },
                ];

                const newChannel = await guild.channels.create({
                    name: `${userChoice.name} 문의`,
                    type: TextChannel,
                    reason: '채팅 생성',
                    permissionOverwrites
                });

                // 카테고리 이동
                const categoryId = '1270048421373280367';

                if (categoryId) {
                    await newChannel.setParent(categoryId, { lockPermissions: false });
                }

                if (role) {
                    const interactionUser = await interaction.guild.members.fetch(buttonInteraction.user.id);

                    const currentTime = new Date().toLocaleTimeString('ko-KR', { hour12: false });

                    const inChannelEmbed = new EmbedBuilder()
                        .setTitle(`안녕하세요, ${interactionUser.nickname}님!\n문제가 해결되었다면 아래의 닫기 버튼을 눌러주세요`)
                        .setFields()
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

                    await newChannel.send({ content: `${role}, ${buttonInteraction.user}`, embeds: [inChannelEmbed], components: [button] });
                }
            } else if (buttonInteraction.customId === '닫기') {
                await closeChannel(buttonInteraction.channel);
            }
        }

        client.on('interactionCreate', handleButtonInteraction);
    },
};

async function closeChannel(channel) {
    await channel.delete();

    console.log(`${channel.name} has been deleted`);
}