"use client";
import { useEffect, useState, useCallback } from "react";
import type { User } from "@/types/user";
import type { Post } from "@/types/post";
import { supabase } from "@/lib/supabaseClient";

export default function DiaryPage() {
  // --- 状態管理 ---
  const [user, setUser] = useState<User | null>(null);
  const [content, setContent] = useState("");
  const [posts, setPosts] = useState<Post[]>([]);

  // --- 認証チェック ---
  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) {
        window.location.href = "/login";
      } else {
        setUser({ id: user.id, email: user.email ?? null });
        fetchPosts();
      }
    });
  }, []);

  // --- 投稿取得 ---
  const fetchPosts = useCallback(async () => {
    const { data } = (await supabase
      .from("posts")
      .select("*")
      .order("created_at", { ascending: false })
      .throwOnError()) as { data: Post[] | null };

    setPosts(data || []);
  }, []);

  // --- 投稿処理 ---
  const handlePost = async () => {
    if (!content) return;
    await supabase.from("posts").insert([{ content, user_id: user!.id }]);
    setContent("");
    fetchPosts();
  };

  // --- UI ---
  return (
    <div>
      <h2>ようこそ</h2>
      {/* 投稿フォーム */}
      <div>
        <textarea 
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="今日の出来事を書いてみよう"
        />
        <button onClick={handlePost} disabled={!content}>
          投稿
        </button>
      </div>
      {/* 投稿一覧 */}
      <ul>
        {posts.map((p) => (
          <li key={p.id}>
            <p>{p.content}</p>
            <p>{new Date(p.created_at).toLocaleString()}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}