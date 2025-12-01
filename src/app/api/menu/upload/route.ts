// src/app/api/menu/upload/route.ts
import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

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

// POST: ファイルをアップロード
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

    // FormDataを取得
    const formData = await request.formData();
    const file = formData.get('file') as File | null;
    const resourceName = formData.get('name') as string | null;

    if (!file) {
      return NextResponse.json(
        { error: 'ファイルが選択されていません' },
        { status: 400 }
      );
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
      return NextResponse.json(
        { error: 'ファイルのアップロードに失敗しました' },
        { status: 500 }
      );
    }

    // 公開URLを取得
    const { data: publicUrlData } = supabase.storage
      .from('room-resources')
      .getPublicUrl(filePath);

    if (!publicUrlData?.publicUrl) {
      return NextResponse.json(
        { error: 'ファイルの公開URLを取得できませんでした' },
        { status: 500 }
      );
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
      }])
      .select()
      .single();

    if (insertError) {
      console.error('リソース保存エラー:', insertError.message);
      return NextResponse.json(
        { error: 'リソース情報の保存に失敗しました' },
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

