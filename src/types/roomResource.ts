
// src/types/roomResource.ts
export type RoomResource = {
    id: string;
    user_id: string; // リソースを保存したユーザーのID
    created_at: string; // 作成日時
    type: 'cocofolia_url' | 'image' | 'pdf' | 'other_url'; // リソースの種類を識別
    name: string | null; // リソースの表示名 (任意)
    value: string; // ココフォリアのURL、またはアップロードされたファイルの公開URL
};