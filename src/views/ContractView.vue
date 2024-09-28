<template>
    <div id="app" class="flex justify-between">
      <!-- Left Side: User Input Form -->
      <div class="w-1/2 p-4 bg-gray-100">
        <h2 class="text-lg font-bold mb-4">사용자 입력</h2>

        <!-- 임대인 및 임차인 박스 -->
        <div class="border border-gray-300 bg-gray-200 p-4 mb-4">
            <div class="bg-white p-2 mb-4">
                <h3 class="text-lg font-bold">임대인 및 임차인</h3>
            </div>
            
            <!-- 집주인 박스 -->
            <div class="border border-gray-300 bg-white p-4 mb-4">
            <label class="block mb-2 font-semibold">임대인</label>
            <div class="flex flex-col md:flex-row items-center">
                <span class="mr-2">성명:</span>
                <input type="text" v-model="landlordName" @input="updateInput('landlord', $event)"
                placeholder="임대인 이름을 입력하세요" class="border border-gray-300 p-2 w-full md:w-auto bg-white" />
            </div>
            </div>
            
            <!-- 세입자 박스 -->
            <div class="border border-gray-300 bg-white p-4 mb-4">
            <label class="block mb-2 font-semibold">임차인</label>
            <div class="flex flex-col md:flex-row items-center">
                <span class="mr-2">성명:</span>
                <input type="text" v-model="tenantName" @input="updateInput('tenant', $event)"
                placeholder="임차인 이름을 입력하세요" class="border border-gray-300 p-2 w-full md:w-auto bg-white" />
            </div>
            </div>
        </div>
    </div>
  
      <!-- Right Side: Real-time Contract Display -->
      <div class="w-1/2 p-4 border border-gray-300">
        <h2 class="text-xl font-bold mb-4 text-center">주택임대차표준계약서(전세)</h2>
        <div v-if="landlordName || tenantName" class="text-center">
          <p>임대인({{ landlordName || "______" }})와(과) 임차인({{ tenantName || "______" }})은(는) 아래와 같이 임대차 계약을 체결한다.</p>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    data() {
      return {
        landlordName: '',
        tenantName: ''
      }
    },
    methods: {
      updateInput(type, event) {
        const input = event.target.value;
        // 첫 자모만 추출하여 업데이트
        if (type === 'landlord') {
          this.landlordName = input;
        } else if (type === 'tenant') {
          this.tenantName = input;
        }
      }
    }
  }
  </script>
  
  <style scoped>
  /* Tailwind CSS를 사용할 경우 추가 스타일은 필요하지 않습니다. */
  </style>
  