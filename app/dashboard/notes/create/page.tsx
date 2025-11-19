// app/dashboard/notes/create/page.tsx
'use client'

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAmplifyClient } from '@/app/useAmplifyClient';

import styles from '../NoteForm.module.css';

export default function CreateNotePage() {
    const client = useAmplifyClient();
    const router = useRouter();
    
    // フォームの状態管理
    const [title, setTitle] = useState('');
    const [body, setBody] = useState('');

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault(); // フォームのデフォルト動作(ページリロード)を防ぐ
        
        if (!client || !title) return; // タイトルが空なら処理を停止
        
        try {
            await client.models.Note.create({
                title: title,
                body: body,
            });
            
            // 成功したら一覧ページに戻る
            router.push('/dashboard'); 
        } catch (error) {
            console.error("メモ作成エラー:", error);
            alert("メモの作成に失敗しました。");
        }
    };
    
    if (!client) {
        return <div>クライアントを読み込み中...</div>;
    }

    return (
        // 🚨 formContainer クラスを div に適用
        <div className={styles.formContainer}>
            <h2>新規メモの作成</h2>
            <form onSubmit={handleCreate}>
                
                {/* 🚨 formGroup クラスを適用 */}
                <div className={styles.formGroup}>
                    {/* 🚨 label クラスを適用 */}
                    <label className={styles.label}>タイトル:</label>
                    <input 
                        // 🚨 inputField クラスを適用
                        className={styles.inputField} 
                        type="text" 
                        value={title} 
                        onChange={(e) => setTitle(e.target.value)} 
                        required
                    />
                </div>
                
                {/* 🚨 formGroup クラスを適用 */}
                <div className={styles.formGroup}>
                    {/* 🚨 label クラスを適用 */}
                    <label className={styles.label}>本文:</label>
                    <textarea 
                        // 🚨 textAreaField クラスを適用
                        className={styles.textAreaField} 
                        value={body} 
                        onChange={(e) => setBody(e.target.value)}
                        rows={10}
                    />
                </div>
                
                {/* 🚨 actionButtons クラスを適用 */}
                <div className={styles.actionButtons}>
                    {/* 🚨 submitButton クラスを適用 */}
                    <button type="submit" className={styles.submitButton}>作成</button>
                    {/* 🚨 cancelButton クラスを適用 */}
                    <button type="button" className={styles.cancelButton} onClick={() => router.back()}>キャンセル</button>
                </div>
            </form>
        </div>
    );
}