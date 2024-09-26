<template>
  <div class="report-container">
    <div class="report-result">
      <!-- 테이블 -->
      <table>
        <tr>
          <td class="bold-text">추정 시세</td>
          <td class="align-right">
            {{ reportStore.estimatedPrice.toLocaleString() }} 원
          </td>
        </tr>
        <tr>
          <td class="bold-text">낙찰가율</td>
          <td class="align-right">{{ reportStore.auctionRate }}%</td>
        </tr>
        <tr>
          <td class="bold-text">예상 경매 낙찰가</td>
          <td class="align-right">
            {{ reportStore.expectedAuctionPrice.toLocaleString() }} 원
          </td>
        </tr>
        <tr>
          <td class="bold-text">선순위 채권액</td>
          <td class="align-right">
            {{ reportStore.securedDebt.toLocaleString() }} 원
          </td>
        </tr>
        <tr>
          <td class="bold-text no-border">환불 가능한 보증금</td>
          <td class="align-right no-border">
            {{ reportStore.refundableDeposit.toLocaleString() }} 원
          </td>
        </tr>
      </table>

      <!-- 가로 막대 그래프 -->
      <div class="bar-graph">
        <!-- 80% 지점의 실선 -->
        <div class="reference-line">
          <span class="reference-text">80%</span>
        </div>

        <div
          class="bar estimated-bar"
          :style="{ width: estimatedPriceBarWidth }"
        >
          추정 시세
        </div>
        <div class="bar total-debt-bar" :style="{ width: totalDebtBarWidth }">
          선순위 채권액 + 내 전세금
        </div>
        <div class="bar my-deposit-bar" :style="{ width: myDepositBarWidth }">
          내 전세금
        </div>
      </div>
    </div>

    <!-- 하단 텍스트 영역 -->
    <div class="result-summary">
      내 전세금은 {{ reportStore.myDeposit.toLocaleString() }}원이므로 예측
      손실액은 {{ reportStore.estimatedLoss.toLocaleString() }}원입니다.
      <br />
      전세가가 매매가(추정 시세)의 {{ rentToPriceRatio }}% 이므로 깡통 전세는
      아닙니다.
    </div>
  </div>
</template>

<script>
import { useReportStore } from "../stores/reportStore";
import { computed } from "vue";

export default {
  setup() {
    const reportStore = useReportStore();

    // 추정 시세 대비 각 값의 비율을 계산하여 막대 그래프의 가로 길이 결정
    const estimatedPriceBarWidth = computed(() => {
      return calculateBarWidth(
        reportStore.estimatedPrice,
        reportStore.estimatedPrice
      ); // 100%
    });

    const totalDebtBarWidth = computed(() => {
      const totalDebt = reportStore.securedDebt + reportStore.myDeposit;
      return calculateBarWidth(totalDebt, reportStore.estimatedPrice);
    });

    const myDepositBarWidth = computed(() => {
      return calculateBarWidth(
        reportStore.myDeposit,
        reportStore.estimatedPrice
      );
    });

    // 전세가 대비 매매가 비율
    const rentToPriceRatio = computed(() => {
      return (
        (reportStore.myDeposit / reportStore.estimatedPrice) *
        100
      ).toFixed(2);
    });

    // 그래프 너비 계산 함수
    const calculateBarWidth = (value, maxValue) => {
      const percentage = (value / maxValue) * 100;
      return `${percentage}%`;
    };

    return {
      reportStore,
      estimatedPriceBarWidth,
      totalDebtBarWidth,
      myDepositBarWidth,
      rentToPriceRatio,
    };
  },
};
</script>

<style scoped>
/* 전체 배경 */
.report-container {
  background-color: #f9f9f9; /* 회색 배경 */
  padding: 20px;
  border-radius: 10px; /* 둥근 테두리 */
  width: 70%;
  margin: 0 auto; /* 화면 가로 중앙 정렬 */
}

.bold-text {
  font-weight: bold;
}

/* 테이블과 막대 그래프를 나란히 배치 */
.report-result {
  padding: 20px;
  border-radius: 10px;
  display: flex;
  justify-content: space-between;
  position: relative;
  height: 100%; /* 부모 요소가 가득 차도록 높이 설정 */
}

/* 테이블 스타일 */
table {
  width: 50%;
  border-collapse: collapse;
  margin-right: 80px; /* 테이블과 그래프 사이 간격 추가 */
  height: 100%; /* 테이블 높이를 부모 높이에 맞춤 */
}
td {
  padding: 10px;
  border-bottom: 1px solid #ddd;
  color: black;
}

/* 마지막 줄(환불 가능한 보증금) 아래의 테두리 제거 */
.no-border {
  border-bottom: none;
}

/* 금액 열을 오른쪽 정렬 */
.align-right {
  text-align: right;
}

/* 가로 막대 그래프 스타일 */
.bar-graph {
  width: 50%;
  display: flex;
  flex-direction: column;
  justify-content: space-between; /* 막대 사이의 간격을 균등하게 배치 */
  padding: 20px;
  position: relative; /* 참조선 절대 위치를 위한 relative */
  height: 100%; /* 그래프 높이를 부모 높이에 맞춤 */
}

.bar {
  color: black; /* 텍스트 검정색으로 변경 */
  text-align: left; /* 왼쪽 정렬 */
  padding-left: 10px; /* 텍스트 시작점 맞춤 */
  margin-bottom: 20px; /* 막대 그래프 사이에 더 많은 간격 추가 */
  padding: 10px;
  border-radius: 5px;
  font-weight: bold; /* 글씨 굵게 */
  transition: width 0.3s ease; /* 애니메이션 효과 추가 */
}

/* 추정 시세 컬러 */
.estimated-bar {
  background-color: #83bbff;
}

/* 선순위 채권액 + 내 전세금 컬러 */
.total-debt-bar {
  background-color: #c0e3fc;
}

/* 내 전세금 컬러 */
.my-deposit-bar {
  background-color: #ebf6ff;
}

/* 80% 지점에 실선 표시 */
.reference-line {
  position: absolute;
  top: 7%; /* 실선이 위에서 조금 내려오도록 설정 */
  left: 80%;
  height: 80%;
  border-left: 2px dashed #777e90; /* 실선 */
}

.reference-text {
  position: absolute;
  top: -18px; /* 실선 위에 위치 */
  left: -15px; /* 실선 옆에 텍스트 */
  font-size: 12px;
  color: #333;
}

/* 텍스트 요약 부분 스타일 */
.result-summary {
  background-color: white;
  margin-top: 10px;
  margin-bottom: 20px;
  margin-left: 10px;
  margin-right: 10px;
  padding: 20px;
  border-radius: 10px;
  text-align: center;
  font-size: 16px;
  line-height: 1.5;
  color: black;
}
</style>
