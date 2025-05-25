"use client";
import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email) return;
    setLoading(true);
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: `${location.origin}/pages/menu` },
    });
    setLoading(false);
    if (error) alert(error.message);
    else alert("メールを確認してください！");
  };

  return (
    <div>
      <h1>ログイン or 新規登録</h1>
      <input 
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="you@example.com"
      />
      <button onClick={handleLogin}>
        {loading ? "送信中..." : "メールでログインリンク送信"}
      </button>
    </div>
  );
}
