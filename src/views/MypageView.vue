<template>
  <div class="container mx-auto p-8 pt-12">
    <!-- 프로필 섹션 -->
    <div
      class="bg-gray-100 rounded-lg p-8 flex justify-between items-center mb-16"
    >
      <div class="flex items-center">
        <div
          class="bg-white w-24 h-24 rounded-full flex items-center justify-center mr-6 shadow-lg"
        >
          <img
            src="@/assets/아자핑.png"
            alt="profile-image"
            class="w-20 h-20 rounded-full"
          />
        </div>
        <div>
          <h2 class="text-3xl font-bold">아자핑</h2>
          <p class="text-gray-600 mt-2">yundabin0608@naver.com</p>
        </div>
      </div>
    </div>

    <!-- 리포트 및 계약서 섹션을 좌우로 배치 -->
    <div class="flex justify-between space-x-16 mx-2">
      <!-- 리포트 조회 섹션 -->
      <div class="w-1/2">
        <div class="mb-4">
          <div class="flex justify-between items-center mb-6">
            <h2 class="text-2xl font-bold">전세사기 리포트 조회</h2>
            <router-link to="/mypage/reports">
              <button
                class="border bg-gray-800 text-white px-4 py-1 rounded-full hover:bg-gray-300 ml-auto"
              >
                더보기
              </button>
            </router-link>
          </div>
          <ul class="space-y-1">
            <li
              v-for="(report, index) in reportList"
              :key="index"
              class="flex justify-between items-center bg-white border-b py-4 border-gray-200"
            >
              <span>{{ report.address }}</span>
              <span
                class="px-4 py-1 rounded-full text-white ml-auto"
                :class="getStatusClass(report.status)"
              >
                {{ report.status }}
              </span>
            </li>
          </ul>
        </div>
      </div>

      <!-- 계약서 조회 섹션 -->
      <div class="w-1/2">
        <div class="mb-4">
          <div class="flex justify-between items-center mb-6">
            <h2 class="text-2xl font-bold">계약서 조회</h2>
            <router-link to="/mypage/contracts">
              <button
                class="border bg-gray-800 text-white px-4 py-1 rounded-full hover:bg-gray-300 ml-auto"
              >
                더보기
              </button>
            </router-link>
          </div>
          <ul class="space-y-1">
            <li
              v-for="(contract, index) in contractList"
              :key="index"
              class="flex justify-between items-center py-4 bg-white border-b border-gray-200"
            >
              <span>{{ contract.address }}</span>
              <button
                class="text-gray-500 px-4 py-1 rounded-full hover:bg-gray-100 bg-buttonBeige"
              >
                확인
              </button>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "MypageView",
  data() {
    return {
      reportList: [
        { address: "강서구 방화대로47가길 22", status: "위험" },
        { address: "강서구 양천로26길 24-10", status: "양호" },
        { address: "강서구 방화대로 351", status: "보통" },
        { address: "강서구 등촌로39마길 4", status: "안전" },
      ],
      contractList: [
        { address: "강서구 방화대로47가길 22" },
        { address: "강서구 양천로26길 24-10" },
        { address: "강서구 방화대로 351" },
      ],
    };
  },
  methods: {
    getStatusClass(status) {
      if (status === "안전") return "bg-green-400"; // 안전 - 연두색
      if (status === "양호" || status === "보통") return "bg-yellow-300"; // 양호, 보통 - 노란색
      if (status === "위험" || status === "주의") return "bg-red-400"; // 위험, 주의 - 빨간색
      return "bg-gray-300"; // 상태가 없는 경우 기본 색상 (회색)
    },
  },
};
</script>

<style scoped>
.container {
  width: 80%; /* 전체 컨테이너의 너비를 80%로 설정 */
}
</style>
