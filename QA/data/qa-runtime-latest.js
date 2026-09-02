'use strict';
{
  const blockedCaseIds = [
    'QA-FLW-001',
    'QA-FLW-005',
    'QA-FLW-006',
    'QA-FLW-012',
    'QA-MOV-001',
    'QA-MOV-005',
    'QA-MOV-006',
    'QA-MOV-007',
    'QA-MOV-008',
    'QA-MOV-012',
    'QA-COL-005',
  ];
  const blockedReason = 'Windows Computer Use helper 持續回覆「Computer Use helper already has an active request」；依技能補救上限熔斷，未啟動或操作 Cocos，故不得沿用先前觀察判定通過。';
  window.__SNAKE_QA_RUNTIME_LATEST__ = Object.freeze({
    schemaVersion: 1,
    runId: 'cocos-runtime-20260820T111000Z',
    status: 'blocked-env',
    startedAt: '2026-08-20T11:06:00.000Z',
    finishedAt: '2026-08-20T11:10:00.395Z',
    mode: 'Cocos Creator Runtime attempt',
    verificationSource: '真正 Cocos Runtime（環境阻塞，未進入 Editor）',
    message: blockedReason,
    gdd: {
      path: 'GDD/貪食蛇GDD.md',
      version: '25',
      sha256: 'f66f01652e6ce11c6903a164ceb94d7064d81ce7793e01b76caa7994af355023',
    },
    build: {
      projectPath: 'D:\\OLD-RD3\\partygo-client-snake-os',
      branch: 'dev',
      commit: 'f7d4007f060a846d0963b8caf2d5cc8c7fe4bd4f',
      cleanBefore: true,
      cleanAfter: true,
      readOnly: true,
    },
    caseResults: blockedCaseIds.map(caseId => ({
      caseId,
      executionResult: 'blocked-during-test',
      result: '環境阻塞',
      verificationSource: 'Cocos Runtime attempt',
      observed: blockedReason,
      evidence: 'QA/evidence/cocos-runtime/cocos-runtime-20260820T111000Z.json',
      testedAt: '2026-08-20T11:10:00.395Z',
    })),
    codeScanResults: [
      {
        id: 'CODE-INPUT-001',
        caseIds: ['QA-MOV-001', 'QA-MOV-005', 'QA-MOV-007'],
        result: '通過',
        verificationSource: '靜態 code scan',
        observed: 'SnakeKeyboardInput.ts 明確採 WASD；數字 1 為 held 衝刺、數字 2 為首次 KEY_DOWN 單次暴食；NUM_0~9 正規化為 DIGIT_0~9。',
      },
      {
        id: 'CODE-MOV-012',
        caseIds: ['QA-MOV-012'],
        result: '通過',
        verificationSource: '靜態 code scan',
        observed: 'sparringSnakeCount 可追加陪練 AI；SnakeHudUI 只依 localPlayerId 尋找本地蛇並驅動唯一體力環。這是接線證據，不是 Cocos Runtime 通過。',
      },
      {
        id: 'CODE-FLW-012',
        caseIds: ['QA-FLW-012'],
        result: '風險',
        verificationSource: '靜態 code scan',
        observed: 'Fake CommonUI 的結果 action callback 呼叫 btnBackCallback，而未呼叫 actionCallback；需在 Cocos Runtime 精確確認「再玩一局」實際去向。',
      },
      {
        id: 'CODE-SPEC-ALIGN',
        caseIds: ['QA-MOV-003', 'QA-MOV-004', 'QA-MOV-008'],
        result: '規格差異',
        verificationSource: 'GDD／Runtime 靜態對照',
        observed: 'GDD v25：BaseMoveSpeed 4000（40px/s）、DashSpeedFactor 2500（25%）、吸附 450/400/350ms；Runtime：160px/s、50%、300/200/350ms。',
      },
    ],
    evidencePath: 'QA/evidence/cocos-runtime/cocos-runtime-20260820T111000Z.json',
  });
}
