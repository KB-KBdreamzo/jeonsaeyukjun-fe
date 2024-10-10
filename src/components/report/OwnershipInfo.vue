<template>
  <div class="section">
    <div class="header flex items-center justify-between">
      <div>
        <h1 class="text-xl font-bold">소유권 침해 내역을<br /> 알아보겠습니다.</h1>
        <p class="subtext text-sm text-gray-600 pt-1">가압류 가등기 등을 확인해요</p>
      </div>
      <div class="profile-image ml-5">
        <img src="@/assets/report/report.png" alt="리포트 사진" class="w-20 h-20 rounded-full object-cover" />
      </div>
    </div>

    <div class="item-list mt-5">
      <div
        class="item flex justify-between content-center py-2"
        :class="{'border-b border-gray-300': index !== ownershipInfo.length - 1}" 
        v-for="(item, index) in ownershipInfo"
        :key="item.label"
      >
        <span class="label text-lg flex items-center justify-center">{{ item.label }}</span>
        <StatusBadge :status="item.status" />
      </div>
    </div>
  </div>
  
</template>

<script setup>
import { computed } from 'vue';
import { useReportStore } from '@/stores/reportStore'; // reportStore 가져오기
import StatusBadge from "@/components/report/StatusBadge.vue"; // StatusBadge 컴포넌트 가져오기

const reportStore = useReportStore();

const ownershipInfo = computed(() => [
  { label: "전월세 사기 신고 접수 여부", status: reportStore.reportData.rentalFraud ? "있음" : "없음" },
  { label: "고액 체납자 여부", status: reportStore.reportData.highTaxDelinquent ? "있음" : "없음" },
  { label: "근저당권 설정 내역", status: reportStore.reportData.registerDto.mortgageCount ? "있음" : "없음" },
  { label: "경매 설정 내역", status: reportStore.reportData.registerDto.auctionRecord ? "있음" : "없음" }
]);
</script>

<style scoped>
</style>
