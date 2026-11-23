// logic.test.js — 규칙 테스트. P1 에서 실행하고 P2 에서 늘립니다.
//
// 상황: 9주차에는 check.js 의 console.log 출력을 주석의 예상과 눈으로 비교했습니다.
//       비교를 사람이 하므로 빠뜨릴 수 있고, 돌리는 것 자체를 잊을 수도 있습니다.
// 할 일: P1  vitest 를 설치하고 아래 예시 테스트 1개를 통과시킵니다.
//       P2  예시 테스트 아래에 테스트 8개를 더 씁니다. 경우 목록은 problems/P2_tests.md 의 표.
//           기대값은 실행해 보기 전에 규칙 표를 보고 손으로 적습니다.
// 실행: 터미널에서 npm test
// 확인: P1 은 1 passed, P2 는 9 passed
// 커밋 메시지: p1: vitest / p2: tests

import { test, expect } from "vitest";
import { toDays, isGoodDay, summarize, reasons } from "./public/logic.js";

// 주어짐: Open-Meteo 응답의 daily 와 같은 모양으로 손으로 만든 입력.
// 기준 30 %, 10 km/h 에서 네 가지 경우가 하루씩 들어가게 고른 값입니다(P2 의 표).
const daily = {
  time: ["11-21", "11-22", "11-23", "11-24"],
  temperature_2m_max: [12.0, 9.5, 15.1, 7.3],
  precipitation_probability_max: [10, 30, 5, 80],
  wind_speed_10m_max: [6.2, 10, 14.8, 3.1],
};
const limits = { rain: 30, wind: 10 };
const days = toDays(daily);

// 주어짐: 예시 테스트. 지우지 않습니다.
test("toDays builds one object per day", () => {
  expect(days[0]).toEqual({ date: "11-21", max: 12.0, wind: 6.2, rain: 10 });
});

test("good day when rain and wind are both below the limits", () => {
  expect(isGoodDay(days[0], limits)).toBe(true);
});

test("good day when rain and wind are exactly the limits", () => {
  expect(isGoodDay(days[1], limits)).toBe(true);
});

test("not a good day when only wind is over the limit", () => {
  expect(isGoodDay(days[2], limits)).toBe(false);
});

test("not a good day when only rain is over the limit", () => {
  expect(isGoodDay(days[3], limits)).toBe(false);
});

test("summary counts good days out of all days", () => {
  expect(summarize(days, limits)).toBe("good for a run on 2 of 4 days");
});

test("summary works when there are no days", () => {
  expect(summarize([], limits)).toBe("good for a run on 0 of 0 days");
});

test("reasons lists rain before wind when both are over", () => {
  const day = { date: "x", max: 0, rain: 90, wind: 20 };
  expect(reasons(day, limits)).toEqual(["rain", "wind"]);
});

test("no reasons when rain and wind are exactly the limits", () => {
  expect(reasons(days[1], limits)).toEqual([]);
});


