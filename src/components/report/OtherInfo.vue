<template>
  <div class="section">
    <div class="header flex items-center justify-between">
      <div>
        <h1 class="text-xl font-bold">기타 권리사항을<br /> 알아보겠습니다.</h1>
        <p class="subtext text-sm text-gray-600 pt-1">소유권의 권리사항을 확인해요</p>
      </div>
      <div class="profile-image ml-5">
        <img src="@/assets/report/report.png" alt="리포트 사진" class="w-20 h-20 rounded-full object-cover" />
      </div>
    </div>
    <div class="item-list mt-5">
      <div
        class="item flex justify-between py-2"
        :class="{'border-b border-gray-300': index !== otherInfo.length - 1}" 
        v-for="(item, index) in otherInfo"
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
import { useReportStore } from '@/stores/reportStore';
import StatusBadge from "@/components/report/StatusBadge.vue"; // StatusBadge 컴포넌트 가져오기

const reportStore = useReportStore();

const otherInfo = computed(() => [
  { label: "신탁 등기 설정 내역", status: reportStore.reportData.registerDto.trustRegistrationRecord ? "있 음" : "없 음" },
  { label: "전세권 설정 내역", status: reportStore.reportData.registerDto.leaseholdRegistrationCount > 0 ? "있 음" : "없 음" },
]);

</script>

<style scoped>
</style>