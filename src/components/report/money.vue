<template>
  <div class="w-full bg-gray-100 py-10 px-10  rounded-3xl mx-auto">
    <div class="flex justify-between px-20 p-5 relative">
      <!-- 테이블 -->
      <table class="w-2/5 border-collapse mr-10">
        <tbody>
          <tr>
            <td class="font-bold">추정 시세</td>
            <td class="text-right">
              {{ nowPrice.toLocaleString() }} 원
            </td>
          </tr>
          <tr>
            <td class="font-bold">낙찰가율</td>
            <td class="text-right">{{ salePriceRatio }}%</td>
          </tr>
          <tr>
            <td class="font-bold">예상 경매 낙찰가</td>
            <td class="text-right">
              {{ estimatedAuctionPrice.toLocaleString() }} 원
            </td>
          </tr>
          <tr>
            <td class="font-bold">선순위 채권액</td>
            <td class="text-right">
              {{ priorityDeposit.toLocaleString() }} 원
            </td>
          </tr>
          <tr>
            <td class="font-bold border-none">환불 가능한 보증금</td>
            <td class="text-right border-none">
              {{ refundableDeposit.toLocaleString() }} 원
            </td>
          </tr>
        </tbody>
      </table>

      <!-- 가로 막대 그래프 -->
      <div class="w-2/5 flex flex-col justify-between p-5 relative">
        <div
          class="absolute top-2 left-[80%] h-[91%] border-l-2 border-dashed border-gray-400"
        >
          <span class="absolute -top-5 -left-4 text-sm text-gray-600">80%</span>
        </div>
        <div
          class="bg-blue-400 text-black text-left mb-5 p-2 rounded-lg font-bold transition-all duration-300"
          :style="{ width: estimatedPriceBarWidth }"
        >
          추정 시세
        </div>

        <div
          class="bg-blue-200 text-black text-left mb-5 p-2 rounded-lg font-bold transition-all duration-300"
          :style="{ width: totalDebtBarWidth }"
        >
          선순위 채권액 + 내 전세금
        </div>
        <div
          class="bg-blue-100 text-black text-left p-2 rounded-lg font-bold transition-all duration-300"
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
import { computed } from "vue";

const reportStore = useReportStore();
console.log(reportStore.reportData)
const nowPrice = computed(() => reportStore.reportData.nowPrice);
const salePriceRatio = computed(() => reportStore.reportData.salePriceRatio);
const estimatedAuctionPrice = computed(() => reportStore.reportData.nowPrice * reportStore.reportData.salePriceRatio);
const priorityDeposit = computed(() => reportStore.reportData.registerDto.priorityDeposit);
const refundableDeposit = computed(() => estimatedAuctionPrice - priorityDeposit < 0 ? 0 : (estimatedAuctionPrice - priorityDeposit));
const myDeposit = computed(() => reportStore.reportData.deposit);
const estimatedLoss = computed(() => myDeposit - refundableDeposit > 0 ? 0 :-(myDeposit - refundableDeposit));

const estimatedPriceBarWidth = computed(() =>
  calculateBarWidth(nowPrice.value, nowPrice.value)
);
const totalDebtBarWidth = computed(() =>
  calculateBarWidth(priorityDeposit.value + myDeposit.value, nowPrice.value)
);
const myDepositBarWidth = computed(() =>
  calculateBarWidth(myDeposit.value, nowPrice.value)
);

const calculateBarWidth = (value, maxValue) =>
  `${(value / maxValue) * 100}%`;
</script>
