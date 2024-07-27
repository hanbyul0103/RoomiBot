module.exports = {
    name: 'ping',
    description: '봇의 응답 속도(ms)를 알려줍니다.',
    devOnly: false,
    testOnly: false,
    deleted: false,
    //options: ,

    callback: async (client, interaction) => {
        await interaction.deferReply();

        const reply = await interaction.fetchReply();

        const ping = reply.createdTimestamp - interaction.createdTimestamp;

        interaction.editReply(`핑: ${ping}ms | Websocket: ${client.ws.ping}ms`);
    },
};