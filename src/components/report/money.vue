<template>
  <div class="w-full bg-gray-100 py-10 px-10  rounded-3xl mx-auto">
    <div class="flex justify-between justify-center gap-20 px-12 p-5 relative">
      <div class="flex flex-col w-1/2 border-collapse">
        <div
          v-for="(item, index) in reportDetails" :key="index"
          class="flex justify-between px-4 py-2 border-b border-gray-300"
          :class="{ 'border-b-0': index === reportDetails.length - 1 }" 
        >
          <div class="font-semibold">{{ item.label }}</div>
          <div class="font-normal">
            {{ item.value > 0 ? item.value.toLocaleString() + (item.unit || ' 원') : '알 수 없음' }}
          </div>
        </div>
      </div>
      

      <!-- 가로 막대 그래프 -->
      <div class="w-1/2 flex flex-col justify-between p-5 relative overflow-x-clip">
        <div
          class="absolute top-2 left-[80%] h-[91%] border-l-2 border-dashed border-gray-400"
        >
          <span class="absolute -top-5 -left-4 text-sm text-gray-600">80%</span>
        </div>
        <div
          class="bg-blue-400 text-black text-left mb-5 p-2 rounded-lg font-semibold transition-all duration-300"
          :style="{ width: estimatedPriceBarWidth }"
        >
          추정 시세
        </div>


        <div
          class="bg-blue-200 overflow-visible whitespace-nowrap text-black text-left mb-5 p-2 rounded-lg font-semibold transition-all duration-300"
          :style="{ width: totalDebtBarWidth }"
        >
          선순위 채권액 + 내 전세금
        </div>
        <div
          class="bg-blue-100 text-black text-left p-2 rounded-lg font-semibold transition-all duration-300"
          :style="{ width: myDepositBarWidth }"
        >
          내 전세금
        </div>
      </div>
    </div>

    <!-- 하단 텍스트 영역 -->
    <div
      class="bg-white mt-2 p-5 rounded-2xl text-center text-lg leading-relaxed"
    >
      내 전세금은 {{ myDeposit.toLocaleString() }}원이므로 예측
      손실액은 {{ estimatedLoss.toLocaleString() }}원입니다.
      <br />
      {{ reportStore.reportMessage }}
    </div>
  </div>
</template>

<script setup>
import { useReportStore } from "../../stores/reportStore";
import { ref, computed } from "vue";

const reportStore = useReportStore();

const nowPrice = computed(() => reportStore.reportData.nowPrice);
const salePriceRatio = computed(() => reportStore.reportData.salePriceRatio);
const estimatedAuctionPrice = computed(() => parseInt(reportStore.reportData.nowPrice * reportStore.reportData.salePriceRatio / 100));
const priorityDeposit = computed(() => reportStore.reportData.registerDto.priorityDeposit);
const refundableDeposit = computed(() => estimatedAuctionPrice.value > priorityDeposit.value ? (estimatedAuctionPrice.value - priorityDeposit.value) : 0);
const myDeposit = computed(() => reportStore.reportData.deposit);
const estimatedLoss = computed(() => refundableDeposit.value > myDeposit.value ? 0 : (myDeposit.value - refundableDeposit.value));

const reportDetails = ref([
  { label: "추정 시세", value: nowPrice, unit: "원" },
  { label: "낙찰가율", value: salePriceRatio, unit: "%" },
  { label: "예상 경매 낙찰가", value: estimatedAuctionPrice, unit: "원" },
  { label: "선순위 채권액", value: priorityDeposit, unit: "원" },
  { label: "환불 가능 보증금", value: refundableDeposit, unit: "원" },
  { label: "내 보증금", value: myDeposit, unit: "원" },
]);

const estimatedPriceBarWidth = computed(() =>
  calculateBarWidth(nowPrice.value, nowPrice.value)
);

const totalDebtBarWidth = computed(() =>
  Math.max(30, (priorityDeposit.value + myDeposit.value) / nowPrice.value * 100) + '%'
);

const myDepositBarWidth = computed(() =>
  Math.max(30, (myDeposit.value / nowPrice.value) * 100) + '%'
);

const calculateBarWidth = (value, maxValue) =>`${(value / maxValue) * 100}%`;

</script>