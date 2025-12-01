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
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import LinkIcon from '@mui/icons-material/Link';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import FolderIcon from '@mui/icons-material/Folder';
import ImageIcon from '@mui/icons-material/Image';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import CheckIcon from '@mui/icons-material/Check';
import type { User } from '@/types/user';
import type { RoomResource } from '@/types/roomResource';
import { supabase } from '@/lib/supabaseClient';
import { useResources } from '@/hooks/useResources';

export default function RoomResourcePage() {
  const theme = useTheme();
  const [user, setUser] = useState<User | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [roomUrl, setRoomUrl] = useState('');
  const [resourceName, setResourceName] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const { 
    resources, 
    loading, 
    error, 
    fetchResources, 
    saveResource, 
    uploadFile 
  } = useResources();

  // 認証チェック
  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session?.user) {
        window.location.href = '/';
        return;
      }
      
      setUser({ id: session.user.id, email: session.user.email ?? null });
      setAccessToken(session.access_token);
    };
    
    checkAuth();
  }, []);

  useEffect(() => {
    if (accessToken) {
      fetchResources(accessToken);
    }
  }, [accessToken, fetchResources]);

  // リソース保存処理
  const handleSaveResource = useCallback(async () => {
    if (!accessToken) return;
    if (!roomUrl.trim() && !selectedFile) return;

    let success = true;

    if (roomUrl.trim()) {
      success = await saveResource(accessToken, {
        type: 'cocofolia_url',
        name: resourceName.trim() || 'ココフォリア部屋URL',
        value: roomUrl.trim(),
      });
      
      if (success) {
        setRoomUrl('');
        setResourceName('');
      }
    }

    if (selectedFile && success) {
      success = await uploadFile(
        accessToken,
        selectedFile,
        resourceName.trim() || undefined
      );
      
      if (success) {
        setSelectedFile(null);
        setResourceName('');
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
      }
    }

    if (success) {
      await fetchResources(accessToken);
    }
  }, [accessToken, roomUrl, resourceName, selectedFile, saveResource, uploadFile, fetchResources]);

  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedFile(e.target.files?.[0] ?? null);
  }, []);

  return (
    <Box sx={{ py: 4 }}>
      <Container maxWidth="md">
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

        {/* リソース追加フォーム */}
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
                新しいリソースを追加
              </Typography>
            </Box>
            
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
              {/* リソース名 */}
              <TextField
                fullWidth
                label="リソース名（任意）"
                placeholder="例: シナリオPDF、セッションURL"
                value={resourceName}
                onChange={(e) => setResourceName(e.target.value)}
                disabled={loading}
              />
              
              {/* URL入力 */}
              <TextField
                fullWidth
                label="URL"
                placeholder="https://ccfolia.com/rooms/..."
                value={roomUrl}
                onChange={(e) => setRoomUrl(e.target.value)}
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
              
              {/* ファイルアップロード */}
              <Box
                onClick={() => fileInputRef.current?.click()}
                sx={{
                  border: `2px dashed ${alpha(theme.palette.text.secondary, 0.3)}`,
                  borderRadius: 2,
                  p: 4,
                  textAlign: 'center',
                  cursor: 'pointer',
                  transition: 'all 0.3s',
                  '&:hover': {
                    borderColor: alpha(theme.palette.primary.main, 0.5),
                    bgcolor: alpha(theme.palette.primary.main, 0.05),
                  },
                }}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  onChange={handleFileChange}
                  style={{ display: 'none' }}
                  disabled={loading}
                />
                <CloudUploadIcon sx={{ fontSize: 40, color: 'text.secondary', mb: 1 }} />
                {selectedFile ? (
                  <Typography color="primary.main" fontWeight={600}>
                    {selectedFile.name}
                  </Typography>
                ) : (
                  <>
                    <Typography color="text.primary">
                      クリックしてファイルを選択
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      画像、PDF、その他
                    </Typography>
                  </>
                )}
              </Box>

              {/* 保存ボタン */}
              <Button
                variant="contained"
                size="large"
                onClick={handleSaveResource}
                disabled={loading || (!roomUrl.trim() && !selectedFile)}
                startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <CheckIcon />}
                sx={{ alignSelf: 'flex-start', mt: 1 }}
              >
                {loading ? '保存中...' : 'リソースを保存'}
              </Button>
            </Box>
          </CardContent>
        </Card>

        {/* リソース一覧 */}
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
              保存されたリソース
            </Typography>
            <Chip
              label={`${resources.length} 件`}
              size="small"
              sx={{ ml: 'auto' }}
            />
          </Box>
          
          {loading && resources.length === 0 ? (
            <Box sx={{ textAlign: 'center', py: 6 }}>
              <CircularProgress sx={{ mb: 2 }} />
              <Typography color="text.secondary">読み込み中...</Typography>
            </Box>
          ) : resources.length === 0 ? (
            <Card>
              <CardContent sx={{ textAlign: 'center', py: 6 }}>
                <FolderIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2, opacity: 0.5 }} />
                <Typography variant="subtitle1" color="text.primary" sx={{ mb: 1 }}>
                  まだリソースがありません
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  URLを入力するか、ファイルをアップロードして保存してみましょう。
                </Typography>
              </CardContent>
            </Card>
          ) : (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {resources.map((res, index) => (
                <ResourceItem 
                  key={res.id} 
                  resource={res} 
                  index={index}
                />
              ))}
            </Box>
          )}
        </Box>
      </Container>
    </Box>
  );
}

// リソースアイテムコンポーネント
function ResourceItem({ resource, index }: { resource: RoomResource; index: number }) {
  const theme = useTheme();
  const { type, name, value, created_at } = resource;
  
  const getIcon = () => {
    switch (type) {
      case 'cocofolia_url':
      case 'other_url':
        return <LinkIcon />;
      case 'image':
        return <ImageIcon />;
      case 'pdf':
        return <PictureAsPdfIcon />;
      default:
        return <InsertDriveFileIcon />;
    }
  };

  const getTypeLabel = () => {
    switch (type) {
      case 'cocofolia_url': return 'URL';
      case 'image': return '画像';
      case 'pdf': return 'PDF';
      default: return 'その他';
    }
  };

  const getTypeColor = () => {
    switch (type) {
      case 'image': return 'success';
      case 'pdf': return 'error';
      default: return 'default';
    }
  };
  
  return (
    <Card
      sx={{
        animation: `fadeInUp 0.5s ease-out forwards`,
        animationDelay: `${index * 0.05}s`,
        opacity: 0,
        '@keyframes fadeInUp': {
          from: { opacity: 0, transform: 'translateY(10px)' },
          to: { opacity: 1, transform: 'translateY(0)' },
        },
      }}
    >
      <CardContent sx={{ p: 2.5 }}>
        <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
          {/* アイコン */}
          <Box
            sx={{
              width: 48,
              height: 48,
              borderRadius: 2,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              bgcolor: alpha(theme.palette.secondary.main, 0.3),
              color: 'primary.main',
              flexShrink: 0,
            }}
          >
            {getIcon()}
          </Box>
          
          {/* コンテンツ */}
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
              <Typography variant="subtitle1" fontWeight={600} noWrap>
                {name || '名前なし'}
              </Typography>
              <Chip
                label={getTypeLabel()}
                size="small"
                color={getTypeColor() as 'default' | 'success' | 'error'}
                sx={{ height: 20, fontSize: '0.7rem' }}
              />
            </Box>
            
            {/* リソースの表示 */}
            {type === 'image' ? (
              <Box
                sx={{
                  mt: 2,
                  borderRadius: 2,
                  overflow: 'hidden',
                  border: `1px solid ${alpha(theme.palette.text.secondary, 0.2)}`,
                }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={value}
                  alt={name || '画像'}
                  style={{
                    maxWidth: '100%',
                    maxHeight: 200,
                    objectFit: 'contain',
                    display: 'block',
                    backgroundColor: theme.palette.background.default,
                  }}
                />
              </Box>
            ) : (
              <Typography
                variant="body2"
                color="text.secondary"
                noWrap
                component="a"
                href={value}
                target="_blank"
                rel="noopener noreferrer"
                sx={{
                  textDecoration: 'none',
                  '&:hover': { color: 'primary.main' },
                }}
              >
                {value}
              </Typography>
            )}
            
            {/* 日時 */}
            <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
              {new Date(created_at).toLocaleString('ja-JP')}
            </Typography>
          </Box>

          {/* 外部リンクボタン */}
          {type !== 'image' && (
            <IconButton
              href={value}
              target="_blank"
              rel="noopener noreferrer"
              sx={{
                color: 'text.secondary',
                '&:hover': {
                  color: 'primary.main',
                  bgcolor: alpha(theme.palette.primary.main, 0.1),
                },
              }}
            >
              <OpenInNewIcon />
            </IconButton>
          )}
        </Box>
      </CardContent>
    </Card>
  );
}
