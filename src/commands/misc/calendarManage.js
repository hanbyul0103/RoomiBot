const { ApplicationCommandOptionType, PermissionFlagsBits } = require('discord.js');
const moment = require('moment-timezone');
const fs = require('fs');
const path = require('path');

// 데이터 파일 경로 설정
const dataFilePath = path.join(__dirname, '../../data/data.json');

// 데이터 파일을 읽고 파싱
let data = JSON.parse(fs.readFileSync(dataFilePath, 'utf-8'));
const { colorData, calendarData } = data;

module.exports = {
    name: '캘린더관리',
    description: '현재 달(UTC+9 기준)의 일정을 관리합니다.',
    devOnly: false,
    testOnly: true,
    deleted: false,
    options: [
        {
            name: '행동',
            description: '행동을 선택하세요',
            required: true,
            type: ApplicationCommandOptionType.String,
            choices: [
                { name: '추가', value: 'add' },
                { name: '삭제', value: 'remove' },
            ],
        },
        {
            name: '이벤트',
            description: '이벤트 명을 입력하세요',
            required: true,
            type: ApplicationCommandOptionType.String,
            choices: [
                { name: '엘리베이터의 주', value: 'e' },
                { name: '자유의 날', value: 'f' },
            ],
        },
        {
            name: '날짜',
            description: '날짜를 입력하세요',
            required: true,
            type: ApplicationCommandOptionType.Number,
        },
    ],
    permissionRequired: [PermissionFlagsBits.Administrator],

    callback: async (client, interaction) => {
        const action = interaction.options.get("행동")?.value;
        const event = interaction.options.get("이벤트")?.value;
        const day = interaction.options.get("날짜")?.value;

        const timeZone = 'Asia/Seoul';

        const today = moment().tz(timeZone);
        const year = today.year();
        const month = today.month() + 1;

        if (action === "add") {
            if (!['e', 'f'].includes(event)) {
                await interaction.reply("유효하지 않은 이벤트 타입입니다.");
                return;
            }

            if (!/^\d+$/.test(day) || day < 1 || day > 31) {
                await interaction.reply("유효하지 않은 날짜입니다.");
                return;
            }

            if (event === 'e') {
                addEventE(year, month, day);
                await interaction.reply(`엘리베이터의 주가 ${day}일로부터 주말을 제외한 5일로 설정되었습니다.`);
            }

            if (event === 'f') {
                addEventF(year, month, day);
                await interaction.reply(`${day}일에 자유의 날 이벤트가 추가되었습니다.`);
            }
        } else if (action === "remove") {
            if (!['e', 'f'].includes(event)) {
                await interaction.reply("유효하지 않은 이벤트 타입입니다.");
                return;
            }

            const colorToRemove = colorData.find(item => Object.keys(item)[0] === event)[event];
            let removed = removeEvents(event, colorToRemove);

            if (removed) {
                await interaction.reply(`${event === 'e' ? '엘리베이터의 주가' : '자유의 날'} 모든 이벤트가 삭제되었습니다.`);
            } else {
                await interaction.reply("해당 이벤트 타입의 이벤트가 없습니다.");
            }
        }

        // 변경된 데이터 저장
        saveData();
    },
};

// 이벤트 타입 e의 이벤트 추가
function addEventE(year, month, day) {
    let startDate = moment.tz(`${year}-${String(month).padStart(2, '0')}-${day}`, 'Asia/Seoul');
    let daysAdded = 0;

    while (daysAdded < 5) {
        if (startDate.day() !== 0 && startDate.day() !== 6) { // 주말을 제외한 날짜
            const dateStr = startDate.format('YYYY-MM-DD');
            if (!calendarData[dateStr]) calendarData[dateStr] = [];
            calendarData[dateStr].push({ color: colorData.find(item => item.e)?.e });
            daysAdded++;
        }
        startDate.add(1, 'day');
    }
}

// 이벤트 타입 f의 이벤트 추가
function addEventF(year, month, day) {
    const date = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    if (!calendarData[date]) calendarData[date] = [];
    calendarData[date].push({ color: colorData.find(item => item.f)?.f, type: 'circle' });
}

// 이벤트 삭제
function removeEvents(event, colorToRemove) {
    let removed = false;

    for (const [date, events] of Object.entries(calendarData)) {
        calendarData[date] = events.filter(ev => {
            if (ev.color === colorToRemove && (event === 'e' || (event === 'f' && ev.type === 'circle'))) {
                removed = true;
                return false;
            }
            return true;
        });

        if (calendarData[date].length === 0) delete calendarData[date];
    }

    return removed;
}

// 변경된 데이터 저장 함수
function saveData() {
    fs.writeFileSync(dataFilePath, JSON.stringify({ colorData, calendarData }, null, 2), 'utf-8');
}
