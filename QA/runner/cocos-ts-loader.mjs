/**
 * 讓 Node 的 TypeScript transform 能唯讀載入 Cocos 專案中省略副檔名的相對匯入。
 *
 * Cocos 原始碼仍留在外包目錄；此 loader 不轉寫、不複製、不快取該專案任何檔案。
 */
import { extname } from 'node:path';

const CANDIDATE_SUFFIXES = ['.ts', '.tsx', '.js', '.mjs', '/index.ts'];

export async function resolve(specifier, context, nextResolve) {
  try {
    return await nextResolve(specifier, context);
  } catch (error) {
    const isRelative = specifier.startsWith('.') || specifier.startsWith('/');
    if (!isRelative || extname(specifier)) {
      throw error;
    }

    for (const suffix of CANDIDATE_SUFFIXES) {
      try {
        const candidate = new URL(`${specifier}${suffix}`, context.parentURL).href;
        return await nextResolve(candidate, context);
      } catch {
        // 試下一個常見副檔名；最終仍由原始錯誤中止。
      }
    }
    throw error;
  }
}
