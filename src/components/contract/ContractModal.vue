<template>
    <div class="modal-overlay" @click="handleClose">
      <div class="modal-content" @click.stop>
        <span class="close" @click="handleClose">&times;</span>
        <div class="document-info">
          <div class="document-top">
            <h1 class="header">주택임대차 계약서 (전세)</h1>
            <p class="info">
              주택임대차계약서는 임대인(집주인)과 임차인(세입자) 간에 주택의 임대에
              대한 권리와 의무를 명시하는 법적 문서입니다. 이 계약서는 주택을 임대하는
              조건과 세부 사항을 명확하게 규정하여, 양측의 권리를 보호하고 향후 발생할
              수 있는 분쟁을 예방하는 역할을 합니다.
            </p>
    
            <div class="core">
              <h3 class="core-header">핵심 내용</h3>
              <div class="core-content">
                계약기간 &nbsp;|&nbsp; 당사자정보 &nbsp;|&nbsp; 계약금액 &nbsp;|&nbsp;
                부동산표시 &nbsp;|&nbsp; 특약사항
              </div>
            </div>
          </div>
    
          <h3>
            <li class="document-bottom">
              <span>주택임대차 계약서 작성시 유의사항</span>
            </li>
          </h3>
    
          <div class="bottom-container">
            <ul class="bottom-content">
              <li>
                임대차계약서에서 부동산의 구조,용도,면적,땅의 지목,대지권,대지면적
                기재 여부를 꼭 확인하기
              </li>
              <li>
                임대차계약서에 작성한 부동산 주소와 등기부에 작성된 주소가 일치하는지
                확인하기
              </li>
              <li>
                임대차계약서에서 매매대금,계약금,중도금,잔금 액수와 지급일,지급 방법을
                확인하기
              </li>
              <li>임대차계약서에서 계약일 및 계약기간을 확인하기</li>
              <li>임대차계약서에서 공과금 납부,관리비에 대한 사항을 확인하기</li>
              <li>임대차계약서에서 계약 해제에 대한 사항을 확인하기</li>
              <li>임대차계약서에서 특약 사항을 확인하기</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { defineEmits } from "vue";
  
  const emit = defineEmits();
  
  const handleClose = () => {
    emit('close'); // 부모 컴포넌트에 close 이벤트 전파
  };
  </script>
  
  <style scoped>
  .modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5); /* 반투명 배경 */
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 999; /* 다른 요소 위에 표시 */
  }
  
  .modal-content {
    background: white;
    padding: 20px;
    border-radius: 5px;
    width: 700px; /* 모달 크기 조정 */
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
    position: relative;
  }
  
  .close {
    position: absolute;
    top: 10px;
    right: 15px;
    font-size: 20px;
    cursor: pointer;
  }
  
  .document-info {
    font-family: Arial, sans-serif;
    max-width: 100%;
  }
  
  .document-top {
    padding: 10px 0;
  }
  
  .document-bottom {
    padding: 10px 0;
    background-color: #f7f7f7;
    color: #019aec;
  }
  
  .document-bottom > span {
    margin-left: -5px;
    font-weight: 700;
    color: black;
  }
  
  .bottom-container {
    padding: 10px 0;
  }
  
  .bottom-content li {
    font-weight: 700; /* 또는 원하는 두께로 조정 (예: 800, 900) */
  }
  
  .bottom-content {
    margin-top: 8px;
    padding-left: 10px;
    color: gray;
    padding-bottom: 20px;
    line-height: 1.5; /* 줄 간격 조정 */
  }
  
  .header {
    font-weight: 700;
    color: black;
  }
  
  .info {
    padding-top: 8px;
    font-weight: 700;
    color: gray;
    font-size: 0.9em; /* 텍스트 크기 조정 */
  }
  
  .core {
    margin-top: 14px;
    font-weight: 700;
  }
  
  .core-header {
    font-weight: 700;
  }
  
  .core-content {
    background-color: #019aec;
    padding: 10px;
    color: white;
    font-weight: 700;
    margin-top: 10px;
    border-radius: 8px;
  }
  </style>
  