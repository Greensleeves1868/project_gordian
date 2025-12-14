'use client';

import Link from 'next/link';
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  Button,
  Chip,
  Stack,
  alpha,
} from '@mui/material';
import CheckIcon from '@mui/icons-material/Check';

const plans = [
  {
    name: 'Free',
    price: '¥0',
    period: '永久無料',
    description: '個人利用に最適なプラン',
    features: [
      'セッション管理（10件まで）',
      'ファイルアップロード（100MBまで）',
      'ココフォリア連携',
      'マジックリンク認証',
    ],
    buttonText: '無料で始める',
    highlighted: false,
    comingSoon: false,
  },
  {
    name: 'Pro',
    price: '¥500',
    period: '/月',
    description: 'ヘビーユーザー向けプラン',
    features: [
      'セッション管理（無制限）',
      'ファイルアップロード（10GBまで）',
      'ココフォリア連携',
      'マジックリンク認証',
      '優先サポート',
      'バックアップ機能',
    ],
    buttonText: '実装予定',
    highlighted: false,
    comingSoon: true,
  },
  {
    name: 'Team',
    price: '¥1,500',
    period: '/月',
    description: 'サークル・チーム向けプラン',
    features: [
      'Proプランの全機能',
      'チームメンバー（5人まで）',
      '共有セッション機能',
      'チーム管理ダッシュボード',
      '専用サポート',
    ],
    buttonText: '実装予定',
    highlighted: false,
    comingSoon: true,
  },
];

export default function PricingPage() {
  return (
    <Box sx={{ py: { xs: 6, md: 10 } }}>
      <Container maxWidth="lg">
        {/* ヘッダー */}
        <Box
          sx={{
            textAlign: 'center',
            mb: { xs: 6, md: 8 },
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
            料金プラン
          </Typography>
          <Typography
            variant="body1"
            color="text.secondary"
            sx={{ maxWidth: 600, mx: 'auto' }}
          >
            あなたの利用スタイルに合わせて選べるプラン。
            まずは無料プランからお試しください。
          </Typography>
        </Box>

        {/* プランカード */}
        <Stack
          direction={{ xs: 'column', md: 'row' }}
          spacing={3}
          justifyContent="center"
          alignItems={{ xs: 'center', md: 'stretch' }}
        >
          {plans.map((plan, index) => (
            <Card
              key={plan.name}
              sx={{
                width: { xs: '100%', md: 340 },
                maxWidth: 400,
                position: 'relative',
                overflow: 'visible',
                animation: 'fadeInUp 0.5s ease-out forwards',
                animationDelay: `${index * 0.1}s`,
                opacity: 0,
                '@keyframes fadeInUp': {
                  from: { opacity: 0, transform: 'translateY(20px)' },
                  to: { opacity: 1, transform: 'translateY(0)' },
                },
                ...(plan.comingSoon && {
                  opacity: 0.7,
                }),
              }}
            >
              {plan.comingSoon && (
                <Chip
                  label="Coming Soon"
                  size="small"
                  sx={{
                    position: 'absolute',
                    top: -12,
                    left: '50%',
                    transform: 'translateX(-50%)',
                    bgcolor: 'text.secondary',
                    color: 'background.paper',
                    fontWeight: 600,
                    zIndex: 1,
                  }}
                />
              )}
              <CardContent sx={{ p: 4 }}>
                <Typography
                  variant="h6"
                  fontWeight={700}
                  sx={{
                    mb: 1,
                    color: plan.comingSoon ? 'text.secondary' : 'text.primary',
                  }}
                >
                  {plan.name}
                </Typography>
                <Box sx={{ mb: 2 }}>
                  <Typography
                    component="span"
                    sx={{
                      fontSize: '2.5rem',
                      fontWeight: 800,
                      color: plan.comingSoon ? 'text.secondary' : 'text.primary',
                    }}
                  >
                    {plan.price}
                  </Typography>
                  <Typography
                    component="span"
                    color="text.secondary"
                    sx={{ ml: 0.5 }}
                  >
                    {plan.period}
                  </Typography>
                </Box>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                  {plan.description}
                </Typography>

                <Stack spacing={1.5} sx={{ mb: 4 }}>
                  {plan.features.map((feature) => (
                    <Box
                      key={feature}
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1.5,
                        opacity: plan.comingSoon ? 0.6 : 1,
                      }}
                    >
                      <CheckIcon sx={{ fontSize: 18, color: 'text.secondary' }} />
                      <Typography variant="body2">{feature}</Typography>
                    </Box>
                  ))}
                </Stack>

                {plan.comingSoon ? (
                  <Button
                    variant="outlined"
                    fullWidth
                    size="large"
                    disabled
                    sx={{
                      borderColor: alpha('#000', 0.12),
                      color: 'text.secondary',
                    }}
                  >
                    {plan.buttonText}
                  </Button>
                ) : (
                  <Link href="/" style={{ textDecoration: 'none' }}>
                    <Button
                      variant="contained"
                      fullWidth
                      size="large"
                    >
                      {plan.buttonText}
                    </Button>
                  </Link>
                )}
              </CardContent>
            </Card>
          ))}
        </Stack>

        {/* 注意事項 */}
        <Typography
          variant="caption"
          color="text.secondary"
          sx={{ display: 'block', textAlign: 'center', mt: 6 }}
        >
          ※ 価格は全て税込です。
        </Typography>
      </Container>
    </Box>
  );
}
