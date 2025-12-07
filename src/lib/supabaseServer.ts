// src/lib/supabaseServer.ts
// サーバーサイドAPI用の共通ヘルパー

import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

/**
 * サーバーサイド用のSupabaseクライアントを作成
 * ユーザーのアクセストークンを使用してRLSを適用
 */
export function createServerSupabaseClient(accessToken: string) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
  
  return createClient(supabaseUrl, supabaseAnonKey, {
    global: {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    },
  });
}

/**
 * リクエストヘッダーから認証トークンを取得
 */
export function getAccessToken(request: NextRequest): string | null {
  const authHeader = request.headers.get('Authorization');
  if (!authHeader?.startsWith('Bearer ')) {
    return null;
  }
  return authHeader.slice(7);
}

/**
 * 認証エラーレスポンスを返す
 */
export function unauthorizedResponse(message = '認証が必要です') {
  return NextResponse.json({ error: message }, { status: 401 });
}

/**
 * バリデーションエラーレスポンスを返す
 */
export function badRequestResponse(message: string) {
  return NextResponse.json({ error: message }, { status: 400 });
}

/**
 * サーバーエラーレスポンスを返す
 */
export function serverErrorResponse(message = 'サーバーエラーが発生しました') {
  return NextResponse.json({ error: message }, { status: 500 });
}

