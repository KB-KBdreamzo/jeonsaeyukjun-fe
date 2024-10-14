<template>
  <Teleport to="body">
    <div
      v-if="isOpen"
      class="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex justify-center items-center z-50"
      @click="closeModal"
    >
      <div
        class="bg-white rounded-lg shadow-lg max-w-md w-full h-[500px] relative"
        @click.stop
      >
        <button
          class="absolute top-4 right-6 bg-transparent border-none text-2xl text-gray-700 cursor-pointer hover:text-red-600"
          @click="goToHomePage"
        >
          &times;
        </button>
        <div class="flex flex-col items-center justify-start h-full p-6">
          <div class="text">
            <div class="title text-2xl font-bold mb-4">전세역전 이용약관</div>
            <div class="con">
              <div
                class="modal-body border p-4 rounded-md space-y-4 overflow-y-auto max-w-sm h-[300px]"
              >
                <h3 class="text-xl font-semibold">제1조 목적</h3>
                <p>
                  이 약관은 전세역전(이하 '서비스')의 이용에 관한 사항을
                  규정하여, 사용자(이하 '이용자')의 권리와 의무를 명확히 하기
                  위해 마련되었습니다.
                </p>

                <h3 class="text-xl font-semibold">제2조 수집하는 개인정보</h3>
                <p>서비스 이용을 위해 다음과 같은 개인정보를 수집합니다.</p>
                <ol class="list-decimal list-inside">
                  <li>
                    <strong>임대인 정보:</strong> 임대인의 주민등록상의
                    기본정보로, 생년월일, 상세주소, 도로명 주소를 포함합니다. 이
                    정보는 계약의 안전성과 신뢰성을 확보하기 위해 임차인이
                    제공해야 합니다.
                  </li>
                  <li><strong>전세금 정보:</strong> 전세금</li>
                  <li><strong>사용자 정보:</strong> 유저 ID</li>
                </ol>

                <h3 class="text-xl font-semibold">
                  제3조 개인정보 보유 및 이용 기간
                </h3>
                <p>
                  이용자가 서비스 이용을 중단하더라도, 아래의 개인정보는 계속
                  보관됩니다.
                </p>
                <ol class="list-decimal list-inside">
                  <li>
                    <strong>임대인 정보</strong>
                  </li>
                  <li><strong>전세금 정보</strong></li>
                  <li><strong>사용자 정보</strong></li>
                </ol>
                <p>
                  이러한 정보는 서비스의 안전성과 신뢰성을 높이기 위해 필요한
                  데이터로, 향후 서비스 개선 및 고객 지원에 활용될 수 있습니다.
                </p>

                <h3 class="text-xl font-semibold">제4조 개인정보 보호</h3>
                <p>
                  이용자의 개인정보는 관련 법령에 따라 안전하게 관리되며,
                  제3자에게 제공되지 않습니다. 개인정보 보호를 위해 최선을
                  다하겠습니다.
                </p>
                <h3 class="text-xl font-semibold">
                  제5조 회원 탈퇴 후 개인정보 처리
                </h3>
                <p>
                  이용자가 회원 탈퇴를 하더라도, 서비스의 안전성과 관련된 정보는
                  계속 보관되며, 이는 법적 의무 또는 서비스의 개선을 위한 목적에
                  사용될 수 있습니다. 이 점은 서비스 이용 시 반드시 이해해
                  주시기 바랍니다.
                </p>
                <h3 class="text-xl font-semibold">제6조 약관의 변경</h3>
                <p>
                  이 약관은 변경될 수 있으며, 변경 시 이용자에게 사전
                  고지합니다. 변경된 약관에 동의하지 않는 경우, 서비스 이용을
                  중단할 수 있습니다.
                </p>
                <h3 class="text-xl font-semibold">제7조 이용계약 체결</h3>
                <p>
                  ① 이용계약은 회원으로 등록하여 사이트를 이용하려는 자의 본
                  약관 내용에 대한 동의와 가입신청에 대하여 운영자의
                  이용승낙으로 성립합니다.<br />
                  ② 회원으로 등록하여 서비스를 이용하려는 자는 사이트 가입신청
                  시 본 약관을 읽고 아래에 있는 "동의합니다"를 선택하는 것으로
                  본 약관에 대한 동의 의사 표시를 합니다.
                </p>
              </div>
            </div>
          </div>

          <div class="flex items-center mt-4">
            <input type="checkbox" id="agree" class="mr-2" v-model="isAgreed" />
            <label for="agree" class="text-gray-700"
              >위의 약관에 동의합니다</label
            >
          </div>

          <div class="flex space-x-7 mt-4" style="padding-bottom: 30px">
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
              @click="agreeAndLogin"
            >
              동의하고 로그인
            </button>
          </div>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup>
import router from "@/router";
import { ref, defineProps, defineEmits, computed, onMounted } from "vue";

const props = defineProps({
  isOpen: Boolean,
  userInfo: Object,
  scrollPosition: Number,
});

const emit = defineEmits(["close", "agree"]);

const isAgreed = ref(false);

const closeModal = () => {
  emit("close");
  router.push("/");
};

const agreeAndLogin = () => {
  if (isAgreed.value) {
    emit("agree", props.userInfo);
  }
};

const goToHomePage = () => {
  isAgreed.value = false;
  closeModal();
};

const modalTopPosition = computed(() => {
  return props.scrollPosition + 50; // 스크롤 위치 + 50px (원하는 값으로 조정)
});
</script>

<style scoped>
.border {
  border: 1px solid #e2e8f0; /* 테두리 색상 */
}
.p-4 {
  padding: 16px; /* 패딩 */
}
.rounded-md {
  border-radius: 8px; /* 둥근 모서리 */
}
</style>