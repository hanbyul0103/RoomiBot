function getSuggestionSongChannel() {
    return "951706729480081458";
}

async function closeChannel(client) {
    const guild = await client.guilds.fetch("795318898656018444");
    const channel = await guild.channels.fetch("951706729480081458");
    const role = await guild.roles.fetch("827187638926704641");
    console.log(guild);
    console.log(channel);
    console.log(role);
    await channel.permissionOverwrites.edit(role, {
        SendMessages: false,
    });
}

async function openChannel(client) {
    const guild = await client.guilds.fetch("795318898656018444");
    const channel = await guild.channels.fetch("951706729480081458");
    const role = await guild.roles.fetch("827187638926704641");
    console.log(guild);
    console.log(channel);
    console.log(role);
    await channel.permissionOverwrites.edit(role, {
        SendMessages: true,
    });
}

module.exports = { getSuggestionSongChannel, closeChannel, openChannel };