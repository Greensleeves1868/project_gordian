'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import {
  Box,
  Container,
  Typography,
  TextField,
  Button,
  Card,
  CardContent,
  Alert,
  Chip,
  CircularProgress,
  InputAdornment,
  alpha,
  IconButton,
  Tooltip,
  Divider,
  LinearProgress,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import LinkIcon from '@mui/icons-material/Link';
import ImageIcon from '@mui/icons-material/Image';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import DownloadIcon from '@mui/icons-material/Download';
import CheckIcon from '@mui/icons-material/Check';
import DeleteIcon from '@mui/icons-material/Delete';
import LogoutIcon from '@mui/icons-material/Logout';
import WarningIcon from '@mui/icons-material/Warning';
import type { User } from '@/types/user';
import type { Session } from '@/types/roomResource';
import { supabase } from '@/lib/supabaseClient';
import { useResources } from '@/hooks/useResources';
import { PLAN_LIMITS, formatFileSize, isFileSizeValid } from '@/lib/planLimits';

export default function RoomResourcePage() {
  const [user, setUser] = useState<User | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  
  // セッション登録フォームの状態
  const [sessionName, setSessionName] = useState('');
  const [sessionUrl, setSessionUrl] = useState('');
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [scenarioFile, setScenarioFile] = useState<File | null>(null);
  const [fileSizeError, setFileSizeError] = useState<string | null>(null);
  const thumbnailInputRef = useRef<HTMLInputElement>(null);
  const scenarioInputRef = useRef<HTMLInputElement>(null);
  
  const { 
    sessions,
    sessionMeta,
    loading, 
    error, 
    canCreateSession,
    fetchResources, 
    saveResource, 
    uploadFile,
    deleteSession
  } = useResources();

  // 認証チェック（Magic Linkコールバック対応）
  useEffect(() => {
    // 認証状態の変化を監視
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === 'SIGNED_IN' && session?.user) {
          setUser({ id: session.user.id, email: session.user.email ?? null });
          setAccessToken(session.access_token);
        } else if (event === 'SIGNED_OUT' || !session) {
          window.location.href = '/';
        }
      }
    );

    // 初回ロード時のセッション確認
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session?.user) {
        setTimeout(async () => {
          const { data: { session: retrySession } } = await supabase.auth.getSession();
          if (!retrySession?.user) {
            window.location.href = '/';
          }
        }, 1000);
        return;
      }
      
      setUser({ id: session.user.id, email: session.user.email ?? null });
      setAccessToken(session.access_token);
    };
    
    checkAuth();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (accessToken) {
      fetchResources(accessToken);
    }
  }, [accessToken, fetchResources]);

  // ログアウト処理
  const handleLogout = useCallback(async () => {
    await supabase.auth.signOut();
    window.location.href = '/';
  }, []);

  // セッション保存処理
  const handleSaveSession = useCallback(async () => {
    if (!accessToken) return;
    if (!sessionName.trim() && !sessionUrl.trim() && !thumbnailFile && !scenarioFile) return;
    if (!canCreateSession) return;

    // セッションIDを生成
    const sessionId = crypto.randomUUID();
    let success = true;

    // URLを保存
    if (sessionUrl.trim()) {
      success = await saveResource(accessToken, {
        type: 'cocofolia_url',
        name: sessionName.trim() || 'セッションURL',
        value: sessionUrl.trim(),
        session_id: sessionId,
      });
    }

    // サムネイル画像をアップロード
    if (thumbnailFile && success) {
      success = await uploadFile(
        accessToken,
        thumbnailFile,
        sessionName.trim() || 'サムネイル',
        sessionId
      );
    }

    // シナリオファイルをアップロード
    if (scenarioFile && success) {
      success = await uploadFile(
        accessToken,
        scenarioFile,
        sessionName.trim() || 'シナリオ',
        sessionId
      );
    }

    if (success) {
      // フォームをリセット
      setSessionName('');
      setSessionUrl('');
      setThumbnailFile(null);
      setScenarioFile(null);
      setFileSizeError(null);
      if (thumbnailInputRef.current) thumbnailInputRef.current.value = '';
      if (scenarioInputRef.current) scenarioInputRef.current.value = '';
      
      // リソースを再取得
      await fetchResources(accessToken);
    }
  }, [accessToken, sessionName, sessionUrl, thumbnailFile, scenarioFile, canCreateSession, saveResource, uploadFile, fetchResources]);

  // ファイルサイズのバリデーション
  const validateFileSize = useCallback((file: File): boolean => {
    if (!isFileSizeValid(file.size)) {
      setFileSizeError(
        `ファイルサイズが上限（${PLAN_LIMITS.FREE.maxFileSizeDisplay}）を超えています。選択: ${formatFileSize(file.size)}`
      );
      return false;
    }
    setFileSizeError(null);
    return true;
  }, []);

  const handleThumbnailChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      if (validateFileSize(file)) {
        setThumbnailFile(file);
      } else {
        e.target.value = '';
      }
    }
  }, [validateFileSize]);

  const handleScenarioChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (validateFileSize(file)) {
        setScenarioFile(file);
      } else {
        e.target.value = '';
      }
    }
  }, [validateFileSize]);

  // セッション削除ハンドラ
  const handleDeleteSession = useCallback(async (sessionId: string, isStandalone: boolean) => {
    if (!accessToken) return;
    
    const confirmed = window.confirm('このセッションを削除しますか？');
    if (!confirmed) return;
    
    await deleteSession(accessToken, sessionId, isStandalone);
  }, [accessToken, deleteSession]);

  const canSave = (sessionUrl.trim() || thumbnailFile || scenarioFile) && canCreateSession && !fileSizeError;

  // セッション使用率の計算
  const sessionUsagePercent = (sessionMeta.sessionCount / sessionMeta.maxSessions) * 100;
  const isNearLimit = sessionUsagePercent >= 80;

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      {/* ダッシュボードヘッダー */}
      <Box
        sx={{
          borderBottom: '1px solid',
          borderColor: 'divider',
          bgcolor: 'background.paper',
        }}
      >
        <Container maxWidth="lg">
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              py: 2,
            }}
          >
            <Typography
              variant="h6"
              sx={{
                fontWeight: 800,
                letterSpacing: '0.1em',
              }}
            >
              GORDIAN
            </Typography>
            
            {user && (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Typography variant="body2" color="text.secondary" sx={{ display: { xs: 'none', sm: 'block' } }}>
                  {user.email}
                </Typography>
                <Button
                  variant="text"
                  size="small"
                  startIcon={<LogoutIcon sx={{ fontSize: 16 }} />}
                  onClick={handleLogout}
                  sx={{ color: 'text.secondary' }}
                >
                  ログアウト
                </Button>
              </Box>
            )}
          </Box>
        </Container>
      </Box>

      <Container maxWidth="lg" sx={{ py: { xs: 4, md: 6 } }}>
        {/* ページタイトル */}
        <Box
          sx={{
            mb: 4,
            animation: 'fadeInUp 0.6s ease-out forwards',
            '@keyframes fadeInUp': {
              from: { opacity: 0, transform: 'translateY(20px)' },
              to: { opacity: 1, transform: 'translateY(0)' },
            },
          }}
        >
          <Typography
            variant="h3"
            component="h1"
            sx={{
              fontWeight: 800,
              mb: 1,
              letterSpacing: '-0.02em',
            }}
          >
            ダッシュボード
          </Typography>
          <Typography color="text.secondary">
            セッションリソースを管理しましょう
          </Typography>
        </Box>

        {/* 使用状況 */}
        <Box
          sx={{
            mb: 4,
            p: 3,
            border: '1px solid',
            borderColor: isNearLimit ? 'warning.main' : 'divider',
            bgcolor: isNearLimit ? alpha('#ff9800', 0.04) : 'transparent',
            animation: 'fadeInUp 0.6s ease-out forwards',
            animationDelay: '0.05s',
            opacity: 0,
            '@keyframes fadeInUp': {
              from: { opacity: 0, transform: 'translateY(20px)' },
              to: { opacity: 1, transform: 'translateY(0)' },
            },
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1.5 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Typography variant="subtitle2" fontWeight={600}>
                セッション使用状況
              </Typography>
              <Chip 
                label="Free プラン" 
                size="small" 
                variant="outlined"
                sx={{ fontSize: '0.7rem' }}
              />
            </Box>
            <Typography variant="body2" color={isNearLimit ? 'warning.main' : 'text.secondary'}>
              {sessionMeta.sessionCount} / {sessionMeta.maxSessions} 件
            </Typography>
          </Box>
          <LinearProgress 
            variant="determinate" 
            value={sessionUsagePercent}
            sx={{
              height: 6,
              bgcolor: alpha('#000', 0.08),
              '& .MuiLinearProgress-bar': {
                bgcolor: isNearLimit ? 'warning.main' : 'text.primary',
              },
            }}
          />
          {!canCreateSession && (
            <Alert 
              severity="warning" 
              icon={<WarningIcon />}
              sx={{ mt: 2 }}
            >
              セッション数が上限に達しています。新しいセッションを作成するには、既存のセッションを削除してください。
            </Alert>
          )}
          <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1 }}>
            ファイルサイズ上限: {PLAN_LIMITS.FREE.maxFileSizeDisplay} / ファイル
          </Typography>
        </Box>

        {/* エラー表示 */}
        {(error || fileSizeError) && (
          <Alert severity="error" sx={{ mb: 4 }}>
            {error || fileSizeError}
          </Alert>
        )}

        {/* セッション登録フォーム */}
        <Box
          sx={{
            mb: 6,
            p: { xs: 3, md: 4 },
            border: '1px solid',
            borderColor: !canCreateSession ? alpha('#000', 0.12) : 'divider',
            opacity: !canCreateSession ? 0.6 : 1,
            pointerEvents: !canCreateSession ? 'none' : 'auto',
            animation: 'fadeInUp 0.6s ease-out forwards',
            animationDelay: '0.1s',
            '@keyframes fadeInUp': {
              from: { opacity: 0, transform: 'translateY(20px)' },
              to: { opacity: 1, transform: 'translateY(0)' },
            },
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
            <AddIcon sx={{ fontSize: 20 }} />
            <Typography variant="h6" fontWeight={700}>
              新しいセッションを追加
            </Typography>
            {!canCreateSession && (
              <Chip label="上限到達" size="small" color="warning" />
            )}
          </Box>
          
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            {/* セッション名 */}
            <TextField
              fullWidth
              label="セッション名"
              placeholder="例: 狂気山脈、クトゥルフ神話"
              value={sessionName}
              onChange={(e) => setSessionName(e.target.value)}
              disabled={loading || !canCreateSession}
            />

            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 2 }}>
              {/* サムネイル画像 */}
              <Box
                onClick={() => canCreateSession && thumbnailInputRef.current?.click()}
                sx={{
                  border: '2px dashed',
                  borderColor: thumbnailFile ? 'success.main' : 'divider',
                  p: 3,
                  textAlign: 'center',
                  cursor: canCreateSession ? 'pointer' : 'not-allowed',
                  transition: 'all 0.2s',
                  bgcolor: thumbnailFile ? alpha('#00bfa5', 0.04) : 'transparent',
                  '&:hover': canCreateSession ? {
                    borderColor: 'text.primary',
                  } : {},
                }}
              >
                <input
                  ref={thumbnailInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleThumbnailChange}
                  style={{ display: 'none' }}
                  disabled={loading || !canCreateSession}
                />
                <ImageIcon sx={{ fontSize: 28, color: thumbnailFile ? 'success.main' : 'text.secondary', mb: 1 }} />
                {thumbnailFile ? (
                  <>
                    <Typography color="success.main" fontWeight={600} variant="body2">
                      {thumbnailFile.name}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {formatFileSize(thumbnailFile.size)}
                    </Typography>
                  </>
                ) : (
                  <>
                    <Typography variant="body2" fontWeight={500}>
                      サムネイル画像
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      上限 {PLAN_LIMITS.FREE.maxFileSizeDisplay}
                    </Typography>
                  </>
                )}
              </Box>

              {/* シナリオファイル */}
              <Box
                onClick={() => canCreateSession && scenarioInputRef.current?.click()}
                sx={{
                  border: '2px dashed',
                  borderColor: scenarioFile ? 'secondary.main' : 'divider',
                  p: 3,
                  textAlign: 'center',
                  cursor: canCreateSession ? 'pointer' : 'not-allowed',
                  transition: 'all 0.2s',
                  bgcolor: scenarioFile ? alpha('#ff4d4d', 0.04) : 'transparent',
                  '&:hover': canCreateSession ? {
                    borderColor: 'text.primary',
                  } : {},
                }}
              >
                <input
                  ref={scenarioInputRef}
                  type="file"
                  accept=".pdf,.doc,.docx,.txt"
                  onChange={handleScenarioChange}
                  style={{ display: 'none' }}
                  disabled={loading || !canCreateSession}
                />
                <PictureAsPdfIcon sx={{ fontSize: 28, color: scenarioFile ? 'secondary.main' : 'text.secondary', mb: 1 }} />
                {scenarioFile ? (
                  <>
                    <Typography color="secondary.main" fontWeight={600} variant="body2">
                      {scenarioFile.name}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {formatFileSize(scenarioFile.size)}
                    </Typography>
                  </>
                ) : (
                  <>
                    <Typography variant="body2" fontWeight={500}>
                      シナリオファイル
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      上限 {PLAN_LIMITS.FREE.maxFileSizeDisplay}
                    </Typography>
                  </>
                )}
              </Box>
            </Box>
            
            {/* URL入力 */}
            <TextField
              fullWidth
              label="ココフォリアURL"
              placeholder="https://ccfolia.com/rooms/..."
              value={sessionUrl}
              onChange={(e) => setSessionUrl(e.target.value)}
              disabled={loading || !canCreateSession}
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <LinkIcon sx={{ color: 'text.secondary', fontSize: 20 }} />
                    </InputAdornment>
                  ),
                },
              }}
            />

            {/* 保存ボタン */}
            <Button
              variant="contained"
              onClick={handleSaveSession}
              disabled={loading || !canSave}
              startIcon={loading ? <CircularProgress size={18} color="inherit" /> : <CheckIcon sx={{ fontSize: 18 }} />}
              sx={{ alignSelf: 'flex-start' }}
            >
              {loading ? '保存中...' : 'セッションを保存'}
            </Button>
          </Box>
        </Box>

        <Divider sx={{ mb: 5 }} />

        {/* セッション一覧 */}
        <Box
          sx={{
            animation: 'fadeInUp 0.6s ease-out forwards',
            animationDelay: '0.2s',
            opacity: 0,
            '@keyframes fadeInUp': {
              from: { opacity: 0, transform: 'translateY(20px)' },
              to: { opacity: 1, transform: 'translateY(0)' },
            },
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
            <Typography variant="h6" fontWeight={700}>
              保存されたセッション
            </Typography>
            <Chip
              label={`${sessions.length} 件`}
              size="small"
              variant="outlined"
            />
          </Box>
          
          {loading && sessions.length === 0 ? (
            <Box sx={{ textAlign: 'center', py: 8 }}>
              <CircularProgress size={32} sx={{ mb: 2 }} />
              <Typography color="text.secondary">読み込み中...</Typography>
            </Box>
          ) : sessions.length === 0 ? (
            <Box
              sx={{
                textAlign: 'center',
                py: 8,
                border: '1px solid',
                borderColor: 'divider',
              }}
            >
              <Typography variant="subtitle1" sx={{ mb: 1 }}>
                まだセッションがありません
              </Typography>
              <Typography variant="body2" color="text.secondary">
                上のフォームからセッションを作成しましょう
              </Typography>
            </Box>
          ) : (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {sessions.map((session, index) => (
                <SessionCard 
                  key={session.id} 
                  session={session} 
                  index={index} 
                  onDelete={handleDeleteSession}
                />
              ))}
            </Box>
          )}
        </Box>
      </Container>
    </Box>
  );
}

// セッションカードコンポーネント
function SessionCard({ 
  session, 
  index, 
  onDelete 
}: { 
  session: Session; 
  index: number;
  onDelete: (sessionId: string, isStandalone: boolean) => void;
}) {
  const { id, name, created_at, thumbnail, url, file } = session;
  
  // スタンドアロン（session_idがないリソース）かどうかを判定
  const isStandalone = !thumbnail?.session_id && !url?.session_id && !file?.session_id;
  
  return (
    <Card
      sx={{
        display: 'flex',
        flexDirection: { xs: 'column', sm: 'row' },
        animation: `fadeInUp 0.4s ease-out forwards`,
        animationDelay: `${index * 0.05}s`,
        opacity: 0,
        '@keyframes fadeInUp': {
          from: { opacity: 0, transform: 'translateY(10px)' },
          to: { opacity: 1, transform: 'translateY(0)' },
        },
      }}
    >
      {/* サムネイル画像（左側） */}
      <Box
        sx={{
          position: 'relative',
          width: { xs: '100%', sm: 180 },
          minWidth: { sm: 180 },
          height: { xs: 140, sm: 'auto' },
          minHeight: { sm: 120 },
          bgcolor: 'grey.100',
          overflow: 'hidden',
          flexShrink: 0,
        }}
      >
        {thumbnail ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={thumbnail.value}
            alt={name}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
            }}
          />
        ) : (
          <Box
            sx={{
              width: '100%',
              height: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              minHeight: 120,
            }}
          >
            <ImageIcon sx={{ fontSize: 40, color: 'grey.400' }} />
          </Box>
        )}
      </Box>

      {/* コンテンツ（右側） */}
      <CardContent sx={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', py: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 2 }}>
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 0.5 }}>
              {name}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {new Date(created_at).toLocaleDateString('ja-JP')}
            </Typography>
          </Box>

          {/* アクションボタン */}
          <Box sx={{ display: 'flex', gap: 1, flexShrink: 0 }}>
            {file && (
              <Tooltip title="シナリオをダウンロード">
                <IconButton
                  href={file.value}
                  target="_blank"
                  rel="noopener noreferrer"
                  download
                  size="small"
                  sx={{
                    border: '1px solid',
                    borderColor: 'divider',
                    '&:hover': {
                      borderColor: 'text.primary',
                    },
                  }}
                >
                  <DownloadIcon sx={{ fontSize: 18 }} />
                </IconButton>
              </Tooltip>
            )}

            {url && (
              <Tooltip title="ココフォリアを開く">
                <IconButton
                  href={url.value}
                  target="_blank"
                  rel="noopener noreferrer"
                  size="small"
                  sx={{
                    border: '1px solid',
                    borderColor: 'divider',
                    '&:hover': {
                      borderColor: 'text.primary',
                    },
                  }}
                >
                  <OpenInNewIcon sx={{ fontSize: 18 }} />
                </IconButton>
              </Tooltip>
            )}

            {!file && !url && (
              <Typography variant="caption" color="text.secondary">
                リソースなし
              </Typography>
            )}

            <Tooltip title="削除">
              <IconButton
                onClick={() => onDelete(id, isStandalone)}
                size="small"
                sx={{
                  border: '1px solid',
                  borderColor: 'divider',
                  color: 'secondary.main',
                  '&:hover': {
                    borderColor: 'secondary.main',
                    bgcolor: alpha('#ff4d4d', 0.04),
                  },
                }}
              >
                <DeleteIcon sx={{ fontSize: 18 }} />
              </IconButton>
            </Tooltip>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
}
