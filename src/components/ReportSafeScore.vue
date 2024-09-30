<template>
  <!-- 상단 주소 표시 영역 -->
  <div class="text-center mx-auto p-5">
    <h1 class="text-2xl font-bold">
      {{ reportStore.address }}의 보증금 리포트
    </h1>
  </div>

  <div class="bg-gray-100 p-5 rounded-lg mx-auto">
    <!-- 상단 메시지 영역 -->
    <div
      class="relative text-center bg-white p-4 rounded-lg my-6 transition-all duration-300 ease-in-out mx-auto"
      :class="expanded ? 'h-auto' : 'h-32 overflow-hidden'"
    >
      <!-- 중앙 정렬을 위한 flex 설정 -->
      <div class="flex justify-center items-center h-full">
        <div class="text-lg">
          해당 집의 종합 보증금 안전 진단 결과
          {{ reportStore.safetyStatus }}입니다.
          <br />
          예측 손실액은
          {{ reportStore.estimatedLoss }}원이며, 위험 진단 요소는
          {{ reportStore.riskFactor }}건입니다.
        </div>
      </div>

      <!-- 추가 내용 영역 (토글 활성화 시 표시) -->
      <div v-if="expanded" class="mt-4 text-sm text-gray-700">
        해당 집의 보증금 안전 점수는 {{ reportStore.safeScore }}점입니다.
        <br />
        안전 점수는 ~~~~를 기반으로 산출되었습니다.
        <br />
        위험 진단 요소로는 선순위 채권, 예상 경매 낙찰가, 경매 건수 등이
        포함됩니다.
        <br />
        리포트의 자세한 정보를 보려면 아래 상세 보고서를 참고하세요.
      </div>

      <!-- 토글 버튼 (오른쪽 상단에 삼각형 아이콘으로 변경) -->
      <button
        class="absolute top-3 right-3 text-xl text-gray-300 hover:text-gray-400 transition-transform transform focus:outline-none"
        @click="toggleExpand"
        :style="{ transform: expanded ? 'rotate(180deg)' : 'rotate(0deg)' }"
      >
        ▼
      </button>
    </div>

    <!-- 메인 리포트 영역 -->
    <div class="flex justify-between items-center rounded-lg p-10">
      <!-- 왼쪽 안전 점수 영역 -->
      <div class="flex flex-col items-center justify-center w-1/2">
        <!-- 안전 상태 표시 원형 -->
        <div
          class="relative flex items-center justify-center w-40 h-40 rounded-full border-8"
          :class="{
            'border-custom-yellow':
              reportStore.safetyStatus === '위험' ||
              reportStore.safetyStatus === '주의' ||
              reportStore.safetyStatus === '보통' ||
              reportStore.safetyStatus === '양호' ||
              reportStore.safetyStatus === '안전',
          }"
        >
          <span
            class="text-4xl font-bold"
            :class="{
              'text-custom-yellow':
                reportStore.safetyStatus === '위험' ||
                reportStore.safetyStatus === '주의' ||
                reportStore.safetyStatus === '보통' ||
                reportStore.safetyStatus === '양호' ||
                reportStore.safetyStatus === '안전',
            }"
          >
            {{ reportStore.safetyStatus }}
          </span>
        </div>

        <div class="relative w-full mt-10 px-8">
          <!-- 배경 바 -->
          <div
            class="absolute left-0 transform -translate-y-1/2 w-full h-3 bg-light-yellow rounded-full"
          ></div>

          <!-- 상태 점 영역 -->
          <div class="flex justify-between items-center relative w-full">
            <div class="flex flex-col items-center z-10">
              <div
                :class="[
                  'w-3 h-3 rounded-full relative -mt-1.5',
                  reportStore.safetyStatus === '위험'
                    ? 'bg-custom-yellow border-custom-yellow'
                    : 'bg-white border-yellow-500',
                ]"
              ></div>
              <span class="text-sm mt-2">위험</span>
            </div>
            <div class="flex flex-col items-center z-10">
              <div
                :class="[
                  'w-3 h-3 rounded-full relative -mt-1.5',
                  reportStore.safetyStatus === '주의'
                    ? 'bg-yellow-500 border-yellow-500'
                    : 'bg-white border-yellow-500',
                ]"
              ></div>
              <span class="text-sm mt-2">주의</span>
            </div>
            <div class="flex flex-col items-center z-10">
              <div
                :class="[
                  'w-3 h-3 rounded-full relative -mt-1.5',
                  reportStore.safetyStatus === '보통'
                    ? 'bg-custom-yellow border-custom-yellow'
                    : 'bg-white border-yellow-500',
                ]"
              ></div>
              <span class="text-sm mt-2">보통</span>
            </div>
            <div class="flex flex-col items-center z-10">
              <div
                :class="[
                  'w-3 h-3 rounded-full relative -mt-1.5',
                  reportStore.safetyStatus === '양호'
                    ? 'bg-green-500 border-green-500'
                    : 'bg-white border-green-500',
                ]"
              ></div>
              <span class="text-sm mt-2">양호</span>
            </div>
            <div class="flex flex-col items-center z-10">
              <div
                :class="[
                  'w-3 h-3 rounded-full relative -mt-1.5',
                  reportStore.safetyStatus === '안전'
                    ? 'bg-green-500 border-green-500'
                    : 'bg-white border-green-500',
                ]"
              ></div>
              <span class="text-sm mt-2">안전</span>
            </div>
          </div>
        </div>
      </div>

      <!-- 오른쪽 막대 그래프 영역 -->
      <div class="flex flex-col items-center w-1/2">
        <div class="flex items-end justify-center h-40">
          <div class="flex flex-col items-center mx-4">
            <div class="w-5 bg-custom-yellow" :style="{ height: '70px' }"></div>
            <span class="text-sm mt-2">우리집</span>
          </div>
          <div class="flex flex-col items-center mx-4">
            <div class="w-5 bg-gray-300" :style="{ height: '60px' }"></div>
            <span class="text-sm mt-2">국내평균</span>
          </div>
          <div class="flex flex-col items-center mx-4">
            <div class="w-5 bg-gray-300" :style="{ height: '80px' }"></div>
            <span class="text-sm mt-2">강서구</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from "vue"; // 여기서 computed를 추가해야 함
import { useReportStore } from "../stores/reportStore";

export default {
  setup() {
    const reportStore = useReportStore();
    const expanded = ref(false);

    const toggleExpand = () => {
      expanded.value = !expanded.value;
    };

    return {
      reportStore,
      expanded,
      toggleExpand,
    };
  },
};
</script>
