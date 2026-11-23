# P2. 규칙을 테스트로 옮기기 — `p2: tests`

P1 의 예시 테스트는 `toDays` 하나만 봅니다. 색을 칠하고 요약 문장을 만드는 규칙(`isGoodDay`, `summarize`, `reasons`)은 아직 아무도 확인하지 않습니다. 이번 문제에서는 9주차 P6·P7 에서 `check.js` 로 확인했던 경우를 테스트로 옮기고, 그 테스트가 **틀린 코드를 실제로 잡아내는지**까지 봅니다.

**규칙** (9주차와 같음): 강수확률이 기준 **이하**이고, 풍속도 기준 **이하**이면 달리기 좋은 날이다. `reasons` 는 기준을 **넘은** 항목의 이름을 `rain`, `wind` 순서로 돌려준다.

`logic.test.js` 에 들어 있는 입력은 기준 `{ rain: 30, wind: 10 }` 에서 네 가지 경우가 하루씩 나오게 고른 값입니다.

| | 날짜 | 강수확률 | 풍속 | 어떤 경우 |
|---|---|---|---|---|
| `days[0]` | 11-21 | 10 | 6.2 | 둘 다 기준 아래 |
| `days[1]` | 11-22 | 30 | 10 | 둘 다 기준과 **정확히 같음** |
| `days[2]` | 11-23 | 5 | 14.8 | 풍속만 넘음 |
| `days[3]` | 11-24 | 80 | 3.1 | 강수만 넘음 |

파일: `logic.test.js`

## 만들 것

1. `logic.test.js` 맨 위의 import 줄에 `isGoodDay`, `summarize`, `reasons` 를 추가합니다. `toDays` 는 그대로 둡니다.
2. 주어진 예시 테스트는 **지우지 않고**, 그 아래에 테스트를 **8개** 추가합니다. 아래 표의 한 줄이 테스트 1개(`test(...)` 한 덩어리)입니다.

   | # | 부르는 것 | 무엇을 확인하나 |
   |---|---|---|
   | 1 | `isGoodDay(days[0], limits)` | 보통의 좋은 날 |
   | 2 | `isGoodDay(days[1], limits)` | 경계. "이하" 를 제대로 썼나 |
   | 3 | `isGoodDay(days[2], limits)` | 풍속만 넘어도 탈락하나 |
   | 4 | `isGoodDay(days[3], limits)` | 강수만 넘어도 탈락하나 |
   | 5 | `summarize(days, limits)` | 좋은 날 수와 전체 날 수가 문장에 맞게 들어가나 |
   | 6 | `summarize([], limits)` | 빈 입력. 날이 하나도 없어도 오류 없이 문장이 나오나 |
   | 7 | 강수와 풍속을 **둘 다 넘는** 날의 `reasons` | 이유가 두 개, 순서는 `rain` 먼저 |
   | 8 | `reasons(days[1], limits)` | 경계. 기준과 같은 날은 이유가 없나 |

   - 7번에 쓸 날은 `days` 에 없습니다. `{ date: "x", max: 0, rain: 90, wind: 20 }` 처럼 하루 객체를 그 자리에서 직접 만들어 넘깁니다.
   - 테스트 이름(`test("...")` 의 문자열)은 영어로, **무엇을 확인하는지** 읽히게 짓습니다. `test 1` 이나 `isGoodDay` 처럼 지으면 나중에 빨간 줄이 떴을 때 무엇이 깨졌는지 이름만 보고 알 수 없습니다. 예: `good day when rain and wind are exactly the limits`.

   참고: 10주차 녹강 슬라이드 14장(What to Test: Normal, Boundary, Empty), 15~17장(Tests for logic.js). **슬라이드와 다른 점**: 슬라이드의 `needsUmbrella` 는 조건이 하나라 경계 테스트도 하나입니다. 오늘은 조건이 둘이라 "한쪽만 넘는 경우" 가 두 가지(3번, 4번) 더 있고, 슬라이드에 없는 `reasons` 가 있습니다.

3. 각 테스트의 **기대값은 `npm test` 를 돌려 보기 전에** 위의 규칙과 표를 보고 손으로 적습니다.
   - 돌려 본 결과를 보고 기대값을 채우면, 코드가 틀렸을 때 테스트도 같이 틀린 값을 기대하게 됩니다. 그런 테스트는 항상 통과하고 아무것도 잡지 못합니다.
   - 5번의 문장 모양은 `good for a run on 3 of 7 days` 입니다. 숫자 두 개는 표에서 직접 셉니다.

   참고: 10주차 녹강 슬라이드 33장(Tests Written from the Code Repeat the Code).

4. 값이 `true` / `false` 나 문자열이면 `toBe`, 배열이나 객체면 `toEqual` 로 비교합니다. 7번과 8번은 배열입니다.

   참고: 10주차 녹강 슬라이드 13장(toBe vs. toEqual).

## 확인 1: 전부 통과 (터미널)

5. 저장하고 실행합니다.
   ```
   npm test
   ```
6. `✓` 줄이 9개이고 맨 아래가 이렇게 나오면 됩니다.
   ```
    Test Files  1 passed (1)
         Tests  9 passed (9)
   ```
7. `×` 줄이 있으면 그 아래에 `Expected` 와 `Received` 가 나옵니다. `Expected` 는 내가 적은 기대값, `Received` 는 코드가 실제로 돌려준 값입니다. 둘 중 어느 쪽이 틀렸는지 **규칙과 표를 기준으로** 판단합니다. `public/logic.js` 는 9주차 완성본이라 지금은 대개 기대값 쪽이 틀린 것입니다.

   참고: 10주차 녹강 슬라이드 12장(When a Test Fails).

## 확인 2: 틀린 코드를 잡는지 (VS Code → 터미널)

통과만 봐서는 테스트가 쓸모 있는지 알 수 없습니다. 코드를 일부러 틀리게 고쳐서 테스트가 빨강이 되는지 봅니다.

8. `public/logic.js` 의 `reasons` 에서 강수 비교의 `>` 를 `>=` 로 바꾸고 저장합니다. 흔한 실수인 "이하" 와 "미만" 을 뒤바꾼 것입니다.
   ```js
   if (day.rain >= limits.rain) out.push("rain");
   ```
9. `npm test` 를 다시 돌립니다.
   - **3개가 실패**합니다(`Tests  3 failed | 6 passed (9)`). 위 표의 2번, 5번, 8번입니다.
   - 한 글자만 바꿨는데 세 함수의 테스트가 깨진 이유를 생각해 봅니다. `isGoodDay` 는 `reasons` 를 부르고, `summarize` 는 `isGoodDay` 를 부릅니다. 9주차 P7 에서 규칙을 `reasons` 한 곳에 모았기 때문에, 그 한 곳이 틀리면 전부 같이 틀립니다.
   - 실패한 테스트 하나의 `Expected` / `Received` 를 읽어 봅니다. 8번이라면 이렇게 나옵니다. 기대는 빈 배열인데 `rain` 이 들어왔다는 뜻입니다.
     ```
     - Expected
     + Received

     - []
     + [
     +   "rain",
     + ]
     ```
   - 3개보다 적게 실패하면 경계 테스트(2번, 8번)나 5번이 빠졌거나 `days[1]` 이 아닌 날을 쓴 것입니다.
10. `>=` 를 **`>` 로 되돌리고** 저장한 뒤 `npm test`. 다시 `9 passed` 인지 확인합니다. 되돌리지 않고 커밋하면 P3 부터 계속 빨강입니다.

## 커밋 (터미널)

11. `git status` 로 바뀐 파일이 `logic.test.js` **하나뿐**인지 확인합니다. `public/logic.js` 가 `modified` 로 보이면 10번을 안 한 것입니다.
12. 커밋하고 push 합니다.
    ```
    git add logic.test.js
    git commit -m "p2: tests"
    git push
    ```

---

[← 문제 목록](../README.md#문제) · [이전: P1](P1_vitest.md) · [다음: P3](P3_ci.md) · [부록: 흔한 오류](../README.md#부록-흔한-오류)
