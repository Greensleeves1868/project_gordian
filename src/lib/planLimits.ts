// src/lib/planLimits.ts
// フリープランの制限値

export const PLAN_LIMITS = {
  FREE: {
    // セッション数の上限
    maxSessions: 10,
    // ファイルサイズの上限（バイト）
    maxFileSizeBytes: 100 * 1024 * 1024, // 100MB
    // ファイルサイズの上限（表示用）
    maxFileSizeDisplay: '100MB',
  },
} as const;

// ファイルサイズをフォーマットする関数
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

// ファイルサイズが制限内かチェックする関数
export function isFileSizeValid(fileSizeBytes: number): boolean {
  return fileSizeBytes <= PLAN_LIMITS.FREE.maxFileSizeBytes;
}

// セッション数が制限内かチェックする関数
export function canCreateSession(currentSessionCount: number): boolean {
  return currentSessionCount < PLAN_LIMITS.FREE.maxSessions;
}

