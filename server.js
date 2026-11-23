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
import { getDaily } from "./openMeteo.js";
import { toDays } from "./public/logic.js";

// P6: 토큰이 없으면 켜지 않음. 없이 켜지면 "Bearer undefined" 가 통과해 버림.
if (!process.env.ADMIN_TOKEN) {
  console.error("ADMIN_TOKEN is not set. Copy .env.example to .env.");
  process.exit(1);
}

const app = express();
const port = process.env.PORT ?? 3000;

// P5: public/main.js 에서 옮겨 옴. 위도·경도는 이제 서버만 앎.
const CITIES = {
  seoul: { name: "Seoul", lat: 37.566, lon: 126.9784 },
  daejeon: { name: "Daejeon", lat: 36.3504, lon: 127.3845 },
  gangneung: { name: "Gangneung", lat: 37.7519, lon: 128.8761 },
};

// P6: 도시 키별 요청 횟수. 메모리에만 있어서 서버를 끄면 사라짐.
const counts = {};

app.use(express.static("public"));

app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});

app.get("/api/forecast", async (req, res) => {
  const key = req.query.city;

  // CITIES[key] 로 확인하면 ?city=toString 이 통과함. 직접 넣은 키만 true.
  if (!Object.hasOwn(CITIES, key)) {
    return res.status(400).json({ error: `Unknown city: ${key}` });
  }

  // P6: 아는 도시로 확인된 직후, Open-Meteo 를 부르기 전에 셈. 502 가 나가도 센 것으로 남음.
  counts[key] = (counts[key] ?? 0) + 1;

  const city = CITIES[key];
  try {
    const daily = await getDaily(city);
    res.json({ city: city.name, days: toDays(daily) });
  } catch (error) {
    res.status(502).json({ error: error.message });
  }
});

// P6: 토큰이 맞는 요청에만 횟수를 보여 줌. 토큰 값은 코드가 아니라 .env 에만 있음.
app.get("/api/stats", (req, res) => {
  if (req.get("Authorization") !== `Bearer ${process.env.ADMIN_TOKEN}`) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  res.json(counts);
});

app.listen(port, (error) => {
  if (error) throw error;
  console.log(`Listening on http://localhost:${port}`);
});