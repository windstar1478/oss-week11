# P1. vitest 를 설치하고 첫 테스트 돌리기 — `p1: vitest`

9주차 P6 에서는 `node check.js` 를 돌리고, 출력을 주석의 예상과 눈으로 한 줄씩 비교했습니다. 이번 문제에서는 그 비교를 프로그램이 하게 합니다. 끝나면 세 가지가 됩니다.

- (1) **설치**: 테스트 도구 vitest 가 이 프로젝트에 깔립니다.
- (2) **명령**: `npm test` 한 줄로 테스트가 돌아갑니다.
- (3) **첫 통과**: 들어 있는 예시 테스트 1개가 통과합니다.

파일: `package.json`, (새로 생김) `package-lock.json`

## 만들 것

1. 새 터미널에서 vitest 를 **개발용 패키지로** 설치합니다. `-D` 를 빠뜨리지 않습니다.
   ```
   npm install -D vitest
   ```
   `added 35 packages` 같은 줄이 나오면 끝난 것입니다. 숫자는 달라도 됩니다.

   참고: 10주차 녹강 슬라이드 8장(Vitest), 9장(Install It as a devDependency).

2. 설치로 무엇이 바뀌었는지 봅니다. 같은 터미널에서 실행합니다.
   ```
   git status
   ```
   - `modified: package.json` 이 보입니다. VS Code 에서 열면 `devDependencies` 에 `vitest` 한 줄이 생겼습니다. `-D` 를 붙였기 때문에 `dependencies` 가 아니라 `devDependencies` 입니다. 테스트 도구는 개발할 때만 필요하고 앱이 돌아가는 데는 필요 없다는 표시입니다.
   - `Untracked files` 에 `package-lock.json` 이 보입니다. 실제로 깔린 패키지 35개 각각의 정확한 버전이 적힌 파일입니다.
   - `node_modules` 폴더도 생겼지만 `git status` 에는 **보이지 않습니다.** 템플릿의 `.gitignore` 에 `node_modules/` 가 들어 있어서 Git 이 못 본 척합니다. 이 폴더는 `package-lock.json` 만 있으면 누구나 똑같이 다시 만들 수 있으므로 저장소에 올리지 않습니다.

3. VS Code 에서 `package.json` 을 열고 `scripts` 를 추가합니다. `test` 라는 이름에 아래 명령을 연결합니다.
   ```
   vitest run --reporter=verbose
   ```
   - `run` 은 "한 번 돌리고 끝낸다" 는 뜻입니다. 빼면 파일이 바뀌기를 기다리며 계속 켜져 있습니다.
   - `--reporter=verbose` 는 테스트 이름을 한 줄에 하나씩 보여 달라는 옵션입니다.
   - `package.json` 은 JSON 입니다. 항목 사이에는 쉼표가 있어야 하고, **마지막 항목 뒤에는 쉼표가 없어야** 합니다. `"type": "module"` 줄 뒤에 `scripts` 를 넣는다면 그 줄 끝에 쉼표를 붙여야 합니다.

   참고: 10주차 녹강 슬라이드 10장(The test Script).

4. VS Code 에서 `logic.test.js` 를 열어 읽어 봅니다. 아직 고치지 않습니다.
   - 맨 위 두 줄이 import 입니다. `test` 와 `expect` 는 vitest 에서, `toDays` 는 `public/logic.js` 에서 가져옵니다.
   - `daily` 는 Open-Meteo 응답과 같은 모양으로 손으로 만든 4일치 입력이고, `days` 는 그것을 `toDays` 로 바꾼 결과입니다.
   - `test("이름", () => { ... })` 한 덩어리가 테스트 1개입니다. 그 안의 `expect(실제값).toEqual(기대값)` 이 9주차의 "출력과 주석을 눈으로 비교" 를 대신합니다.

   참고: 10주차 녹강 슬라이드 7장(From check.js to a Test), 11장(Your First Test).

## 확인 (터미널)

5. 테스트를 돌립니다.
   ```
   npm test
   ```
6. 아래처럼 나오면 됩니다. 시간(ms)과 폴더 경로는 다릅니다.
   ```
    ✓ logic.test.js > toDays builds one object per day 1ms

    Test Files  1 passed (1)
         Tests  1 passed (1)
   ```
   - `✓` 로 시작하는 줄이 테스트 1개입니다. `>` 뒤가 `test("...")` 에 적힌 이름입니다.
   - 맨 아래 `Tests  1 passed (1)` 은 "1개 중 1개 통과" 입니다.
   - `Missing script: "test"` 가 나오면 부록 E1, `EJSONPARSE` 가 나오면 부록 E2 입니다.

## 커밋 (터미널)

7. 커밋하고 push 합니다. **`package-lock.json` 을 꼭 같이 넣습니다.** P3 에서 GitHub 가 이 파일을 보고 같은 버전을 설치합니다.
   ```
   git add package.json package-lock.json
   git commit -m "p1: vitest"
   git push
   ```
8. **확인**: github.com 의 내 저장소를 새로 고칩니다. 파일 목록에 `package-lock.json` 이 있고 `node_modules` 는 없으면 됩니다.

---

[← 문제 목록](../README.md#문제) · [이전: P0](P0_setup.md) · [다음: P2](P2_tests.md) · [부록: 흔한 오류](../README.md#부록-흔한-오류)
