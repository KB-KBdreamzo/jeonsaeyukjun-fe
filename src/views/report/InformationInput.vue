<template>
    <div class="container">

      <div class="cont1">
        <div class="left">
            <img src="/src/assets/report1.png" alt="house" class="icon" />
            <h1>보증금 리포트를 확인할 집 주소를 알려주세요</h1>
        </div>
        <div class="right">
            <div class="inputs">
                <div>주소지</div>
                <input
                    type="text"
                    id="address"
                    v-model="address"
                    class="form-control"
                    placeholder="예) 역삼 푸르지오"
                />
            </div>
            <div class="inputs">
                <div>상세주소</div>
                <input
                    type="text"
                    id="detailed-address"
                    v-model="detailedAddress"
                    class="form-control mt-2"
                    placeholder="동, 호수 입력 (동 없을 경우 호수만 입력)"
                />
            </div>
        </div>
      </div>


      <div class="cont1">
        <div class="left">
            <img src="/src/assets/report2.png" alt="money" class="icon" />
            <h1>전세 금액을 알려주세요</h1>
        </div>
        <div class="right">
            <div class="inputs">
                <input
                    type="number"
                    id="deposit"
                    v-model="deposit"
                    class="form-control"
                    placeholder="금액을 입력해 주세요."
                />
                <div class="label">{{ deposit }}원</div>
            </div>
        </div>
      </div>

      <div class="cont1">
        <div class="left">
            <img src="/src/assets/report3.png" alt="file" class="icon" />
            <h1>등기부등본을 업로드해주세요</h1>
        </div>
        <div class="right">
            <div class="deposit">
                <input
                    type="file"
                    id="upload-file"
                    @change="onFileChange"
                    class="form-control-file"
                />
                <button class="btn" @click="confirmFile" :disabled="!uploadedFile">
                    Confirm File
                </button>
            </div>
        </div>
      </div>
      
      <div class="cont1">
        <button class="btn" @click="createReport" :disabled="!canCreateReport">
            Create Report
        </button>
      </div>
    </div>
  
  </template>
  
  <script setup>
  import { ref } from 'vue';
  import { useRegisterStore } from '@/stores/registerStore'; // Pinia 스토어 사용
  
  const store = useRegisterStore();  // Pinia 스토어 호출
  
  const address = ref('');
  const detailedAddress = ref('');
  const deposit = ref(0);
  const uploadedFile = ref(null);
  const canCreateReport = ref(false); 
  
  // 파일 업로드 시 처리
  const onFileChange = (event) => {
    uploadedFile.value = event.target.files[0];
  };
  
  // 파일 검증 및 서버 응답 확인
  const confirmFile = async () => {
    if (uploadedFile.value) {
      await store.fetchRegister(uploadedFile.value);  
      validateAddress();
    }
  };
  
  const validateAddress = () => {
    console.log(store.registerData)
    if (store.registerData.address === address.value) {
      canCreateReport.value = true;  
    } else {
      canCreateReport.value = false;
      alert('주소가 일치하지 않습니다.');
    }
  };
  
  const createReport = () => {
    // 가진 정보들을 바탕으로 백엔드에 post 요청
    alert('리포트 생성 완료!');
    // pinia로 정보저장 후 report result 페이지로 넘기기

  };
  </script>
  
  <style scoped>
.container {
  width: 100%; 
  height: 100%;
}

.cont1 {
  display: flex;
  justify-content: space-evenly;
  align-items: center;
  background-color: #f8f8f8;
  padding: 50px 0px;
  width: 90%; 
  margin: 0 auto;
}

.left {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 60px;
  flex: 1;
}

.left img {
  width: 120px;
  height: 120px;
}

.left h1 {
  width: 300px;
  white-space: normal; 
}

.right {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  gap: 30px;
}

.right input {
  width: 400px; 
  height: 30px;
}

button[disabled] {
  background-color: grey;
  cursor: not-allowed;
}

.btn {
  padding: 10px 20px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}
</style>