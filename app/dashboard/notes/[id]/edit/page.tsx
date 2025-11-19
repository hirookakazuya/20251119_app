'use client'

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAmplifyClient } from '@/app/useAmplifyClient';
import styles from '../../NoteForm.module.css';

export default function EditNotePage() {
    const client = useAmplifyClient();
    const router = useRouter();
    const params = useParams(); // URLパラメータを取得
    const noteId = params.id as string; // メモのID

    const [title, setTitle] = useState('');
    const [body, setBody] = useState('');
    const [isLoading, setIsLoading] = useState(true);

    // 既存メモのデータを取得
    useEffect(() => {
        const fetchNote = async () => {
            if (!client || !noteId) return;

            try {
                const { data: note } = await client.models.Note.get({ id: noteId });
                if (note) {
                    setTitle(note.title || '');
                    setBody(note.body || '');
                } else {
                    // alert() の代わりにカスタムモーダルを推奨しますが、ここでは確認として残します
                    alert('メモが見つかりません。');
                    router.push('/dashboard');
                }
            } catch (error) {
                console.error("メモ取得エラー:", error);
                alert('データの読み込みに失敗しました。');
            } finally {
                setIsLoading(false);
            }
        };
        fetchNote();
    }, [client, noteId, router]);

    // メモ更新処理
    const handleUpdate = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!client || !title) return;

        try {
            await client.models.Note.update({
                id: noteId,
                title: title,
                body: body,
            });

            // 成功したら一覧ページに戻る
            router.push('/dashboard');
        } catch (error) {
            console.error("メモ更新エラー:", error);
            alert("メモの更新に失敗しました。");
        }
    };

    // 💡 新しく追加: メモ削除処理
    const handleDelete = async () => {
        if (!client || !noteId) return;

        // 削除確認 (ブラウザ標準の confirm を使用)
        if (!window.confirm("このメモを完全に削除しますか？\nこの操作は元に戻せません。")) {
            return;
        }

        try {
            // 削除実行
            await client.models.Note.delete({ id: noteId });

            // 成功したら、一覧ページにリダイレクト
            router.push('/dashboard');
        } catch (error) {
            console.error("メモ削除エラー:", error);
            alert("メモの削除に失敗しました。");
        }
    };

    if (isLoading || !client) {
        return <div>データを読み込み中...</div>;
    }

    return (
        <div className={styles.formContainer}>
            <h2>メモの編集</h2>
            <form onSubmit={handleUpdate}>

                <div className={styles.formGroup}>
                    <label className={styles.label}>タイトル:</label>
                    <input
                        className={styles.inputField}
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                    />
                </div>

                <div className={styles.formGroup}>
                    <label className={styles.label}>本文:</label>
                    <textarea
                        className={styles.textAreaField}
                        value={body}
                        onChange={(e) => setBody(e.target.value)}
                        rows={10}
                    />
                </div>

                {/* 💡 ボタンコンテナ: 更新・キャンセルボタンと削除ボタンを格納 */}
                <div className={styles.actionButtons}>
                    {/* 主要アクションボタン（左側） */}
                    <button type="submit" className={styles.submitButton}>更新</button>
                    <button type="button" className={styles.deleteButton} onClick={handleDelete}>削除</button>
                    <button type="button" className={styles.cancelButton} onClick={() => router.back()}>キャンセル</button>
                </div>
            </form>
        </div>
    );
}