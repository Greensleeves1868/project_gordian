// src/app/api/contact/route.ts
import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

// サーバーサイド用のSupabaseクライアント（認証なし）
function createSupabaseClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
  
  return createClient(supabaseUrl, supabaseServiceKey);
}

// POST: お問い合わせを保存
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, type, message } = body;

    // バリデーション
    if (!name || !email || !message) {
      return NextResponse.json(
        { error: 'お名前、メールアドレス、お問い合わせ内容は必須です' },
        { status: 400 }
      );
    }

    // メールアドレスの簡易バリデーション
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: '有効なメールアドレスを入力してください' },
        { status: 400 }
      );
    }

    const supabase = createSupabaseClient();

    // お問い合わせを保存
    const { data, error } = await supabase
      .from('contacts')
      .insert([{
        name,
        email,
        type: type || 'general',
        message,
        status: 'pending', // 未対応
      }])
      .select()
      .single();

    if (error) {
      console.error('お問い合わせ保存エラー:', error.message, error.code, error.details);
      return NextResponse.json(
        { error: `お問い合わせの送信に失敗しました: ${error.message}` },
        { status: 500 }
      );
    }

    return NextResponse.json({ data, success: true }, { status: 201 });
  } catch (error) {
    console.error('予期しないエラー:', error);
    return NextResponse.json(
      { error: 'サーバーエラーが発生しました' },
      { status: 500 }
    );
  }
}

