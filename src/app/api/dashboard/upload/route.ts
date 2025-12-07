// src/app/api/dashboard/upload/route.ts
import { NextRequest, NextResponse } from 'next/server';
import {
  createServerSupabaseClient,
  getAccessToken,
  unauthorizedResponse,
  badRequestResponse,
  serverErrorResponse,
} from '@/lib/supabaseServer';
import { PLAN_LIMITS, formatFileSize } from '@/lib/planLimits';

// ファイルタイプを判定するヘルパー関数
function getResourceType(mimeType: string): 'image' | 'pdf' | 'other_url' {
  if (mimeType.startsWith('image/')) {
    return 'image';
  }
  if (mimeType === 'application/pdf') {
    return 'pdf';
  }
  return 'other_url';
}

// ユーザーのセッション数を取得するヘルパー関数
async function getSessionCount(supabase: ReturnType<typeof createServerSupabaseClient>, userId: string): Promise<number> {
  const { data, error } = await supabase
    .from('resources')
    .select('session_id')
    .eq('user_id', userId)
    .not('session_id', 'is', null);

  if (error) {
    console.error('セッション数取得エラー:', error.message);
    return 0;
  }

  const uniqueSessionIds = new Set(data?.map(r => r.session_id) || []);
  
  const { count: standaloneCount } = await supabase
    .from('resources')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', userId)
    .is('session_id', null);

  return uniqueSessionIds.size + (standaloneCount || 0);
}

// POST: ファイルをアップロード
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

    const formData = await request.formData();
    const file = formData.get('file') as File | null;
    const resourceName = formData.get('name') as string | null;
    const sessionId = formData.get('session_id') as string | null;

    if (!file) {
      return badRequestResponse('ファイルが選択されていません');
    }

    // ファイルサイズの制限チェック
    if (file.size > PLAN_LIMITS.FREE.maxFileSizeBytes) {
      return NextResponse.json(
        { 
          error: `ファイルサイズが上限（${PLAN_LIMITS.FREE.maxFileSizeDisplay}）を超えています。選択されたファイル: ${formatFileSize(file.size)}`,
          code: 'FILE_SIZE_EXCEEDED'
        },
        { status: 413 }
      );
    }

    // セッション数の制限チェック（新しいセッションの場合）
    if (sessionId) {
      const { data: existingSession } = await supabase
        .from('resources')
        .select('id')
        .eq('user_id', user.id)
        .eq('session_id', sessionId)
        .limit(1);

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

    // ファイル名を生成
    const fileExtension = file.name.split('.').pop();
    const fileName = `${crypto.randomUUID()}_${Date.now()}.${fileExtension}`;
    const filePath = `${user.id}/${fileName}`;

    // ファイルをバッファに変換
    const arrayBuffer = await file.arrayBuffer();
    const buffer = new Uint8Array(arrayBuffer);

    // Supabase Storageにアップロード
    const { error: uploadError } = await supabase.storage
      .from('room-resources')
      .upload(filePath, buffer, {
        contentType: file.type,
        cacheControl: '3600',
        upsert: false,
      });

    if (uploadError) {
      console.error('ファイルアップロードエラー:', uploadError.message);
      return serverErrorResponse('ファイルのアップロードに失敗しました');
    }

    // 公開URLを取得
    const { data: publicUrlData } = supabase.storage
      .from('room-resources')
      .getPublicUrl(filePath);

    if (!publicUrlData?.publicUrl) {
      return serverErrorResponse('ファイルの公開URLを取得できませんでした');
    }

    // リソースタイプを判定
    const resourceType = getResourceType(file.type);

    // データベースにリソース情報を保存
    const { data, error: insertError } = await supabase
      .from('resources')
      .insert([{
        user_id: user.id,
        type: resourceType,
        name: resourceName || file.name,
        value: publicUrlData.publicUrl,
        session_id: sessionId || null,
      }])
      .select()
      .single();

    if (insertError) {
      console.error('リソース保存エラー:', insertError.message);
      return serverErrorResponse('リソース情報の保存に失敗しました');
    }

    return NextResponse.json({ data }, { status: 201 });
  } catch (error) {
    console.error('予期しないエラー:', error);
    return serverErrorResponse();
  }
}
