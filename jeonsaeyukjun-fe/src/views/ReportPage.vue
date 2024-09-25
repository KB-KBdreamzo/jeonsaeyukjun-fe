<template>
  <div class="container">
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

<script setup>
import LandlordInfo from "@/components/InfoSections/LandlordInfo.vue";
import OwnershipInfo from "@/components/InfoSections/OwnershipInfo.vue";
import OtherInfo from "@/components/InfoSections/OtherInfo.vue";
</script>

<style scoped>
body {
  margin: 0;
  padding-top: 60px; /* 헤더 높이만큼 공간을 확보 */
}

.container {
  display: grid;
  grid-template-columns: repeat(2, 1fr); /* 두 개의 열을 고정 */
  gap: 20px; /* 섹션들 사이 간격 */
  width: 100%; /* 너비를 전체 화면 크기로 설정 */
  max-width: 1200px; /* 컨테이너의 최대 너비를 1200px로 설정 */
  margin: 0 auto; /* 가운데 정렬 */
  padding: 20px; /* 내부 여백 추가 */
}

.section {
  background-color: #fff;
  padding: 20px;
  /* border-radius: 10px;  /* 둥근 모서리 제거 */
  /* box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);  /* 그림자 제거 */
  border: none; /* 경계선 제거 */
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

</style>

