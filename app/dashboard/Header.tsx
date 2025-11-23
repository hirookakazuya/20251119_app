// app/components/Header.tsx

import React, { useState, useRef, useEffect } from 'react';
import styles from '../app.module.css'; 

interface HeaderProps {
  displayNickname: string;
  onMenuButtonClick: () => void; // メニューボタン（ハンバーガー）
  onEditProfile: () => void; // プロフィール編集クリック時のハンドラ
  onSignOut: () => void; // サインアウトクリック時のハンドラ
}

export default function Header({ 
  displayNickname, 
  onMenuButtonClick, 
  onEditProfile,
  onSignOut,
}: HeaderProps) {
  // 💡 修正点 1: ドロップダウンメニューの開閉状態を管理
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  // 💡 修正点 2: 外側クリックを検知するための参照
  const dropdownRef = useRef<HTMLDivElement>(null);

  // ドロップダウンの表示をトグルする関数
  const toggleDropdown = () => {
    setIsDropdownOpen(prev => !prev);
  };
  
  // 💡 修正点 3: 外部クリックを検知してメニューを閉じるロジック
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      // クリックがドロップダウンの外側で行われた場合、メニューを閉じる
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    // クリーンアップ関数: コンポーネントがアンマウントされるときにイベントリスナーを削除
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);


  return (
    <header className={styles.header}> 
      
      {/* 左端: メニューボタン */}
      <button 
        className={styles.menuButton} 
        onClick={onMenuButtonClick}
        aria-label="メニューを開く"
      >
        ☰ 
      </button>
      
      <div className={styles.headerTitle}>
        {/* アプリのタイトル */}
      </div>

      {/* 💡 修正点 4: ニックネーム部分をドロップダウンコンテナとしてラップ */}
      <div 
        className={styles.profileDropdown} 
        ref={dropdownRef} // 参照を設定
      >
        {/* ニックネームをボタン化してクリックでメニューをトグル */}
        <button 
          className={styles.nicknameButton}
          onClick={toggleDropdown}
          aria-expanded={isDropdownOpen}
        >
          {displayNickname} 
        </button>
        
        {/* メニューリスト */}
        {isDropdownOpen && (
          <ul className={styles.dropdownMenu}>
            {/* 💡 onEditProfile を実行 */}
            <li onClick={() => {
              onEditProfile(); // 親コンポーネントで編集画面の表示を制御
              setIsDropdownOpen(false); // メニューを閉じる
            }}>
              Edit Profile
            </li>
            {/* 💡 onSignOut を実行 */}
            <li onClick={() => {
              onSignOut(); // 親コンポーネントの signOut 関数を実行
              setIsDropdownOpen(false); // メニューを閉じる
            }}>
              Sign out
            </li>
          </ul>
        )}
      </div>
      
    </header>
  );
}