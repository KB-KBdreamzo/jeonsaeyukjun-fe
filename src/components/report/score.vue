<template>
  <!-- 상단 주소 표시 영역 -->
  <div class="flex flex-row justify-center gap-14 mt-10">
    <button @click="goBack" class="flex items-center justify-center">
      <img src="/src/assets/back.jpg" alt="back" class="w-10 h-10" />
    </button>
    <h1 class="text-2xl text-center font-bold">
      {{ reportStore.reportData.registerDto.roadName }}의 보증금 리포트
    </h1>
    
  </div>

  <div class="w-full bg-gray-100 p-5 rounded-3xl mx-auto">
    <div
      class="relative text-center bg-white rounded-lg my-5 transition-all duration-300 ease-in-out"
      :class="expanded ? 'h-auto' : 'h-32 overflow-hidden'"
    >
      <div class="flex justify-center items-center h-full">
        <div class="text-lg">
          해당 집의 종합 보증금 안전 진단 결과 {{ safetyStatus }}입니다.
          <br />
          예측 손실액은 {{ estimatedLoss }}원이며, 위험 진단 요소는 {{ riskFactor }}건입니다.
        </div>
      </div>

      <div v-if="expanded" class="mt-4 text-sm text-gray-700">
        해당 집의 보증금 안전 점수는 {{ reportStore.reportData.safetyScore }}점입니다. <br />
        안전 점수는 ~~~~를 기반으로 산출되었습니다.<br />
        위험 진단 요소로는 선순위 채권, 예상 경매 낙찰가, 경매 건수 등이 포함됩니다. <br />
        리포트의 자세한 정보를 보려면 아래 상세 보고서를 참고하세요.
      </div>

      <button
        class="absolute top-3 right-3 text-xl text-gray-300 hover:text-gray-400 transition-transform transform focus:outline-none"
        @click="toggleExpand"
        :style="{ transform: expanded ? 'rotate(180deg)' : 'rotate(0deg)' }"
      >
        ▼
      </button>
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

const safetyStatus = computed(() => {
  const score = reportStore.reportData.safetyScore 
  if (score >= 80) { return '안전';
  } else if (score >= 60) { return '양호';
  } else if (score >= 40) { return '보통';
  } else if (score >= 20) { return '주의';
  } else { return '위험';
  }
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

const toggleExpand = () => {
  expanded.value = !expanded.value;
};
</script>