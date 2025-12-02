// src/types/roomResource.ts

export type RoomResource = {
  id: string;
  user_id: string;
  created_at: string;
  type: 'cocofolia_url' | 'image' | 'pdf' | 'other_url';
  name: string | null;
  value: string;
  session_id: string | null; // 同時に登録されたリソースをグループ化するためのID
};

// セッション（グループ化されたリソース）
export type Session = {
  id: string;
  name: string;
  created_at: string;
  thumbnail: RoomResource | null;  // サムネイル画像
  url: RoomResource | null;        // ココフォリアURL等
  file: RoomResource | null;       // シナリオファイル（PDF等）
};
