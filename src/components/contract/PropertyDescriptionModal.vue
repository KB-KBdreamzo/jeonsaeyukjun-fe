<template>
    <!-- <Teleport to="body"> -->
      <div class="modal-overlay" @click="closeModal">
        <div class="modal-content" @click.stop>
          <button class="close-button" @click="closeModal">&times;</button>
          <h2 v-if="title">{{ title }}</h2>
  
          <!-- 작성가이드 제목과 내용 추가 -->
          <div class="hardcoded-content">
            <div class="guide-title"># 임차주택의 표시란</div>
            <p>
              이 부분에서는 임대하는 주택에 대한 구체적인 정보를 제공하여 계약의
              명확성을 높이고, 나중에 발생할 수 있는 분쟁을 예방하는 데
              기여합니다.
            </p>
            <br />
            <hr />
            <div class="guide-title"># 특약이란</div>
            <p>~~~</p>
          </div>
        </div>
      </div>
    <!-- </Teleport> -->
  </template>
  
  <script setup>
  import { defineProps, defineEmits, ref, onMounted } from "vue";
  
  const props = defineProps({
    title: String,
  });
  
//   const emit = defineEmits(["close"]);
  
//   const data = ref([]);
//   const loading = ref(true);
//   const error = ref(null);
  
//   const closeModal = () => {
//     emit("close");
//   };
  
//   const fetchData = async () => {
//     loading.value = true;
//     error.value = null;
  
//     try {
//       const response = await fetch(
//         "http://localhost:8080/api/contract/special?conditionType=법적"
//       );
//       if (!response.ok) {
//         throw new Error("Network response was not ok");
//       }
//       const result = await response.json();
//       console.log(result);
//       data.value = result; // 가져온 데이터를 data에 할당
//     } catch (err) {
//       error.value = "데이터를 가져오는 데 실패했습니다: " + err.message;
//     } finally {
//       loading.value = false; // 로딩 완료
//     }
//   };
  
//   onMounted(() => {
//     fetchData(); // 컴포넌트가 마운트될 때 데이터 가져오기
//   });
  </script>
  
  <style scoped>
  .modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
  }
  
  .modal-content {
    position: relative;
    background: #019aec;
    padding: 12px 12px 24px 12px;
    border-radius: 20px 20px 0 0;
    bottom: 0;
    box-sizing: border-box;
    -webkit-filter: drop-shadow(0 -8px 15px rgba(0, 0, 0, 0.15));
    filter: drop-shadow(0 -8px 15px rgba(0, 0, 0, 0.15));
    height: 300px; /* 높이 조정 */
    left: 0;
    position: fixed;
    width: 360px;
    display: flex;
    flex-direction: column;
    justify-content: flex-start; /* 위쪽 정렬 */
  }
  
  .close-button {
    position: absolute;
    top: 4px;
    right: 4px;
    background: none;
    border: none;
    font-size: 24px;
    color: #fff;
    cursor: pointer;
  }
  
  .close-button:hover {
    color: red;
  }
  
  /* 작성가이드 스타일 추가 */
  .guide-title {
    font-size: 18px; /* 폰트 크기 증가 */
    font-weight: 700; /* 글씨 두께 증가 */
    color: #fff; /* 색상 설정 */
    margin-bottom: 12px;
    margin-top: 16px;
  }
  
  /* 하드코딩된 내용 스타일 추가 */
  .hardcoded-content {
    padding: 0px 12px;
    margin-top: 20px;
    width: 100%;
    height: 100%;
    color: #fff;
    font-size: 17px; /* 폰트 크기 */
    line-height: 22px; /* 줄 높이 */
    font-weight: 700; /* 글씨 두께 조정 */
    letter-spacing: -0.04em;
    overflow-y: auto; /* 수직 스크롤 활성화 */
  }
  
  .guide-box {
    padding: 10px 0px;
  }
  
  /* 스크롤바 스타일 */
  .hardcoded-content::-webkit-scrollbar {
    width: 6px; /* 스크롤바 너비 */
  }
  
  .hardcoded-content::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, 0.5); /* 반투명 색상 */
    border-radius: 5px; /* 둥글게 */
  }
  
  /* 스크롤바 전체 영역 */
  .hardcoded-content::-webkit-scrollbar-track {
    background: transparent; /* 배경 투명 */
  }
  
  hr {
    color: white;
    margin-bottom: 8px;
  }
  </style>