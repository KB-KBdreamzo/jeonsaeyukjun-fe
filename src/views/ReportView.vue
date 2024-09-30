<script setup>
import LandlordInfo from "@/components/InfoSections/LandlordInfo.vue";
import OwnershipInfo from "@/components/InfoSections/OwnershipInfo.vue";
import OtherInfo from "@/components/InfoSections/OtherInfo.vue";
import ReportSafeScore from "../components/ReportSafeScore.vue";
import ReportResult from "../components/ReportResult.vue";

</script>

<template>
  <div class="container">
    <div class="report-section mb-10">
      <ReportSafeScore />
    </div>

      <!-- Divider Line (Optional) -->
    <hr class="border-gray-300 my-10" />
    <!-- ReportResult Component -->
    <div class="report-section">
      <ReportResult />
    </div>

    <div class="section">
      <LandlordInfo />
    </div>
    <div class="section">
      <OwnershipInfo />
    </div>
    <div class="section">
      <OtherInfo />
    </div>
  </div>
</template>

<style scoped>
body {
  margin: 0;
  padding-top: 60px;
}
.container {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}
.section {
  background-color: #fff;
  padding: 20px;

  border: none;
}
.item {
  display: flex;
  justify-content: space-between;
  margin-top: 1rem;
}
.status {
  background-color: #e0e0e0;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  text-align: center;
}

.report-container {
  max-width: 1200px; /* 페이지 전체 컨테이너의 최대 너비 설정 */
  margin: 0 auto; /* 중앙 정렬 */
  background-color: white; /* 배경 색상 설정 */
}

.report-section {
  background-color: #ffffff; /* 각 섹션의 배경색 */
}
</style>
