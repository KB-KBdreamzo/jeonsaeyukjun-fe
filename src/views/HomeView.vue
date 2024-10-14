<template>
  <div id="app" class="flex flex-col h-screen">
    <main>
      <!-- 첫 번째 전체 화면 섹션 -->
      <div
        class="h-screen flex justify-center items-center bg-cover bg-bottom"
        style="
          background-image: url('/src/assets/landscape.png');
          background-position: center 30%;
        "
      >
        <div class="text-center bg-opacity-60 p-10 rounded-lg">
          <h1
            data-aos="fade-up"
            class="text-5xl font-bold leading-snug text-black"
          >
            전세사기의 모든것<br />전세역전에서 쉽고 간편하게
          </h1>
        </div>
      </div>
      <!-- 다섯 개의 동일한 섹션 -->
      <div
        style="height: 1000px"
        class="h-screen flex justify-center items-center bg-white relative"
      >
        <div class="absolute" style="top: 50px; left: 150px">
          <div data-aos="fade-right" class="bg-opacity-60 p-10 rounded-lg">
            <h1 class="text-3xl text-blue-500">리포트</h1>
            <p class="text-5xl font-semibold text-black mt-10">내 집 관리,</p>
            <p class="text-5xl font-semibold text-black mt-4">
              안전진단부터 전세진단까지
            </p>
            <p class="text-5xl font-semibold text-black mt-4">확실하게</p>
          </div>
        </div>
        <img
          data-aos="fade-up"
          class="absolute"
          style="width: 800px; left: 460px; top: 330px"
          src="/src/assets/report_img.svg"
        />
      </div>
      <div
        style="height: 840px"
        class="h-screen flex justify-center items-center bg-white relative"
      >
        <div class="absolute" style="top: 50px; left: 150px">
          <div data-aos="fade-right" class="bg-opacity-60 p-10 rounded-lg">
            <h1 class="text-3xl text-blue-500">계약서</h1>
            <p class="text-5xl font-semibold text-black mt-10">
              간편하고 안전하게
            </p>
            <p class="text-5xl font-semibold text-black mt-4">
              내게 딱 맞는 계약서,
            </p>
            <p class="text-5xl font-semibold text-black mt-4">
              이런 계약서 써보셨나요?
            </p>
          </div>
        </div>
        <img
          data-aos="fade-up"
          class="absolute shadow-lg"
          style="width: 800px; left: 460px; top: 370px"
          src="/src/assets/contract_img.svg"
        />
      </div>
      <div class="h-screen flex justify-center items-center bg-white relative">
        <div class="absolute" style="top: 50px; left: 150px">
          <div data-aos="fade-right" class="bg-opacity-60 p-10 rounded-lg">
            <h1 class="text-3xl text-blue-500">공인중개사</h1>
            <p class="text-5xl font-semibold text-black mt-10">
              공인중개사 맞춤 매칭
            </p>
            <p class="text-5xl font-semibold text-black mt-4">
              받으시겠습니까?
            </p>
          </div>
        </div>
      </div>
      <!-- 부가 정보 4 섹션 -->
      <div
        class="h-screen flex flex-col justify-center items-center bg-gray-800 relative"
      >
        <div
          class="absolute text-center"
          style="top: 90px; left: 50%; transform: translateX(-50%)"
        >
          <div data-aos="flip-down" class="bg-opacity-60 p-10 rounded-lg">
            <h1 class="text-5xl font-semibold text-white">
              전세사기 예방은 전세역전과 함께
            </h1>
            <p class="text-2xl text-[#B0B8C1] mt-16">
              불안한 전세계약 많이 힘드셨죠?
            </p>
            <p class="text-2xl text-[#B0B8C1] mt-4">
              리포트를 통한 안전진단에서 계약서 작성까지
            </p>
            <p class="text-2xl text-[#B0B8C1] mt-4">
              이제 전세역전과 함께 만들어봐요
            </p>
          </div>
        </div>
        <button
          data-aos="flip-down"
          class="w-[240px] h-[60px] bg-[#3182F6] text-white text-xl font-semibold rounded-[10px] transition duration-300 hover:bg-[#2674C9] mt-80"
          @click="openModal"
        >
          리포트 만들기
        </button>
        <p
          data-aos="flip-down"
          class="text-xl text-[#B0B8C1] mt-4 hover:text-[#2674C9] transition duration-300 cursor-pointer"
          @click="openMapView"
        >
          아니요. 좀 더 알아볼래요!
        </p>
      </div>
    </main>
  </div>
</template>
<script setup>
import { inject } from "vue";
import { useRouter } from "vue-router";
const router = useRouter();
const openModal = inject("openModal");
const openMapView = () => {
  router.push("/map");
};
</script>
<style scoped>
/* Tailwind CSS가 필요 없는 경우, 여기에 추가 스타일을 작성하세요. */
</style>
