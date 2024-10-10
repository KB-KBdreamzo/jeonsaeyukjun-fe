<template>
  <div class="section">
    <div class="header flex items-center justify-between">
      <div class="flex flex-col">
        <h1 class="text-xl font-bold">임대인의 정보를 <br /> 알아보겠습니다.</h1>
        <p class="subtext text-sm text-gray-600 pt-1">소유권 외 권리사항을 확인해요</p>
      </div>
      <div class="profile-image ml-5">
        <img src="@/assets/report/renter.png" alt="임대인 사진" class="w-20 h-20 rounded-full object-cover" />
      </div>
    </div>

    <div class="item-list mt-5">
      <div
        class="item flex justify-between py-2"
        :class="{'border-b border-gray-300': index !== landlordInfo.length - 1}" 
        v-for="(item, index) in landlordInfo"
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

const landlordInfo = computed(() => [
  { label: "가압류 설정 내역", status: reportStore.reportData.registerDto.provisionalSeizureCount > 0 ? `${reportStore.reportData.registerDto.provisionalSeizureCount}건` : "없음" },
  { label: "압류 설정 내역", status: reportStore.reportData.registerDto.seizureCount > 0 ? `${reportStore.reportData.registerDto.provisionalSeizureCount}건` : "없음" },
  { label: "가등기 설정 내역", status: reportStore.reportData.registerDto.registrationRecord ? "있음" : "없음" },
  { label: "환매특약 등기 내역", status: reportStore.reportData.registerDto.redemptionRecord ? "있음" : "없음" },
  { label: "가처분 내역", status: reportStore.reportData.registerDto.injuctionRecord ? "있음" : "없음" },
]);

</script>