<template>
  <div class = "container flex flex-col gap-10"
    v-if="reportStore.reportData && Object.keys(reportStore.reportData).length > 0">
    <Score/>
    <Money />
    <div class = "detail w-full p-10 grid grid-cols-2 gap-x-20 gap-y-10">
      <LandlordInfo />
      <OwnershipInfo />
      <OtherInfo />
    </div>
    <div class="flex mb-10 justify-center">
      <button type="button" class="w-80 inline-flex justify-center items-center py-3 shadow rounded-lg text-white bg-black disabled:opacity-50"
        @click="addContract"
        >
        계약서 생성하기
      </button>
    </div>
  </div>
  <div v-else>
    로딩중..
  </div>
</template>

<script setup>
import axios from 'axios';
import { ref, onMounted } from 'vue';
import { useReportStore } from "@/stores/reportStore";
import { useUserStore } from '@/stores/userStore';
import { useRoute } from 'vue-router';

import LandlordInfo from "@/components/report/LandlordInfo.vue"
import OwnershipInfo from "@/components/report/OwnershipInfo.vue";
import OtherInfo from "@/components/report/OtherInfo.vue";
import Score from "@/components/report/score.vue";
import Money from "@/components/report/money.vue";

const reportStore = useReportStore();
const userStore = useUserStore();

const route = useRoute();
const userId = userStore.userId; 
const isReportLoading = ref(false);
const reportId = ref("");

onMounted(async () => {
  reportId.value = route.params.reportId; 
  await fetchReport();
  console.log(reportStore.reportData);
});

const fetchReport = async () => {
  try {
    const response = await axios.get(`http://localhost:8080/api/report/${userId}/${reportId.value}`,
    {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem("token")}`
        }
      }
    );
    reportStore.reportData = response.data; 
  } catch (error) {
    console.error("리포트 조회 중 오류 발생:", error);
  }
};

const addContract = async () => {
  try {
    const response = await axios.post(`http://localhost:8080/api/contract/generate`, {
      params: {
        reportId : reportId.value 
      },
      headers: {
          'Authorization': `Bearer ${localStorage.getItem("token")}`
        }
      }
    );
    reportStore.reportData = response.data; 
  } catch (error) {
    console.error("계약서 생성 중 오류 발생:", error);
  }
}

</script>

<style scoped>
.container {
  width: 70%;
  min-width: 900px;
  max-width: 1200px;
  margin: 0 auto;
}
</style>