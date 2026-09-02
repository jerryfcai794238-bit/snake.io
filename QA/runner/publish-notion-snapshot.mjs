/** 將最新 Notion JSON 快照轉成可由 file:// 儀表板直接載入的資料資產。 */
import { readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..');
const inputPath = path.join(ROOT, 'QA', 'data', 'notion-schedule-latest.json');
const outputPath = path.join(ROOT, 'QA', 'data', 'notion-schedule-latest.js');

const snapshot = JSON.parse(await readFile(inputPath, 'utf8'));
if (snapshot.source !== 'Notion' || !Array.isArray(snapshot.cards)) {
  throw new Error('Notion 快照格式不正確；拒絕發布至儀表板。');
}

const output = [
  "'use strict';",
  `window.__SNAKE_QA_NOTION_SNAPSHOT__ = Object.freeze(${JSON.stringify(snapshot, null, 2)});`,
  '',
].join('\n');
await writeFile(outputPath, output, 'utf8');
console.log(`已發布 Notion 快照：${snapshot.snapshotId}（${snapshot.cards.length} 張工作卡）`);
