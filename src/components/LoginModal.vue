<template>
  <Teleport to="body">
    <div
      v-if="isOpen"
      class="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex justify-center items-center z-50"
      @click="closeModal"
    >
      <div
        class="bg-white rounded-lg shadow-lg max-w-md w-full h-[500px] overflow-y-auto relative"
        @click.stop
      >
        <button
          class="absolute top-4 right-6 bg-transparent border-none text-2xl text-gray-700 cursor-pointer hover:text-red-600"
          @click="closeModal"
        >
          &times;
        </button>
        <div class="flex flex-col items-center justify-start h-full p-8">
          <div class="flex items-center mb-8 mt-4">
            <img src="../assets/logo.svg" class="mr-2 w-12 h-12" />
            <h2 class="text-4xl font-custom">전세역전</h2>
          </div>

          <div class="flex items-center justify-center mb-4">
            <div
              class="w-[336px] h-[48px] bg-white rounded border border-[#D9D9D9] flex items-center justify-center transition duration-300 ease-in-out hover:bg-[#F0F0F0] cursor-pointer"
            >
              <img src="../assets/googleLogo.svg" class="mr-2" />
              <span>구글 로그인</span>
            </div>
          </div>

          <div class="flex items-center justify-center mb-4">
            <div
              class="w-[336px] h-[48px] bg-[#FFEB02] rounded flex items-center justify-center transition duration-300 ease-in-out hover:bg-[#FFD700] cursor-pointer"
              @click="handleKakaoLogin"
            >
              <img src="../assets/kakaoLogo.svg" class="mr-2" />
              <span class="text-[#3C1E1E]">카카오 로그인</span>
            </div>
          </div>

          <div class="flex items-center justify-center mb-4">
            <div
              class="w-[336px] h-[48px] bg-[#27D34A] rounded flex items-center justify-center transition duration-300 ease-in-out hover:bg-[#1DBD3A] cursor-pointer"
            >
              <img src="../assets/naverLogo.svg" class="mr-2" />
              <span class="text-[#FFFFFF]">네이버 로그인</span>
            </div>
          </div>

          <div class="flex items-center mb-4 w-full justify-center">
            <hr class="w-[124px] border-t border-gray-300" />
            <span class="mx-8 text-gray-500">또는</span>
            <hr class="w-[124px] border-t border-gray-300" />
          </div>

          <div class="flex items-center justify-center mb-4">
            <div
              class="w-[336px] h-[48px] bg-white rounded border border-[#3182F6] flex items-center justify-center transition duration-300 ease-in-out hover:bg-[#F0F0F0] cursor-pointer"
            >
              <span class="text-[#3182F6]">전세역전 로그인</span>
            </div>
          </div>

          <div class="flex items-center justify-between mt-4">
            <div class="flex items-center">
              <span
                class="mx-1 text-gray-500 transition duration-300 ease-in-out hover:text-[#E0E0E0] cursor-pointer"
                >아이디 찾기</span
              >
              <div class="w-[1px] h-6 bg-gray-300 mx-2"></div>
            </div>
            <div class="flex items-center">
              <span
                class="mx-1 text-gray-500 transition duration-300 ease-in-out hover:text-[#E0E0E0] cursor-pointer"
                >비밀번호 찾기</span
              >
              <div class="w-[1px] h-6 bg-gray-300 mx-2"></div>
            </div>
            <div class="flex items-center">
              <span
                class="mx-1 text-gray-500 transition duration-300 ease-in-out hover:text-[#E0E0E0] cursor-pointer"
                >회원가입</span
              >
            </div>
          </div>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup>
import { defineProps, defineEmits } from "vue";

const props = defineProps({
  isOpen: Boolean,
  title: String,
  scrollPosition: Number,
});

const emit = defineEmits(["close", "kakao-login"]);

const closeModal = () => {
  emit("close");
};

// Kakao 로그인 관련 설정
const KAKAO_CLIENT_ID = "6f6db32df8814c2c64f9b4ba9f9160d4";
const KAKAO_REDIRECT_URI = "http://localhost:5173/oauth/kakao";
const KAKAO_AUTH_URL = `https://kauth.kakao.com/oauth/authorize?client_id=${KAKAO_CLIENT_ID}&redirect_uri=${KAKAO_REDIRECT_URI}&response_type=code`;

const handleKakaoLogin = () => {
  window.location.href = KAKAO_AUTH_URL;
};
</script>

<style scoped>
/* 추가적인 스타일이 필요하다면 여기에 작성할 수 있습니다. */
</style>