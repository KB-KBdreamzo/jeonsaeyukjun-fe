<template>
  <div id="app" class="flex flex-col h-screen">
    <main>
      <!-- 부가 정보 4 섹션 -->
      <div
        class="h-screen flex flex-col justify-center items-center bg-gray-800 relative"
      >
        <div
          class="absolute text-center"
          style="top: 90px; left: 50%; transform: translateX(-50%)"
        >
          <div data-aos="flip-down" class="bg-opacity-60 p-10 rounded-lg">
            <h1 class="text-5xl font-semibold text-white">
              전세사기 예방은 전세역전과 함께
            </h1>
            <p class="text-2xl text-[#b0b8c1] mt-16">
              불안한 전세계약 많이 힘드셨죠?
            </p>
            <p class="text-2xl text-[#b0b8c1] mt-4">
              리포트를 통한 안전진단에서 계약서 작성까지
            </p>
            <p class="text-2xl text-[#b0b8c1] mt-4">
              이제 전세역전과 함께 만들어봐요
            </p>
          </div>
        </div>
        <button
          data-aos="flip-down"
          class="w-[240px] h-[60px] bg-[#3182f6] text-white text-xl font-semibold rounded-[10px] transition duration-300 hover:bg-[#2674c9] mt-80"
        >
          리포트 만들기
        </button>
        <p
          data-aos="flip-down"
          class="text-xl text-[#b0b8c1] mt-4 hover:text-[#2674c9] transition duration-300 cursor-pointer"
        >
          아니요. 좀 더 알아볼래요!
        </p>
      </div>
    </main>
    <div>
      <p v-if="error">{{ error }}</p>
      <TermsOfUseModal
        v-if="isModalOpen"
        :isOpen="isModalOpen"
        :userInfo="kakaoUserInfo"
        @close="isModalOpen = false"
        @agree="onAgree"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import axios from "axios";
import { useUserStore } from "@/stores/userStore";
import TermsOfUseModal from "@/components/TermsOfUseModal.vue";

const userStore = useUserStore();
const router = useRouter();
const error = ref(null);
const isModalOpen = ref(false);
const kakaoUserInfo = ref(null);

const code = router.currentRoute.value.query.code;
console.log("카카오 로그인 코드 : ", code);

onMounted(() => {
  if (code) {
    getAccessToken(code);
  } else {
    error.value = "코드가 없습니다.";
  }
});

const getAccessToken = async (code) => {
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
    getUserInfo(accessToken);
  } catch (error) {
    error.value = "액세스 토큰을 가져오는 데 실패했습니다.";
    console.error(error);
  }
};

const getUserInfo = async (token) => {
  try {
    const response = await axios.get("https://kapi.kakao.com/v2/user/me", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const user = response.data;
    console.log("카카오 사용자 정보 : ", user);
    checkUserAndProceed(user);
  } catch (error) {
    error.value = "사용자 정보를 가져오는 데 실패했습니다.";
    console.error(error);
  }
};

const checkUserAndProceed = async (userInfo) => {
  axios.defaults.withCredentials = true;

  try {
    const userData = {
      userKey: userInfo.id.toString(),
      username: userInfo.kakao_account.profile?.nickname || "알수 없음",
      email: userInfo.kakao_account.email,
      platformType: "kakao",
      profileImg: userInfo.properties.thumbnail_image,
    };

    console.log("Sending user data:", userData);

    const checkResponse = await axios.post(
      "http://localhost:8080/api/login/kakao/check",
      userData
    );

    // 가입된 회원이 아니면 정책 모달 열기
    if (!checkResponse.data) {
      kakaoUserInfo.value = userData;
      isModalOpen.value = true;
    } else {
      // 이미 가입된 회원이면 바로 로그인 진행
      await loginUser(userData);
    }
  } catch (error) {
    error.value = "사용자 확인 중 오류가 발생했습니다.";
    console.error("User check error:", error);
  }
};

const loginUser = async (userData) => {
  try {
    const loginResponse = await axios.post(
      "http://localhost:8080/api/login/kakao",
      userData
    );

    console.log("로그인 성공!");

    const token = loginResponse.data;
    localStorage.setItem("user", JSON.stringify(userData));
    localStorage.setItem("token", JSON.stringify(token));

    // userStore에 사용자 정보 저장
    userStore.setUser(userData);

    // 추가 API 호출
    const testResponse = await axios.post(
      "http://localhost:8080/api/test",
      userData,
      {
        headers: {
          Authorization: "Bearer " + token,
        },
      }
    );

    console.log(testResponse.data);
    router.push("/");
  } catch (error) {
    error.value = "카카오 로그인에 실패했습니다.";
    console.error("Login error:", error);
  }
};

// 동의 버튼 클릭 시 카카오 로그인 진행
const onAgree = async (userData) => {
  isModalOpen.value = false; // 모달 닫기
  await loginUser(userData);
};
</script>