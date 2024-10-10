// src/stores/userStore.js
import { defineStore } from "pinia";

export const useUserStore = defineStore("user", {
  state: () => ({
    userId: null,
    userKey: "",
    username: "",
    email: "",
    platformType: "",
    profileImg: "",
    createAt: null,
    isLogin: false, // 로그인 상태 추가
  }),
  actions: {
    setUser(user) {
      this.userId = user.user_id;
      this.userKey = user.user_key;
      this.username = user.username;
      this.email = user.email;
      this.platformType = user.platform_type;
      this.profileImg = user.profile_img;
      this.createAt = user.create_at;
      this.isLogin = true; // 로그인 상태 업데이트
    },
    clearUser() {
      this.userId = null;
      this.userKey = "";
      this.username = "";
      this.email = "";
      this.platformType = "";
      this.profileImg = "";
      this.createAt = null;
      this.isLogin = false; // 로그인 상태 초기화
    },
    getUser() {
      return {
        userId: this.userId,
        userKey: this.userKey,
        username: this.username,
        email: this.email,
        platformType: this.platformType,
        profileImg: this.profileImg,
        createAt: this.createAt,
        isLogin: this.isLogin, // 로그인 상태 반환
      };
    },
  },
});
