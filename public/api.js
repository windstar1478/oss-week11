// public/api.js — 주어짐(9주차 Run Check 완성본). P5 에서 고칩니다.
//
// P5 를 하기 전: 페이지가 Open-Meteo 를 직접 부릅니다. 요청 주소와 받을 필드 이름이 이 파일에 있습니다.
// P5 를 한 뒤: 그 호출은 서버(openMeteo.js)로 옮겨 가고, 이 파일의 getForecast 는
//            내 서버의 /api/forecast 만 부릅니다. 자세한 것은 problems/P5_forecast.md.
// 확인: problems/P5_forecast.md 의 "확인"
// 커밋 메시지: p5: forecast

export async function getForecast(cityKey) {
  // "/" 로 시작하면 이 페이지를 보내 준 서버로 감.
  const res = await fetch(`/api/forecast?city=${encodeURIComponent(cityKey)}`);
  // 성공이든 실패든 본문은 JSON. 실패면 서버가 적어 준 이유를 그대로 throw.
  const body = await res.json();
  if (!res.ok) throw new Error(body.error);
  return body; // { city, days }
}