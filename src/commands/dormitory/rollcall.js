const regidents = require("./residents.json");

module.exports = {
  name: "점호 위치",
  description: "점호 위치를 확인합니다",
  devOnly: true,
  testOnly: true,
  deleted: true,

  callback: async (client, interaction) => {
    for (let i = 0; i < regidents.size; ++i) {
      console.log(regidents["resident"][i]["name"]);
    }
    // json에 자치회 인원 저장
    // 자치회 인원을 데이터 베이스에 추가하는 커맨드 만들고
    // 가장 먼저 데이터 가져오고
    //
  },
};
