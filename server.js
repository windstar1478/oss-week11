// server.js — 내 서버. P4 에서 만들고 P5, P6 에서 늘립니다.
//
// 상황: 지금까지는 npx serve 가 파일을 내보내 주기만 했습니다. 예보는 페이지가 Open-Meteo 에서 직접 받았습니다.
// 할 일: P4  Express 서버. public/ 폴더를 내보내고, GET /api/health 에 응답합니다.
//       P5  GET /api/forecast?city=seoul. 예보를 서버가 받아서 하루 단위로 바꿔 돌려줍니다.
//       P6  GET /api/stats. 도시별 요청 횟수. 토큰(ADMIN_TOKEN)을 가진 요청에만 응답합니다.
// 실행: 터미널에서 npm start → http://localhost:3000
// 확인: 문제마다 problems/ 의 문제 파일 "확인"
// 커밋 메시지: p4: server / p5: forecast / p6: secret
//
// 이 파일은 public/ 밖에 있습니다. 브라우저 주소창으로는 열리지 않습니다(P4 에서 확인).

// P4 부터 여기 아래에 씁니다.

import express from "express";

const app = express();
const port = process.env.PORT ?? 3000;

app.use(express.static("public"));

app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});

app.listen(port, (error) => {
  if (error) throw error;
  console.log(`Listening on http://localhost:${port}`);
});