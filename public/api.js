// public/api.js — 주어짐(9주차 Run Check 완성본). P5 에서 고칩니다.
//
// P5 를 하기 전: 페이지가 Open-Meteo 를 직접 부릅니다. 요청 주소와 받을 필드 이름이 이 파일에 있습니다.
// P5 를 한 뒤: 그 호출은 서버(openMeteo.js)로 옮겨 가고, 이 파일의 getForecast 는
//            내 서버의 /api/forecast 만 부릅니다. 자세한 것은 problems/P5_forecast.md.
// 확인: problems/P5_forecast.md 의 "확인"
// 커밋 메시지: p5: forecast

const BASE = "https://api.open-meteo.com/v1/forecast";

export async function getForecast({ lat, lon }) {
  const params = new URLSearchParams({
    latitude: lat,
    longitude: lon,
    // 필드 이름은 문서(Daily Weather Variables)에서 복사하는 게 안전. 오타는 400 으로 바로 드러남.
    // 까다로운 건 옛 이름 windspeed_10m_max. 서버가 받아 주고 200 이 오는데, 응답 키도
    // windspeed_10m_max 라서 toDays 의 daily.wind_speed_10m_max[i] 에서 TypeError.
    // 상태 줄에 "Cannot read properties of undefined (reading '0')" 가 떠서 받기가 실패한 걸로 오해함.
    // 쉼표 뒤 공백도 400(" wind_speed_10m_max" 를 이름으로 읽음).
    daily: "temperature_2m_max,precipitation_probability_max,wind_speed_10m_max",
    timezone: "Asia/Seoul",
    forecast_days: 7,
  });
  const res = await fetch(`${BASE}?${params}`);
  // fetch 는 404·500 이어도 throw 하지 않음. ok 를 직접 봐야 main.js 의 catch 로 넘어감.
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const data = await res.json();
  // 필드 이름을 틀리면 400 이 오므로 위에서 걸림. 맞으면 daily 만 넘기면 됨.
  return data.daily;
}
