// app/page.tsx
'use client'
import { Authenticator } from '@aws-amplify/ui-react';
import { fetchUserAttributes } from 'aws-amplify/auth';
import React, { useState, useEffect, useCallback } from 'react'; 
import NotesList from '../app/dashboard/page'; 
import UserProfileEditor from './setting/userProfileEditor';
import styles from './app.module.css';
import Header from './dashboard/Header'; // Header コンポーネントをインポート

interface UserAttributes {
  [key: string]: string;
}

export default function DashboardPage() {
  const [userAttributes, setUserAttributes] = useState<UserAttributes | null>(null);
  // メニューの開閉状態 (左端のハンバーガーメニュー用)
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  // 💡 修正点 1: プロフィール編集モーダルの表示状態
  const [isEditingProfile, setIsEditingProfile] = useState(false); 

  // メニューボタンクリック時のハンドラー
  const handleMenuClick = useCallback(() => {
    setIsMenuOpen(prev => !prev);
  }, []); 

  // 💡 修正点 2: Edit Profile クリック時のハンドラー
  const handleEditProfile = useCallback(() => {
    // 編集モーダルを開く
    setIsEditingProfile(true); 
    // サイドメニューが開いていたら閉じる (オプション)
    setIsMenuOpen(false);
  }, []);
  
  // 💡 修正点 3: 属性取得（更新）のロジック。更新成功時にモーダルを閉じる。
  const getUserAttributes = useCallback(async () => {
    try {
      const attributes = await fetchUserAttributes();
      setUserAttributes(attributes as UserAttributes); 
      // 属性更新成功後、または初回取得成功後にモーダルを閉じる
      setIsEditingProfile(false); 
      return true;
    } catch (error) {
      console.error('Error fetching user attributes:', error);
      setUserAttributes(null);
      return false; 
    }
  }, []); 

  // 初回マウント時や認証状態が変わった時に属性を取得
  useEffect(() => {
    getUserAttributes();
  }, [getUserAttributes]); 

  // 💡 修正点 4: モーダルを閉じるためのヘルパー関数
  const handleCloseModal = useCallback(() => {
    setIsEditingProfile(false);
  }, []);


  return (
    <Authenticator>
      {({ signOut, user }) => { 
        
        const displayNickname = userAttributes?.nickname ?? 'Guest';

        return (
          <main>
            {/* Header コンポーネント */}
            <Header 
              displayNickname={displayNickname} 
              onMenuButtonClick={handleMenuClick} 
              onEditProfile={handleEditProfile} // 編集ハンドラを渡す
              onSignOut={signOut} // signOut 関数をそのまま渡す
            />
            
            {/* サイドバーメニュー (左端のハンバーガーメニュー用) */}
            {isMenuOpen && (
              <aside className={styles.sidebar}>
                サイドバーメニュー
              </aside>
            )}

            <NotesList />
            
            {/* 💡 修正点 5: モーダル表示ロジック */}
            {userAttributes && isEditingProfile && (
              <div className={styles.modalOverlay}>
                <div className={styles.modalContent}>
                   {/* 閉じるボタン */}
                   <button 
                     className={styles.modalCloseButton} 
                     onClick={handleCloseModal}
                   >
                     ×
                   </button>
                   
                   {/* UserProfileEditor コンポーネント */}
                   <UserProfileEditor 
                      initialAttributes={userAttributes} 
                      // 属性更新成功時に State を最新化し、モーダルを自動で閉じる
                      onUpdateSuccess={getUserAttributes} 
                    />
                </div>
              </div>
            )}
            
            {/* サインアウトボタンは Header 内のドロップダウンに移動したため、ここでは削除します */}
          </main>
        );
      }}
    </Authenticator>
  );
}