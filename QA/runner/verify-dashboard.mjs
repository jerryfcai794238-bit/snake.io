/** 驗證 QA 儀表板：Stage 狀態導覽、資料口徑、下鑽、響應式與證據邊界。 */
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import path from 'node:path';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { fileURLToPath, pathToFileURL } from 'node:url';
import puppeteer from 'puppeteer';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..');
const dashboardUrl = pathToFileURL(path.join(ROOT, 'QA', '貪食蛇驗收儀表板.html')).href;
const evidenceDirectory = path.join(ROOT, 'QA', 'evidence', 'dashboard');
const latestRunPath = path.join(ROOT, 'QA', 'data', 'qa-latest-run.js');
const runnerPath = path.join(ROOT, 'QA', 'runner', 'run-cocos-logic.mjs');
const loaderPath = path.join(ROOT, 'QA', 'runner', 'cocos-ts-loader.mjs');
const sha256 = value => createHash('sha256').update(value).digest('hex');
const pause = milliseconds => new Promise(resolve => setTimeout(resolve, milliseconds));
const ROUND = Object.freeze({ score: 14, pass: 4, fail: 1, pending: 24, total: 29 });
const STAGES = Object.freeze([
  { stage: 'Stage 1', cases: 29, cards: 14, dates: '2026-06-29～2026-08-03', status: '已完成 14', current: true },
  { stage: 'Stage 2', cases: 41, cards: 13, dates: '2026-08-05～2026-09-29', status: '已完成 1｜進行中 2｜未開始 10' },
  { stage: 'Stage 3', cases: 7, cards: 7, dates: '2026-10-02～2026-11-03', status: '未開始 7' },
  { stage: 'Stage 4', cases: 10, cards: 3, dates: '2026-11-06～2026-11-13', status: '未開始 3' },
]);

await mkdir(evidenceDirectory, { recursive: true });
const latestBefore = await readFile(latestRunPath);
const blockedPreflight = spawnSync(process.execPath, [
  '--experimental-transform-types',
  '--experimental-loader', pathToFileURL(loaderPath).href,
  runnerPath,
], { cwd: ROOT, encoding: 'utf8', windowsHide: true });
const latestAfter = await readFile(latestRunPath);
assert.equal(blockedPreflight.error, undefined, `blocked preflight 無法啟動：${blockedPreflight.error?.message || '未知錯誤'}`);
assert.notEqual(blockedPreflight.status, 0, '缺 DoD／build／測試入口時，正式 runner 必須阻塞');
assert.equal(sha256(latestAfter), sha256(latestBefore), 'blocked preflight 不得覆蓋最後有效 qa-latest-run.js');
const blockedOutput = `${blockedPreflight.stdout || ''}\n${blockedPreflight.stderr || ''}`;
assert.match(blockedOutput, /latestRunPreserved|缺少 DoD／build／測試入口/, 'blocked preflight 必須留下缺件與 latest 保護證據');

const browser = await puppeteer.launch({ headless: true });
try {
  const page = await browser.newPage();
  const pageErrors = [];
  const consoleErrors = [];
  page.on('pageerror', error => pageErrors.push(error.message));
  page.on('console', message => { if (message.type() === 'error') consoleErrors.push(message.text()); });

  async function load(width, height) {
    await page.setViewport({ width, height, deviceScaleFactor: 1 });
    await page.goto(dashboardUrl, { waitUntil: 'networkidle0' });
    await page.waitForFunction(() => document.querySelectorAll('#stageNavigator [data-stage-nav]').length === 4
      && document.querySelectorAll('#issueHeatmap .heat-tile').length > 0
      && document.querySelectorAll('#stageCaseList .delivery-work-card').length > 0);
  }

  async function selectStage(expected) {
    const scrollBefore = await page.evaluate(() => {
      document.documentElement.style.scrollBehavior = 'auto';
      const heatmap = document.querySelector('#issueHeatmap');
      window.scrollTo({ top: heatmap.getBoundingClientRect().top + window.scrollY + 120, behavior: 'auto' });
      return window.scrollY;
    });
    await page.click(`#stageNavigator [data-stage-nav="${expected.stage}"]`);
    await page.waitForFunction(stage => document.querySelector(`#stageNavigator [data-stage-nav="${stage}"]`)?.getAttribute('aria-selected') === 'true', {}, expected.stage);
    await pause(450);
    const actual = await page.evaluate(() => {
      const nav = document.querySelector('#stageNavigator');
      const summaries = [...document.querySelectorAll('#stageCaseList .delivery-work-card > summary')];
      const qaSegments = document.querySelectorAll('#issueHeatmap .problem-segment.pass, #issueHeatmap .problem-segment.fail, #issueHeatmap .problem-segment.pending');
      const semanticColors = Object.fromEntries(['total', 'pass', 'fail', 'pending'].map(status => {
        const strong = document.querySelector(`.delivery-qa-kpi.${status}:not(.is-zero) strong`);
        return [status, strong ? getComputedStyle(strong).color : null];
      }));
      const qaKpiCards = summaries.map(summary => {
        const group = summary.querySelector('.delivery-card-kpis');
        if (!group) return null;
        const card = summary.closest('.delivery-work-card');
        const cases = [...card.querySelectorAll('.delivery-card-body details.case')];
        const values = Object.fromEntries([...group.querySelectorAll('[data-qa-kpi]')].map(node => [node.dataset.qaKpi, Number(node.querySelector('strong')?.textContent)]));
        const expected = {
          total: cases.length,
          pass: cases.filter(node => node.dataset.outcome === '通過').length,
          fail: cases.filter(node => node.dataset.outcome === '不通過').length,
          pending: cases.filter(node => node.dataset.outcome === '未執行').length,
        };
        return {
          labels: [...group.querySelectorAll('.delivery-qa-kpi span')].map(node => node.textContent.trim()),
          values,
          expected,
          aria: group.getAttribute('aria-label'),
          zeroValuesNeutral: [...group.querySelectorAll('.delivery-qa-kpi')].every(node => {
            const strong = node.querySelector('strong');
            if (Number(strong?.textContent) !== 0) return true;
            const semanticColor = semanticColors[node.dataset.qaKpi];
            return node.classList.contains('is-zero') && (!semanticColor || getComputedStyle(strong).color !== semanticColor);
          }),
          nonzeroValuesSemantic: [...group.querySelectorAll('.delivery-qa-kpi')].every(node => Number(node.querySelector('strong')?.textContent) === 0 || !node.classList.contains('is-zero')),
          separated: [...group.querySelectorAll('.delivery-qa-kpi')].slice(1).every(node => parseFloat(getComputedStyle(node).borderLeftWidth) > 0),
        };
      }).filter(Boolean);
      return {
        selected: [...document.querySelectorAll('#stageNavigator [aria-selected="true"]')].map(node => node.dataset.stageNav),
        title: document.querySelector('#selectedStageTitle').textContent.trim(),
        subtitle: document.querySelector('#selectedStageSubtitle').textContent.trim(),
        summary: document.querySelector('#stageStatusSummary').textContent.replace(/\s+/g, ' ').trim(),
        heatTiles: document.querySelectorAll('#issueHeatmap .heat-tile').length,
        cases: document.querySelectorAll('#stageCaseList details.case').length,
        cards: summaries.length,
        qaKpiGroups: qaKpiCards.length,
        qaKpiCards,
        oldQaPills: summaries.filter(summary => summary.querySelector('.delivery-card-qa')).length,
        neutralSummaries: summaries.filter(summary => summary.querySelector('.delivery-card-neutral')).length,
        qaSegments: qaSegments.length,
        plannedSegments: document.querySelectorAll('#issueHeatmap .problem-segment.planned').length,
        editableStatuses: document.querySelectorAll('#stageCaseList .case-status').length,
        caseNotice: document.querySelector('#caseStageNotice').textContent.trim(),
        scheduleMetadata: summaries.every(summary => {
          const date = summary.querySelector('.schedule-date');
          const status = summary.querySelector('.schedule-status');
          const visible = node => node && getComputedStyle(node).display !== 'none' && node.getBoundingClientRect().width > 0;
          return visible(date) && visible(status) && /排程日期：/.test(date.textContent) && /外包狀態：/.test(status.textContent)
            && /不代表 QA 通過/.test(summary.textContent)
            && !date.matches('.status-通過, .status-不通過, .complete')
            && !status.matches('.status-通過, .status-不通過, .complete');
        }),
        traceCollapsed: [...document.querySelectorAll('#stageCaseList .delivery-card-body > .secondary-details')].every(node => !node.open),
        navPosition: getComputedStyle(nav).position,
        navTop: nav.getBoundingClientRect().top,
        scrollY: window.scrollY,
        overflow: document.documentElement.scrollWidth > innerWidth + 1,
      };
    });
    actual.scrollBefore = scrollBefore;
    actual.scrollDelta = Math.abs(actual.scrollY - scrollBefore);
    return actual;
  }

  await load(1440, 1080);
  const firstScreen = await page.evaluate(() => {
    const score = document.querySelector('#roundScore');
    const activeStage = document.querySelector('#stageNavigator [aria-selected="true"]');
    return {
      score: Number(score.textContent.replace(/[^0-9]/g, '')),
      formula: document.querySelector('#roundScoreFormula').textContent.trim(),
      outcomes: [...document.querySelectorAll('#kpis .round-outcome-label')].map(node => ({ label: node.querySelector('span').textContent.trim(), count: Number(node.querySelector('b').textContent) })),
      outcomeSegments: document.querySelectorAll('#roundOutcomeTrack .round-outcome-segment').length,
      outcomeControls: document.querySelectorAll('#kpis button, #roundOutcomeTrack button').length,
      scoreInViewport: score.getBoundingClientRect().bottom <= innerHeight,
      filtersHidden: document.querySelector('#visuals').hidden && getComputedStyle(document.querySelector('#visuals')).display === 'none',
      stageButtons: [...document.querySelectorAll('#stageNavigator [data-stage-nav]')].map(node => ({ stage: node.dataset.stageNav, text: node.textContent.replace(/\s+/g, ' ').trim() })),
      activeStageColor: getComputedStyle(activeStage).backgroundColor,
      passColor: getComputedStyle(document.querySelector('#roundOutcomeTrack .pass')).backgroundColor,
      nav: [...document.querySelectorAll('.sidebar nav a')].map(node => node.textContent.replace(/^[^\p{L}]+/u, '').trim()),
      overflow: document.documentElement.scrollWidth > innerWidth + 1,
      gddCases: document.querySelectorAll('#caseList details.case').length,
      gddCollapsed: !document.querySelector('#gddAcceptanceDetails').open,
      notionCollapsed: !document.querySelector('#notion-delivery').open,
      gateCount: document.querySelectorAll('#gateList .gate').length,
      runtimeCopy: document.querySelector('#runtime-test').textContent,
    };
  });
  assert.equal(firstScreen.score, ROUND.score, '首屏必須先顯示本輪 14 分');
  assert.match(firstScreen.formula, /通過 4[\s\S]*本輪 29/);
  assert.deepEqual(firstScreen.outcomes.map(item => item.count), [4, 1, 24], '首屏必須顯示 4／1／24');
  assert.ok(firstScreen.outcomes[0].label.includes('通過') && firstScreen.outcomes[1].label.includes('不通過') && firstScreen.outcomes[2].label.includes('未執行'), '首屏只使用三種易懂結果');
  assert.equal(firstScreen.outcomeSegments, 3, '本輪結果必須為單一三態 stacked bar');
  assert.equal(firstScreen.outcomeControls, 0, '頂部結果不得形成重複篩選入口');
  assert.equal(firstScreen.filtersHidden, true, '低價值主篩選必須從首頁移除');
  assert.deepEqual(firstScreen.stageButtons.map(item => item.stage), STAGES.map(item => item.stage));
  assert.match(firstScreen.stageButtons[0].text, /本輪 QA 14 分/);
  assert.ok(firstScreen.stageButtons.slice(1).every(item => /尚未進入驗收/.test(item.text)));
  assert.notEqual(firstScreen.activeStageColor, firstScreen.passColor, 'Stage 選取色不得冒充 QA 通過綠');
  assert.deepEqual(firstScreen.nav, ['本輪判定', '驗收結果與問題', '檢測項目清單', '放行與證據']);
  assert.equal(firstScreen.scoreInViewport, true);
  assert.equal(firstScreen.overflow, false);
  assert.equal(firstScreen.gddCollapsed, true);
  assert.equal(firstScreen.notionCollapsed, true);
  assert.equal(firstScreen.gateCount, 5);
  assert.match(firstScreen.runtimeCopy, /真正 Cocos Runtime/);
  assert.match(firstScreen.runtimeCopy, /環境阻塞|尚未執行/);
  await page.select('#gddChapterSelect', '所有主題');
  await page.waitForFunction(() => document.querySelectorAll('#caseList details.case').length === 109);
  const gddTotal = await page.$$eval('#caseList details.case', nodes => nodes.length);
  assert.equal(gddTotal, 109, '完整 GDD 案例必須保留 109 條');

  const stageEvidence = [];
  for (const expected of STAGES) {
    const actual = await selectStage(expected);
    assert.deepEqual(actual.selected, [expected.stage]);
    assert.equal(actual.heatTiles, expected.cards, `${expected.stage} 圖卡數錯誤`);
    assert.equal(actual.cases, expected.cases, `${expected.stage} 案例數錯誤`);
    assert.equal(actual.cards, expected.cards, `${expected.stage} 工作卡數錯誤`);
    assert.match(actual.title, new RegExp(expected.stage));
    assert.ok(actual.summary.includes(expected.dates), `${expected.stage} 排程日期錯誤`);
    assert.ok(actual.summary.includes(expected.status), `${expected.stage} 外包狀態錯誤`);
    assert.equal(actual.scheduleMetadata, true, `${expected.stage} 收合摘要缺排程日期或外包狀態`);
    assert.equal(actual.traceCollapsed, true);
    assert.equal(actual.navPosition, 'sticky');
    assert.ok(actual.navTop >= 0 && actual.navTop <= 20, '切換後浮動 Stage 導覽必須留在 viewport');
    assert.ok(actual.scrollDelta <= 4, `${expected.stage} 切換不得改變目前捲動位置`);
    assert.equal(actual.overflow, false);
    if (expected.current) {
      assert.ok(actual.qaSegments > 0 && actual.plannedSegments === 0);
      assert.equal(actual.editableStatuses, 29);
      assert.match(actual.summary, /本輪 QA｜14\/100[\s\S]*通過 4｜不通過 1｜未執行 24/);
      assert.equal(actual.qaKpiGroups, expected.cards, 'Stage 1 每張工作卡都必須顯示四欄 QA KPI');
      assert.equal(actual.oldQaPills, 0, '不得保留單一長膠囊 QA 摘要');
      assert.equal(actual.neutralSummaries, 0);
      assert.ok(actual.qaKpiCards.every(card => JSON.stringify(card.labels) === JSON.stringify(['本輪檢測', '通過', '不通過', '未執行'])), '四欄 KPI 名稱或順序錯誤');
      assert.ok(actual.qaKpiCards.every(card => JSON.stringify(card.values) === JSON.stringify(card.expected)), '工作卡 KPI 與案例 DOM 計數不一致');
      assert.ok(actual.qaKpiCards.every(card => card.zeroValuesNeutral && card.nonzeroValuesSemantic && card.separated), 'KPI 零值中性化或欄間分隔不符');
      assert.ok(actual.qaKpiCards.every(card => /本輪檢測 \d+、通過 \d+、不通過 \d+、未執行 \d+/.test(card.aria)), '四欄 KPI 缺少完整無障礙摘要');
    } else {
      assert.equal(actual.qaSegments, 0, `${expected.stage} 不得產生 QA 三態色塊`);
      assert.equal(actual.qaKpiGroups, 0, `${expected.stage} 不得產生本輪 QA 四欄 KPI`);
      assert.equal(actual.oldQaPills, 0, `${expected.stage} 不得出現舊 QA 長膠囊`);
      assert.equal(actual.neutralSummaries, expected.cards, `${expected.stage} 必須使用中性的未納入本輪 QA 摘要`);
      assert.ok(actual.plannedSegments >= 1, `${expected.stage} 應以中性色表示待驗收量`);
      assert.equal(actual.editableStatuses, 0, `${expected.stage} 不得出現可編輯 QA 結果`);
      assert.match(actual.subtitle, /未產生 QA 結論/);
      assert.match(actual.caseNotice, /不計分[\s\S]*不產生通過／不通過結論/);
    }
    stageEvidence.push({ expected, actual });
  }

  await selectStage(STAGES[0]);
  const stage1KpiAggregate = stageEvidence[0].actual.qaKpiCards.reduce((aggregate, card) => ({
    total: aggregate.total + card.values.total,
    pass: aggregate.pass + card.values.pass,
    fail: aggregate.fail + card.values.fail,
    pending: aggregate.pending + card.values.pending,
  }), { total: 0, pass: 0, fail: 0, pending: 0 });
  assert.deepEqual(stage1KpiAggregate, { total: ROUND.total, pass: ROUND.pass, fail: ROUND.fail, pending: ROUND.pending }, '14 張工作卡 KPI 加總必須等於本輪 29／4／1／24');

  async function sharedFilterEvidence({ status = '全部', query = '' }) {
    await page.select('#statusFilter', status);
    await page.$eval('#search', (input, value) => {
      input.value = value;
      input.dispatchEvent(new Event('input', { bubbles: true }));
    }, query);
    await pause(50);
    return page.evaluate(() => {
      const cards = [...document.querySelectorAll('#stageCaseList .delivery-work-card')];
      const aggregate = { total: 0, pass: 0, fail: 0, pending: 0 };
      const dom = { total: 0, pass: 0, fail: 0, pending: 0 };
      let perCardMatch = true;
      cards.forEach(card => {
        const values = Object.fromEntries([...card.querySelectorAll('.delivery-card-kpis [data-qa-kpi]')].map(node => [node.dataset.qaKpi, Number(node.querySelector('strong')?.textContent)]));
        const cases = [...card.querySelectorAll('.delivery-card-body details.case')];
        const expected = {
          total: cases.length,
          pass: cases.filter(node => node.dataset.outcome === '通過').length,
          fail: cases.filter(node => node.dataset.outcome === '不通過').length,
          pending: cases.filter(node => node.dataset.outcome === '未執行').length,
        };
        perCardMatch &&= JSON.stringify(values) === JSON.stringify(expected);
        for (const key of Object.keys(aggregate)) {
          aggregate[key] += values[key] || 0;
          dom[key] += expected[key];
        }
      });
      return { cards: cards.length, cases: dom.total, aggregate, dom, perCardMatch };
    });
  }

  const filteredKpiEvidence = {
    pass: await sharedFilterEvidence({ status: '通過' }),
    fail: await sharedFilterEvidence({ status: '不通過' }),
    pending: await sharedFilterEvidence({ status: '未執行' }),
    query: await sharedFilterEvidence({ query: 'QA-COL-001' }),
  };
  assert.deepEqual(filteredKpiEvidence.pass.aggregate, { total: 4, pass: 4, fail: 0, pending: 0 });
  assert.deepEqual(filteredKpiEvidence.fail.aggregate, { total: 1, pass: 0, fail: 1, pending: 0 });
  assert.deepEqual(filteredKpiEvidence.pending.aggregate, { total: 24, pass: 0, fail: 0, pending: 24 });
  assert.deepEqual(filteredKpiEvidence.query.aggregate, { total: 1, pass: 1, fail: 0, pending: 0 });
  assert.ok(Object.values(filteredKpiEvidence).every(item => item.perCardMatch && JSON.stringify(item.aggregate) === JSON.stringify(item.dom)), '篩選後工作卡 KPI 必須和目前可見案例 DOM 同步重算');
  await sharedFilterEvidence({});

  const zeroCaseCard = await page.$eval('#issueHeatmap .heat-tile[data-pass="0"][data-fail="0"][data-pending="0"] [data-open-stage-card]', node => node.dataset.openStageCard);
  await page.click(`#issueHeatmap [data-open-stage-card="${zeroCaseCard}"]`);
  await page.waitForFunction(card => document.querySelectorAll('#stageCaseList .delivery-work-card').length === 1 && document.querySelector('#stageCaseList .delivery-work-card')?.dataset.cardName === card, {}, zeroCaseCard);
  const zeroCaseDrill = await page.evaluate(() => ({
    cases: document.querySelectorAll('#stageCaseList details.case').length,
    gapVisible: Boolean(document.querySelector('#stageCaseList .delivery-card-gap')),
    values: Object.fromEntries([...document.querySelectorAll('#stageCaseList .delivery-card-kpis [data-qa-kpi]')].map(node => [node.dataset.qaKpi, Number(node.querySelector('strong')?.textContent)])),
  }));
  assert.deepEqual(zeroCaseDrill, { cases: 0, gapVisible: true, values: { total: 0, pass: 0, fail: 0, pending: 0 } }, '0 案例工作卡必須保留缺口提示與全 0 KPI');
  await page.click('#clearIssueDrill');
  await page.waitForFunction(() => document.querySelectorAll('#stageCaseList .delivery-work-card').length === 14);

  const drillCard = await page.$eval('#issueHeatmap .heat-tile[data-pass], #issueHeatmap .heat-tile[data-fail], #issueHeatmap .heat-tile[data-pending]', node => node.dataset.heatRow);
  await page.click(`#issueHeatmap [data-open-stage-card="${drillCard}"]`);
  await page.waitForFunction(card => !document.querySelector('#issueDrillBar').hidden && document.querySelector('#issueDrillBar').textContent.includes(card), {}, drillCard);
  await pause(800);
  const drillEvidence = await page.evaluate(card => {
    const openCard = [...document.querySelectorAll('#stageCaseList .delivery-work-card')].find(node => node.dataset.cardName === card);
    return {
      drillText: document.querySelector('#issueDrillBar').textContent.replace(/\s+/g, ' ').trim(),
      selectedTile: document.querySelector(`#issueHeatmap [data-open-stage-card="${CSS.escape(card)}"]`)?.getAttribute('aria-pressed'),
      workCards: document.querySelectorAll('#stageCaseList .delivery-work-card').length,
      cases: document.querySelectorAll('#stageCaseList details.case').length,
      detailsOpen: document.querySelector('#roundCaseDetails').open,
      workCardOpen: Boolean(openCard?.open),
      navTop: document.querySelector('#stageNavigator').getBoundingClientRect().top,
    };
  }, drillCard);
  assert.match(drillEvidence.drillText, /返回 Stage 1 全部工作卡/);
  assert.equal(drillEvidence.selectedTile, 'true');
  assert.equal(drillEvidence.workCards, 1);
  assert.ok(drillEvidence.cases > 0);
  assert.equal(drillEvidence.detailsOpen && drillEvidence.workCardOpen, true);
  assert.ok(drillEvidence.navTop >= 0 && drillEvidence.navTop <= 20);
  await page.evaluate(() => {
    document.documentElement.style.scrollBehavior = 'auto';
    document.querySelector('#clearIssueDrill').scrollIntoView({ block: 'center' });
  });
  await pause(40);
  const clearScrollBefore = await page.evaluate(() => window.scrollY);
  await page.click('#clearIssueDrill');
  await page.waitForFunction(() => document.querySelector('#issueDrillBar').hidden && document.querySelectorAll('#issueHeatmap .heat-tile').length === 14 && document.querySelectorAll('#stageCaseList details.case').length === 29);
  await pause(50);
  const clearScrollAfter = await page.evaluate(() => window.scrollY);
  assert.ok(Math.abs(clearScrollAfter - clearScrollBefore) <= 4, `返回全部工作卡不得改變目前捲動位置：${clearScrollBefore} → ${clearScrollAfter}`);

  const stage1Bars = await page.evaluate(() => ({
    tracksValid: [...document.querySelectorAll('#issueHeatmap .heat-tile')].every(node => node.querySelectorAll('.problem-track').length === 1),
    zeroFailNoRed: [...document.querySelectorAll('#issueHeatmap .heat-tile[data-fail="0"]')].every(node => !node.querySelector('.problem-segment.fail')),
    zeroPassNoGreen: [...document.querySelectorAll('#issueHeatmap .heat-tile[data-pass="0"]')].every(node => !node.querySelector('.problem-segment.pass')),
    zeroPendingNoColor: [...document.querySelectorAll('#issueHeatmap .heat-tile[data-pending="0"]')].every(node => !node.querySelector('.problem-segment.pending')),
    labelsChinese: [...document.querySelectorAll('#issueHeatmap .problem-counts')].every(node => /通過 \d+/.test(node.textContent) && /不通過 \d+/.test(node.textContent) && /未執行 \d+/.test(node.textContent)),
    noStatusSymbols: [...document.querySelectorAll('#issueHeatmap .problem-counts')].every(node => !/[✓!○]/.test(node.textContent)),
  }));
  assert.ok(Object.values(stage1Bars).every(Boolean), '單一 bar 或零值色塊規則不符');

  const stateConsistency = await page.evaluate(() => {
    const rows = [...document.querySelectorAll('#stageCaseList details.case')].map(node => {
      const badges = [...node.querySelectorAll(':scope > summary .case-summary .badge')];
      const select = node.querySelector('.case-status');
      return {
        id: node.dataset.caseId,
        badge: badges.at(-1)?.textContent.trim() || '',
        selected: select?.selectedOptions[0]?.textContent.trim() || '',
        options: select ? [...select.options].map(option => option.textContent.trim()) : [],
      };
    });
    const blocked = document.querySelector('#stageCaseList details.case[data-case-id="QA-FLW-001"]');
    return {
      rows,
      allMatch: rows.every(row => row.badge === row.selected),
      optionsAreThreeStates: rows.every(row => JSON.stringify(row.options) === JSON.stringify(['未執行', '通過', '不通過'])),
      blockedCase: blocked ? {
        outcome: blocked.dataset.outcome,
        executionResult: blocked.dataset.executionResult,
        selected: blocked.querySelector('.case-status')?.selectedOptions[0]?.textContent.trim() || '',
      } : null,
    };
  });
  assert.equal(stateConsistency.allMatch, true, '案例摘要與 QA 下拉狀態必須一致');
  assert.equal(stateConsistency.optionsAreThreeStates, true, 'QA 下拉只能顯示未執行／通過／不通過');
  assert.deepEqual(stateConsistency.blockedCase, { outcome: '未執行', executionResult: 'blocked-during-test', selected: '未執行' }, '底層阻塞原因必須保留，但對外狀態統一為未執行');
  await page.evaluate(() => {
    const blocked = document.querySelector('#stageCaseList details.case[data-case-id="QA-FLW-001"]');
    blocked.closest('.delivery-work-card').open = true;
    blocked.open = true;
    blocked.scrollIntoView({ block: 'center' });
  });
  const blockedCaseElement = await page.$('#stageCaseList details.case[data-case-id="QA-FLW-001"]');
  await blockedCaseElement.screenshot({ path: path.join(evidenceDirectory, 'qa-dashboard-state-consistency.png') });

  async function responsive(width, height, columns, kpiColumns, kpiPlacement, screenshotName) {
    await load(width, height);
    await page.evaluate(() => {
      document.documentElement.style.scrollBehavior = 'auto';
      document.querySelector('#roundCaseDetails').open = true;
      document.querySelector('#stageCaseList .delivery-work-card').scrollIntoView({ block: 'center' });
    });
    await pause(40);
    const actual = await page.evaluate(() => {
      const heatmap = document.querySelector('#issueHeatmap');
      const widths = [...heatmap.querySelectorAll('.heat-tile')].slice(0, 6).map(node => node.getBoundingClientRect().width);
      const nav = document.querySelector('#stageNavigator');
      const summary = document.querySelector('#stageCaseList .delivery-work-card > summary');
      const title = summary.querySelector('.delivery-work-title');
      const kpis = summary.querySelector('.delivery-card-kpis');
      const summaryRect = summary.getBoundingClientRect();
      const titleRect = title.getBoundingClientRect();
      const kpiRect = kpis.getBoundingClientRect();
      const kpiWidths = [...kpis.querySelectorAll('.delivery-qa-kpi')].map(node => node.getBoundingClientRect().width);
      const placement = titleRect.right <= kpiRect.left + 1 ? 'right' : titleRect.bottom <= kpiRect.top + 1 ? 'below' : 'overlap';
      return {
        columns: getComputedStyle(heatmap).gridTemplateColumns.split(' ').filter(Boolean).length,
        equalWidths: Math.max(...widths) - Math.min(...widths) <= 2,
        overflow: document.documentElement.scrollWidth > innerWidth + 1,
        navSticky: getComputedStyle(nav).position === 'sticky',
        navTop: nav.getBoundingClientRect().top,
        stageButtons: nav.querySelectorAll('[data-stage-nav]').length,
        kpiColumns: getComputedStyle(kpis).gridTemplateColumns.split(' ').filter(Boolean).length,
        kpiPlacement: placement,
        kpiEqualWidths: Math.max(...kpiWidths) - Math.min(...kpiWidths) <= 2,
        kpiInsideCard: kpiRect.left >= summaryRect.left - 1 && kpiRect.right <= summaryRect.right + 1,
        kpiNoOverflow: kpis.scrollWidth <= kpis.clientWidth + 1,
        titleUsable: placement === 'right' ? titleRect.width >= 360 : titleRect.width >= summaryRect.width - 40,
        kpiLabels: [...kpis.querySelectorAll('.delivery-qa-kpi span')].map(node => node.textContent.trim()),
      };
    });
    assert.equal(actual.columns, columns, `${width}px 工作卡欄數錯誤`);
    assert.equal(actual.equalWidths, true);
    assert.equal(actual.overflow, false);
    assert.equal(actual.navSticky, true);
    assert.ok(actual.navTop >= 0 && actual.navTop <= 32, `${width}px 浮動 Stage 導覽 top=${actual.navTop}`);
    assert.equal(actual.stageButtons, 4);
    assert.equal(actual.kpiColumns, kpiColumns, `${width}px QA KPI 欄數錯誤`);
    assert.equal(actual.kpiPlacement, kpiPlacement, `${width}px QA KPI 應位於${kpiPlacement === 'right' ? '卡片右側' : '驗收項目下方'}`);
    assert.equal(actual.kpiEqualWidths, true, `${width}px QA KPI 欄寬不一致`);
    assert.equal(actual.kpiInsideCard && actual.kpiNoOverflow && actual.titleUsable, true, `${width}px QA KPI 擠壓左側項目或超出卡片`);
    assert.deepEqual(actual.kpiLabels, ['本輪檢測', '通過', '不通過', '未執行']);
    await page.screenshot({ path: path.join(evidenceDirectory, screenshotName), fullPage: false });
    return actual;
  }

  const responsiveEvidence = {
    desktop: await responsive(1440, 1080, 3, 4, 'right', 'qa-dashboard-stage-desktop.png'),
    tablet: await responsive(1024, 900, 2, 4, 'below', 'qa-dashboard-stage-tablet.png'),
    mobile390: await responsive(390, 844, 1, 2, 'below', 'qa-dashboard-stage-mobile-390.png'),
    mobile360: await responsive(360, 800, 1, 2, 'below', 'qa-dashboard-stage-mobile-360.png'),
  };
  assert.deepEqual(pageErrors, [], `儀表板有執行錯誤：${pageErrors.join(' | ')}`);
  assert.deepEqual(consoleErrors, [], `儀表板 Console 有錯誤：${consoleErrors.join(' | ')}`);

  const report = {
    verifiedAt: new Date().toISOString(), dashboardUrl, result: 'PASS', roundResult: ROUND,
    stageEvidence, firstScreen, gddTotal, stage1KpiAggregate, filteredKpiEvidence, zeroCaseDrill, drillEvidence, clearScroll: { before: clearScrollBefore, after: clearScrollAfter }, stage1Bars, stateConsistency, responsive: responsiveEvidence,
    blockedPreflight: { exitCode: blockedPreflight.status, latestPreserved: true },
    evidenceBoundary: '此驗證只證明儀表板靜態呈現、資料一致性、響應式與瀏覽器互動，不代表 Cocos Runtime 通過。',
    screenshots: [
      'QA/evidence/dashboard/qa-dashboard-stage-desktop.png',
      'QA/evidence/dashboard/qa-dashboard-stage-tablet.png',
      'QA/evidence/dashboard/qa-dashboard-stage-mobile-390.png',
      'QA/evidence/dashboard/qa-dashboard-stage-mobile-360.png',
      'QA/evidence/dashboard/qa-dashboard-state-consistency.png',
    ],
    pageErrors, consoleErrors,
  };
  await writeFile(path.join(evidenceDirectory, 'qa-dashboard-verification-latest.json'), `${JSON.stringify(report, null, 2)}\n`, 'utf8');
  console.log(JSON.stringify(report, null, 2));
} finally {
  await browser.close();
}
