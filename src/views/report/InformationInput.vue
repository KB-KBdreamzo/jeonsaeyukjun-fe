<template>
    <div class="container">

      <div class="cont1">
        <div class="left">
            <img src="/src/assets/report1.png" alt="house" class="icon" />
            <h1>보증금 리포트를 확인할 집 주소를 알려주세요</h1>
        </div>
        <div class="right">
            <div class="search-container">
                <div class="input-label">주소지</div>
                <div class="search">
                <input
                    type="text"
                    v-model="addressInput"
                    placeholder="도로명 주소나 지번 주소를 입력하세요"
                    class="address-input form-control"
                />
                <button class="icon-btn" @click="onSearchClick">
                    <img src="/src/assets/search.png" style="height: 24px; width: 24px;">
                </button>
                <button class="icon-btn" @click="clearInput">
                    <img src="/src/assets/cancel.png" style="height: 24px; width: 24px;">
                </button>
                </div>
                <ul v-if="showResults && addressStore.addressResults.length" class="dropdown">
                    <li v-for="(result, index) in addressStore.addressResults" :key="index" @click="selectAddress(result)">
                        {{ result.jibunAddr }} / {{ result.roadAddr }}
                    </li>
                </ul>
            </div>
            <div class="inputs">
                <div class="input-label">상세주소</div>
                <input
                    type="text"
                    id="detailed-address"
                    v-model="detailedAddress"
                    class="address-input form-control mt-2"
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
                    class="address-input form-control"
                    placeholder="금액을 입력해 주세요."
                />
                <div class="label" style="text-align: right;">{{ deposit }}원</div>
            </div>
        </div>
      </div>

      <div class="cont1">
        <div class="left">
            <img src="/src/assets/report3.png" alt="file" class="icon" />
            <h1>등기부등본을<br/>업로드해주세요</h1>
        </div>
        <div class="right">
            <div class="deposit">
                <input
                    type="file"
                    id="upload-file"
                    @change="activeBtn"
                    class="form-control-file address-input"
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
import { useRegisterStore } from '@/stores/registerStore'; 
import { useAddressStore } from '@/stores/addressStore';

const registerStore = useRegisterStore();  
const addressStore = useAddressStore();

const addressInput = ref('');
const showResults = ref(false); // 검색 결과를 보여줄지 여부
const detailedAddress = ref('');
const deposit = ref(0);
const uploadedFile = ref(null);
const canCreateReport = ref(false); 

const onSearchClick = async() => {
    if (addressInput.value) {
        await addressStore.fetchAddress(addressInput.value);
        showResults.value = true; 
    }
};

const clearInput = () => {
    addressInput.value = '';
    addressStore.addressResults = []; 
    showResults.value = false;
};

const selectAddress = (result) => {
    // 도로명 주소 roadAddr, 법정동 코드 admCd (10), 지번주소 jibunAddr, 도로명주소 roadAddr
    // 우편번호 zipNo, 도로명코드 rnMgtSn (12)
    addressStore.selectAddress(result);
    addressInput.value = result.roadAddr;
    showResults.value = false; 
};

const activeBtn = (event) => {
    uploadedFile.value = event.target.files[0];
};

const confirmFile = async () => {
    if (uploadedFile.value) {
        await registerStore.fetchRegister(uploadedFile.value);  
        validateAddress();
    }
};

const validateAddress = () => {
    if (addressInput.value.includes(registerStore.registerData.roadName)) {
        canCreateReport.value = true;  
    } else {
        canCreateReport.value = false;
        alert('주소가 일치하지 않습니다.');
    }
};

const createReport = () => {
    alert('리포트 생성 완료!');
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
  padding: 40px 0px;
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

.inputs {
  width: 400px;
}

.search-container{
    width: 400px;
}

.address-input {
  width: 100%;
  height: 30px;
  padding: 10px;
  font-size: 18px;
  border: 1px solid #ccc;
  border-radius: 5px;
}

.search {
  display: flex;
  align-items: center;
  gap: 10px;
}

.icon-btn {
  background: none;
  border: none;
  cursor: pointer;
  margin-left: 5px;
}

.clear-button {
  font-size: 18px;
  color: red;
}

.dropdown {
  background-color: white;
  border: 1px solid #ddd;
  max-height: 200px;
  overflow-y: auto;
  list-style: none;
  padding: 0;
  margin: 0;
  z-index: 100;
}

.dropdown li {
  padding: 10px;
  cursor: pointer;
}

.dropdown li:hover {
  background-color: #f1f1f1;
}

button[disabled] {
  background-color: grey;
  cursor: not-allowed;
}

.btn {
  padding: 15px 30px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 18px;
}
</style>
