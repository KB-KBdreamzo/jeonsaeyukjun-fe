<template>
  <div class="container mx-auto p-8 pt-12">
    <!-- 페이지 제목 및 검색바 -->
    <div class="flex justify-between items-center mb-12 mt-8">
      <h1 class="text-2xl font-bold">나의 전세사기 리포트</h1>
      <div class="flex items-center space-x-4">
        <input
          v-model="searchQuery"
          @input="onSearch"
          type="text"
          placeholder="주소를 검색하세요"
          class="w-80 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-gray-500"
        />
        <div class="relative">
          <button
            @click="toggleSortDropdown"
            class="bg-black text-white px-4 py-2 rounded-full flex items-center hover:bg-gray-300 w-28"
          >
            <span class="flex-grow text-center">{{ sortButtonText }}</span>
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
            class="absolute mt-1 right-0 w-full bg-white border border-gray-300 rounded-lg z-10"
          >
            <button
              @click="sortBy('lastest')"
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
    <div class="min-h-[400px]">
      <table class="w-full bg-white rounded-lg table-fixed">
        <thead class="bg-gray-100">
          <tr>
            <th class="p-4 text-left" style="width: 40%">주소지</th>
            <th class="p-4 text-left" style="width: 23%">전세금</th>
            <th class="p-4 text-left" style="width: 20%">안전 진단</th>
            <th class="p-4 text-left" style="width: 25%">생성일</th>
            <th class="p-4 text-left w-40">조회 및 삭제</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="(report, index) in reportList"
            :key="index"
            class="border-b hover:bg-gray-50"
          >
            <td class="p-4">{{ report.roadName + report.detailAddress }}</td>
            <td class="p-4">{{ formatPrice(report.deposit) }}</td>
            <td class="p-4">
              <span
                class="px-4 py-1.5 rounded-full text-white"
                :class="getStatusClass(report.status)"
              >
                {{ report.status }}
              </span>
            </td>
            <td class="p-4">{{ report.createAt }}</td>
            <td class="p-4 flex space-x-2 justify-end">
              <button
                @click="viewReport(report)"
                class="bg-buttonBeige text-gray-500 px-4 py-1 rounded-full hover:bg-gray-200"
              >
                확인
              </button>
              <button
                @click="deleteReport(index)"
                class="bg-black text-white px-4 py-1 rounded-full hover:bg-gray-300"
              >
                삭제
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- 페이지네이션 섹션 -->
    <div class="flex justify-end space-x-2 mt-6">
      <button
        @click="goToPage(page)"
        v-for="page in totalPages"
        :key="page"
        :class="[
          'px-3 py-1 border rounded-lg',
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
import axios from "axios";

export default {
  name: "MypageReport",
  data() {
    return {
      searchQuery: "", // 검색어
      isSortDropdownOpen: false, // 정렬 드롭다운 메뉴의 상태
      sortKey: "lastest", // 현재 정렬 키
      currentPage: 1, // 현재 페이지
      perPage: 5, // 페이지당 항목 수
      reportList: [], // 서버에서 받은 리포트 목록
      totalPages: 1, // 전체 페이지 수
    };
  },
  computed: {
    filteredReports() {
      let filtered = this.reportList.filter(
        (report) =>
          report.roadName.includes(this.searchQuery) ||
          report.detailAddress.includes(this.searchQuery)
      );
      return this.sortKey === "lastest"
        ? filtered.sort((a, b) => new Date(b.createAt) - new Date(a.createAt))
        : filtered.sort((a, b) => new Date(a.createAt) - new Date(b.createAt));
    },
    paginatedReports() {
      const start = (this.currentPage - 1) * this.perPage;
      const end = this.currentPage * this.perPage;
      return this.filteredReports.slice(start, end);
    },
    sortButtonText() {
      return this.sortKey === "lastest" ? "최신순" : "오래된순";
    },
  },
  methods: {
    toggleSortDropdown() {
      this.isSortDropdownOpen = !this.isSortDropdownOpen;
    },
    sortBy(key) {
      this.sortKey = key;
      this.isSortDropdownOpen = false;
      this.currentPage = 1; // 첫 페이지부터 다시 검색
      this.fetchReports("2");
    },
    goToPage(page) {
      this.currentPage = page;
      this.fetchReports("2");
    },
    onSearch() {
      console.log("onSearch", this.searchQuery);
      this.currentPage = 1; // 검색어 변경 시 첫 페이지부터 다시 검색
      this.fetchReports("2");
    },
    formatPrice(value) {
      return value.toLocaleString();
    },
    getStatusClass(status) {
      if (status === "안전") return "bg-green-400";
      if (status === "양호" || status === "보통") return "bg-yellow-300";
      if (status === "위험" || status === "주의") return "bg-red-400";
      return "bg-gray-300";
    },
    calculateStatus(safetyScore) {
      if (safetyScore > 80) return "안전";
      if (safetyScore > 60) return "양호";
      if (safetyScore > 40) return "보통";
      if (safetyScore > 20) return "위험";
      return "주의";
    },
    async fetchReports(userId, searchQuery) {
      try {
        const reportResponse = await axios.get(
          `http://localhost:8080/api/mypage/reports/paged/${userId}`,
          {
            params: {
              page: this.currentPage,
              size: this.perPage,
              sortKey: this.sortKey,
              query: this.searchQuery,
            },
          }
        );
        this.reportList = reportResponse.data.reports.map((report) => ({
          ...report,
          status: this.calculateStatus(report.safetyScore),
        }));
        this.totalPages = reportResponse.data.totalPages; // 전체 페이지 수 설정
      } catch (error) {
        console.error("데이터를 불러오는 중 오류 발생:", error);
      }
    },
    async deleteReport(index) {
      const reportId = this.reportList[index]?.reportId;
      if (!reportId) {
        alert("삭제할 리포트 ID가 존재하지 않습니다.");
        return;
      }

      try {
        await axios.delete(`http://localhost:8088/api/report/${reportId}`);
        this.fetchReports("2");
        alert("리포트가 삭제되었습니다.");
      } catch (error) {
        console.error("삭제 중 오류 발생:", error);
        alert("삭제에 실패했습니다. 다시 시도해주세요.");
      }
    },
  },
  mounted() {
    this.fetchReports("2");
  },
};
</script>
