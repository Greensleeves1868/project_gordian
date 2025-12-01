// src/hooks/useResources.ts
import { useState, useCallback } from 'react';
import type { RoomResource } from '@/types/roomResource';

type ResourceInput = {
  type: RoomResource['type'];
  name: string;
  value: string;
};

type UseResourcesReturn = {
  resources: RoomResource[];
  loading: boolean;
  error: string | null;
  fetchResources: (accessToken: string) => Promise<void>;
  saveResource: (accessToken: string, resource: ResourceInput) => Promise<boolean>;
  uploadFile: (accessToken: string, file: File, name?: string) => Promise<boolean>;
};

export function useResources(): UseResourcesReturn {
  const [resources, setResources] = useState<RoomResource[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // リソース一覧を取得
  const fetchResources = useCallback(async (accessToken: string) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/menu', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'リソースの取得に失敗しました');
      }

      setResources(result.data || []);
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
      const response = await fetch('/api/menu', {
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
    name?: string
  ): Promise<boolean> => {
    setLoading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('file', file);
      if (name) {
        formData.append('name', name);
      }

      const response = await fetch('/api/menu/upload', {
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

  return {
    resources,
    loading,
    error,
    fetchResources,
    saveResource,
    uploadFile,
  };
}

