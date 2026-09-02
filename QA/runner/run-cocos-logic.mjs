/**
 * 貪食蛇背景 QA runner
 *
 * 範圍：只執行外包 Cocos 專案中標示為 cc-free 的裁判層 TypeScript；不啟動 Editor、
 * 不操控桌面、也不寫入外包目錄。每輪必須讀取目前 GDD 並取得新鮮的 Notion 快照，
 * 結果才會發布到儀表板。
 */
import assert from 'node:assert/strict';
import { execFile } from 'node:child_process';
import { createHash } from 'node:crypto';
import { mkdir, readFile, stat, writeFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';
import { promisify } from 'node:util';
import { fileURLToPath, pathToFileURL } from 'node:url';

const execFileAsync = promisify(execFile);

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..');
const DATA_DIR = path.join(ROOT, 'QA', 'data');
const RUNS_DIR = path.join(ROOT, 'QA', 'runs');
const SNAPSHOT_PATH = path.join(DATA_DIR, 'notion-schedule-latest.json');
const LATEST_RUN_PATH = path.join(DATA_DIR, 'qa-latest-run.js');
const LATEST_DIAGNOSTIC_PATH = path.join(DATA_DIR, 'qa-latest-diagnostic.js');
const GDD_PATH = path.join(ROOT, 'GDD', '貪食蛇GDD.md');
const DEFAULT_PROJECT = 'D:/OLD-RD3/partygo-client-snake-os';
const DEFAULT_MAX_SNAPSHOT_AGE_MINUTES = 5;

function option(name, fallback = undefined) {
  const index = process.argv.indexOf(name);
  return index >= 0 ? process.argv[index + 1] : fallback;
}

const PROJECT_ROOT = path.resolve(option('--project', process.env.SNAKE_COCOS_PROJECT || DEFAULT_PROJECT));
const MAX_SNAPSHOT_AGE_MINUTES = Number(option('--max-snapshot-age-min', DEFAULT_MAX_SNAPSHOT_AGE_MINUTES));
const DIAGNOSTIC_LOGIC_ONLY = process.argv.includes('--diagnostic-logic-only');

class PreflightBlockedError extends Error {
  constructor(message, blockers = []) {
    super(message);
    this.name = 'PreflightBlockedError';
    this.blockers = blockers;
  }
}

function isoNow() {
  return new Date().toISOString();
}

function runId(now = new Date()) {
  const stamp = now.toISOString().replace(/[-:]/g, '').replace('.', '');
  return `logic-${stamp}`;
}

function relativeToRoot(target) {
  return path.relative(ROOT, target).replaceAll('\\', '/');
}

function formatError(error) {
  return error instanceof Error ? error.message : String(error);
}

function closeTo(actual, expected, epsilon = 1e-9) {
  assert.ok(Math.abs(actual - expected) <= epsilon, `expected ${actual} to equal ${expected} ± ${epsilon}`);
}

async function readJson(filePath) {
  return JSON.parse(await readFile(filePath, 'utf8'));
}

async function writeJson(filePath, value) {
  await writeFile(filePath, `${JSON.stringify(value, null, 2)}\n`, 'utf8');
}

async function readGdd() {
  const [content, fileStat] = await Promise.all([readFile(GDD_PATH, 'utf8'), stat(GDD_PATH)]);
  const version = content.match(/\*\*文件版本\*\*：\s*([^\r\n]+)/)?.[1]?.trim();
  assert.ok(version, 'GDD 缺少可辨識的文件版本');
  return {
    content,
    info: {
      path: relativeToRoot(GDD_PATH),
      version,
      sha256: createHash('sha256').update(content, 'utf8').digest('hex'),
      modifiedAt: fileStat.mtime.toISOString(),
      readAt: isoNow(),
    },
  };
}

async function writeRunArtifacts(report) {
  const runDirectory = path.join(RUNS_DIR, report.runId);
  await mkdir(runDirectory, { recursive: true });
  const reportPath = path.join(runDirectory, 'results.json');
  const tracePath = path.join(runDirectory, 'assertions.ndjson');
  await writeJson(reportPath, report);
  const trace = report.tests.length ? `${report.tests.map(test => JSON.stringify(test)).join('\n')}\n` : '';
  await writeFile(tracePath, trace, 'utf8');
  return { reportPath, tracePath };
}

async function publishLatest(report, artifacts, latestPath = LATEST_RUN_PATH, globalName = '__SNAKE_QA_LATEST_RUN__') {
  const { reportPath, tracePath } = artifacts;
  const dashboardAsset = [
    "'use strict';",
    `window.${globalName} = Object.freeze(${JSON.stringify({
      ...report,
      evidencePath: relativeToRoot(reportPath),
      tracePath: relativeToRoot(tracePath),
    }, null, 2)});`,
    '',
  ].join('\n');
  await writeFile(latestPath, dashboardAsset, 'utf8');
}

function preflight(snapshot, { requireFresh = true, requireDeliveryMetadata = true } = {}) {
  const blockers = [];
  if (snapshot.source !== 'Notion') blockers.push({ type: 'invalid-source', message: 'Notion 快照來源不正確' });
  if (!Array.isArray(snapshot.cards) || snapshot.cards.length === 0) blockers.push({ type: 'missing-cards', message: 'Notion 快照缺少工作卡' });
  const syncedAt = Date.parse(snapshot.syncedAt);
  if (!Number.isFinite(syncedAt)) blockers.push({ type: 'invalid-synced-at', message: 'Notion 快照缺少有效 syncedAt' });
  const ageMs = Date.now() - syncedAt;
  if (Number.isFinite(ageMs) && ageMs < 0) blockers.push({ type: 'future-snapshot', message: 'Notion 快照時間位於未來，拒絕使用' });
  if (Number.isFinite(ageMs) && ageMs > MAX_SNAPSHOT_AGE_MINUTES * 60_000) {
    blockers.push({
      type: 'stale-snapshot',
      owner: 'QA／排程資料 owner',
      missingItems: ['5 分鐘內的 Notion 快照'],
      reentryCondition: '重新同步 Snake Schedule 後再執行正式 runner',
      message: `Notion 快照已超過 ${MAX_SNAPSHOT_AGE_MINUTES} 分鐘，請先同步`,
    });
  }
  const cards = Array.isArray(snapshot.cards) ? snapshot.cards : [];
  const deliveredStage1Cards = cards.filter(card => card.stage === 'Stage 1' && card.status === '已完成');
  const metadataGaps = deliveredStage1Cards.filter(card => !card.definitionOfDone || !card.build || !card.testEntry);
  if (metadataGaps.length) {
    blockers.push({
      type: 'missing-testability-metadata',
      owner: '外包 PM／整合 owner',
      missingItems: ['Definition of Done', '可追溯 build／commit', '測試入口'],
      affectedCards: metadataGaps.map(card => card.name),
      reentryCondition: '補齊每張已交付工作卡的 DoD、build 與測試入口後重跑正式 runner',
      message: `Stage 1 已交付卡有 ${metadataGaps.length} 張缺少 DoD／build／測試入口`,
    });
  }
  const hardBlockerTypes = new Set(['invalid-source', 'missing-cards', 'invalid-synced-at', 'future-snapshot']);
  const enforcedBlockers = blockers.filter(item => hardBlockerTypes.has(item.type)
    || (item.type === 'stale-snapshot' && requireFresh)
    || (item.type === 'missing-testability-metadata' && requireDeliveryMetadata));
  if (enforcedBlockers.length) {
    throw new PreflightBlockedError(enforcedBlockers.map(item => item.message).join('；'), enforcedBlockers);
  }
  return {
    fresh: Number.isFinite(ageMs) && ageMs >= 0 && ageMs <= MAX_SNAPSHOT_AGE_MINUTES * 60_000,
    ageMinutes: Number.isFinite(ageMs) ? Number((ageMs / 60_000).toFixed(2)) : null,
    snapshotId: snapshot.snapshotId,
    syncedAt: snapshot.syncedAt,
    cardCount: cards.length,
    deliveredStage1CardCount: deliveredStage1Cards.length,
    metadataGapCardCount: metadataGaps.length,
    advisories: blockers,
    diagnosticBypass: !requireFresh || !requireDeliveryMetadata,
  };
}

async function externalBuildInfo() {
  assert.ok(existsSync(PROJECT_ROOT), `找不到外包 Cocos 專案：${PROJECT_ROOT}`);
  try {
    const gitArgs = args => execFileAsync('git', ['-C', PROJECT_ROOT, ...args], { windowsHide: true, maxBuffer: 1024 * 1024 });
    const [branchResult, commitResult, statusResult] = await Promise.all([
      gitArgs(['branch', '--show-current']),
      gitArgs(['rev-parse', 'HEAD']),
      gitArgs(['status', '--porcelain=v1', '--untracked-files=all']),
    ]);
    const statusLines = statusResult.stdout.split(/\r?\n/).map(line => line.trimEnd()).filter(Boolean);
    return {
      projectPath: PROJECT_ROOT,
      branch: branchResult.stdout.trim() || 'detached',
      commit: commitResult.stdout.trim(),
      clean: statusLines.length === 0,
      statusPorcelain: statusLines,
      readOnly: true,
      checkedAt: isoNow(),
    };
  } catch (error) {
    throw new PreflightBlockedError(`無法確認外包 Cocos 專案 Git 狀態：${formatError(error)}`, [{
      type: 'blocked-env',
      owner: 'QA 環境 owner',
      missingItems: ['可讀取的 Git branch／commit／status'],
      reentryCondition: '確認外包 checkout 可由 git 唯讀查詢後重跑',
    }]);
  }
}

function sourceUrl(...segments) {
  return pathToFileURL(path.join(PROJECT_ROOT, ...segments)).href;
}

async function loadJudgeLayer() {
  const scriptRoot = ['assets', 'games', 'snake', 'script'];
  const [
    staticModule,
    entityModule,
    worldModule,
    moveModule,
    skillModule,
    collisionModule,
    bounceModule,
    mathModule,
    defineModule,
  ] = await Promise.all([
    import(sourceUrl(...scriptRoot, 'define', 'SnakeGameStaticData.ts')),
    import(sourceUrl(...scriptRoot, 'sim', 'SnakeEntity.ts')),
    import(sourceUrl(...scriptRoot, 'sim', 'SnakeGameWorld.ts')),
    import(sourceUrl(...scriptRoot, 'sim', 'SnakeMoveSystem.ts')),
    import(sourceUrl(...scriptRoot, 'sim', 'SnakeSkillSystem.ts')),
    import(sourceUrl(...scriptRoot, 'sim', 'SnakeCollisionSystem.ts')),
    import(sourceUrl(...scriptRoot, 'sim', 'SnakeBounceReactionSystem.ts')),
    import(sourceUrl(...scriptRoot, 'sim', 'SnakeBounceMath.ts')),
    import(sourceUrl(...scriptRoot, 'define', 'SnakeDefine.ts')),
  ]);
  return {
    SnakeGameStaticData: staticModule.SnakeGameStaticData,
    SnakeEntity: entityModule.SnakeEntity,
    SnakeGameWorld: worldModule.SnakeGameWorld,
    SnakeMoveSystem: moveModule.SnakeMoveSystem,
    SnakeSkillSystem: skillModule.SnakeSkillSystem,
    SnakeCollisionSystem: collisionModule.SnakeCollisionSystem,
    SnakeBounceReactionSystem: bounceModule.SnakeBounceReactionSystem,
    reflectDirection: mathModule.reflectDirection,
    SnakeFoodType: defineModule.SnakeFoodType,
  };
}

function setupSnake(judge, id = 'qa-player') {
  const world = new judge.SnakeGameWorld();
  world.arena = { width: 2000, height: 2000, rocks: [], slowZones: [] };
  const snake = new judge.SnakeEntity();
  snake.reset(id, null);
  snake.trail.setHead(0, 0);
  world.snakes.set(id, snake);
  return { world, snake };
}

async function runSuite(judge, build, preflightInfo) {
  const tests = [];
  const caseResults = [];
  const testTimestamp = isoNow();

  async function test({ id, caseId, title, coverage, expected, execute }) {
    const startedAt = isoNow();
    try {
      const observed = await execute();
      const result = {
        id,
        caseId,
        title,
        result: '通過',
        coverage,
        source: '自動裁判層',
        expected,
        observed,
        startedAt,
        finishedAt: isoNow(),
      };
      tests.push(result);
      caseResults.push({
        caseId,
        formalStatus: coverage === 'complete' ? '通過' : '未測',
        observationResult: '通過',
        coverage,
        verificationSource: '自動裁判層',
        testId: id,
        expected,
        observed,
        testedAt: testTimestamp,
        reproduce: 'npm run qa:run',
      });
    } catch (error) {
      const message = formatError(error);
      const result = {
        id,
        caseId,
        title,
        result: '失敗',
        coverage,
        source: '自動裁判層',
        expected,
        observed: message,
        startedAt,
        finishedAt: isoNow(),
      };
      tests.push(result);
      caseResults.push({
        caseId,
        formalStatus: coverage === 'complete' ? '失敗' : '未測',
        observationResult: '失敗',
        coverage,
        verificationSource: '自動裁判層',
        testId: id,
        expected,
        observed: message,
        testedAt: testTimestamp,
        reproduce: 'npm run qa:run',
      });
    }
  }

  await test({
    id: 'AUTO-FOD-006A',
    caseId: 'QA-FOD-006A',
    title: '扣長與累計積分分離',
    coverage: 'complete',
    expected: '扣長只改目前節數；50 節扣 25、51 節依 GDD v25 先算 int(25.5)=25 後剩 26；吞食／總積分不倒扣。',
    execute: () => {
      const snake = new judge.SnakeEntity();
      snake.reset('score-snake', null);
      snake.length = 50;
      judge.SnakeMoveSystem.growByScoreDelta(snake, 10);
      assert.equal(snake.length, 51);
      assert.equal(snake.score, 10);
      assert.equal(snake.totalScore, 10);
      snake.length = 50;
      const lost = judge.SnakeMoveSystem.applyLengthPenalty(snake, 5000, 0);
      assert.equal(lost, 25);
      assert.equal(snake.length, 25);
      assert.equal(snake.score, 10);
      assert.equal(snake.totalScore, 10);
      judge.SnakeMoveSystem.growByScoreDelta(snake, 10);
      assert.equal(snake.length, 26);
      assert.equal(snake.score, 20);
      assert.equal(snake.totalScore, 20);
      snake.length = 51;
      const oddLost = judge.SnakeMoveSystem.applyLengthPenalty(snake, 5000, 0);
      assert.equal(oddLost, 25, `GDD v25 要求 51 節先扣 int(25.5)=25，實際扣除 ${oddLost}`);
      assert.equal(snake.length, 26, `GDD v25 要求 51-25=26，實際剩餘 ${snake.length}`);
      return '50 節扣至 25；51 節扣 25、剩 26；score/totalScore 不倒扣。';
    },
  });

  await test({
    id: 'AUTO-MOV-005',
    caseId: 'QA-MOV-005',
    title: '衝刺持按、速度與體力消耗裁判邏輯',
    coverage: 'partial',
    expected: '持按才進入衝刺；體力依每秒消耗並套用 Runtime 衝刺速度。體力環視覺另需 Cocos Runtime。',
    execute: () => {
      const { world, snake } = setupSnake(judge, 'dash-snake');
      const data = judge.SnakeGameStaticData.getInstance();
      const skill = new judge.SnakeSkillSystem();
      snake.staminaMax = data.STAMINA_MAX;
      snake.stamina = data.STAMINA_MAX;
      snake.dashHeld = true;
      skill.update(world, 1);
      assert.equal(snake.isDashing, true);
      assert.equal(snake.stamina, data.STAMINA_MAX - data.STAMINA_CONSUME_SPEED);
      assert.equal(snake.speed, data.BASE_SPEED * (1 + data.DASH_SPEED_BONUS / 100));
      snake.dashHeld = false;
      skill.update(world, 1);
      assert.equal(snake.isDashing, false);
      assert.equal(snake.speed, data.BASE_SPEED);
      return `持按 1 秒：體力 ${data.STAMINA_MAX}→${data.STAMINA_MAX - data.STAMINA_CONSUME_SPEED}，速度 ${data.BASE_SPEED}→${data.BASE_SPEED * (1 + data.DASH_SPEED_BONUS / 100)}；放開回基礎速度。`;
    },
  });

  await test({
    id: 'AUTO-MOV-006',
    caseId: 'QA-MOV-006',
    title: '體力耗盡、超載與回滿解除裁判邏輯',
    coverage: 'partial',
    expected: '耗盡當步進入超載、停止衝刺；回滿才解除超載。紅／黃體力環視覺另需 Cocos Runtime。',
    execute: () => {
      const { world, snake } = setupSnake(judge, 'overload-snake');
      const data = judge.SnakeGameStaticData.getInstance();
      const skill = new judge.SnakeSkillSystem();
      snake.staminaMax = data.STAMINA_MAX;
      snake.stamina = 1;
      snake.dashHeld = true;
      skill.update(world, 1);
      assert.equal(snake.stamina, 0);
      assert.equal(snake.isOverloaded, true);
      assert.equal(snake.isDashing, false);
      snake.dashHeld = false;
      skill.update(world, data.STAMINA_MAX / data.STAMINA_REGEN_SPEED);
      assert.equal(snake.stamina, data.STAMINA_MAX);
      assert.equal(snake.isOverloaded, false);
      return `體力 1→0 時進入超載並停衝；放開後依 ${data.STAMINA_REGEN_SPEED}/s 回滿 ${data.STAMINA_MAX} 才解除。`;
    },
  });

  await test({
    id: 'AUTO-MOV-007',
    caseId: 'QA-MOV-007',
    title: '暴食觸發與 CD 裁判邏輯',
    coverage: 'partial',
    expected: '首次觸發啟用暴食並進 30 秒 CD；CD 中不得再次裁判觸發。UI 遮罩／動畫另需實機。',
    execute: () => {
      const { world, snake } = setupSnake(judge, 'gluttony-snake');
      const skill = new judge.SnakeSkillSystem();
      snake.gluttonyQueued = true;
      skill.update(world, 0);
      assert.equal(snake.gluttonyActive, true);
      assert.equal(snake.gluttonyCooldown, 30000);
      snake.gluttonyQueued = true;
      skill.update(world, 0.1);
      assert.equal(snake.gluttonyActive, false);
      assert.equal(snake.gluttonyCooldown, 29900);
      snake.gluttonyQueued = false;
      skill.update(world, 29.9);
      assert.equal(snake.gluttonyCooldown, 0);
      return '首次觸發 30000ms CD；CD 中的再次佇列不啟用；CD 歸零後才可再次觸發。';
    },
  });

  await test({
    id: 'AUTO-MOV-008',
    caseId: 'QA-MOV-008',
    title: '基礎／暴食吸附半徑與表現參數',
    coverage: 'partial',
    expected: '基礎吸附 50px、暴食 200px；Runtime 表現參數可讀，並由規格差異檢查另行對照 GDD。動畫實際時長另需實機。',
    execute: () => {
      const { world, snake } = setupSnake(judge, 'suction-snake');
      const collision = new judge.SnakeCollisionSystem();
      world.spawnFood('outside-basic', judge.SnakeFoodType.Small, 51, 0, 1);
      collision.update(world, 0);
      assert.equal(world.collisionEvents.count, 0);
      snake.gluttonyActive = true;
      collision.update(world, 0);
      assert.equal(world.collisionEvents.count, 1);
      const data = judge.SnakeGameStaticData.getInstance();
      assert.equal(data.BASE_SUCTION_RADIUS, 50);
      assert.equal(data.GLUTTONY_RADIUS, 200);
      assert.ok(Number.isFinite(data.BASE_SUCTION_TRAVEL_TIME));
      assert.ok(Number.isFinite(data.MAGNET_SUCTION_TRAVEL_TIME));
      assert.ok(Number.isFinite(data.GLUTTONY_SUCTION_TRAVEL_TIME));
      return `51px 食物在基礎吸附外、暴食吸附內；Runtime 為 basic ${data.BASE_SUCTION_TRAVEL_TIME}ms／magnet ${data.MAGNET_SUCTION_TRAVEL_TIME}ms／gluttony ${data.GLUTTONY_SUCTION_TRAVEL_TIME}ms。`;
    },
  });

  await test({
    id: 'AUTO-COL-001',
    caseId: 'QA-COL-001',
    title: '邊界正面回彈、扣長與不扣分',
    coverage: 'complete',
    expected: '正面撞邊界反轉方向、扣目前長度 50%，不倒扣吞食積分或對局總積分。',
    execute: () => {
      const { world, snake } = setupSnake(judge, 'bounce-snake');
      snake.length = 50;
      snake.score = 40;
      snake.totalScore = 40;
      snake.speed = 160;
      snake.direction.x = 1;
      snake.direction.y = 0;
      snake.headPos.x = 1000;
      snake.trail.setHead(1000, 0);
      world.collisionEvents.pushBoundary(snake.id, 1, 0, -1, 0);
      new judge.SnakeBounceReactionSystem().update(world, 0);
      assert.equal(snake.direction.x, -1);
      assert.equal(snake.direction.y, 0);
      assert.equal(snake.length, 25);
      assert.equal(snake.score, 40);
      assert.equal(snake.totalScore, 40);
      assert.equal(world.pendingEvents.length, 1);
      return '方向 (1,0)→(-1,0)，長度 50→25，score/totalScore 均維持 40。';
    },
  });

  await test({
    id: 'AUTO-COL-002',
    caseId: 'QA-COL-002',
    title: '邊界斜角鏡射',
    coverage: 'complete',
    expected: '法線分量反轉、切線分量保留，不一律強制 180 度。',
    execute: () => {
      const out = { x: 0, y: 0 };
      judge.reflectDirection(out, 0.6, 0.8, -1, 0);
      closeTo(out.x, -0.6);
      closeTo(out.y, 0.8);
      return '入射 (0.6,0.8) 對右界法線 (-1,0) 反射為 (-0.6,0.8)。';
    },
  });

  await test({
    id: 'AUTO-COL-003',
    caseId: 'QA-COL-003',
    title: '回彈 350ms 鎖向與即時輸入恢復',
    coverage: 'complete',
    expected: '鎖向期間忽略轉向；時間歸零同一步採用目前輸入，不要求放開重推。',
    execute: () => {
      const { world, snake } = setupSnake(judge, 'lock-snake');
      snake.length = 50;
      snake.speed = 160;
      snake.direction.x = 1;
      snake.targetDirection.x = 1;
      snake.inputActive = true;
      snake.inputDir.x = 1;
      snake.headPos.x = 1000;
      snake.trail.setHead(1000, 0);
      world.collisionEvents.pushBoundary(snake.id, 1, 0, -1, 0);
      new judge.SnakeBounceReactionSystem().update(world, 0);
      assert.equal(snake.bounceLockRemainMs, 350);
      const move = new judge.SnakeMoveSystem();
      move.update(world, 0.1);
      assert.equal(snake.bounceLockRemainMs, 250);
      assert.equal(snake.targetDirection.x, -1);
      move.update(world, 0.25);
      assert.equal(snake.bounceLockRemainMs, 0);
      assert.equal(snake.targetDirection.x, 1);
      assert.equal(snake.direction.x, 1);
      return '350ms 內保持反射方向；歸零當步讀取仍持續的原方向輸入。';
    },
  });

  await test({
    id: 'AUTO-COL-004',
    caseId: 'QA-COL-004',
    title: '同邊界再觸發保護與最小長度',
    coverage: 'complete',
    expected: '未脫離碰撞緩衝區前不重複扣長，且可縮短至 0 節身體但不可為負。',
    execute: () => {
      const { world, snake } = setupSnake(judge, 'gate-snake');
      snake.length = 50;
      snake.direction.x = 1;
      snake.headPos.x = 1000;
      snake.trail.setHead(1000, 0);
      const reaction = new judge.SnakeBounceReactionSystem();
      world.collisionEvents.pushBoundary(snake.id, 1, 0, -1, 0);
      reaction.update(world, 0);
      assert.equal(snake.length, 25);
      world.pendingEvents.length = 0;
      world.collisionEvents.clear();
      world.collisionEvents.pushBoundary(snake.id, -1, 0, -1, 0);
      reaction.update(world, 0.05);
      assert.equal(snake.length, 25);
      assert.equal(world.pendingEvents.length, 0);
      snake.length = 1;
      const firstLoss = judge.SnakeMoveSystem.applyLengthPenalty(snake, 5000, 0);
      const secondLoss = judge.SnakeMoveSystem.applyLengthPenalty(snake, 5000, 0);
      assert.equal(firstLoss, 1);
      assert.equal(secondLoss, 0);
      assert.equal(snake.length, 0);
      return '同一面封鎖中第二次碰撞不扣長；1 節→0 節，後續不會出現負長度。';
    },
  });

  await test({
    id: 'AUTO-COL-005',
    caseId: 'QA-COL-005',
    title: '四角合成法線、場內反射與單次扣長',
    coverage: 'partial',
    expected: '四角碰撞皆產生有限方向並朝場內，單一角落事件只扣一次長度。不卡牆／不穿出仍需 Cocos Runtime 連續觀察。',
    execute: () => {
      const corners = [
        { name: '右上', x: 1001, y: 1001, dx: 1, dy: 1 },
        { name: '左上', x: -1001, y: 1001, dx: -1, dy: 1 },
        { name: '左下', x: -1001, y: -1001, dx: -1, dy: -1 },
        { name: '右下', x: 1001, y: -1001, dx: 1, dy: -1 },
      ];
      const observations = [];
      for (const corner of corners) {
        const { world, snake } = setupSnake(judge, `corner-${corner.name}`);
        const length = Math.hypot(corner.dx, corner.dy);
        snake.length = 50;
        snake.direction.x = corner.dx / length;
        snake.direction.y = corner.dy / length;
        snake.targetDirection.x = snake.direction.x;
        snake.targetDirection.y = snake.direction.y;
        snake.headPos.x = corner.x;
        snake.headPos.y = corner.y;
        snake.trail.setHead(corner.x, corner.y);
        new judge.SnakeCollisionSystem().update(world, 0);
        assert.equal(world.collisionEvents.count, 1, `${corner.name} 應合成一筆角落邊界事件`);
        new judge.SnakeBounceReactionSystem().update(world, 0);
        assert.ok(Number.isFinite(snake.direction.x) && Number.isFinite(snake.direction.y), `${corner.name} 方向不得 NaN`);
        assert.ok(snake.direction.x * corner.dx < 0 && snake.direction.y * corner.dy < 0, `${corner.name} 反射後必須朝場內`);
        assert.equal(snake.length, 25, `${corner.name} 不得雙扣長`);
        assert.equal(world.pendingEvents.length, 1, `${corner.name} 只應發出一次 bounce`);
        observations.push(`${corner.name} (${snake.direction.x.toFixed(3)},${snake.direction.y.toFixed(3)})`);
      }
      return `${observations.join('；')}；四角皆有限、朝場內且 50→25 單次扣長。`;
    },
  });

  const failed = tests.filter(test => test.result === '失敗').length;
  const completed = tests.filter(test => test.coverage === 'complete').length;
  return {
    tests,
    caseResults,
    summary: {
      total: tests.length,
      passed: tests.length - failed,
      failed,
      completeCoverage: completed,
      partialCoverage: tests.length - completed,
      notionCardCount: preflightInfo.cardCount,
    },
  };
}

function gddModuleValue(content, parameter) {
  const escaped = parameter.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const match = content.match(new RegExp(`\\|\\s*${escaped}\\s*\\|\\s*(-?\\d+(?:\\.\\d+)?)\\s*\\|`));
  return match ? Number(match[1]) : null;
}

function buildSpecFindings(judge, gddContent) {
  const data = judge.SnakeGameStaticData.getInstance();
  const comparisons = [
    { id: 'BASE-SPEED', parameter: 'BaseMoveSpeed', runtimeKey: 'BASE_SPEED', toRuntime: value => value / 100, describeGdd: (raw, expected) => `raw ${raw}（0.01 px/s＝${expected}px/s）`, runtimeUnit: 'px/s' },
    { id: 'DASH-SPEED', parameter: 'DashSpeedFactor', runtimeKey: 'DASH_SPEED_BONUS', toRuntime: value => value / 100, describeGdd: (raw, expected) => `raw ${raw}（萬分比＝${expected}%）`, runtimeUnit: '%' },
    { id: 'BASE-SUCTION', parameter: 'BaseSuctionTravelTime', runtimeKey: 'BASE_SUCTION_TRAVEL_TIME', toRuntime: value => value, describeGdd: raw => `${raw}ms`, runtimeUnit: 'ms' },
    { id: 'MAGNET-SUCTION', parameter: 'MagnetSuctionTravelTime', runtimeKey: 'MAGNET_SUCTION_TRAVEL_TIME', toRuntime: value => value, describeGdd: raw => `${raw}ms`, runtimeUnit: 'ms' },
    { id: 'GLUTTONY-SUCTION', parameter: 'GluttonySuctionTravelTime', runtimeKey: 'GLUTTONY_SUCTION_TRAVEL_TIME', toRuntime: value => value, describeGdd: raw => `${raw}ms`, runtimeUnit: 'ms' },
  ];
  return comparisons.flatMap(({ id, parameter, runtimeKey, toRuntime, describeGdd, runtimeUnit }) => {
    const gddValue = gddModuleValue(gddContent, parameter);
    const expected = gddValue === null ? null : toRuntime(gddValue);
    const actual = data[runtimeKey];
    if (expected === actual) return [];
    return [{
      id: `SPEC-${id}`,
      severity: '規格待同步',
      source: `GDD Ch16.1 ${parameter} 對照 Runtime StaticData.${runtimeKey}`,
      title: expected === null ? `${parameter}：GDD 數值無法解析` : `${parameter}：GDD ${describeGdd(gddValue, expected)}、Runtime ${actual}${runtimeUnit}`,
      detail: expected === null
        ? `本輪已讀取 GDD，但無法從 Ch16.1 解析 ${parameter}；不得假設 Runtime ${actual}${runtimeUnit} 已對齊。`
        : `GDD 與 Runtime 不一致；完成同步並重跑 QA 前，不得判定 GDD 對齊。`,
    }];
  });
}

async function makeBlockedReport(error, gdd = null) {
  const report = {
    schemaVersion: 3,
    runId: runId(),
    status: 'blocked',
    startedAt: isoNow(),
    finishedAt: isoNow(),
    runner: 'Snake Cocos background logic runner',
    mode: '自動裁判層',
    message: formatError(error),
    blockers: error instanceof PreflightBlockedError ? error.blockers : [{ type: 'blocked-env', message: formatError(error) }],
    latestRunPreserved: true,
    latestRunPath: relativeToRoot(LATEST_RUN_PATH),
    gdd,
    tests: [],
    caseResults: [],
    specFindings: [],
    summary: { total: 0, passed: 0, failed: 0, completeCoverage: 0, partialCoverage: 0 },
  };
  const artifacts = await writeRunArtifacts(report);
  return { report, artifacts };
}

async function main() {
  let snapshot;
  let gdd;
  try {
    gdd = await readGdd();
    if (process.argv.includes('--gdd-preflight-only')) {
      console.log(JSON.stringify(gdd.info, null, 2));
      return;
    }
    snapshot = await readJson(SNAPSHOT_PATH);
    const preflightInfo = preflight(snapshot, {
      requireFresh: !DIAGNOSTIC_LOGIC_ONLY,
      requireDeliveryMetadata: !DIAGNOSTIC_LOGIC_ONLY,
    });
    const buildBefore = await externalBuildInfo();
    if (!buildBefore.clean) {
      throw new PreflightBlockedError('外包 Cocos 專案在背景測試前不是乾淨狀態，停止讀取式 runner', [{
        type: 'blocked-env',
        owner: '外包 checkout owner',
        missingItems: ['乾淨且可追溯的唯讀 checkout'],
        statusPorcelain: buildBefore.statusPorcelain,
        reentryCondition: '由 checkout owner 確認既有變更來源；不得由 QA runner 清理',
      }]);
    }
    const judge = await loadJudgeLayer();
    const suite = await runSuite(judge, buildBefore, preflightInfo);
    const specFindings = buildSpecFindings(judge, gdd.content);
    const buildAfter = await externalBuildInfo();
    const buildStable = buildBefore.branch === buildAfter.branch
      && buildBefore.commit === buildAfter.commit
      && JSON.stringify(buildBefore.statusPorcelain) === JSON.stringify(buildAfter.statusPorcelain);
    if (!buildStable || !buildAfter.clean) {
      throw new PreflightBlockedError('外包 Cocos 專案在背景測試前後狀態不一致，停止發布', [{
        type: 'blocked-env',
        owner: '外包 checkout owner',
        before: buildBefore,
        after: buildAfter,
        reentryCondition: '確認造成 tracked/untracked 變動的來源後，以乾淨唯讀 checkout 重跑',
      }]);
    }
    const hasFailure = suite.summary.failed > 0 || specFindings.length > 0;
    const report = {
      schemaVersion: 3,
      runId: runId(),
      status: DIAGNOSTIC_LOGIC_ONLY
        ? (hasFailure ? 'diagnostic-failed' : 'diagnostic-completed')
        : (hasFailure ? 'failed' : 'completed'),
      startedAt: isoNow(),
      finishedAt: isoNow(),
      runner: 'Snake Cocos background logic runner',
      mode: DIAGNOSTIC_LOGIC_ONLY ? '背景 code-level 診斷' : '自動裁判層',
      scope: 'cc-free 裁判層；不含 Cocos Editor、HUD 視覺、輸入裝置或動畫實機。',
      formalPublication: !DIAGNOSTIC_LOGIC_ONLY,
      gdd: gdd.info,
      preflight: preflightInfo,
      notion: {
        source: snapshot.source,
        sourceUrl: snapshot.sourceUrl,
        snapshotId: snapshot.snapshotId,
        syncedAt: snapshot.syncedAt,
        cards: snapshot.cards,
      },
      build: {
        projectPath: buildBefore.projectPath,
        branch: buildBefore.branch,
        commit: buildBefore.commit,
        cleanBefore: buildBefore.clean,
        cleanAfter: buildAfter.clean,
        statusBefore: buildBefore.statusPorcelain,
        statusAfter: buildAfter.statusPorcelain,
        readOnly: true,
      },
      tests: suite.tests,
      caseResults: suite.caseResults,
      specFindings,
      summary: suite.summary,
    };
    const artifacts = await writeRunArtifacts(report);
    if (DIAGNOSTIC_LOGIC_ONLY) {
      await publishLatest(report, artifacts, LATEST_DIAGNOSTIC_PATH, '__SNAKE_QA_LATEST_DIAGNOSTIC__');
    } else {
      await publishLatest(report, artifacts);
    }
    console.log(JSON.stringify({ runId: report.runId, status: report.status, summary: report.summary, artifacts }, null, 2));
    if (hasFailure) {
      process.exitCode = 1;
    }
  } catch (error) {
    const { report, artifacts } = await makeBlockedReport(error, gdd?.info || null);
    console.error(`[QA blocked] ${report.message}`);
    console.error(JSON.stringify({ runId: report.runId, latestRunPreserved: true, artifacts }, null, 2));
    process.exitCode = 2;
  }
}

await main();
