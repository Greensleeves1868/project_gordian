'use client';

import { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  TextField,
  Button,
  Alert,
  Card,
  CardContent,
  MenuItem,
  CircularProgress,
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

const inquiryTypes = [
  { value: 'general', label: '一般的なお問い合わせ' },
  { value: 'bug', label: 'バグ報告' },
  { value: 'feature', label: '機能リクエスト' },
  { value: 'billing', label: '料金・お支払いについて' },
  { value: 'other', label: 'その他' },
];

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    type: 'general',
    message: '',
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (field: string) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // 実際の送信処理（現在はダミー）
    await new Promise((resolve) => setTimeout(resolve, 1500));

    setLoading(false);
    setSuccess(true);
  };

  const isValid = formData.name && formData.email && formData.message;

  return (
    <Box sx={{ py: { xs: 6, md: 10 } }}>
      <Container maxWidth="sm">
        {/* ヘッダー */}
        <Box
          sx={{
            textAlign: 'center',
            mb: { xs: 4, md: 6 },
            animation: 'fadeInUp 0.6s ease-out forwards',
            '@keyframes fadeInUp': {
              from: { opacity: 0, transform: 'translateY(20px)' },
              to: { opacity: 1, transform: 'translateY(0)' },
            },
          }}
        >
          <Typography
            variant="h2"
            component="h1"
            sx={{
              fontWeight: 800,
              mb: 2,
              letterSpacing: '-0.02em',
              fontSize: { xs: '2rem', md: '3rem' },
            }}
          >
            お問い合わせ
          </Typography>
          <Typography variant="body1" color="text.secondary">
            ご質問・ご要望がございましたら、お気軽にお問い合わせください。
          </Typography>
        </Box>

        {/* フォーム */}
        <Card
          sx={{
            animation: 'fadeInUp 0.6s ease-out forwards',
            animationDelay: '0.1s',
            opacity: 0,
            '@keyframes fadeInUp': {
              from: { opacity: 0, transform: 'translateY(20px)' },
              to: { opacity: 1, transform: 'translateY(0)' },
            },
          }}
        >
          <CardContent sx={{ p: { xs: 3, md: 4 } }}>
            {success ? (
              <Box sx={{ textAlign: 'center', py: 4 }}>
                <CheckCircleIcon sx={{ fontSize: 64, color: 'success.main', mb: 2 }} />
                <Typography variant="h6" fontWeight={700} sx={{ mb: 1 }}>
                  送信完了
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  お問い合わせありがとうございます。
                  <br />
                  内容を確認の上、ご連絡いたします。
                </Typography>
              </Box>
            ) : (
              <form onSubmit={handleSubmit}>
                {error && (
                  <Alert severity="error" sx={{ mb: 3 }}>
                    {error}
                  </Alert>
                )}

                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                  <TextField
                    label="お名前"
                    value={formData.name}
                    onChange={handleChange('name')}
                    required
                    disabled={loading}
                    fullWidth
                  />

                  <TextField
                    label="メールアドレス"
                    type="email"
                    value={formData.email}
                    onChange={handleChange('email')}
                    required
                    disabled={loading}
                    fullWidth
                  />

                  <TextField
                    select
                    label="お問い合わせ種別"
                    value={formData.type}
                    onChange={handleChange('type')}
                    disabled={loading}
                    fullWidth
                  >
                    {inquiryTypes.map((option) => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </TextField>

                  <TextField
                    label="お問い合わせ内容"
                    value={formData.message}
                    onChange={handleChange('message')}
                    required
                    disabled={loading}
                    fullWidth
                    multiline
                    rows={5}
                  />

                  <Button
                    type="submit"
                    variant="contained"
                    size="large"
                    disabled={loading || !isValid}
                    endIcon={
                      loading ? (
                        <CircularProgress size={18} color="inherit" />
                      ) : (
                        <SendIcon sx={{ fontSize: 18 }} />
                      )
                    }
                  >
                    {loading ? '送信中...' : '送信する'}
                  </Button>
                </Box>
              </form>
            )}
          </CardContent>
        </Card>

        {/* 補足情報 */}
        <Typography
          variant="caption"
          color="text.secondary"
          sx={{ display: 'block', textAlign: 'center', mt: 4 }}
        >
          通常2〜3営業日以内にご返信いたします。
        </Typography>
      </Container>
    </Box>
  );
}

