// amplify/auth/resource.ts

import { defineAuth, secret } from "@aws-amplify/backend";

export const auth = defineAuth({
  loginWith: {
    email: true,
  },
  userAttributes: {
    // 💡 ニックネーム (Nickname) は標準属性として利用可能
    nickname: {
      required: false, 
      mutable: true, 
    },
    // 💡 氏名 (Family Name / Given Name) を使う場合はこれらを使う
    familyName: { // 姓
      required: false, 
      mutable: true,
    },
    givenName: { // 名
      required: false, 
      mutable: true,
    },
    // name属性は削除または変更してください
  },
});