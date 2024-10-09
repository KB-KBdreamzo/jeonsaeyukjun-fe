<template>
  <div class="container mx-auto py-10">
    <div class="pb-10 pt-10 flex justify-between items-center w-10/12 mx-auto">
      <div class="flex items-center gap-14">
        <img src="/src/assets/report/report1.png" alt="house" class="w-24 h-24" />
        <h1 class="text-2xl font-semibold leading-tight">보증금 리포트를 확인할<br /> 집 주소를 알려주세요</h1>
      </div>
      <div class="flex flex-col w-96">
        <div class="mb-4 relative">
        <label class="block text-lg mb-2">주소지</label>
        <div class="grid grid-cols-10 gap-2 items-center border border-gray-300 rounded">
          <!-- 8:1:1 비율로 설정 -->
          <input
            type="text"
            v-model="addressInput"
            placeholder="예) 역삼 푸르지오"
            class="col-span-8 h-10 px-4 text-lg focus:outline-none focus:border-none"
          />
          <button class="col-span-1 flex justify-center items-center" @click="clearInput">     
            <img src="/src/assets/cancel.png" class="h-3 w-3">
          </button>
          <button class="col-span-1 flex justify-center items-center" @click="onSearchClick">
            <img src="/src/assets/search.png" class="h-6 w-6">
          </button>
        </div>

        <!-- 절대 위치를 사용해 ul 리스트를 input 바로 아래에 표시 -->
        <ul
          v-if="showResults && addressStore.addressResults.length"
          class="absolute left-0 w-full bg-white border border-gray-300 max-h-48 overflow-y-auto mt-2 z-10"
        >
          <li
            v-for="(result, index) in addressStore.addressResults"
            :key="index"
            @click="selectAddress(result)"
            class="p-2 hover:bg-gray-200"
          >
            {{ result.jibunAddr }} / {{ result.roadAddr }}
          </li>
        </ul>
      </div>

        <div class="mb-4">
          <label class="block text-lg mb-2">상세주소</label>
          <input
            type="text"
            v-model="detailedAddress"
            placeholder="동, 호수 입력 (동 없을 경우 호수만 입력)"
            class="w-full h-10 px-4 text-lg border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>
      </div>
    </div>

    <div class="pb-10 pt-10 flex justify-between items-center w-10/12 mx-auto">
      <div class="flex items-center gap-14">
        <img src="/src/assets/report/report2.png" alt="money" class="w-24 h-24" />
        <h1 class="text-2xl font-semibold">전세 금액을 알려주세요</h1>
      </div>
      <div class="w-96">
        <input
          type="number"
          v-model="deposit"
          placeholder="금액을 입력해 주세요."
          class="w-full h-10 px-4 text-lg border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <div class="text-right mt-2 text-gray-700 text-lg">{{ deposit.toLocaleString() }}원</div>
      </div>
    </div>

    <div class="pb-10 pt-10 flex justify-between items-center w-10/12 mx-auto">
      <div class="flex items-center gap-14">
        <img src="/src/assets/report/report3.png" alt="file" class="w-24 h-24" />
        <h1 class="text-2xl font-semibold leading-tight">등기부등본을<br /> 업로드해주세요</h1>
      </div>
      <div class="w-96">
        <input
          type="file"
          @change="handleFileUpload"
          class="w-full h-10 px-4 pt-0.5 text-lg border flex justify-between items-center border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <div class="w-full flex flex-row-reverse">
          <button type="button" class="w-40 inline-flex justify-center items-center mt-4 py-3 shadow rounded-lg text-white bg-black disabled:opacity-50"
          @click="confirmFile"
          :disabled="!uploadedFile"
          >
            <svg v-if="isFileLoading" class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            {{ isFileLoading ? '파일 검사 중...' : '등본 제출' }}
          </button>
        </div>
      </div>
    </div>
    <!-- 리포트 생성 버튼 -->
    <div class="mt-20 flex justify-center">
      <!-- <button
        class="w-80 bg-black text-white py-3 rounded-lg shadow-md hover:bg-black transition-colors disabled:opacity-50"
        @click="addReport"
        :disabled="!canAddReport"
      >
        Create Report
      </button> -->
      <button type="button" class="w-80 inline-flex justify-center items-center py-3 shadow rounded-lg text-white bg-black disabled:opacity-50"
          @click="addReport"
          :disabled="!canAddReport"
          >
            <svg v-if="isReportLoading" class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            {{ isReportLoading ? '전세사기 리포트 생성중...' : '리포트 생성하기' }}
          </button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useRegisterStore } from '@/stores/registerStore'; 
import { useAddressStore } from '@/stores/addressStore';
import { useReportStore } from '@/stores/reportStore';

const router = useRouter();

const registerStore = useRegisterStore();  
const addressStore = useAddressStore();
const reportStore = useReportStore();

const addressInput = ref('');
const showResults = ref(false);
const detailedAddress = ref('');
const deposit = ref(0);
const uploadedFile = ref(null);
const isFileLoading = ref(false); // 로딩 상태 관리 변수
const canAddReport = ref(false);
const isReportLoading = ref(false);

const onSearchClick = async () => {
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
  addressStore.selectAddress(result);
  addressInput.value = result.roadAddr;
  showResults.value = false;
};

const handleFileUpload = (event) => {
  const file = event.target.files[0];
  if(file && file.type != 'application/pdf'){
    alert("PDF 파일만 업로드 가능합니다")
    event.target.value = ""
  } else {
    uploadedFile.value = file
  }
};

const confirmFile = async () => {
  if (uploadedFile.value) {
    isFileLoading.value = true;  // 로딩 시작 
    try {
      await registerStore.fetchRegister(uploadedFile.value);
      checkValidation();
    } catch (error) {
      console.error("파일 확인 중 오류:", error);
    } finally {
      isFileLoading.value = false; // 로딩 완료
    }
  }
};

const checkValidation = () => {
  if (registerStore.error != null) {
    alert("등기부등본 파일이 아닙니다. 올바른 형식의 등기부등본 pdf를 올려주세요.")
  }
  else {
    if (addressInput.value.includes(registerStore.registerData.roadName) && !registerStore.registerData.illegalBuilding) {
      canAddReport.value = true;
      alert("등본 유효성 검증이 정상적으로 완료되었습니다.")
    } else {
      canAddReport.value = false;
      if (registerStore.registerData.illegalBuilding) {
        alert('불법 건축물입니다. 해당 건물은 법적, 제정적 위험이 따르기 때문에 계약하지 않는 것을 추천합니다.')
      } else {
        alert('주소가 일치하지 않습니다. 등기부등본의 주소와 일치시켜주세요.');
      }
    }
  }
};

const addReport = async () => {
  if (canAddReport.value) {
    console.log("리포트 생성 및 저장")
    isReportLoading.value = true;
    try {
        await reportStore.addReport({
        deposit: deposit.value,
        detailedAddress: detailedAddress.value,
        jbAddress: addressStore.selectedAddress.jibunAddr,
        legalCode: addressStore.selectedAddress.admCd, 
        registerDto: registerStore.registerData,
      });
    } catch (error) {
      console.error("리포트 저장 및 조회 실패", error);
    } finally {
      isFileLoading.value = false; // 로딩 완료
      console.log("리포트 완료 라우터 넘어갈거임")
      router.push('/report/result')
    }
  }
};
</script>

<style scoped>
.container {
  max-width: 1200px;
  margin: 0 auto;
}

input[type="file"] {
  cursor: pointer;
}
</style>
