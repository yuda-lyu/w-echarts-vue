# 處理要點（w-echarts-vue）

本檔記本套件特有之處理流程與使用者裁示。

> 2026-11-22 自 Claude Code 自動記憶提取（記憶依資料夾路徑存放，套件層級改變後失聯；原記於 2026-09-25～2026-09-27）。本套件當時尚無 `CLAUDE.md` 與 `sgud/`，本檔為首份指引要求文件。

## 1. 需求屬自有基礎層者，回饋基礎層，不在本套件另寫平行實作（使用者裁示，2026-09-26）

- **分層**：自有套件為分層之基礎——wsemi（與框架無關之原語，例：`domDetect`）→ w-component-vue（Vue 轉接器與指令，例：`v-domresize`）→ 包裝套件（本套件、w-highcharts-vue 等）與應用。本套件之圖表容器尺寸監聽即經 w-component-vue 之 `v-domresize`（`WEchartsVue.vue` 之 `resizeOpt`、`getSize`、`getBase`；純函數與單元測試在 `src/js/getContainerSize.mjs`、`parseAutoresize.mjs`、`isPropUnchanged.mjs` 與 `test/unit-autoresize.test.mjs`）。
- **裁示**：消費端需要基礎層表達不了之事（一個選項、一條規則、一個生命週期鉤子）時，交付物是**寫給該基礎層主責之建議文件**（`建議{套件名}修正.md`，交主控轉該基礎層之主責處理），不是在消費端另寫本地程式，也不是辯稱「兩者不同所以得另寫」。轉接器丟掉選項者，視為該轉接器之缺陷，不是繞過它之理由。
- **使用者原話（2026-09-26）**：「明明就有基礎與結構有順序有依循有繼承, 但你偏偏要另外創建而不是把經驗總結與回饋整體自有套件」。起因：曾因 w-component-vue 之 domResize 忽略選項而繞過它，在本套件與 w-highcharts-vue 各自另寫 needResize、throttle、清理；其後盤點顯示同樣之碎片化散在各處（9 個 w-component-vue 組件內共 16 處零尺寸守門、他套件改用原生 ResizeObserver、w-aggrid-vue 監聽一個自 2021 年起不再發出之 `display` 事件）。
- **做法**：加邏輯進消費端之前，先 Grep `C:\opensrc` 下所有自有套件對同一機制之全部消費者；把每項需求分類——內建於基礎層（對所有人）、基礎層之 opt（個別消費端客製）、僅屬消費端之函式庫事實（函式庫如何量測、尺寸為何、如何重繪）；規則放在最低可行之自有層，以建議文件提出並附真瀏覽器驗證過之原型。

## 2. 修一類行為時，要挑最穩健之作法，不做點狀補丁（使用者要求，2026-09-25）

- **使用者原話（2026-09-25）**：「需挑最穩健的方法, 過往經驗都須參考, 否則一直都會有小問題 變成得一直改 你仔細查清楚」。why：針對單一抱怨之點狀修法會不斷產生後續小錯；使用者偏好有證據支撐之一次性穩健重設計。
- **做法**：①設計前先挖過往經驗——wsemi 之 git 歷史（例：`src/domDetect.mjs` 於 2020-07-14 由 ResizeObserver＋IntersectionObserver 改回 20ms 輪詢，原因記於該檔註解）、w-component-vue 之使用（`src/js/domResize.mjs`）、同類 w-*-vue 包裝套件、成熟上游函式庫（vue-echarts、echarts-for-react、Highcharts reflow）；②把 ≥5 個候選實作放進同一個真瀏覽器 harness，跑同一組情境矩陣，挑全過者實作，並把核心邏輯抽成 `src/js/*.mjs` 純函數加單元測試；③同類問題一併查姊妹套件，寫 `建議<套件>調整.md` 交其主責處理，不自行改他套件。

## 3. 真瀏覽器驗證之 harness 作法（2026-09-25 記載；Playwright 取得方式依現況修訂）

- 本套件不宣告 playwright 相依。需要真瀏覽器驗證時，依自有套件慣例經 `w-playwright` 取得（各套件 2026-11-13 起遷移，見 w-component-vue 規則帳本四）；原作法「以 `createRequire` 借用 w-screenctl repo 之 playwright」已不採。
- **harness 型式**（不需 bundler，直接測組件原始碼）：`page.setContent` ＋ `addScriptTag` 載入 `node_modules/vue/dist/vue.js`（完整版，2.7.16）＋ `node_modules/echarts/dist/echarts.js` ＋ SFC 之 `<script>` 區塊（import 改寫為全域變數）。
- headless 預設加 `--hide-scrollbars`；捲軸寬度會影響量測時，傳 `ignoreDefaultArgs: ['--hide-scrollbars']`（2026-09-25 於 Playwright 1.62.1 實測；改經 w-playwright 後之旗標傳法未重驗）。
