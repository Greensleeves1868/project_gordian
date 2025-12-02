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
  useTheme,
  alpha,
  IconButton,
  Tooltip,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import LinkIcon from '@mui/icons-material/Link';
import FolderIcon from '@mui/icons-material/Folder';
import ImageIcon from '@mui/icons-material/Image';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import DownloadIcon from '@mui/icons-material/Download';
import CheckIcon from '@mui/icons-material/Check';
import DeleteIcon from '@mui/icons-material/Delete';
import type { User } from '@/types/user';
import type { Session } from '@/types/roomResource';
import { supabase } from '@/lib/supabaseClient';
import { useResources } from '@/hooks/useResources';

export default function RoomResourcePage() {
  const theme = useTheme();
  const [user, setUser] = useState<User | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  
  // セッション登録フォームの状態
  const [sessionName, setSessionName] = useState('');
  const [sessionUrl, setSessionUrl] = useState('');
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [scenarioFile, setScenarioFile] = useState<File | null>(null);
  const thumbnailInputRef = useRef<HTMLInputElement>(null);
  const scenarioInputRef = useRef<HTMLInputElement>(null);
  
  const { 
    sessions,
    loading, 
    error, 
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
        // Magic Linkからのリダイレクト直後はセッションがまだない場合がある
        // onAuthStateChangeで処理されるので、少し待つ
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

  // セッション保存処理
  const handleSaveSession = useCallback(async () => {
    if (!accessToken) return;
    if (!sessionName.trim() && !sessionUrl.trim() && !thumbnailFile && !scenarioFile) return;

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
      if (thumbnailInputRef.current) thumbnailInputRef.current.value = '';
      if (scenarioInputRef.current) scenarioInputRef.current.value = '';
      
      // リソースを再取得
      await fetchResources(accessToken);
    }
  }, [accessToken, sessionName, sessionUrl, thumbnailFile, scenarioFile, saveResource, uploadFile, fetchResources]);

  const handleThumbnailChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      setThumbnailFile(file);
    }
  }, []);

  const handleScenarioChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setScenarioFile(e.target.files?.[0] ?? null);
  }, []);

  // セッション削除ハンドラ
  const handleDeleteSession = useCallback(async (sessionId: string, isStandalone: boolean) => {
    if (!accessToken) return;
    
    const confirmed = window.confirm('このセッションを削除しますか？');
    if (!confirmed) return;
    
    await deleteSession(accessToken, sessionId, isStandalone);
  }, [accessToken, deleteSession]);

  const canSave = sessionUrl.trim() || thumbnailFile || scenarioFile;

  return (
    <Box sx={{ py: 4 }}>
      <Container maxWidth="lg">
        {/* ヘッダー */}
        <Box sx={{ mb: 4 }} className="animate-fade-in-up">
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
            <Typography
              variant="h4"
              component="h1"
              sx={{
                fontFamily: '"Cinzel", serif',
                fontWeight: 700,
                color: 'primary.main',
              }}
            >
              ダッシュボード
            </Typography>
            {user && (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Box
                  sx={{
                    width: 8,
                    height: 8,
                    borderRadius: '50%',
                    bgcolor: 'success.main',
                    animation: 'pulse 2s infinite',
                    '@keyframes pulse': {
                      '0%, 100%': { opacity: 1 },
                      '50%': { opacity: 0.5 },
                    },
                  }}
                />
                <Typography variant="body2" color="text.secondary" sx={{ display: { xs: 'none', sm: 'block' } }}>
                  {user.email}
                </Typography>
              </Box>
            )}
          </Box>
          <Typography color="text.secondary">
            セッションリソースを管理しましょう
          </Typography>
        </Box>

        {/* エラー表示 */}
        {error && (
          <Alert severity="error" sx={{ mb: 3 }} className="animate-fade-in-up">
            {error}
          </Alert>
        )}

        {/* セッション登録フォーム */}
        <Card sx={{ mb: 4 }} className="animate-fade-in-up stagger-1">
          <CardContent sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
              <Box
                sx={{
                  width: 40,
                  height: 40,
                  borderRadius: 2,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
                }}
              >
                <AddIcon sx={{ color: 'primary.contrastText' }} />
              </Box>
              <Typography variant="h6" color="primary.main">
                新しいセッションを追加
              </Typography>
            </Box>
            
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
              {/* セッション名 */}
              <TextField
                fullWidth
                label="セッション名"
                placeholder="例: 狂気山脈、クトゥルフ神話"
                value={sessionName}
                onChange={(e) => setSessionName(e.target.value)}
                disabled={loading}
              />

              <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 2 }}>
                {/* サムネイル画像 */}
                <Box sx={{ flex: 1 }}>
                  <Box
                    onClick={() => thumbnailInputRef.current?.click()}
                    sx={{
                      border: `2px dashed ${thumbnailFile ? theme.palette.success.main : alpha(theme.palette.text.secondary, 0.3)}`,
                      borderRadius: 2,
                      p: 3,
                      textAlign: 'center',
                      cursor: 'pointer',
                      transition: 'all 0.3s',
                      bgcolor: thumbnailFile ? alpha(theme.palette.success.main, 0.05) : 'transparent',
                      '&:hover': {
                        borderColor: alpha(theme.palette.primary.main, 0.5),
                        bgcolor: alpha(theme.palette.primary.main, 0.05),
                      },
                    }}
                  >
                    <input
                      ref={thumbnailInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleThumbnailChange}
                      style={{ display: 'none' }}
                      disabled={loading}
                    />
                    <ImageIcon sx={{ fontSize: 32, color: thumbnailFile ? 'success.main' : 'text.secondary', mb: 1 }} />
                    {thumbnailFile ? (
                      <Typography color="success.main" fontWeight={600} variant="body2">
                        {thumbnailFile.name}
                      </Typography>
                    ) : (
                      <>
                        <Typography color="text.primary" variant="body2">
                          サムネイル画像
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          クリックして選択
                        </Typography>
                      </>
                    )}
                  </Box>
                </Box>

                {/* シナリオファイル */}
                <Box sx={{ flex: 1 }}>
                  <Box
                    onClick={() => scenarioInputRef.current?.click()}
                    sx={{
                      border: `2px dashed ${scenarioFile ? theme.palette.error.main : alpha(theme.palette.text.secondary, 0.3)}`,
                      borderRadius: 2,
                      p: 3,
                      textAlign: 'center',
                      cursor: 'pointer',
                      transition: 'all 0.3s',
                      bgcolor: scenarioFile ? alpha(theme.palette.error.main, 0.05) : 'transparent',
                      '&:hover': {
                        borderColor: alpha(theme.palette.primary.main, 0.5),
                        bgcolor: alpha(theme.palette.primary.main, 0.05),
                      },
                    }}
                  >
                    <input
                      ref={scenarioInputRef}
                      type="file"
                      accept=".pdf,.doc,.docx,.txt"
                      onChange={handleScenarioChange}
                      style={{ display: 'none' }}
                      disabled={loading}
                    />
                    <PictureAsPdfIcon sx={{ fontSize: 32, color: scenarioFile ? 'error.main' : 'text.secondary', mb: 1 }} />
                    {scenarioFile ? (
                      <Typography color="error.main" fontWeight={600} variant="body2">
                        {scenarioFile.name}
                      </Typography>
                    ) : (
                      <>
                        <Typography color="text.primary" variant="body2">
                          シナリオファイル
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          PDF、Word等
                        </Typography>
                      </>
                    )}
                  </Box>
                </Box>
              </Box>
              
              {/* URL入力 */}
              <TextField
                fullWidth
                label="ココフォリアURL"
                placeholder="https://ccfolia.com/rooms/..."
                value={sessionUrl}
                onChange={(e) => setSessionUrl(e.target.value)}
                disabled={loading}
                slotProps={{
                  input: {
                    startAdornment: (
                      <InputAdornment position="start">
                        <LinkIcon sx={{ color: 'text.secondary' }} />
                      </InputAdornment>
                    ),
                  },
                }}
              />

              {/* 保存ボタン */}
              <Button
                variant="contained"
                size="large"
                onClick={handleSaveSession}
                disabled={loading || !canSave}
                startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <CheckIcon />}
                sx={{ alignSelf: 'flex-start', mt: 1 }}
              >
                {loading ? '保存中...' : 'セッションを保存'}
              </Button>
            </Box>
          </CardContent>
        </Card>

        {/* セッション一覧 */}
        <Box className="animate-fade-in-up stagger-2">
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
            <Box
              sx={{
                width: 40,
                height: 40,
                borderRadius: 2,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: `linear-gradient(135deg, ${theme.palette.secondary.main} 0%, ${theme.palette.secondary.dark} 100%)`,
                border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
              }}
            >
              <FolderIcon sx={{ color: 'primary.main' }} />
            </Box>
            <Typography variant="h6" color="primary.main">
              保存されたセッション
            </Typography>
            <Chip
              label={`${sessions.length} 件`}
              size="small"
              sx={{ ml: 'auto' }}
            />
          </Box>
          
          {loading && sessions.length === 0 ? (
            <Box sx={{ textAlign: 'center', py: 6 }}>
              <CircularProgress sx={{ mb: 2 }} />
              <Typography color="text.secondary">読み込み中...</Typography>
            </Box>
          ) : sessions.length === 0 ? (
            <Card>
              <CardContent sx={{ textAlign: 'center', py: 6 }}>
                <FolderIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2, opacity: 0.5 }} />
                <Typography variant="subtitle1" color="text.primary" sx={{ mb: 1 }}>
                  まだセッションがありません
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  サムネイル画像、シナリオファイル、URLを登録してセッションを作成しましょう。
                </Typography>
              </CardContent>
            </Card>
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

// セッションカードコンポーネント（横長レイアウト）
function SessionCard({ 
  session, 
  index, 
  onDelete 
}: { 
  session: Session; 
  index: number;
  onDelete: (sessionId: string, isStandalone: boolean) => void;
}) {
  const theme = useTheme();
  const { id, name, created_at, thumbnail, url, file } = session;
  
  // スタンドアロン（session_idがないリソース）かどうかを判定
  // スタンドアロンの場合、idはリソースのIDそのもの
  const isStandalone = !thumbnail?.session_id && !url?.session_id && !file?.session_id;
  
  return (
    <Card
      sx={{
        display: 'flex',
        flexDirection: { xs: 'column', sm: 'row' },
        animation: `fadeInUp 0.5s ease-out forwards`,
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
          width: { xs: '100%', sm: 200 },
          minWidth: { sm: 200 },
          height: { xs: 150, sm: 'auto' },
          aspectRatio: { sm: '16/9' },
          bgcolor: alpha(theme.palette.secondary.main, 0.3),
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
            <ImageIcon sx={{ fontSize: 48, color: 'text.secondary', opacity: 0.3 }} />
          </Box>
        )}
      </Box>

      {/* コンテンツ（右側） */}
      <CardContent sx={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 2 }}>
          <Box sx={{ flex: 1, minWidth: 0 }}>
            {/* セッション名 */}
            <Typography variant="h6" fontWeight={600} sx={{ mb: 0.5 }}>
              {name}
            </Typography>

            {/* 作成日時 */}
            <Typography variant="caption" color="text.secondary">
              {new Date(created_at).toLocaleDateString('ja-JP')}
            </Typography>
          </Box>

          {/* アクションボタン */}
          <Box sx={{ display: 'flex', gap: 1, flexShrink: 0 }}>
            {/* ファイルダウンロードボタン */}
            {file && (
              <Tooltip title="シナリオをダウンロード">
                <IconButton
                  href={file.value}
                  target="_blank"
                  rel="noopener noreferrer"
                  download
                  sx={{
                    bgcolor: alpha(theme.palette.error.main, 0.1),
                    color: 'error.main',
                    '&:hover': {
                      bgcolor: alpha(theme.palette.error.main, 0.2),
                    },
                  }}
                >
                  <DownloadIcon />
                </IconButton>
              </Tooltip>
            )}

            {/* URLリンクボタン */}
            {url && (
              <Tooltip title="ココフォリアを開く">
                <IconButton
                  href={url.value}
                  target="_blank"
                  rel="noopener noreferrer"
                  sx={{
                    bgcolor: alpha(theme.palette.primary.main, 0.1),
                    color: 'primary.main',
                    '&:hover': {
                      bgcolor: alpha(theme.palette.primary.main, 0.2),
                    },
                  }}
                >
                  <OpenInNewIcon />
                </IconButton>
              </Tooltip>
            )}

            {/* リソースがない場合の表示 */}
            {!file && !url && (
              <Typography variant="caption" color="text.secondary">
                リソースなし
              </Typography>
            )}

            {/* 削除ボタン */}
            <Tooltip title="削除">
              <IconButton
                onClick={() => onDelete(id, isStandalone)}
                sx={{
                  bgcolor: alpha(theme.palette.error.dark, 0.1),
                  color: 'error.dark',
                  '&:hover': {
                    bgcolor: alpha(theme.palette.error.dark, 0.3),
                  },
                }}
              >
                <DeleteIcon />
              </IconButton>
            </Tooltip>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
}
