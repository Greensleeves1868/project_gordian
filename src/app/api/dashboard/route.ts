// src/app/api/dashboard/route.ts
import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';
import type { RoomResource } from '@/types/roomResource';

// サーバーサイド用のSupabaseクライアントを作成
function createServerSupabaseClient(accessToken: string) {
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

// 認証トークンを取得するヘルパー関数
function getAccessToken(request: NextRequest): string | null {
  const authHeader = request.headers.get('Authorization');
  if (!authHeader?.startsWith('Bearer ')) {
    return null;
  }
  return authHeader.slice(7);
}

// GET: リソース一覧を取得
export async function GET(request: NextRequest) {
  try {
    const accessToken = getAccessToken(request);
    if (!accessToken) {
      return NextResponse.json(
        { error: '認証が必要です' },
        { status: 401 }
      );
    }

    const supabase = createServerSupabaseClient(accessToken);
    
    // トークンからユーザー情報を取得
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json(
        { error: '認証に失敗しました' },
        { status: 401 }
      );
    }

    // リソースを取得
    const { data, error } = await supabase
      .from('resources')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('リソース取得エラー:', error.message);
      return NextResponse.json(
        { error: 'リソースの取得に失敗しました' },
        { status: 500 }
      );
    }

    return NextResponse.json({ data });
  } catch (error) {
    console.error('予期しないエラー:', error);
    return NextResponse.json(
      { error: 'サーバーエラーが発生しました' },
      { status: 500 }
    );
  }
}

// POST: リソースを保存
export async function POST(request: NextRequest) {
  try {
    const accessToken = getAccessToken(request);
    if (!accessToken) {
      return NextResponse.json(
        { error: '認証が必要です' },
        { status: 401 }
      );
    }

    const supabase = createServerSupabaseClient(accessToken);
    
    // トークンからユーザー情報を取得
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json(
        { error: '認証に失敗しました' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { type, name, value, session_id } = body as Pick<RoomResource, 'type' | 'name' | 'value' | 'session_id'>;

    // バリデーション
    if (!type || !value) {
      return NextResponse.json(
        { error: 'type と value は必須です' },
        { status: 400 }
      );
    }

    // リソースを保存
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
      return NextResponse.json(
        { error: 'リソースの保存に失敗しました' },
        { status: 500 }
      );
    }

    return NextResponse.json({ data }, { status: 201 });
  } catch (error) {
    console.error('予期しないエラー:', error);
    return NextResponse.json(
      { error: 'サーバーエラーが発生しました' },
      { status: 500 }
    );
  }
}

// DELETE: セッション（リソース）を削除
export async function DELETE(request: NextRequest) {
  try {
    const accessToken = getAccessToken(request);
    if (!accessToken) {
      return NextResponse.json(
        { error: '認証が必要です' },
        { status: 401 }
      );
    }

    const supabase = createServerSupabaseClient(accessToken);
    
    // トークンからユーザー情報を取得
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json(
        { error: '認証に失敗しました' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const sessionId = searchParams.get('session_id');
    const resourceId = searchParams.get('resource_id');

    if (!sessionId && !resourceId) {
      return NextResponse.json(
        { error: 'session_id または resource_id が必要です' },
        { status: 400 }
      );
    }

    let query = supabase
      .from('resources')
      .delete()
      .eq('user_id', user.id);

    // session_idがある場合は、そのセッションに属するすべてのリソースを削除
    if (sessionId) {
      query = query.eq('session_id', sessionId);
    } else if (resourceId) {
      // resource_idの場合は単一リソースを削除
      query = query.eq('id', resourceId);
    }

    const { error } = await query;

    if (error) {
      console.error('リソース削除エラー:', error.message);
      return NextResponse.json(
        { error: 'リソースの削除に失敗しました' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('予期しないエラー:', error);
    return NextResponse.json(
      { error: 'サーバーエラーが発生しました' },
      { status: 500 }
    );
  }
}
