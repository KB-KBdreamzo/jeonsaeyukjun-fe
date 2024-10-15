<template>
  <!-- <Teleport to="body"> -->
    <div class="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50" @click="closeModal">
      <div class="fixed left-0 bottom-0 w-[360px] bg-blue-500 p-4 rounded-t-lg shadow-lg h-60 flex flex-col justify-start" @click.stop>
        <button class="absolute top-2 right-2 text-white text-2xl" @click="closeModal">&times;</button>
        <h2 v-if="title" class="text-white text-lg font-bold">{{ title }}</h2>

        <!-- 작성가이드 제목과 내용 추가 -->
        <div class="mt-4 text-white overflow-y-auto h-full">
          <div class="text-lg font-bold"># 임차주택의 표시란</div>
          <p class="mt-2">
            이 부분에서는 임대하는 주택에 대한 구체적인 정보를 제공하여 계약의
            명확성을 높이고, 나중에 발생할 수 있는 분쟁을 예방하는 데
            기여합니다.
          </p>
          <hr class="my-4 border-white" />
        </div>
      </div>
    </div>
  <!-- </Teleport> -->
</template>

<script setup>
import { defineProps, defineEmits } from "vue";

const props = defineProps({
  title: String,
});

const emit = defineEmits(['close']); // 'close' 이벤트 정의

const closeModal = () => {
  emit('close'); // 부모 컴포넌트에 'close' 이벤트 발생
};
</script>
