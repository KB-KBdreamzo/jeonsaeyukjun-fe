<template>
  <div class="bg-gray-100 p-5 rounded-lg mx-auto">
    <div class="flex justify-between p-5 relative">
      <!-- 테이블 -->
      <table class="w-1/2 border-collapse mr-10">
        <tbody>
          <tr class="underline">
            <td class="font-bold">추정 시세</td>
            <td class="text-right">
              {{ reportStore.estimatedPrice.toLocaleString() }} 원
            </td>
          </tr>
          <tr class="underline">
            <td class="font-bold">낙찰가율</td>
            <td class="text-right">{{ reportStore.auctionRate }}%</td>
          </tr>
          <tr class="underline">
            <td class="font-bold">예상 경매 낙찰가</td>
            <td class="text-right">
              {{ reportStore.expectedAuctionPrice.toLocaleString() }} 원
            </td>
          </tr>
          <tr class="underline">
            <td class="font-bold">선순위 채권액</td>
            <td class="text-right">
              {{ reportStore.securedDebt.toLocaleString() }} 원
            </td>
          </tr>
          <tr class="underline">
            <td class="font-bold border-none">환불 가능한 보증금</td>
            <td class="text-right border-none">
              {{ reportStore.refundableDeposit.toLocaleString() }} 원
            </td>
          </tr>
        </tbody>
      </table>

      <!-- 가로 막대 그래프 -->
      <div class="w-1/2 flex flex-col justify-between p-5 relative">
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
      class="bg-white mt-2 p-5 rounded-lg text-center text-lg leading-relaxed"
    >
      내 전세금은 {{ reportStore.myDeposit.toLocaleString() }}원이므로 예측
      손실액은 {{ reportStore.estimatedLoss.toLocaleString() }}원입니다.
      <br />
      {{ reportStore.reportMessage }}
    </div>
  </div>
</template>

<script>
import { useReportStore } from "../stores/reportStore";
import { computed } from "vue";

export default {
  setup() {
    const reportStore = useReportStore();

    const estimatedPriceBarWidth = computed(() =>
      calculateBarWidth(reportStore.estimatedPrice, reportStore.estimatedPrice)
    );
    const totalDebtBarWidth = computed(() =>
      calculateBarWidth(
        reportStore.securedDebt + reportStore.myDeposit,
        reportStore.estimatedPrice
      )
    );
    const myDepositBarWidth = computed(() =>
      calculateBarWidth(reportStore.myDeposit, reportStore.estimatedPrice)
    );

    const calculateBarWidth = (value, maxValue) =>
      `${(value / maxValue) * 100}%`;

    return {
      reportStore,
      estimatedPriceBarWidth,
      totalDebtBarWidth,
      myDepositBarWidth,
    };
  },
};
</script>
