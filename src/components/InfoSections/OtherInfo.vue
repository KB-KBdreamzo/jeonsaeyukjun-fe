<template>
  <div class="section">
    <div class="header">
      <div>
        <h2 class="bold">기타 권리사항을 </h2>
        <h2 class="bold">알아보겠습니다</h2>
      </div>
      <div class="profile-image">
        <img src="@/assets/report/report.png" alt="리포트 사진"/>
      </div>
    </div>

    <p class="subtext">소유권의 권리사항을 확인해요</p>


    <div class="item-list">
      <div class="item" v-for="item in landlordInfo" :key="item.label">
        <span class="label">{{ item.label }}</span>
        <span class="status">{{ item.status }}</span>
      </div>
    </div>
  </div>
</template>

<script setup>

import {ref} from 'vue';

const landlordInfo = ref([
  {label: "신탁 등기 설정 내역", status: "없음"},
  {label: "전세권 설정 내역", status: "없음"},
]);
</script>

<style scoped>
.section {
  margin: 1rem 0;
}


.header {
  display: flex;
  align-items: center;
}


.subtext {
  margin: 0;
  padding-top: 5px;
  font-size: 14px;
  color: #555;
}


.profile-image img {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  object-fit: cover;
  margin-left: 20px;
}


.item-list {
  margin-top: 20px;
}


.item {
  display: flex;
  justify-content: space-between;
  padding: 10px 0;
  border-bottom: 1px solid #ccc;
}

.bold {
  font-weight: bold;
}

.item:last-child {
  border-bottom: none;
}


.label {
  font-weight: bold;
}


.status {
  background-color: #e0e0e0;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  text-align: center;
}
</style>