// src/hooks/useResources.ts
import { useState, useCallback } from 'react';
import type { RoomResource, Session } from '@/types/roomResource';
import { PLAN_LIMITS } from '@/lib/planLimits';

type ResourceInput = {
  type: RoomResource['type'];
  name: string;
  value: string;
  session_id?: string;
};

type SessionMeta = {
  sessionCount: number;
  maxSessions: number;
};

type UseResourcesReturn = {
  resources: RoomResource[];
  sessions: Session[];
  sessionMeta: SessionMeta;
  loading: boolean;
  error: string | null;
  canCreateSession: boolean;
  fetchResources: (accessToken: string) => Promise<void>;
  saveResource: (accessToken: string, resource: ResourceInput) => Promise<boolean>;
  uploadFile: (accessToken: string, file: File, name?: string, sessionId?: string) => Promise<boolean>;
  deleteSession: (accessToken: string, sessionId: string, isStandalone?: boolean) => Promise<boolean>;
};

// リソースをセッション単位でグループ化する関数
function groupResourcesIntoSessions(resources: RoomResource[]): Session[] {
  const sessionMap = new Map<string, RoomResource[]>();
  const standaloneResources: RoomResource[] = [];

  // session_idでグループ化
  resources.forEach((resource) => {
    if (resource.session_id) {
      const existing = sessionMap.get(resource.session_id) || [];
      existing.push(resource);
      sessionMap.set(resource.session_id, existing);
    } else {
      standaloneResources.push(resource);
    }
  });

  const sessions: Session[] = [];

  // グループ化されたリソースをセッションに変換
  sessionMap.forEach((groupedResources, sessionId) => {
    const thumbnail = groupedResources.find((r) => r.type === 'image') || null;
    const url = groupedResources.find((r) => r.type === 'cocofolia_url' || r.type === 'other_url') || null;
    const file = groupedResources.find((r) => r.type === 'pdf') || null;
    
    // セッション名を決定（最初に見つかった名前付きリソースの名前を使用）
    const namedResource = groupedResources.find((r) => r.name);
    const sessionName = namedResource?.name || 'セッション';
    
    // 最も古い作成日時を取得
    const oldestCreatedAt = groupedResources.reduce((oldest, r) => {
      return new Date(r.created_at) < new Date(oldest) ? r.created_at : oldest;
    }, groupedResources[0].created_at);

    sessions.push({
      id: sessionId,
      name: sessionName,
      created_at: oldestCreatedAt,
      thumbnail,
      url,
      file,
    });
  });

  // スタンドアロンのリソースも個別のセッションとして追加
  standaloneResources.forEach((resource) => {
    sessions.push({
      id: resource.id,
      name: resource.name || '名前なし',
      created_at: resource.created_at,
      thumbnail: resource.type === 'image' ? resource : null,
      url: resource.type === 'cocofolia_url' || resource.type === 'other_url' ? resource : null,
      file: resource.type === 'pdf' ? resource : null,
    });
  });

  // 作成日時でソート（新しい順）
  sessions.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

  return sessions;
}

export function useResources(): UseResourcesReturn {
  const [resources, setResources] = useState<RoomResource[]>([]);
  const [sessions, setSessions] = useState<Session[]>([]);
  const [sessionMeta, setSessionMeta] = useState<SessionMeta>({
    sessionCount: 0,
    maxSessions: PLAN_LIMITS.FREE.maxSessions,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // セッション作成可能かどうか
  const canCreateSession = sessionMeta.sessionCount < sessionMeta.maxSessions;

  // リソース一覧を取得
  const fetchResources = useCallback(async (accessToken: string) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/dashboard', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'リソースの取得に失敗しました');
      }

      const fetchedResources = result.data || [];
      setResources(fetchedResources);
      setSessions(groupResourcesIntoSessions(fetchedResources));
      
      // メタデータを更新
      if (result.meta) {
        setSessionMeta({
          sessionCount: result.meta.sessionCount || 0,
          maxSessions: result.meta.maxSessions || PLAN_LIMITS.FREE.maxSessions,
        });
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : '予期しないエラーが発生しました';
      setError(message);
      console.error('fetchResources error:', message);
    } finally {
      setLoading(false);
    }
  }, []);

  // URLリソースを保存
  const saveResource = useCallback(async (
    accessToken: string,
    resource: ResourceInput
  ): Promise<boolean> => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/dashboard', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(resource),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'リソースの保存に失敗しました');
      }

      return true;
    } catch (err) {
      const message = err instanceof Error ? err.message : '予期しないエラーが発生しました';
      setError(message);
      console.error('saveResource error:', message);
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  // ファイルをアップロード
  const uploadFile = useCallback(async (
    accessToken: string,
    file: File,
    name?: string,
    sessionId?: string
  ): Promise<boolean> => {
    setLoading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('file', file);
      if (name) {
        formData.append('name', name);
      }
      if (sessionId) {
        formData.append('session_id', sessionId);
      }

      const response = await fetch('/api/dashboard/upload', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
        body: formData,
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'ファイルのアップロードに失敗しました');
      }

      return true;
    } catch (err) {
      const message = err instanceof Error ? err.message : '予期しないエラーが発生しました';
      setError(message);
      console.error('uploadFile error:', message);
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  // セッション（リソース）を削除
  const deleteSession = useCallback(async (
    accessToken: string,
    sessionId: string,
    isStandalone: boolean = false
  ): Promise<boolean> => {
    setLoading(true);
    setError(null);

    try {
      // スタンドアロンの場合はresource_idとして、グループの場合はsession_idとして削除
      const param = isStandalone ? `resource_id=${sessionId}` : `session_id=${sessionId}`;
      const response = await fetch(`/api/dashboard?${param}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'セッションの削除に失敗しました');
      }

      // ローカルの状態を更新
      setResources((prev) => prev.filter((r) => 
        isStandalone ? r.id !== sessionId : r.session_id !== sessionId
      ));
      setSessions((prev) => prev.filter((s) => s.id !== sessionId));
      
      // セッション数を減らす
      setSessionMeta((prev) => ({
        ...prev,
        sessionCount: Math.max(0, prev.sessionCount - 1),
      }));

      return true;
    } catch (err) {
      const message = err instanceof Error ? err.message : '予期しないエラーが発生しました';
      setError(message);
      console.error('deleteSession error:', message);
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    resources,
    sessions,
    sessionMeta,
    loading,
    error,
    canCreateSession,
    fetchResources,
    saveResource,
    uploadFile,
    deleteSession,
  };
}
