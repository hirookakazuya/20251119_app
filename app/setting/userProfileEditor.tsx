// app/setting/UserProfileEditor.tsx
'use client'
import React, { useState } from 'react';
import { updateUserAttributes } from 'aws-amplify/auth';

import styles from './setting.module.css';

// ユーザー属性の型は親コンポーネント（page.tsx）と同じ定義を使用
interface UserAttributes {
  nickname?: string;
  [key: string]: any; // その他の属性を許容
}

// 💡 修正点 1: Propsの型を簡略化し、必要な初期属性と更新コールバックを受け取るようにする
interface UserProfileEditorProps {
  initialAttributes: UserAttributes | null; // 初期値として属性全体を受け取る
  // 更新が成功したときに親コンポーネントに通知するためのコールバック
  onUpdateSuccess: () => void; 
}

// 💡 修正点 2: Propsの受け取り方を変更
const UserProfileEditor = ({ initialAttributes, onUpdateSuccess }: UserProfileEditorProps) => {
  // ユーザーの現在のニックネームを取得（未設定なら空文字）
  // 💡 修正点 3: initialAttributesからニックネームを取得
  const currentNickname = initialAttributes?.nickname || '';
  // フォームのStateとして使用（更新前の初期値としてセット）
  const [nickname, setNickname] = useState(currentNickname); 
  const [message, setMessage] = useState('');

  const handleUpdate = async () => {
    setMessage('');

    // ニックネームが変更されていない場合は何もしない
    if (nickname === currentNickname) {
      setMessage('ニックネームは変更されていません。');
      return;
    }

    try {
      const output = await updateUserAttributes({
        userAttributes: {
          nickname: nickname,
        },
      });

      // updateUserAttributes の結果処理は現状維持で問題ありません
      const nicknameResult = output.nickname;

      if (nicknameResult) {
        if (nicknameResult.isUpdated) {
          setMessage('ニックネームが更新されました！');
          // 💡 修正点 4: 更新成功時に親コンポーネントに通知
          onUpdateSuccess(); 

        } else if (nicknameResult.nextStep && nicknameResult.nextStep.updateAttributeStep === 'CONFIRM_ATTRIBUTE_WITH_CODE') {
          setMessage('更新には確認コードの入力が必要です。');
          // CONFIRM_ATTRIBUTE_WITH_CODE の処理は必要に応じて実装
        } else {
          setMessage('更新処理は完了しましたが、状態が確認できませんでした。');
        }
      } else {
        setMessage('ニックネームの更新結果が取得できませんでした。');
      }

    } catch (error) {
      console.error('属性の更新に失敗しました:', error);
      setMessage(`更新失敗: ${error instanceof Error ? error.message : '不明なエラー'}`);
    }
  };

  return (
    <div>
      <h2>プロフィール編集</h2>
      {/* 💡 修正点 5: initialAttributesから取得したニックネームを表示 */}
      <p>現在のニックネーム: {currentNickname || '未設定'}</p> 
      <input
        className={styles.inputField}
        type="text"
        value={nickname}
        onChange={(e) => setNickname(e.target.value)}
        placeholder="新しいニックネーム"
      />
      <button className={styles.submitButton} onClick={handleUpdate}>ニックネームを保存</button>
      {message && <p>{message}</p>}
    </div>
  );
};

export default UserProfileEditor;