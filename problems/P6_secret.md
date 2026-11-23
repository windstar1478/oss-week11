# P6. 토큰이 있어야 보이는 통계 — `p6: secret`

서버가 생겼으니 페이지 혼자서는 못 하던 일을 하나 더 합니다. **어느 도시가 몇 번 요청됐는지** 서버가 세어 두고, 운영자만 볼 수 있게 합니다. 운영자인지는 요청에 실려 온 **토큰**으로 확인합니다. 끝나면 네 가지가 됩니다.

- (1) **세기**: `/api/forecast` 요청이 올 때마다 도시별 횟수를 셉니다.
- (2) **보호된 route**: `GET /api/stats` 는 토큰이 맞는 요청에만 횟수를 보여 줍니다.
- (3) **코드 밖의 비밀**: 토큰 값은 `.env` 파일에만 있고, 코드와 GitHub 저장소 어디에도 없습니다.
- (4) **없으면 멈추기**: 토큰 없이는 서버가 켜지지 않습니다.

토큰은 내가 정하는 문자열입니다. 이 과제에서는 `run-check-` 뒤에 아무 글자나 붙여 정합니다. 문제지의 예시 `run-check-4c1e` 를 그대로 쓰지 않고 **내 값을 새로** 정합니다. 실제로 쓰는 비밀번호는 넣지 않습니다.

파일: `.gitignore`, (새로 만듦, 커밋 안 함) `.env`, (새로 만듦) `.env.example`, `package.json`, `server.js`

## 만들 것: 비밀을 둘 자리부터

순서가 중요합니다. **`.gitignore` 를 먼저** 고치고 그 다음에 `.env` 를 만듭니다. 반대로 하면 `.env` 가 실수로 커밋에 들어갈 틈이 생깁니다.

1. `.gitignore` 에 한 줄을 추가합니다.
   ```
   .env
   ```
2. 저장소 맨 위 폴더(`package.json` 옆)에 `.env` 파일을 새로 만들고 두 줄을 씁니다. 아래의 `run-check-4c1e` 자리에는 위에서 정한 내 값을 씁니다.
   ```
   PORT=3000
   ADMIN_TOKEN=run-check-4c1e
   ```
   - `=` 앞뒤에 공백을 넣지 않습니다. 값에 따옴표도 붙이지 않습니다.
   - 파일 이름은 점으로 시작하고 확장자가 없습니다. `.env.txt` 가 아닙니다.
3. **확인**: 터미널에서 `git status`. `.gitignore` 는 `modified` 로 보이고, **`.env` 는 어디에도 보이지 않아야** 합니다. 보이면 1번의 철자를 확인합니다.
4. `.env.example` 파일을 만듭니다. `.env` 와 같은 줄을 쓰되 **토큰 값은 비워 둡니다.** 이 파일은 커밋합니다.
   ```
   PORT=3000
   ADMIN_TOKEN=
   ```
   `.env` 는 저장소에 없으므로, 이 저장소를 받은 사람은 어떤 값을 준비해야 하는지 알 수 없습니다. `.env.example` 이 그 목록입니다.
5. `package.json` 의 `start` 를 아래로 바꿉니다. Node 가 켜질 때 `.env` 의 줄들을 읽어 환경 변수로 넣어 줍니다.
   ```
   node --env-file=.env server.js
   ```

   참고: 11주차 녹강 슬라이드 35장(Where a Secret Can Live), 36장(.env and process.env), 39장(Keep .env Out of Git).

## 만들 것: 서버

6. `server.js` 의 위쪽(route 들보다 앞)에 검사를 넣습니다. 환경 변수 `ADMIN_TOKEN` 이 없거나 비어 있으면 아래 메시지를 `console.error` 로 찍고 `process.exit(1)` 로 끝냅니다.
   ```
   ADMIN_TOKEN is not set. Copy .env.example to .env.
   ```
   이 검사가 없으면 토큰 없이도 서버가 켜집니다. 그때 `process.env.ADMIN_TOKEN` 은 `undefined` 이고, 8번의 비교에서 `Bearer undefined` 라는 글자를 보낸 요청이 통과해 버립니다.

   참고: 11주차 녹강 슬라이드 38장(Stop at Once If a Secret Is Missing).

7. 도시별 요청 횟수를 셉니다.
   - route 들 밖에 빈 객체 하나를 둡니다(예: `counts`). 키는 **도시 키**(`req.query.city` 로 받은 `seoul`), 값은 횟수입니다. 도시 이름(`Seoul`)이 아닙니다. 예: `{ "seoul": 2, "gangneung": 1 }`.
   - `/api/forecast` 의 handler 에서 **아는 도시로 확인된 직후**, Open-Meteo 를 부르기 **전에** 그 도시의 횟수를 1 올립니다.
   - `400`(모르는 도시)은 세지 않습니다. Open-Meteo 가 실패해 `502` 가 나가는 요청은 셉니다. 세는 것은 "예보를 받은 횟수" 가 아니라 "그 도시를 요청받은 횟수" 입니다.
   - 처음 요청된 도시는 객체에 키가 없습니다. `undefined + 1` 은 `NaN` 이므로, 없으면 0 으로 보고 올립니다.

8. route `GET /api/stats` 를 추가합니다.

   | 요청의 `Authorization` 헤더 | 상태 코드 | 본문 |
   |---|---|---|
   | `Bearer <내 토큰>` 과 정확히 같음 | `200` | 7번의 객체. 예: `{ "seoul": 2, "gangneung": 1 }` |
   | 없음, 또는 다른 값 | `401` | `{ "error": "Unauthorized" }` |

   - 요청의 헤더는 handler 안에서 `req.get("Authorization")` 으로 읽습니다.
   - 비교할 토큰은 **`process.env.ADMIN_TOKEN` 에서** 읽습니다. `server.js` 에 `run-check-4c1e` 같은 실제 값을 적지 않습니다. `server.js` 는 GitHub 에 올라갑니다.
   - `401` 을 보낸 줄은 `return` 으로 끝냅니다.

   참고: 11주차 녹강 슬라이드 37장(Check the Token: the Authorization Header). **슬라이드와 다른 점**: 슬라이드는 메모를 **지우는** 요청(`DELETE /api/notes`)을 토큰으로 막고 성공하면 `204` 를 보냅니다. 오늘은 통계를 **읽는** 요청(`GET /api/stats`)을 막고, 성공하면 `200` 과 함께 객체를 보냅니다. 헤더를 비교하는 한 줄은 같은 모양입니다.

## 확인 (터미널)

9. 서버를 껐다 켭니다(`Ctrl+C`, `npm start`). `Listening on http://localhost:3000` 이 나옵니다.
10. 다른 터미널에서, 토큰 없이 통계를 요청합니다.
    ```
    curl -i http://localhost:3000/api/stats
    ```
    첫 줄이 `HTTP/1.1 401 Unauthorized`, 본문이 `{"error":"Unauthorized"}` 이면 됩니다.
11. 예보를 세 번 요청해서 셀 거리를 만듭니다. 서울 두 번, 강릉 한 번, 그리고 세지 않아야 하는 모르는 도시 한 번입니다. 출력은 보지 않아도 됩니다.
    ```
    curl "http://localhost:3000/api/forecast?city=seoul"
    curl "http://localhost:3000/api/forecast?city=seoul"
    curl "http://localhost:3000/api/forecast?city=gangneung"
    curl "http://localhost:3000/api/forecast?city=tokyo"
    ```
12. 이번에는 토큰을 실어 요청합니다. `-H` 는 요청에 헤더 한 줄을 붙이는 옵션입니다. 토큰 자리에는 내 `.env` 의 값을 씁니다.
    ```
    curl -i -H "Authorization: Bearer run-check-4c1e" http://localhost:3000/api/stats
    ```
    첫 줄이 `HTTP/1.1 200 OK`, 본문이 아래와 같으면 됩니다. `tokyo` 는 없습니다. 9번에서 서버를 켠 뒤 브라우저에서 Check 를 눌렀다면 그만큼 숫자가 더 큽니다.
    ```
    {"seoul":2,"gangneung":1}
    ```
13. 토큰을 한 글자 틀리게 바꿔 12번을 다시 보냅니다. `401` 이 나와야 합니다.
14. 서버를 껐다 켜고 12번을 다시 보냅니다. 본문이 `{}` 입니다. 횟수는 서버의 메모리(변수)에만 있어서, 서버가 꺼지면 사라집니다. 남기려면 파일이나 데이터베이스에 써야 합니다.

    참고: 11주차 녹강 슬라이드 33장(Memory Is Not Storage).

15. 토큰 없이는 켜지지 않는지 봅니다. 서버를 끄고(`Ctrl+C`), `npm start` 대신 아래처럼 직접 켭니다. `--env-file` 이 없으므로 `.env` 를 읽지 않습니다.
    ```
    node server.js
    ```
    `ADMIN_TOKEN is not set. Copy .env.example to .env.` 가 나오고 바로 프롬프트가 돌아오면 됩니다. 확인했으면 다시 `npm start` 로 켭니다.
16. 브라우저 주소창에 `http://localhost:3000/.env` 를 입력합니다. `Cannot GET /.env` 가 나옵니다. `.env` 는 `public` 밖에 있어서 주소로 열 수 없습니다(P4 8번과 같은 이유).

## 커밋 (터미널)

17. 올릴 파일을 **이름으로 하나씩** 지정합니다. `.env` 는 넣지 않습니다.
    ```
    git add .gitignore .env.example package.json server.js
    git commit -m "p6: secret"
    git push
    ```
18. **확인** 세 가지.
    - github.com 의 내 저장소 파일 목록에 `.env.example` 은 있고 **`.env` 는 없습니다.**
    - 터미널에서 내 토큰 값을 찾아봅니다. `git grep` 은 Git 이 관리하는 파일에서만 찾습니다. **아무것도 나오지 않아야** 합니다. 줄이 나오면 그 파일에 토큰을 적은 것이고, 그 파일은 이미 GitHub 에 올라갔습니다(부록 E23 의 마지막 문장).
      ```
      git grep -n "내 토큰 값"
      ```
    - Actions 탭 맨 위 줄 `p6: secret` 이 초록입니다. GitHub 의 컴퓨터에는 `.env` 가 없지만 통과합니다. 테스트는 `public/logic.js` 만 불러오고 서버를 켜지 않기 때문입니다.
19. `.env` 가 저장소에 올라가 버렸다면 부록 E23 을 봅니다.

    참고: 11주차 녹강 슬라이드 40장(If a Secret Reaches GitHub).

---

[← 문제 목록](../README.md#문제) · [이전: P5](P5_forecast.md) · [부록: 흔한 오류](../README.md#부록-흔한-오류)
