// public/main.js — 주어짐(9주차 Run Check 완성본). P5 에서 세 군데를 고칩니다.
//
// 상황: 화면 담당. 받기는 api.js, 판단은 logic.js 에 맡기고 여기서는 읽고 그리기만 합니다.
// P5 를 하기 전: 도시의 위도·경도(CITIES)를 이 파일이 갖고 있고, 받은 daily 를 여기서 toDays 로 바꿉니다.
// P5 를 한 뒤: CITIES 와 toDays 호출은 서버로 옮겨 가고, 이 파일은 서버가 준 city 와 days 를 그대로 씁니다.
//            자세한 것은 problems/P5_forecast.md.
// 실행: P0 ~ P3 은 npx serve public, P4 부터는 npm start → 브라우저에서 http://localhost:3000
// 커밋 메시지: p5: forecast
import { getForecast } from "./api.js";
import { isGoodDay, summarize, reasons } from "./logic.js";

// P1. 요소는 처음에 한 번만 찾아 둠. 선택자 오타면 null 이 되고,
// 나중에 statusEl.textContent 에서 "Cannot set properties of null" 로 터짐.
const form = document.querySelector("#run-form");
const citySelect = document.querySelector("#city");
const rainInput = document.querySelector("#rain-limit");
const windInput = document.querySelector("#wind-limit");
const statusEl = document.querySelector("#status");
const summaryEl = document.querySelector("#summary");
const rowsEl = document.querySelector("#rows");

// input.value 는 항상 문자열. Number 를 빼먹어도 57 > "30" 은 JS 가 숫자로 바꿔 비교해서
// 티가 안 남. 그러다 기준끼리 더하거나 문자열끼리 비교하는 순간 틀림("9" > "10" 은 true).
// 칸을 비우면 Number("") 가 0 이라 모든 날이 탈락함. 오늘은 그대로 둠.
function readLimits() {
  return { rain: Number(rainInput.value), wind: Number(windInput.value) };
}

// P3. 화면에 보이는 모든 값. render() 는 이것만 보고 그림.
const state = { city: null, days: [], limits: readLimits() };

function dayRow(day) {
  const tr = document.createElement("tr");
  const cells = [
    day.date.slice(5), // "2026-11-05" → "11-05"
    `${day.max}°`,
    `${day.wind} km/h`,
    `${day.rain}%`,
    reasons(day, state.limits).join(", "), // P7
  ];
  for (const text of cells) {
    const td = document.createElement("td");
    // innerHTML 이 아니라 textContent. 서버가 준 문자열을 HTML 로 해석하지 않음.
    td.textContent = text;
    tr.append(td);
  }
  if (isGoodDay(day, state.limits)) tr.classList.add("good");
  return tr;
}

function render() {
  summaryEl.textContent = state.city
    ? `${state.city}: ${summarize(state.days, state.limits)}.`
    : "";
  // append 만 하면 Check 를 누를 때마다 줄이 7개씩 쌓임. 통째로 갈아 끼움.
  rowsEl.replaceChildren(...state.days.map(dayRow));
}

// P1·P2. submit 이벤트를 form 에 검. 버튼 click 에 걸면 Enter 로 제출할 때 빠지고,
// min/max/required 검사도 submit 쪽에서 일어남.
form.addEventListener("submit", async (event) => {
  event.preventDefault(); // 안 하면 페이지가 새로 고쳐져서 주소가 /? 로 바뀌고 아무것도 안 남음
  statusEl.textContent = "Loading...";
  statusEl.classList.remove("error");
  try {
    const { city, days } = await getForecast(citySelect.value);
    state.city = city;
    state.days = days;
    statusEl.textContent = "";
  } catch (err) {
    // 실패하면 state 를 그대로 둠. 이전 도시 표가 남는 게 빈 화면보다 나음.
    statusEl.textContent = `Could not load the forecast (${err.message}).`;
    statusEl.classList.add("error");
  }
  render();
});

// P5. 기준만 바뀐 거라 다시 받을 필요 없음. 같은 데이터, 새 기준으로 다시 그리기만 함.
// change 가 아니라 input 이벤트: 화살표나 타이핑마다 바로 반영됨.
for (const input of [rainInput, windInput]) {
  input.addEventListener("input", () => {
    state.limits = readLimits();
    render();
  });
}
