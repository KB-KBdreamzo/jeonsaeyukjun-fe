<template>
  <div class="container mx-auto p-8">
    <!-- 프로필 섹션 -->
    <div
      class="bg-gray-100 rounded-lg p-8 flex justify-between items-center mb-8"
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
          <p class="text-gray-600">yundabin0608@naver.com</p>
        </div>
      </div>
      <button
        class="bg-gray-800 text-white px-4 py-2 rounded-lg hover:bg-gray-700"
      >
        EDIT
      </button>
    </div>

    <!-- 리포트 및 계약서 섹션을 좌우로 배치 -->
    <div class="flex justify-between space-x-16">
      <!-- 리포트 조회 섹션 -->
      <div class="w-1/2">
        <div class="mb-8">
          <div class="flex justify-between items-center mb-6">
            <h2 class="text-2xl font-bold">전세사기 리포트 조회</h2>
            <router-link to="/mypage/reports">
              <button
                class="border border-gray-800 bg-gray-800 text-white px-4 py-2 rounded-lg hover:bg-gray-700"
              >
                더보기
              </button>
            </router-link>
          </div>
          <ul class="space-y-2">
            <li
              v-for="(report, index) in reportList"
              :key="index"
              class="flex justify-between items-center p-4 bg-white border-b border-gray-200"
            >
              <span>{{ report.address }}</span>
              <span
                class="px-4 py-1 rounded-full font-bold text-white"
                :class="getScoreClass(report.score)"
              >
                {{ report.score }}점
              </span>
            </li>
          </ul>
        </div>
      </div>

      <!-- 계약서 조회 섹션 -->
      <div class="w-1/2">
        <div class="mb-8">
          <div class="flex justify-between items-center mb-6">
            <h2 class="text-2xl font-bold">계약서 조회</h2>
            <router-link to="/mypage/contracts">
              <button
                class="border border-gray-800 bg-gray-800 text-white px-4 py-2 rounded-lg hover:bg-gray-700"
              >
                더보기
              </button>
            </router-link>
          </div>
          <ul class="space-y-2">
            <li
              v-for="(contract, index) in contractList"
              :key="index"
              class="flex justify-between items-center p-4 bg-white border-b border-gray-200"
            >
              <span>{{ contract.address }}</span>
              <button
                class="border border-gray-500 text-gray-500 px-4 py-1 rounded-lg hover:bg-gray-100"
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
        { address: "강서구 방화대로47가길 22", score: 52 },
        { address: "강서구 양천로26길 24-10", score: 72 },
        { address: "강서구 방화대로 351", score: 32 },
        { address: "강서구 등촌로39마길 4", score: 18 },
      ],
      contractList: [
        { address: "강서구 방화대로47가길 22" },
        { address: "강서구 양천로26길 24-10" },
        { address: "강서구 방화대로 351" },
      ],
    };
  },
  methods: {
    getScoreClass(score) {
      if (score >= 70) return "bg-green-500";
      if (score >= 50) return "bg-yellow-400";
      return "bg-red-500";
    },
  },
};
</script>

<style scoped>
.container {
  width: 80%; /* 전체 컨테이너의 너비를 80%로 설정 */
}
</style>
