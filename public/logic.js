// public/logic.js — 주어짐(9주차 Run Check 완성본). 고치지 않습니다.
//
// 상황: 규칙이 전부 이 파일에 있습니다. 순수 함수만 있어서 브라우저 없이 Node 로 돌릴 수 있습니다.
//       P2 에서 이 함수들을 테스트하고, P5 부터는 서버(server.js)도 이 파일을 import 합니다.
// 약속: P2 의 확인에서 한 글자를 일부러 바꿨다가 되돌리는 것 말고는 이 파일을 고치지 않습니다.

// P3. 열 단위 응답(daily.time, daily.xxx 배열들)을 하루 단위 객체 배열로 바꿈.
// 화면 쪽은 이 모양만 알면 되고, Open-Meteo 필드 이름은 이 파일 밖으로 안 나감.
export function toDays(daily) {
  return daily.time.map((date, i) => ({
    date,
    max: daily.temperature_2m_max[i],
    wind: daily.wind_speed_10m_max[i],
    rain: daily.precipitation_probability_max[i],
  }));
}

// P7. 기준을 넘은 항목 이름들. 비어 있으면 좋은 날.
// > 를 쓰는 이유: 문제의 규칙이 "기준 이하면 통과" 라서 넘은 것만 걸러야 함.
// 여기서 >= 로 쓰면 정확히 30% 인 날이 이유 칸엔 rain, 색은 초록이 되는 식으로 어긋남.
export function reasons(day, limits) {
  const out = [];
  if (day.rain > limits.rain) out.push("rain");
  if (day.wind > limits.wind) out.push("wind");
  return out;
}

// P4. 처음엔 day.rain <= limits.rain && day.wind <= limits.wind 로 썼음.
// P7 에서 reasons 가 생기면 같은 비교가 두 군데 생김. 기준을 하나 더 넣을 때(기온 등)
// 한쪽만 고치기 쉬워서, 규칙은 reasons 한 곳에만 두고 여기서는 그걸 씀.
export function isGoodDay(day, limits) {
  return reasons(day, limits).length === 0;
}

export function summarize(days, limits) {
  const good = days.filter((day) => isGoodDay(day, limits));
  // 빈 배열이면 "0 of 0 days". 이상해 보여도 throw 하지 않는 게 핵심.
  return `good for a run on ${good.length} of ${days.length} days`;
}
