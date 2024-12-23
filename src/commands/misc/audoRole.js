module.exports = {
    name: '역할부여',
    description: '학년에 맞게 역할을 부여합니다.',
    devOnly: true,
    testOnly: true,
    deleted: true,

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
        let student = guild.roles.cache.find(role => role.name === "학생");

        const gradeRoles = [firstGradeRole, secondGradeRole, thirdGradeRole];

        // 멤버 리스트를 로그에 출력
        members.forEach(async member => {
            const nickname = member.nickname || 'None';

            if (!member.roles.cache.has(student.id)) {
                await member.roles.add(student);
            }

            if (nickname.includes('1학년')) {
                await updateRoles(member, firstGradeRole, gradeRoles);
            } else if (nickname.includes('2학년')) {
                await updateRoles(member, secondGradeRole, gradeRoles);
            } else if (nickname.includes('3학년')) {
                await updateRoles(member, thirdGradeRole, gradeRoles);
            }
        });

        // 멤버 수를 로그에 출력
        console.log(`Total members in ${guild.name}: ${members.size}`);
    } catch (error) {
        console.error('Error fetching members:', error);
    }
}

async function updateRoles(member, targetRole, allRoles) {
    try {
        // 대상 역할 추가
        if (!member.roles.cache.has(targetRole.id)) {
            await member.roles.add(targetRole);
            console.log(`Added '${targetRole.name}' role to ${member.user.tag}`);
        }

        // 다른 역할 제거
        for (const role of allRoles) {
            if (role.id !== targetRole.id && member.roles.cache.has(role.id)) {
                await member.roles.remove(role);
                console.log(`Removed '${role.name}' role from ${member.user.tag}`);
            }
        }
    } catch (error) {
        console.error('Error updating roles for', member.user.tag, ':', error);
    }
}
