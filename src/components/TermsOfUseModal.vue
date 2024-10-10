<template>
  <Teleport to="body">
    <div
      v-if="isOpen"
      class="fixed top-0 left-0 w-full h-full flex justify-center items-center z-50"
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
          <div class="text">
            <div class="title text-2xl font-bold mb-4">이용약관</div>
            <div class="con">
              <div class="modal-body space-y-4">
                <h3 class="text-xl font-semibold">제1조 목적</h3>
                <p>
                  본 이용약관은 “회사이름”(이하 "사이트")의 서비스의 이용조건과
                  운영에 관한 제반 사항 규정을 목적으로 합니다.
                </p>

                <h3 class="text-xl font-semibold">제2조 용어의 정의</h3>
                <p>
                  본 약관에서 사용되는 주요한 용어의 정의는 다음과 같습니다.
                </p>
                <ol class="list-decimal list-inside">
                  <li>
                    <strong>회원:</strong> 사이트의 약관에 동의하고 개인정보를
                    제공하여 회원등록을 한 자로서, 사이트와의 이용계약을
                    체결하고 사이트를 이용하는 이용자를 말합니다.
                  </li>
                  <li>
                    <strong>이용계약:</strong> 사이트 이용과 관련하여 사이트와
                    회원 간에 체결하는 계약을 말합니다.
                  </li>
                  <li>
                    <strong>회원 아이디 (ID):</strong> 회원의 식별과 회원의
                    서비스 이용을 위하여 회원별로 부여하는 고유한 문자와 숫자의
                    조합을 말합니다.
                  </li>
                  <li>
                    <strong>비밀번호:</strong> 회원이 부여받은 ID와 일치된
                    회원임을 확인하고 회원의 권익 보호를 위하여 회원이 선정한
                    문자와 숫자의 조합을 말합니다.
                  </li>
                  <li>
                    <strong>운영자:</strong> 서비스에 홈페이지를 개설하여
                    운영하는 운영자를 말합니다.
                  </li>
                  <li>
                    <strong>해지:</strong> 회원이 이용계약을 해약하는 것을
                    말합니다.
                  </li>
                </ol>

                <h3 class="text-xl font-semibold">제3조 약관 외 준칙</h3>
                <p>
                  운영자는 필요한 경우 별도로 운영정책을 공지 안내할 수 있으며,
                  본 약관과 운영정책이 중첩될 경우 운영정책이 우선 적용됩니다.
                </p>

                <h3 class="text-xl font-semibold">제4조 이용계약 체결</h3>
                <p>
                  ① 이용계약은 회원으로 등록하여 사이트를 이용하려는 자의 본
                  약관 내용에 대한 동의와 가입신청에 대하여 운영자의
                  이용승낙으로 성립합니다.<br />
                  ② 회원으로 등록하여 서비스를 이용하려는 자는 사이트 가입신청
                  시 본 약관을 읽고 아래에 있는 "동의합니다"를 선택하는 것으로
                  본 약관에 대한 동의 의사 표시를 합니다.
                </p>

                <!-- 나머지 조항들도 비슷한 형식으로 추가하세요 -->
              </div>
            </div>
          </div>

          <!-- 체크박스 추가 -->
          <div class="flex items-center mt-4">
            <input type="checkbox" id="agree" class="mr-2" v-model="isAgreed" />
            <label for="agree" class="text-gray-700"
              >위의 약관에 동의합니다</label
            >
          </div>

          <!-- 버튼 추가 -->
          <div class="flex space-x-7 mt-8" style="padding-bottom: 30px">
            <button
              class="flex-2 bg-gray-700 text-white px-4 py-2 rounded hover:bg-gray-600 transition duration-300"
              @click="goToHomePage"
            >
              뒤로가기
            </button>
            <button
              :class="[
                isAgreed
                  ? 'bg-[#FFEB02] text-black hover:bg-[#FFD700]'
                  : 'bg-gray-300 text-white cursor-not-allowed',
                'flex-2 px-4 py-2 rounded transition duration-300',
              ]"
              :disabled="!isAgreed"
              @click="isAgreed ? handleKakaoLogin() : null"
            >
              카카오 로그인
            </button>
          </div>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup>
import router from "@/router";
import { defineProps, defineEmits, ref } from "vue";

const props = defineProps({
  isOpen: Boolean,
  title: String,
});

const emit = defineEmits(["close"]);

const closeModal = () => {
  emit("close");
};

// 상태 관리
const isAgreed = ref(false);

// Kakao 로그인 관련 설정
const KAKAO_CLIENT_ID = "6f6db32df8814c2c64f9b4ba9f9160d4";
const KAKAO_REDIRECT_URI = "http://localhost:5173/oauth/kakao";
const KAKAO_AUTH_URL = `https://kauth.kakao.com/oauth/authorize?client_id=${KAKAO_CLIENT_ID}&redirect_uri=${KAKAO_REDIRECT_URI}&response_type=code`;

const handleKakaoLogin = () => {
  window.location.href = KAKAO_AUTH_URL;
};

// 홈페이지로 이동하는 함수 추가
const goToHomePage = () => {
  router.push("/");
  closeModal();
};
</script>

<style scoped>
.modal-body {
  scrollbar-width: thin; /* Firefox에서 스크롤바를 얇게 설정 */
  scrollbar-color: transparent transparent; /* 스크롤바와 트랙 색상 설정 */
}

.modal-body::-webkit-scrollbar {
  width: 8px; /* 스크롤바의 너비 */
}

.modal-body::-webkit-scrollbar-thumb {
  background: transparent; /* 스크롤바 색상 */
}

.modal-body::-webkit-scrollbar-thumb:hover {
  background: transparent; /* hover 시 색상 */
}

.modal-body::-webkit-scrollbar-track {
  background: transparent; /* 스크롤바 트랙 색상 */
}
</style>
