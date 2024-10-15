<template>
  <div class="container mx-auto p-8 pt-12">
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
          <h2 class="text-3xl font-bold">{{ username}}</h2>
          <p class="text-gray-600 mt-2">{{ email }}</p>
        </div>
      </div>
      <button
        @click="logout"
        class="border bg-gray-800 text-white px-4 py-1 rounded-full hover:bg-gray-300"
      >
        로그아웃
      </button>
    </div>

    <div class="flex justify-between space-x-16 mx-2">
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
              <span>{{ report.roadName + report.detailAddress }}</span>
              <span
                class="px-4 py-1 rounded-full ml-auto"
                :class="getStatusClass(report.status)"
              >
                {{ report.status }}
              </span>
            </li>
          </ul>
        </div>
      </div>

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
              <span>{{ contract.reportAddress }}</span>
              <button
                @click="viewContract(contract)"
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

<script setup>
import { ref, onMounted } from "vue";
import axios from "axios";
import { useRouter } from "vue-router";
import { useUserStore } from "@/stores/userStore";

const username = ref("")
const email = ref("")
const router = useRouter();
const userStore = useUserStore();
const reportList = ref([]);
const contractList = ref([]);

onMounted(()=>{
  username.value = userStore.username;
  email.value = userStore.email;

  fetchContracts(userStore.getUser().userId);
});

const viewContract = (contract) => {
  router.push({
    name: 'PdfViewer',
    params: { contractName: contract.contractName },
  });
};


onMounted(()=>{
  username.value = userStore.username;
  email.value = userStore.email;
});

const getStatusClass = (status) => {
  if (status === '안전') return 'bg-badge-bg-blue text-badge-txt-blue';
  if (status === '양호') return 'bg-badge-bg-green text-badge-txt-green';
  if (status === '보통') return 'bg-badge-bg-yellow text-badge-txt-yellow';
  if (status === '주의') return 'bg-badge-bg-orange text-badge-txt-orange';
  if (status === '위험') return 'bg-badge-bg-red text-badge-txt-red';
  return 'bg-badge-bg-no text-badge-txt-no';
};

const calculateStatus = (safetyScore) => {
  if (safetyScore > 80) return "안전";
  if (safetyScore > 60) return "양호";
  if (safetyScore > 40) return "보통";
  if (safetyScore > 20) return "위험";
  return "주의";
};

const fetchReports = async (userId) => {
  console.log(localStorage.getItem("token"))
  try {
    const reportResponse = await axios.get(
      `http://localhost:8080/api/report/${userId}?sortKey=latest&page=1&size=4`,{
        headers: {
          'Authorization': `Bearer ${localStorage.getItem("token")}`
        }
      });
    reportList.value = reportResponse.data.reports.map((report) => ({
      ...report,
      status: calculateStatus(report.safetyScore),
    }));
  } catch (error) {
    console.error("데이터를 불러오는 중 오류 발생:", error);
  }
};

const fetchContracts = async (userId) => {
  try {
    const contractResponse = await axios.get(
      `http://localhost:8080/api/contract/list/${userId}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem("token")}`
        }
      });
    contractList.value = contractResponse.data; 
  } catch (error) {
    console.error("계약서 데이터를 불러오는 중 오류 발생:", error);
  }
};

const logout = async () => {
  try {
    // 로그아웃 API 호출
    await axios.post("http://localhost:8080/api/login/logout", {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem("token")}`
      }}
    );

    userStore.clearUser();
    console.log("userStore.getUser() : ", userStore.getUser());
    router.push("/");
  } catch (error) {
    console.error("로그아웃 중 오류 발생:", error);
  }
};

fetchReports("1");
fetchContracts("1");
</script>

<style scoped>
.container {
  width: 80%;
}
</style>
