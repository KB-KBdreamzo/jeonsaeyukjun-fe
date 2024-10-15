<template>
  <!-- 상단 주소 표시 영역 -->
  <div class="flex flex-row justify-center gap-14 mt-10">
    <button @click="goBack" class="absolute left-60">
      <img src="/src/assets/back.jpg" alt="back" class="w-10 h-10" />
    </button>
    <h1 class="text-2xl text-center font-bold">
      {{ reportStore.reportData.registerDto.roadName }}의 보증금 리포트
    </h1>
    
  </div>

  <div class="w-full bg-gray-100 p-5 rounded-3xl mx-auto">
    <div class="accordion w-full bg-white p-5 rounded-3xl mx-auto transition-all duration-500">
    <button 
      @click="toggleExpand" 
      class="accordion-toggle group inline-flex items-center justify-center leading-8 text-gray-900 w-full transition duration-500  hover:text-gray-600"
      aria-controls="basic-collapse-one-with-arrow"
    >
      <div class="text-lg">
        해당 집의 종합 보증금 안전 진단 결과 {{ safetyStatus }}입니다.
        <br />
        예측 손실액은 {{ estimatedLoss }}원이며, 위험 진단 요소는 {{ riskFactor }}건입니다.
      </div>
      <svg 
        class="absolute right-80 text-gray-900 transition duration-500 group-hover:text-gray-600" 
        :class="{'rotate-180': expanded}" 
        width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M16.5 8.25L12.4142 12.3358C11.7475 13.0025 11.4142 13.3358 11 13.3358C10.5858 13.3358 10.2525 13.0025 9.58579 12.3358L5.5 8.25" 
          stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"
        />
      </svg>
    </button>
    <div 
      class="accordion-content flex flex-col items-center justify-center w-full px-10 overflow-hidden transition-all duration-500" >
      <div v-if="expanded" class="flex flex-col gap-2 mt-6 text-center text-gray-700">
        <div class="font-semibold"> 해당 집의 보증금 안전 점수는 {{ reportStore.reportData.safetyScore }}점입니다. </div>
        <div> 리포트는 사용자가 조회한 전세금과 등기부등본을 기반으로 다양한 위험 요소들을 평가한 결과를 제시합니다.</div> 
        <div> 위험 요소에는 환불 가능한 보증금, 임대인의 정보, 기타 권리사항, 소유권 침해내역등이 있습니다. </div>
        <div> 리포트의 자세한 정보를 보려면 아래 상세 보고서를 참고하세요.</div>
      </div>
    </div>
  </div>

    <div class="flex flex-col md:flex-row justify-between items-start px-5 pt-10 pb-10">
      <!-- 좌측: 보증금 안전 상태 -->
      <div class="flex flex-col items-center justify-center w-full md:w-1/2">
        <div
          class="relative flex items-center justify-center w-36 h-36 rounded-full border-8"
          :class="{
            'border-custom-yellow':
              ['위험', '주의', '보통', '양호', '안전'].includes(safetyStatus),
          }"
        >
          <span
            class="text-4xl font-bold"
            :class="{
              'text-custom-yellow':
              ['위험', '주의', '보통', '양호', '안전'].includes(safetyStatus),
            }"
          >
            {{ safetyStatus }}
          </span>
        </div>

        <div class="relative w-2/3 mt-10 px-30">
          <div class="absolute left-0 transform -translate-y-1/2 w-full h-3 bg-light-yellow rounded-full"></div>
          
          <div class="flex justify-between items-center relative">
            <div v-for="status in ['위험', '주의', '보통', '양호', '안전']" :key="status" class="flex flex-col items-center z-10">
              <div :class="[
                  'w-3 h-3 rounded-full relative -mt-1.5',
                  safetyStatus === status ? 'bg-custom-yellow border-custom-yellow' : 'bg-white border-yellow-500',
                ]"
              ></div>
              <span class="text-sm mt-2">{{ status }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- 우측: 막대 그래프 영역 -->
      <div class="flex flex-col items-center w-full md:w-1/2">
        <div class="flex items-end justify-center h-40 gap-10">
          <div class="flex flex-col items-center gap-3">
            <div class="w-5 bg-custom-yellow rounded-t-xl" :style="{ height: '100px' }"></div>
            <span class="text-sm mt-1">우리집</span>
          </div>
          <div class="flex flex-col items-center gap-3">
            <div class="w-5 bg-gray-200 rounded-t-xl" :style="{ height: '80px' }"></div>
            <span class="text-sm mt-1">국내평균</span>
          </div>
          <div class="flex flex-col items-center gap-3">
            <div class="w-5 bg-gray-200 rounded-t-xl" :style="{ height: '120px' }"></div>
            <span class="text-sm mt-1">강서구</span>
          </div>
        </div>
      </div>
      
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue"; 
import { computed } from 'vue';
import { useReportStore } from "@/stores/reportStore";
import { useRouter } from 'vue-router';  

const router = useRouter();

const reportStore = useReportStore();
const expanded = ref(false);

const goBack = () => router.back();

const toggleExpand = () => expanded.value = !expanded.value;

const safetyStatus = computed(() => {
  const score = reportStore.reportData.safetyScore 
  if (score >= 80)  return '안전';
  else if (score >= 60)  return '양호';
  else if (score >= 40)  return '보통';
  else if (score >= 20)  return '주의';
  else  return '위험';
});

const estimatedLoss = computed(() => {
  const loss = parseInt( reportStore.reportData.nowPrice * reportStore.reportData.salePriceRatio /100) 
                - reportStore.reportData.registerDto.priorityDeposit - reportStore.reportData.deposit
  return loss > 0 ? 0 : -loss
});

const riskFactor = computed(() => {
  let count = reportStore.reportData.registerDto.auctionRecord + 
  reportStore.reportData.registerDto.injuctionRecord +
  reportStore.reportData.registerDto.trustRegistrationRecord +
  reportStore.reportData.registerDto.redemptionRecord +
  reportStore.reportData.registerDto.registrationRecord +
  reportStore.reportData.highTaxDelinquent +
  reportStore.reportData.rentalFraud ;
  if (reportStore.reportData.registerDto.seizureCount > 0) count++;
  if (reportStore.reportData.registerDto.provisionalSeizureCount > 0) count++;
  if (reportStore.reportData.registerDto.leaseholdRegistrationCount > 0) count++;
  if (reportStore.reportData.registerDto.mortgageCount > 0) count++;
  return count; 
});
</script>