<template>
  <div class="report-container p-10 bg-gray-100">
    <!-- ReportSafeScore Component -->
    <div class="report-section mb-10">
      <ReportSafeScore />
    </div>

    <!-- Divider Line (Optional) -->
    <hr class="border-gray-300 my-10" />

    <!-- ReportResult Component -->
    <div class="report-section">
      <ReportResult />
    </div>
  </div>
</template>

<script>
import ReportSafeScore from "../components/ReportSafeScore.vue";
import ReportResult from "../components/ReportResult.vue";

export default {
  components: {
    ReportSafeScore,
    ReportResult,
  },
};
</script>

<style scoped>
.report-container {
  max-width: 1200px; /* 페이지 전체 컨테이너의 최대 너비 설정 */
  margin: 0 auto; /* 중앙 정렬 */
  background-color: white; /* 배경 색상 설정 */
}

.report-section {
  background-color: #ffffff; /* 각 섹션의 배경색 */
}
</style>
