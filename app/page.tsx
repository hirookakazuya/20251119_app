// app/page.tsx

'use client'
import { Authenticator } from '@aws-amplify/ui-react';
import NotesList from '../app/dashboard/page';// TodoListコンポーネントを切り出す

export default function DashboardPage() {
  return (
    <Authenticator>
      {({ signOut, user }) => (
        <main>
          <h1>Hello, {user?.username}!</h1>
          <NotesList /> {/* 👈 Todoリストコンポーネントを配置 */}
          <button onClick={signOut}>サインアウト</button>
        </main>
      )}
    </Authenticator>
  );
}