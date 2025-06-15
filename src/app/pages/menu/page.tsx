'use client';

import { useEffect, useState, useCallback } from "react";
import type { User } from "@/types/user";
import { supabase } from "@/lib/supabaseClient";
import type { RoomResource } from "@/types/roomResource"; // 新しい型をインポート

// ファイル名に使う一意のIDを生成するヘルパー関数
// uuidライブラリをインストールしていない場合は、これを使用できます
// (npm install uuid と @types/uuid をインストールすることを推奨します)
function generateUniqueId() {
  return crypto.randomUUID();
}

export default function RoomResourcePage() { // コンポーネント名をRoomResourcePageに変更しました
  // --- 状態管理 ---
  const [user, setUser] = useState<User | null>(null);
  const [roomUrl, setRoomUrl] = useState<string>(""); // ココフォリアURL入力用
  const [resourceName, setResourceName] = useState<string>(""); // リソース名入力用
  const [selectedFile, setSelectedFile] = useState<File | null>(null); // 選択されたファイル用
  const [resources, setResources] = useState<RoomResource[]>([]); // 保存されたリソースの一覧
  const [uploading, setUploading] = useState<boolean>(false); // ファイルアップロード中の状態

  // --- 認証チェック ---
  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) {
        // ユーザーがログインしていない場合、ログインページへリダイレクト
        window.location.href = "/login";
      } else {
        // ユーザーがログインしている場合、ユーザー情報を設定し、リソースを取得
        setUser({ id: user.id, email: user.email ?? null });
        fetchResources(user.id); // ログインユーザーのリソースを取得
      }
    });
  }, []);

  // --- リソース取得関数 ---
  const fetchResources = useCallback(async (userId: string) => {
    // Supabaseの 'resources' テーブルから、現在のユーザーIDに紐づくリソースを取得
    const { data, error } = await supabase
      .from("resources") // リソースを保存する新しいテーブル名
      .select("*") // 全てのカラムを選択
      .eq("user_id", userId) // 現在のユーザーIDに一致するリソースのみ
      .order("created_at", { ascending: false }); // 作成日時で降順にソート

    if (error) {
      console.error("リソースの取得中にエラーが発生しました:", error.message);
      // ユーザーフレンドリーなエラー表示を追加することも検討
      return;
    }
    setResources(data || []); // 取得したリソースを状態に設定
  }, []);

  // --- リソース保存処理関数 ---
  const handleSaveResource = async () => {
    if (!user) {
      console.error("ユーザーが認証されていません。");
      return;
    }

    // URLもファイルも入力されていない場合は何もしない
    if (!roomUrl.trim() && !selectedFile) {
      console.warn("保存するURLまたはファイルが選択されていません。");
      return;
    }

    setUploading(true); // アップロード処理を開始
    let resourceToSave: Omit<RoomResource, 'id' | 'created_at'> | null = null; // データベースに保存するリソースデータ

    try {
      // ココフォリアURLが入力されている場合
      if (roomUrl.trim()) {
        resourceToSave = {
          user_id: user.id,
          type: 'cocofolia_url', // タイプを 'cocofolia_url' に設定
          name: resourceName.trim() || 'ココフォリア部屋URL', // 名前の入力がなければデフォルト名
          value: roomUrl.trim(),
        };
        // 'resources' テーブルにURLリソースを挿入
        const { error: insertError } = await supabase.from("resources").insert([resourceToSave]);
        if (insertError) throw new Error(`URLの保存に失敗しました: ${insertError.message}`);
        setRoomUrl(""); // 入力フィールドをクリア
        setResourceName(""); // 名前入力フィールドをクリア
      }

      // ファイルが選択されている場合
      if (selectedFile) {
        const fileExtension = selectedFile.name.split('.').pop(); // ファイル拡張子を取得
        const fileName = `file_${Date.now()}.${fileExtension}`; // 一意なファイル名を生成
        const filePath = `${user.id}/${fileName}`; // Supabase Storage内のパス (ユーザーIDごとのフォルダ)

        // Supabase Storageへのファイルアップロード
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from("room-resources") // ストレージバケット名 (Supabaseで事前に作成する必要があります)
          .upload(filePath, selectedFile, {
            cacheControl: '3600', // キャッシュ制御
            upsert: false, // 同じファイル名が存在しても上書きしない
          });

        if (uploadError) {
          throw new Error(`ファイルのアップロードに失敗しました: ${uploadError.message}`);
        }

        // アップロードしたファイルの公開URLを取得
        const { data: publicUrlData } = supabase.storage
          .from("room-resources")
          .getPublicUrl(filePath);

        if (!publicUrlData || !publicUrlData.publicUrl) {
          throw new Error("ファイルの公開URLを取得できませんでした。");
        }

        // ファイルのMIMEタイプに基づいてリソースタイプを決定
        let fileType: RoomResource['type'];
        if (selectedFile.type.startsWith('image/')) {
          fileType = 'image';
        } else if (selectedFile.type === 'application/pdf') {
          fileType = 'pdf';
        } else {
          fileType = 'other_url'; // その他のファイルタイプ
        }

        resourceToSave = {
          user_id: user.id,
          type: fileType,
          name: resourceName.trim() || selectedFile.name, // 名前の入力がなければファイル名
          value: publicUrlData.publicUrl,
        };
        // 'resources' テーブルにファイルリソースを挿入
        const { error: insertError } = await supabase.from("resources").insert([resourceToSave]);
        if (insertError) throw new Error(`ファイルのメタデータの保存に失敗しました: ${insertError.message}`);
        setSelectedFile(null); // 選択されたファイルをクリア
        setResourceName(""); // 名前入力フィールドをクリア
      }

      // URLまたはファイルが保存された後、リソースリストを再取得
      fetchResources(user.id);
    } catch (error: any) {
      console.error("リソースの保存中にエラーが発生しました:", error.message);
      // ここでユーザーにエラーメッセージを表示するUI (例: Snackbar, Dialog) を追加すると良いでしょう
    } finally {
      setUploading(false); // アップロード処理を終了
    }
  };

  // --- UI ---
  return (
    <div className="max-w-2xl mx-auto p-6 space-y-6">
      <h2 className="text-xl font-bold border-b pb-2 text-blue-800">ココフォリア部屋とリソースの管理</h2> {/* タイトルを更新 */}

      {/* リソース追加フォーム */}
      <div className="space-y-4 p-4 border rounded-lg shadow-md bg-white">
        <h3 className="text-lg font-semibold mb-2 text-blue-700">新しいリソースを追加</h3>
        <input
          type="text"
          value={resourceName}
          onChange={(e) => setResourceName(e.target.value)}
          placeholder="リソース名 (任意、例: シナリオPDF、セッションURL)"
          className="w-full rounded-lg border border-gray-300 p-3 focus:border-blue-500 focus:ring-blue-500"
        />
        <input
          type="url" // URL入力に特化したタイプ
          value={roomUrl}
          onChange={(e) => setRoomUrl(e.target.value)}
          placeholder="ココフォリア部屋URL または その他のURL (例: https://ccfolia.com/rooms/...)"
          className="w-full rounded-lg border border-gray-300 p-3 focus:border-blue-500 focus:ring-blue-500"
        />
        <input
          type="file"
          onChange={(e) => setSelectedFile(e.target.files ? e.target.files[0] : null)}
          className="w-full file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-100 file:text-blue-700 hover:file:bg-blue-200 cursor-pointer"
        />
        {selectedFile && (
          <p className="text-sm text-gray-600 mt-2">選択中のファイル: <span className="font-medium text-blue-700">{selectedFile.name}</span></p>
        )}
        <button
          onClick={handleSaveResource}
          disabled={uploading || (!roomUrl.trim() && !selectedFile)} // URLもファイルも入力されていない、またはアップロード中の場合はボタンを無効化
          className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 font-medium text-white hover:bg-blue-700 disabled:opacity-40 transition-colors duration-200"
        >
          {uploading ? "保存中..." : "リソースを保存"}
        </button>
      </div>

      {/* 保存されたリソース一覧 */}
      <ul className="space-y-6">
        <h3 className="text-xl font-bold border-b pb-2 text-blue-800">保存されたリソース</h3>
        {resources.length === 0 ? (
          <p className="text-gray-500 text-center py-4">まだリソースがありません。URLを入力するか、ファイルをアップロードして保存してみましょう。</p>
        ) : (
          resources.map((res) => (
            <li key={res.id} className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
              <h4 className="font-semibold text-lg text-blue-800 mb-1">{res.name || '名前なし'}</h4>
              {/* リソースのタイプに応じて表示を切り替え */}
              {(res.type === 'cocofolia_url' || res.type === 'other_url') ? (
                <a
                  href={res.value}
                  target="_blank" // 新しいタブで開く
                  rel="noopener noreferrer" // セキュリティ対策
                  className="text-blue-600 hover:underline break-all block" // URLが長くなっても改行されるように
                >
                  {res.value}
                </a>
              ) : res.type === 'image' ? (
                // next/imageを使わない場合の警告を回避するためにeslint-disableを使用
                // プロジェクトでnext/imageの設定が適切であればそちらを使用することを推奨
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={res.value}
                  alt={res.name || '画像'}
                  className="max-w-full h-auto rounded-lg mt-2 border border-gray-100"
                />
              ) : res.type === 'pdf' ? (
                <a
                  href={res.value}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-red-600 hover:underline block"
                >
                  📄 PDFファイルを開く: {res.name || 'PDF'}
                </a>
              ) : (
                <p>{res.value}</p> // 未知のタイプの場合、とりあえず値を表示
              )}
              <p className="mt-2 text-xs text-gray-500">
                保存日時: {new Date(res.created_at).toLocaleString()}
              </p>
            </li>
          ))
        )}
      </ul>
    </div>
  );
}
