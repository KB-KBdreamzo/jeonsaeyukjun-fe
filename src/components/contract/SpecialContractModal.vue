<template>
    <div class="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50" @click="closeModal">
      <div 
        class="fixed bottom-0 left-0 w-[360px] bg-blue-500 p-4 rounded-t-lg shadow-lg h-72 flex flex-col justify-start" 
        @click.stop
      >
        <button class="absolute top-2 right-2 text-white text-2xl" @click="closeModal">&times;</button>
        <h2 v-if="title" class="text-white text-lg font-bold">{{ title }}</h2>
  
        <div class="mt-4 text-white overflow-y-auto h-full">
          <div class="text-lg font-bold"># 특약이란</div>
          <p class="mt-2">
            특약이란 말 그대로 '특별한 약정'을 말합니다. 매매 계약이나 임대차
            계약 시 주된 계약 조건에서 다루지 않았던 세부적인 내용을 보완하기
            위해 추가로 기재하는 약정이라고 이해하시면 됩니다.
          </p>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { defineProps, defineEmits } from "vue";
  
  const props = defineProps({
    title: String,
  });
  
  const emit = defineEmits(["close"]);
  
  function closeModal() {
    emit("close");
  }
  </script>
  
  