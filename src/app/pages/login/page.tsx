"use client";

import { useState } from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
  Alert,
  InputAdornment,
  CircularProgress,
} from '@mui/material';
import EmailIcon from '@mui/icons-material/Email';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { supabase } from "@/lib/supabaseClient";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async () => {
    if (!email) return;
    setLoading(true);
    setError(null);
    setSuccess(false);
    
    const { error: authError } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: `${location.origin}/pages/menu` },
    });
    
    setLoading(false);
    
    if (authError) {
      setError(authError.message);
    } else {
      setSuccess(true);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !loading) {
      handleLogin();
    }
  };

  return (
    <Box>
      {/* タイトル */}
      <Typography
        variant="h6"
        component="h2"
        align="center"
        sx={{
          fontFamily: '"Cinzel", serif',
          color: 'text.primary',
          mb: 3,
        }}
      >
        冒険を始める
      </Typography>

      {/* エラー表示 */}
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {success ? (
        /* 成功メッセージ */
        <Alert
          severity="success"
          icon={<CheckCircleIcon />}
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'center',
            py: 3,
          }}
        >
          <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 1 }}>
            メールを送信しました！
          </Typography>
          <Typography variant="body2" color="text.secondary">
            メールボックスを確認して、リンクをクリックしてください。
          </Typography>
        </Alert>
      ) : (
        /* ログインフォーム */
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {/* メール入力 */}
          <TextField
            fullWidth
            type="email"
            label="メールアドレス"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={loading}
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <EmailIcon sx={{ color: 'text.secondary' }} />
                  </InputAdornment>
                ),
              },
            }}
          />

          {/* 送信ボタン */}
          <Button
            variant="contained"
            size="large"
            onClick={handleLogin}
            disabled={loading || !email}
            endIcon={loading ? <CircularProgress size={20} color="inherit" /> : <ArrowForwardIcon />}
            sx={{ py: 1.5 }}
          >
            {loading ? "送信中..." : "マジックリンクを送信"}
          </Button>

          {/* 説明テキスト */}
          <Typography variant="caption" color="text.secondary" align="center">
            パスワード不要！メールに届くリンクからログインできます。
          </Typography>
        </Box>
      )}
    </Box>
  );
}
