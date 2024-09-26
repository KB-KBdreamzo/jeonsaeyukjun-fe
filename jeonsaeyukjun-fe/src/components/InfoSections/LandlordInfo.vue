<template>
  <div class="section">
    <!-- 텍스트와 이미지를 포함하는 헤더 섹션 -->
    <div class="header">
      <div>
        <h2 class="bold">임대인의 정보를</h2>
        <h2 class="bold"> 알아보겠습니다.</h2>
      </div>
        <div class="profile-image">
          <img src="@/assets/renter.png" alt="임대인 사진"/>
        </div>
      </div>

      <!-- 소유권 외 권리사항 텍스트 -->
      <p class="subtext">소유권 외 권리사항을 확인해요</p>

      <!-- 항목 리스트 -->
      <div class="item-list">
        <div class="item" v-for="item in landlordInfo" :key="item.label">
          <span class="label">{{ item.label }}</span>
          <span class="status">{{ item.status }}</span>
        </div>
      </div>
    </div>
</template>

<script setup>
//axios사용
import { ref } from 'vue';
const landlordInfo = ref([
  { label: "전월세 사기 신고 접수 여부", status: "없음" },
  { label: "고액 체납자 여부", status: "없음" },
  { label: "근저당권 설정 내역", status: "없음" },
  { label: "집이 경매에 넘어간 횟수", status: "없음" },
]);
</script>

<style scoped>
.section {
  margin: 1rem 0;
}

/* 텍스트와 이미지를 나란히 배치하는 헤더 */
.header {
  display: flex;
  align-items: center; /* 텍스트와 이미지 상단을 맞춤 */
}

/* 소유권 외 권리사항 텍스트 스타일 */
.subtext {
  margin: 0;
  padding-top: 5px;
  font-size: 14px;
  color: #555; /* 부가 설명 텍스트 색상 */
}
.bold {
  font-weight: bold;
}


/* 이미지 스타일 */
.profile-image img {
  width: 80px; /* 이미지 크기 */
  height: 80px;
  border-radius: 50%; /* 이미지를 원형으로 만듦 */
  object-fit: cover; /* 이미지가 비율을 유지하며 꽉 차게 */
  margin-left: 20px; /* 텍스트와의 간격 */
}

/* 항목 리스트 */
.item-list {
  margin-top: 20px; /* 리스트 위 여백 */
}

/* 항목 스타일 */
.item {
  display: flex;
  justify-content: space-between;
  padding: 10px 0;
  border-bottom: 1px solid #ccc; /* 항목 사이에 선 추가 */
}

.item:last-child {
  border-bottom: none; /* 마지막 항목에 선을 표시하지 않음 */
}

/* 텍스트 볼드 처리 */
.label {
  font-weight: bold;
}

/* 상태 스타일 */
.status {
  background-color: #e0e0e0;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  text-align: center;
}
</style>
