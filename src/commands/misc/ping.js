module.exports = {
    name: 'ping',
    description: 'pong',
    devOnly: false,
    testOnly: false,
    deleted: false,
    //options: ,

    callback: (client, interaction) => {
        interaction.reply(`${client.ws.ping}ms`);
    },
};