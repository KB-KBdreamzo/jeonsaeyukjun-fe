<script>
import router from "@/router";
import axios from "axios";
import { useUserStore } from "@/stores/userStore"; // userStore 가져오기

export default {
  data() {
    return {
      user: null,
      error: null,
    };
  },
  mounted() {
    const code = this.$route.query.code;
    console.log("카카오 로그인 코드 : ", code);
    if (code) {
      this.getAccessToken(code);
    } else {
      this.error = "코드가 없습니다.";
    }
  },
  methods: {
    async getAccessToken(code) {
      try {
        const response = await axios.post(
          "https://kauth.kakao.com/oauth/token",
          null,
          {
            params: {
              grant_type: "authorization_code",
              client_id: "6f6db32df8814c2c64f9b4ba9f9160d4",
              redirect_uri: "http://localhost:5173/oauth/kakao",
              code: code,
            },
            headers: {
              "Content-Type": "application/x-www-form-urlencoded",
            },
          }
        );

        const accessToken = response.data.access_token;
        console.log("카카오 엑세스 토큰 : ", accessToken);
        this.getUserInfo(accessToken);
      } catch (error) {
        this.error = "액세스 토큰을 가져오는 데 실패했습니다.";
        console.error(error);
      }
    },
    async getUserInfo(token) {
      try {
        const response = await axios.get("https://kapi.kakao.com/v2/user/me", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        this.user = response.data;
        console.log("카카오 사용자 정보 : ", this.user);
        this.sendUserInfo(this.user);
      } catch (error) {
        this.error = "사용자 정보를 가져오는 데 실패했습니다.";
        console.error(error);
      }
    },
    async sendUserInfo(userInfo) {
      axios.defaults.withCredentials = true;
      const userStore = useUserStore(); // userStore 인스턴스 생성

      try {
        const userData = {
          userKey: userInfo.id.toString(),
          username: userInfo.kakao_account.profile?.nickname || "알수 없음",
          email: userInfo.kakao_account.email,
          platformType: "kakao",
          profileImg: userInfo.properties.thumbnail_image,
        };

        console.log("Sending user data:", userData);

        const response = await axios.post(
          "http://localhost:8080/api/login/kakao",
          userData
        );

        if (response.status !== 200) throw new Error("Login failed");

        console.log("로그인 성공!");

        const token = response.data;
        localStorage.setItem("user", JSON.stringify(userData));
        localStorage.setItem("token", JSON.stringify(token));

        // userStore에 사용자 정보 저장
        userStore.setUser(userData);

        const response2 = await axios.post(
          "http://localhost:8080/api/test",
          userData,
          {
            headers: {
              Authorization: "Bearer " + token,
            },
          }
        );

        console.log(response2.data);

        router.push("/");
      } catch (error) {
        this.error = "카카오 로그인에 실패했습니다.";
        console.error("Login error:", error);
      }
    },
  },
};
</script>
