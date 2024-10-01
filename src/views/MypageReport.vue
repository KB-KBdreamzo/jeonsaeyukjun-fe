<template>
  <div class="container mx-auto p-8">
    <!-- 페이지 제목 및 검색바 -->
    <div class="flex justify-between items-center mb-12 mt-8">
      <h1 class="text-2xl font-bold">나의 전세사기 리포트</h1>
      <div class="flex items-center space-x-4">
        <input
          v-model="searchQuery"
          type="text"
          placeholder="주소를 검색하세요"
          class="w-80 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-gray-500"
        />
        <div class="relative">
          <button
            @click="toggleSortDropdown"
            class="border border-gray-800 text-gray-800 px-4 py-2 rounded-lg flex items-center hover:bg-gray-100"
          >
            최신순
            <svg
              class="ml-2 w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M19 9l-7 7-7-7"
              ></path>
            </svg>
          </button>
          <!-- 정렬 드롭다운 메뉴 -->
          <div
            v-if="isSortDropdownOpen"
            class="absolute mt-1 right-0 w-32 bg-white border border-gray-300 rounded-lg shadow-lg z-10"
          >
            <button
              @click="sortBy('latest')"
              class="block w-full text-left px-4 py-2 hover:bg-gray-100"
            >
              최신순
            </button>
            <button
              @click="sortBy('oldest')"
              class="block w-full text-left px-4 py-2 hover:bg-gray-100"
            >
              오래된순
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- 테이블 섹션 -->
    <table class="w-full bg-white rounded-lg">
      <thead class="bg-gray-100">
        <tr>
          <th class="p-4 text-left">주소지</th>
          <th class="p-4 text-left">전세금</th>
          <th class="p-4 text-left">점수</th>
          <th class="p-4 text-left">생성일</th>
          <th class="p-4 text-left">조회 및 삭제</th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="(report, index) in filteredReports"
          :key="index"
          class="border-b hover:bg-gray-50"
        >
          <td class="p-4">{{ report.address }}</td>
          <td class="p-4">{{ formatPrice(report.deposit) }}</td>
          <td class="p-4">
            <span
              class="px-4 py-1 rounded-full font-bold text-white"
              :class="getScoreClass(report.score)"
            >
              {{ report.score }}점
            </span>
          </td>
          <td class="p-4">{{ report.createdAt }}</td>
          <td class="p-4 flex space-x-2">
            <button
              @click="viewReport(report)"
              class="bg-gray-400 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
            >
              조회
            </button>
            <button
              @click="deleteReport(index)"
              class="bg-black text-white px-4 py-2 rounded-lg hover:bg-red-700"
            >
              삭제
            </button>
          </td>
        </tr>
      </tbody>
    </table>

    <!-- 페이지네이션 섹션 -->
    <div class="flex justify-center space-x-2 mt-6">
      <button
        @click="goToPage(page)"
        v-for="page in totalPages"
        :key="page"
        :class="[
          'px-4 py-2 border rounded-lg',
          page === currentPage
            ? 'bg-gray-800 text-white'
            : 'bg-white text-gray-800',
        ]"
        class="hover:bg-gray-200"
      >
        {{ page }}
      </button>
    </div>
  </div>
</template>

<script>
export default {
  name: "MypageReport",
  data() {
    return {
      searchQuery: "", // 검색어
      isSortDropdownOpen: false, // 정렬 드롭다운 메뉴의 상태
      sortKey: "latest", // 현재 정렬 키
      currentPage: 1, // 현재 페이지
      perPage: 5, // 페이지당 항목 수
      reports: [
        {
          address: "강서구 방화대로47가길 22",
          deposit: 420000000,
          score: 52,
          createdAt: "2024.09.11 11:00",
        },
        {
          address: "강서구 양천로26길 24-10",
          deposit: 280000000,
          score: 72,
          createdAt: "2024.09.11 15:00",
        },
        {
          address: "강서구 방화대로 351",
          deposit: 370000000,
          score: 31,
          createdAt: "2024.09.12 18:00",
        },
        {
          address: "강서구 등촌로39마길 4",
          deposit: 210000000,
          score: 18,
          createdAt: "2024.09.13 8:00",
        },
        {
          address: "양천구 목동동로12길 55-9",
          deposit: 210000000,
          score: 89,
          createdAt: "2024.09.16 15:00",
        },
      ],
    };
  },
  computed: {
    // 검색어와 정렬 조건에 따른 리포트 필터링
    filteredReports() {
      let filtered = this.reports.filter((report) =>
        report.address.includes(this.searchQuery)
      );
      return this.sortKey === "latest"
        ? filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        : filtered.sort(
            (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
          );
    },
    // 총 페이지 수 계산
    totalPages() {
      return Math.ceil(this.filteredReports.length / this.perPage);
    },
  },
  methods: {
    // 정렬 드롭다운 메뉴 열기/닫기
    toggleSortDropdown() {
      this.isSortDropdownOpen = !this.isSortDropdownOpen;
    },
    // 정렬 방식 변경
    sortBy(key) {
      this.sortKey = key;
      this.isSortDropdownOpen = false;
    },
    // 페이지 이동
    goToPage(page) {
      this.currentPage = page;
    },
    // 숫자 포맷 (전세금)
    formatPrice(value) {
      return value.toLocaleString();
    },
    // 점수에 따라 색상 클래스 반환
    getScoreClass(score) {
      if (score >= 70) return "bg-green-500";
      if (score >= 50) return "bg-yellow-400";
      return "bg-red-500";
    },
  },
};
</script>

<style scoped>
/* 테이블의 헤더 스타일링 */
th {
  font-weight: bold;
  text-align: left;
}
</style>
