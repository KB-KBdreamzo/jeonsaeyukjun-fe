<template>
    <div class="flex gap-2.5 items-center mt-2.5 w-full">
      <div class="flex overflow-hidden flex-1 shrink gap-2.5 items-start self-stretch px-4 py-3.5 my-auto text-sm font-semibold tracking-widest leading-6 bg-white rounded-xl basis-0 min-h-[50px] min-w-[240px] text-slate-500">
        <img
          loading="lazy"
          src="https://cdn.builder.io/api/v1/image/assets/TEMP/5ea77e64a8522d4457affed6b38f4bb1743d6a50058125a03dafcbbec2465b62?apiKey=d111ac40a5bb4ce79c76d09fec0749df&"
          alt="달력 아이콘"
          class="object-contain shrink-0 w-5 aspect-square cursor-pointer"
          @click="triggerDateInput"
        />
        <input 
          type="date"
          class="flex-1 shrink basis-0 appearance-none focus:outline-none bg-transparent" 
          v-model="selectedDate"
		  ref="dateInput"
          @input="updateDate"
        />

      </div>
      <label class="self-stretch my-auto text-base font-bold leading-none text-gray-400 uppercase">
        {{ label }}
      </label>
    </div>
</template>
  
<script lang="ts">
import { defineComponent, ref } from 'vue';
  
export default defineComponent({
    name: 'DateInput',
    props: {
      label: {
        type: String,
        required: true,
      },
      date: {
        type: String,
        required: true,
      },
    },
    setup(props, { emit }) {
      // 로컬 상태로 선택된 날짜를 관리
      const selectedDate = ref(props.date);
      const dateInput = ref<HTMLInputElement | null>(null); // 날짜 입력 필드 참조

      // 날짜가 변경되면 부모 컴포넌트로 이벤트를 발송하여 업데이트
      const updateDate = () => {
        emit('update:date', selectedDate.value);
      };

      // 이미지를 클릭하면 날짜 입력 필드에 포커스
      const triggerDateInput = () => {
		if (dateInput.value) {
			dateInput.value.showPicker(); // input[type="date"]에 showPicker()를 사용하여 달력을 트리거
		}
      };

      return {
        selectedDate,
        triggerDateInput,
        dateInput,
        updateDate,
      };
    },
});
</script>
<style scoped>
/* 기본 달력 아이콘 숨기기 */
input[type="date"]::-webkit-calendar-picker-indicator {
    display: none; /* Chrome, Safari */
}
input[type="date"]::-ms-clear {
    display: none; /* Internet Explorer */
}
</style>