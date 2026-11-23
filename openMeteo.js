// openMeteo.js — 서버가 Open-Meteo 에서 예보를 받아 오는 파일. P5 에서 채웁니다.
//
// 상황: 예보를 받는 코드는 지금 public/api.js 에 있고, 브라우저에서 실행됩니다.
// 할 일: 그 코드를 이 파일로 옮겨 getDaily({ lat, lon }) 로 export 합니다. 응답 JSON 의 daily 를 돌려줍니다.
//       응답이 실패(200 대가 아님)면 "Open-Meteo: HTTP 400" 같은 메시지로 throw 합니다.
// 확인: problems/P5_forecast.md 의 "확인"
// 커밋 메시지: p5: forecast

import { readFile } from "node:fs/promises";

// P5: 여기에 getDaily 를 씁니다.

// ---- 주어짐: Open-Meteo 가 응답하지 않을 때만 씁니다 (README 부록 E19) ----
// data/ 폴더에 저장해 둔 실제 응답(11/5 받은 것)에서 daily 를 돌려줍니다. getDaily 와 돌려주는 모양이 같습니다.
// 받는 것이 다릅니다. 위도·경도 객체가 아니라 도시 키("seoul")입니다.
export async function getSampleDaily(cityKey) {
  const file = new URL(`./data/${cityKey}.json`, import.meta.url);
  const data = JSON.parse(await readFile(file, "utf8"));
  return data.daily;
}
