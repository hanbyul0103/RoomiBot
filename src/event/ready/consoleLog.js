const { ActivityType } = require("discord.js");

module.exports = (client) => {
    console.log(`[!] ${client.user.tag} is ready`);

    client.user.setPresence({
        activities: [{ name: "/캘린더", type: ActivityType.Playing }],
        status: 'online'
    });
};