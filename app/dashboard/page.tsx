// app/dashboard/TodoList.tsx (または page.tsx)
'use client'

import { useState, useEffect } from "react";
import { useRouter } from 'next/navigation'; // 👈 ページ遷移のために追加
import type { Schema } from "@/amplify/data/resource";
import { useAmplifyClient } from '@/app/useAmplifyClient';

import styles from './NotesList.module.css';

export default function NotesList() {
    // Hooksの初期化
    const client = useAmplifyClient();
    const router = useRouter(); // 👈 useRouterの初期化

    // 状態管理: メモの配列
    // Schema["Note"]["type"] はバックエンドの 'Note' モデルの型
    const [notes, setNotes] = useState<Schema["Note"]["type"][]>([]);

    // ------------------------------------
    // C R U D 関数
    // ------------------------------------

    // R (Read): データ取得関数
    const fetchNotes = async () => {
        if (!client) return;

        try {
            // client.models.Note.list()でデータ全体を取得
            const { data: items } = await client.models.Note.list();
            setNotes(items);
        } catch (error) {
            console.error("データの読み込みに失敗しました:", error);
            // エラーハンドリングを追加
        }
    };

    // C (Create): 作成ページへの遷移
    const navigateToCreate = () => {
        // 新規作成ページへルーティング
        router.push('/dashboard/notes/create');
    }

    // U (Update): 編集ページへの遷移
    const navigateToEdit = (id: string) => {
        // 編集ページへルーティング (IDを含む動的パス)
        router.push(`/dashboard/notes/${id}/edit`);
    }

    // D (Delete): データ削除関数
    const deleteNote = async (id: string) => {
        if (!client) return;

        if (!window.confirm("このメモを削除しますか？")) {
            return;
        }

        try {
            // 削除実行
            await client.models.Note.delete({ id });

            // 成功したらリストを再取得 (またはローカルで削除)
            fetchNotes();
        } catch (error) {
            console.error("データの削除に失敗しました:", error);
        }
    };

    // ------------------------------------
    // Lifecycle (画面読み込み時の処理)
    // ------------------------------------

    // clientがnullから値に変わった時（初回ロード時）にデータをフェッチする
    useEffect(() => {
        if (client) {
            fetchNotes();
        }
    }, [client]);

    // ------------------------------------
    // UI レンダリング
    // ------------------------------------

    // クライアント生成中はローディング表示
    if (!client) {
        return <div>データを読み込み中...</div>;
    }

    // メインのUI
    return (
        <div>
            <h2>メモ一覧</h2>
            <button
                style={{
                    cursor: 'pointer' // マウスカーソルを変更してクリック可能であることを示す
                }}
                className={styles.createButton}
                onClick={navigateToCreate}>新規メモを作成</button>
            <ul>
                {notes.map(({ id, title, body }) => (
                    // 🚨 修正ポイント 1: <li>全体に onClick を追加し、編集ページへ遷移させる
                    <li
                        key={id}
                        className={styles.listItem}
                        style={{
                            borderBottom: '1px solid #ccc',
                            padding: '10px 0',
                            cursor: 'pointer', // マウスカーソルを変更してクリック可能であることを示す
                            display: 'flex'
                        }}
                        onClick={() => navigateToEdit(id)} // 👈 リスト全体をクリックで編集へ
                    >
                        <div>
                            <strong>{title}</strong>

                        </div>

                        {/* アクションボタン */}
                        {/* 修正ポイント 2: Editボタンは不要になるため削除（または非表示） */}
                        {/* 修正ポイント 3: DeleteボタンのonClickでイベント伝播を停止させる */}
                        <button
                            style={{
                                // 修正後のスタイル: キャメルケースに修正し、右寄せ（配置）を試みる
                                // インライン要素の右寄せは親要素の text-align で行う方が一般的ですが、
                                // ボタン自体を右に寄せるためにブロック要素と margin-left: auto を適用します。
                                marginLeft: 'auto', // 可能な限り右へ移動
                                display: 'block',   // margin-left: auto が効くようにブロック要素化
                                // textAlign: 'right', // ボタンの配置には効果が薄い
                            }}
                            className={styles.deleteButton}
                            onClick={(e) => {
                                e.stopPropagation(); // 👈 これが重要！親要素(<li>)への伝播を停止　//
                                deleteNote(id);
                            }}
                        >
                            Delete
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    );
}