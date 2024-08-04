module.exports = {
    name: '역할부여',
    description: '학년에 맞게 역할을 부여합니다.',
    devOnly: true,
    testOnly: true,
    deleted: false,

    callback: async (client, interaction) => {
        client.guilds.cache.forEach(guild => {
            fetchAllMembers(guild);
        });
    }
};

async function fetchAllMembers(guild) {
    try {
        // 모든 멤버를 가져오기
        const members = await guild.members.fetch();

        let firstGradeRole = guild.roles.cache.find(role => role.name === '1학년');
        let secondGradeRole = guild.roles.cache.find(role => role.name === '2학년');
        let thirdGradeRole = guild.roles.cache.find(role => role.name === '3학년');

        // 멤버 리스트를 로그에 출력
        members.forEach(async member => {
            const nickname = member.nickname || 'None';

            if (nickname.includes('1학년')) {
                if (!member.roles.cache.has(firstGradeRole.id)) {
                    await member.roles.add(firstGradeRole);
                    console.log(`Added '1학년' role to ${member.user.tag}`);
                }
            } else if (nickname.includes('2학년')) {
                if (!member.roles.cache.has(secondGradeRole.id)) {
                    await member.roles.add(secondGradeRole);
                    console.log(`Added '2학년' role to ${member.user.tag}`);
                }
            } else if (nickname.includes('3학년')) {
                if (!member.roles.cache.has(thirdGradeRole.id)) {
                    await member.roles.add(thirdGradeRole);
                    console.log(`Added '3학년' role to ${member.user.tag}`);
                }
            }
        });

        // 멤버 수를 로그에 출력
        console.log(`Total members in ${guild.name}: ${members.size}`);
    } catch (error) {
        console.error('Error fetching members:', error);
    }
}