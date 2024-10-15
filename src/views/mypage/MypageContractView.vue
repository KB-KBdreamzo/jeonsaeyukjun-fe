<template>
  <div class="container mx-auto p-8 pt-12">
    <div class="rounded-lg p-8 flex justify-between items-center mb-16">
      <h1 class="text-2xl font-bold">나의 계약서</h1>
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
        <thead class="bg-gray-100">
          <tr>
            <th class="p-4 text-left" style="width: 40%">주소지</th>
            <th class="p-4 text-left" style="width: 30%">전세금</th>
            <th class="p-4 text-left" style="width: 30%">생성일</th>
            <th class="p-4 text-left w-40">조회 및 삭제</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="(contract, index) in paginatedContracts"
            :key="index"
            class="border-b hover:bg-gray-50"
          >
            <td class="p-4">{{ contract.reportAddress }}</td>
            <td class="p-4">{{ formatPrice(contract.reportDeposit) }}</td>
            <td class="p-4">{{ new Date(contract.uploadTime).toLocaleDateString() }}</td>
            <td class="p-4 flex space-x-2 justify-end">
              <button
                @click="viewContract(contract)"
                class="bg-buttonBeige text-gray-500 px-4 py-1 rounded-full hover:bg-gray-200"
              >
                확인
              </button>
              <button
                @click="deleteContract(contract, index)"
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
      >
        {{ page }}
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import axios from 'axios';
import { useUserStore } from '@/stores/userStore';
import { useRouter } from 'vue-router'; 

const router = useRouter(); 

const searchQuery = ref('');
const isSortDropdownOpen = ref(false);
const sortKey = ref('latest');
const currentPage = ref(1);
const perPage = 5;
const contractList = ref([]); 

const userStore = useUserStore();
const userId = userStore.getUser().userId;

const viewContract = (contract) => {
  router.push({
    name: 'PdfViewer',
    params: { contractName: contract.contractName },
  });
};

const deleteContract = async (contract, index) => {
  try {
    const confirmed = confirm("정말로 이 계약서를 삭제하시겠습니까?");
    if (!confirmed) return;

    await axios.delete(`http://localhost:8080/api/contract/delete`, {
      data: {
        userId: userId,
        contractName: contract.contractName
      }
    });

    await fetchContracts(userId);

  } catch (error) {
    console.error("계약서 삭제 중 오류 발생:", error);
  }
};

// 계약서 목록 반환
const fetchContracts = async (userId) => {
  try {
    console.log("userId: ", userId);
    const response = await axios.get(`http://localhost:8080/api/contract/list/${userId}`);
    console.log("response: ", response.data);
    contractList.value = response.data; 
  } catch (error) {
    console.error('데이터를 불러오는 중 오류 발생:', error);
  }
};

onMounted(() => {
  fetchContracts(userId); // 계약서 데이터 조회
});

const filteredContracts = computed(() => {
  return (contractList.value || []).filter(contract =>
  contract.reportAddress && contract.reportAddress.includes(searchQuery.value)
  ).sort((a, b) => 
    sortKey.value === 'latest' 
      ? new Date(b.createdAt) - new Date(a.createdAt) 
      : new Date(a.createdAt) - new Date(b.createdAt)
  );
});


const paginatedContracts = computed(() => {
  const start = (currentPage.value - 1) * perPage;
  return filteredContracts.value.slice(start, start + perPage);
});

const totalPages = computed(() => {
  return Math.ceil(filteredContracts.value.length / perPage);
});

const sortButtonText = computed(() => {
  return sortKey.value === 'latest' ? '최신순' : '오래된순';
});

const toggleSortDropdown = () => {
  isSortDropdownOpen.value = !isSortDropdownOpen.value;
};

const sortBy = (key) => {
  sortKey.value = key;
  isSortDropdownOpen.value = false;
};

const goToPage = (page) => {
  currentPage.value = page;
};

const formatPrice = (value) => {
  return value.toLocaleString();
};

</script>

<style scoped>
.container {
  width: 80%; 
}
</style>
