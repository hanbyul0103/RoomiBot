const { EmbedBuilder } = require('discord.js');
const path = require('path');
const fs = require('fs');
const { createCanvas, registerFont } = require('canvas');
const moment = require('moment-timezone');
const { colorData, calendarData } = require('../../data/data.json');

// 폰트 등록
registerFont(path.join(__dirname, '../../../Fonts', 'NanumGothic.ttf'), { family: 'Nanum Gothic' });

// 제목과 헤더의 크기 정의
const scaleFactor = 3;
const titleHeight = 140 * scaleFactor; // 제목의 공간을 140으로 설정
const headerHeight = 100 * scaleFactor;

// colorData를 객체 형태로 변환합니다.
const colorMap = colorData.reduce((acc, item) => {
    const key = Object.keys(item)[0];
    acc[key] = item[key];
    return acc;
}, {});

module.exports = {
    name: '캘린더',
    description: '현재 달(UTC+9 기준)의 일정을 보여줍니다.',
    devOnly: true,
    testOnly: true,
    deleted: false,
    //options: ,

    callback: async (client, interaction) => {
        const timeZone = 'Asia/Seoul';

        const today = moment().tz(timeZone);

        // 캘린더 생성 및 이미지 파일로 저장
        try {
            await generateCalendarImage(interaction, today);
        } catch (error) {
            console.error('캘린더 이미지 생성 중 오류 발생:', error);
            await interaction.reply('캘린더 이미지 생성 중 오류가 발생했습니다.');
        }
    },
};

// 캘린더 이미지 생성
async function generateCalendarImage(interaction, today) {
    const startOfMonth = today.clone().startOf('month');
    const endOfMonth = today.clone().endOf('month');
    const daysInMonth = endOfMonth.date();
    const startDay = startOfMonth.day();

    const canvasWidth = 700 * scaleFactor;
    const cellSize = 100 * scaleFactor;
    const calendarRows = 6;
    const canvasHeight = titleHeight + headerHeight + cellSize * calendarRows;

    const canvas = createCanvas(canvasWidth, canvasHeight);
    const ctx = canvas.getContext('2d');

    // 배경색 설정
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);

    // 제목 설정
    ctx.fillStyle = 'black';
    ctx.font = `${60 * scaleFactor}px Nanum Gothic`; // 제목의 폰트 사이즈를 60으로 설정
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(`${today.format('MM월')}`, canvasWidth / 2, titleHeight / 2); // 제목 위치 조정

    // 요일 헤더 그리기
    drawWeekHeaders(ctx, scaleFactor, headerHeight, cellSize);

    // 날짜 및 이벤트 그리기
    drawDays(ctx, startOfMonth, daysInMonth, startDay, cellSize);

    // 이미지 파일로 저장
    const filePath = './calendar.png';
    try {
        const buffer = canvas.toBuffer('image/png');
        fs.writeFileSync(filePath, buffer);

        // 이미지 파일을 임베드에 추가
        const calendarEmbed = new EmbedBuilder()
            .setTitle('엘리베이터의 주는 초록색으로,\n자유의 날은 빨간 원으로 표시됩니다.')
            .setColor('#FFFFFF')
            .setImage('attachment://calendar.png');

        await interaction.reply({ embeds: [calendarEmbed], files: [{ attachment: filePath, name: 'calendar.png' }] });
    } catch (error) {
        console.error('파일 저장 또는 메시지 전송 중 오류 발생:', error);
        await interaction.reply('파일 저장 또는 메시지 전송 중 오류가 발생했습니다.');
    } finally {
        // 이미지 파일 삭제
        try {
            fs.unlinkSync(filePath);
        } catch (error) {
            console.error('파일 삭제 중 오류 발생:', error);
        }
    }
}

// 요일 헤더 그리기
function drawWeekHeaders(ctx, scaleFactor, cellSize) {
    const daysOfWeek = ['일', '월', '화', '수', '목', '금', '토'];
    const headerBackgroundColor = 'lightgray';
    let xOffset = 0;
    let yOffset = titleHeight; // 제목 아래로 시작

    ctx.font = `${30 * scaleFactor}px Nanum Gothic`;
    ctx.textAlign = 'center';

    daysOfWeek.forEach((day, i) => {
        ctx.fillStyle = headerBackgroundColor;
        ctx.fillRect(xOffset, yOffset, cellSize, cellSize);
        ctx.strokeStyle = 'black';
        ctx.lineWidth = 4;
        ctx.strokeRect(xOffset, yOffset, cellSize, cellSize);
        ctx.fillStyle = 'black';
        ctx.fillText(day, xOffset + cellSize / 2, yOffset + cellSize / 2 + 5);
        xOffset += cellSize;
    });
}

// 날짜 및 이벤트 그리기
function drawDays(ctx, startOfMonth, daysInMonth, startDay, cellSize) {
    let xOffset = 0;
    let yOffset = titleHeight + headerHeight; // 제목 + 헤더 아래로 시작
    let dayCount = 1;
    const calendarRows = 6;

    for (let row = 0; row < calendarRows; row++) {
        for (let col = 0; col < 7; col++) {
            if (row === 0 && col < startDay) {
                // 첫 번째 주의 빈 셀
            } else if (dayCount <= daysInMonth) {
                const currentDate = startOfMonth.clone().date(dayCount);
                const currentDateStr = `${startOfMonth.year()}-${String(startOfMonth.month() + 1).padStart(2, '0')}-${String(dayCount).padStart(2, '0')}`;
                const dayEvents = calendarData[currentDateStr] || [];

                // 배경색 설정
                let fillColor = (currentDate.day() === 0 ? colorMap["SUNDAY"] : (currentDate.day() === 6 ? colorMap["SATURDAY"] : 'white'));
                console.log(`${fillColor} : ${currentDate.day()}`);
                ctx.fillStyle = fillColor;
                ctx.fillRect(xOffset, yOffset, cellSize, cellSize);

                drawEvents(ctx, dayEvents, xOffset, yOffset, cellSize);

                // 날짜 텍스트
                ctx.fillStyle = 'black';
                ctx.font = `${24 * scaleFactor}px Nanum Gothic`;
                ctx.textAlign = 'center';
                ctx.fillText(dayCount, xOffset + cellSize / 2, yOffset + cellSize / 2 + 5);

                dayCount++;
            }

            ctx.strokeStyle = 'black';
            ctx.lineWidth = 4;
            ctx.strokeRect(xOffset, yOffset, cellSize, cellSize);
            xOffset += cellSize;
        }
        xOffset = 0;
        yOffset += cellSize;
    }
}

// 날짜 셀에 이벤트 그리기
function drawEvents(ctx, events, xOffset, yOffset, cellSize) {
    // 먼저 배경색 이벤트를 그립니다.
    events.forEach(event => {
        if (event.color && !event.type) {
            // 배경색 이벤트
            ctx.fillStyle = event.color;
            ctx.fillRect(xOffset, yOffset, cellSize, cellSize);
        }
    });

    // 이후 동그라미 이벤트를 그립니다.
    events.forEach(event => {
        if (event.type === 'circle') {
            ctx.strokeStyle = colorMap['f'];
            ctx.lineWidth = 4;
            ctx.beginPath();
            const circleRadius = cellSize / 3;
            ctx.arc(xOffset + cellSize / 2, yOffset + cellSize / 2, circleRadius, 0, Math.PI * 2);
            ctx.stroke();
        }
    });
}