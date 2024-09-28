<template>
    <div class="p-4 border border-gray-300">
      <h2 class="text-xl font-bold mb-4 text-center">주택임대차표준계약서(전세)</h2>
      <div v-if="landlordName || tenantName" class="text-center">
        <p>임대인({{ landlordName || "______" }})와(과) 임차인({{ tenantName || "______" }})은(는) 아래와 같이 임대차 계약을 체결한다.</p>
      </div>
      <div v-if="propertyAddress || landUsage || landArea || buildingStructure || buildingArea || rentalPortion || rentalArea" class="mt-4">
            <h3 class="text-lg font-semibold">부동산 정보</h3>
            <p>소재지: {{ propertyAddress || "______" }}</p>
            <p>토지 - 지목: {{ landUsage || "______" }}, 면적: {{ landArea || "______" }}</p>
            <p>건물 - 구조/용도: {{ buildingStructure || "______" }}, 면적: {{ buildingArea || "______" }}</p>
            <p>임차할 부분: {{ rentalPortion || "______" }}, 면적: {{ rentalArea || "______" }}</p>
        </div>
    </div>
  </template>
  
  <script>
  export default {
    props: {
        landlordName: {
            type: String,
            default: ''
        },
        tenantName: {
            type: String,
            default: ''
        },
        propertyAddress: {
            type: String,
            default: ''
        },
        landUsage: {
            type: String,
            default: ''
        },
        landArea: {
            type: String,
            default: ''
        },
        buildingStructure: {
            type: String,
            default: ''
        },
        buildingArea: {
            type: String,
            default: ''
        },
        rentalPortion: {
            type: String,
            default: ''
        },
        rentalArea: {
            type: String,
            default: ''
        }
    }
  }
  </script>
  