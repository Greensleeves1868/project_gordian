// src/app/api/dashboard/route.ts
import { NextRequest, NextResponse } from 'next/server';
import type { RoomResource } from '@/types/roomResource';
import {
  createServerSupabaseClient,
  getAccessToken,
  unauthorizedResponse,
  badRequestResponse,
  serverErrorResponse,
} from '@/lib/supabaseServer';
import { PLAN_LIMITS } from '@/lib/planLimits';

// ユーザーのセッション数を取得するヘルパー関数
async function getSessionCount(supabase: ReturnType<typeof createServerSupabaseClient>, userId: string): Promise<number> {
  // session_idでグループ化してユニークなセッション数をカウント
  const { data, error } = await supabase
    .from('resources')
    .select('session_id')
    .eq('user_id', userId)
    .not('session_id', 'is', null);

  if (error) {
    console.error('セッション数取得エラー:', error.message);
    return 0;
  }

  // ユニークなsession_idをカウント
  const uniqueSessionIds = new Set(data?.map(r => r.session_id) || []);
  
  // session_idがないリソース（スタンドアロン）もカウント
  const { count: standaloneCount } = await supabase
    .from('resources')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', userId)
    .is('session_id', null);

  return uniqueSessionIds.size + (standaloneCount || 0);
}

// GET: リソース一覧を取得
export async function GET(request: NextRequest) {
  try {
    const accessToken = getAccessToken(request);
    if (!accessToken) {
      return unauthorizedResponse();
    }

    const supabase = createServerSupabaseClient(accessToken);
    
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return unauthorizedResponse('認証に失敗しました');
    }

    const { data, error } = await supabase
      .from('resources')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('リソース取得エラー:', error.message);
      return serverErrorResponse('リソースの取得に失敗しました');
    }

    // セッション数も返す
    const sessionCount = await getSessionCount(supabase, user.id);

    return NextResponse.json({ 
      data,
      meta: {
        sessionCount,
        maxSessions: PLAN_LIMITS.FREE.maxSessions,
      }
    });
  } catch (error) {
    console.error('予期しないエラー:', error);
    return serverErrorResponse();
  }
}

// POST: リソースを保存
export async function POST(request: NextRequest) {
  try {
    const accessToken = getAccessToken(request);
    if (!accessToken) {
      return unauthorizedResponse();
    }

    const supabase = createServerSupabaseClient(accessToken);
    
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return unauthorizedResponse('認証に失敗しました');
    }

    const body = await request.json();
    const { type, name, value, session_id } = body as Pick<RoomResource, 'type' | 'name' | 'value' | 'session_id'>;

    if (!type || !value) {
      return badRequestResponse('type と value は必須です');
    }

    // 新しいセッションを作成する場合、セッション数の制限をチェック
    if (session_id) {
      // このsession_idが既存かどうかチェック
      const { data: existingSession } = await supabase
        .from('resources')
        .select('id')
        .eq('user_id', user.id)
        .eq('session_id', session_id)
        .limit(1);

      // 新しいセッションの場合
      if (!existingSession || existingSession.length === 0) {
        const sessionCount = await getSessionCount(supabase, user.id);
        if (sessionCount >= PLAN_LIMITS.FREE.maxSessions) {
          return NextResponse.json(
            { 
              error: `セッション数が上限（${PLAN_LIMITS.FREE.maxSessions}件）に達しています`,
              code: 'SESSION_LIMIT_EXCEEDED'
            },
            { status: 403 }
          );
        }
      }
    } else {
      // session_idなし（スタンドアロン）の場合もセッション数としてカウント
      const sessionCount = await getSessionCount(supabase, user.id);
      if (sessionCount >= PLAN_LIMITS.FREE.maxSessions) {
        return NextResponse.json(
          { 
            error: `セッション数が上限（${PLAN_LIMITS.FREE.maxSessions}件）に達しています`,
            code: 'SESSION_LIMIT_EXCEEDED'
          },
          { status: 403 }
        );
      }
    }

    const { data, error } = await supabase
      .from('resources')
      .insert([{
        user_id: user.id,
        type,
        name: name || null,
        value,
        session_id: session_id || null,
      }])
      .select()
      .single();

    if (error) {
      console.error('リソース保存エラー:', error.message);
      return serverErrorResponse('リソースの保存に失敗しました');
    }

    return NextResponse.json({ data }, { status: 201 });
  } catch (error) {
    console.error('予期しないエラー:', error);
    return serverErrorResponse();
  }
}

// DELETE: セッション（リソース）を削除
export async function DELETE(request: NextRequest) {
  try {
    const accessToken = getAccessToken(request);
    if (!accessToken) {
      return unauthorizedResponse();
    }

    const supabase = createServerSupabaseClient(accessToken);
    
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return unauthorizedResponse('認証に失敗しました');
    }

    const { searchParams } = new URL(request.url);
    const sessionId = searchParams.get('session_id');
    const resourceId = searchParams.get('resource_id');

    if (!sessionId && !resourceId) {
      return badRequestResponse('session_id または resource_id が必要です');
    }

    let query = supabase
      .from('resources')
      .delete()
      .eq('user_id', user.id);

    if (sessionId) {
      query = query.eq('session_id', sessionId);
    } else if (resourceId) {
      query = query.eq('id', resourceId);
    }

    const { error } = await query;

    if (error) {
      console.error('リソース削除エラー:', error.message);
      return serverErrorResponse('リソースの削除に失敗しました');
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('予期しないエラー:', error);
    return serverErrorResponse();
  }
}
