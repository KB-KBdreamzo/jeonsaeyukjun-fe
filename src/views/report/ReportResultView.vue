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
    </div>
  <div v-else>
    로딩중..
  </div>
</template>

<script setup>
import axios from 'axios';
import { onMounted } from 'vue';
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

// 사용자 아이디 피니아에서 꺼내오는거 처리해야함!

onMounted(async () => {
  const userId = 1; 
  const reportId = route.params.reportId; 
  await fetchReport(userId, reportId);
  console.log(reportStore.reportData);
});

const fetchReport = async (userId, reportId) => {
  try {
    const response = await axios.get(`http://localhost:8080/api/report/${userId}/${reportId}`);
    reportStore.reportData = response.data; 
  } catch (error) {
    console.error("리포트 조회 중 오류 발생:", error);
  }
};

</script>

<style scoped>
.container {
  width: 70%;
  min-width: 900px;
  max-width: 1200px;
  margin: 0 auto;
}
</style>