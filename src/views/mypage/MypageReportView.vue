<template>
  <div class="container mx-auto p-8 pt-12">
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
          <div
            v-if="isSortDropdownOpen"
            class="absolute mt-1 right-0 w-full bg-white border border-gray-300 rounded-lg z-10"
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

    <div class="min-h-[400px]">
      <table class="w-full bg-white rounded-lg table-fixed">
        <thead class="bg-gray-100 rounded-md">
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
            <td class="p-4">{{ report.roadName + " " + report.detailAddress }}</td>
            <td class="p-4">{{ report.deposit.toLocaleString() }}</td>
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
                @click="fetchReport(index)"
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

<script setup>
import { ref, computed } from 'vue';
import axios from 'axios';

const reportList = ref([]);

const searchQuery = ref(''); 
const isSortDropdownOpen = ref(false); 
const sortKey = ref('latest'); 

const currentPage = ref(1); 
const perPage = ref(5); 
const totalPages = ref(1); 
const userId = 1;

const toggleSortDropdown = () => {
  isSortDropdownOpen.value = !isSortDropdownOpen.value;
};

const sortButtonText = computed(() => {
  return sortKey.value === 'latest' ? '최신순' : '오래된순';
});

const getStatusClass = (status) => {
  if (status === '안전') return 'bg-green-400';
  if (status === '양호' || status === '보통') return 'bg-yellow-300';
  if (status === '위험' || status === '주의') return 'bg-red-400';
  return 'bg-gray-300';
};

const calculateStatus = (safetyScore) => {
  if (safetyScore > 80) return '안전';
  if (safetyScore > 60) return '양호';
  if (safetyScore > 40) return '보통';
  if (safetyScore > 20) return '위험';
  return '주의';
};

const fetchReportLists = async() => {
  try {
    const reportResponse = await axios.get(`http://localhost:8080/api/report/${userId}`, {
      params: {
        page: currentPage.value,
        size: perPage.value,
        sortKey: sortKey.value,
        query: searchQuery.value,
      },
    });
    reportList.value = reportResponse.data.reports.map((report) => ({
      ...report,
      status: calculateStatus(report.safetyScore),
    }));
    totalPages.value = reportResponse.data.totalPages;
  } catch (error) {
    console.error("데이터를 불러오는 중 오류 발생:", error);
  }
};

const fetchReport = async (index) => {
  const reportId = reportList.value[index]?.reportId;
  if (!reportId) {
    alert("조회할 리포트 ID가 존재하지 않습니다.");
    return;
  }
  try {
    const reportResponse = await axios.get(`http://localhost:8080/api/report/${userId}/${reportId}`);
    // 이제 리포트 뷰의 내용들이랑 매칭해서 리포트 뷰에 넘겨야함
  } catch (error) {
    console.log("조회 중 오류 발생", error)
    alert("조회에 실패했습니다. 다시 시도해주세요.")
  }

}

const deleteReport = async (index) => {
  const reportId = reportList.value[index]?.reportId;
  if (!reportId) {
    alert("삭제할 리포트 ID가 존재하지 않습니다.");
    return;
  }
  try {
    await axios.delete(`http://localhost:8080/api/report/${userId}/${reportId}`);
    await fetchReportLists();
    alert("리포트가 삭제되었습니다.");
  } catch (error) {
    console.error("삭제 중 오류 발생:", error);
    alert("삭제에 실패했습니다. 다시 시도해주세요.");
  }
};

const onSearch = () => {
  console.log("onSearch", searchQuery.value);
  currentPage.value = 1;
  fetchReportLists();
};

const sortBy = (key) => {
  sortKey.value = key;
  isSortDropdownOpen.value = false;
  currentPage.value = 1; 
  fetchReportLists();
};

const goToPage = async (page) => {
  currentPage.value = page;
  fetchReportLists();
};

fetchReportLists(); 
</script>

<style scoped>
</style>
