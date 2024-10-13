<template>
  <div class="flex flex-col h-screen">
    <header class="top-0 h-16 w-full flex justify-between items-center p-2 bg-white fixed z-10 border-b">
      <div class="flex items-center ml-20 cursor-pointer" @click="goToHome">
        <img src="@/assets/logo.png" alt="전세역전 로고" class="w-12 h-12 mr-2" />
        <span class="text-xl font-custom">전세역전</span>
      </div>
      <nav class="mr-20">
        <ul class="flex space-x-20">
          <li>
            <router-link to="/report/input" class="text-black font-normal hover:bg-gray-200 px-4 py-2 rounded transition duration-300">리포트</router-link>
          </li>
          <li>
            <router-link to="/map" class="text-black font-normal hover:bg-gray-200 px-4 py-2 rounded transition duration-300">지도</router-link>
          </li>
          <li>
            <router-link to="/contract" class="text-black font-normal hover:bg-gray-200 px-4 py-2 rounded transition duration-300">계약서</router-link>
          </li>
          <li>
            <router-link to="/agent" class="text-black font-normal hover:bg-gray-200 px-4 py-2 rounded transition duration-300">공인중개사</router-link>
          </li>
          <li>
            <a
              v-if="!userStore.isLogin"
              href="#"
              class="text-black font-normal hover:bg-gray-200 px-4 py-2 rounded transition duration-300"
              @click.prevent="openModal">Login</a
            >
            <router-link
              v-else
              to="/mypage"
              class="text-black font-normal hover:bg-gray-200 px-4 py-2 rounded transition duration-300">Mypage</router-link
            >
          </li>
        </ul>
      </nav>
    </header>
    <div class="flex-1 mt-16 overflow-auto">
      <router-view />
    </div>
    <LoginModal
      :isOpen="isModalOpen"
      @close="closeModal"
      @kakao-login="openTermsOfUseModal"
    />
    <TermsOfUseModal
      :isOpen="isTermsOfUseModalOpen"
      @close="closeTermsOfUseModal"
    />
  </div>
</template>

<script setup>
import { ref, watch } from "vue";
import { useUserStore } from "@/stores/userStore";
import LoginModal from "./components/LoginModal.vue";
import TermsOfUseModal from "./components/TermsOfUseModal.vue";
import router from "./router";
const userStore = useUserStore();
const isModalOpen = ref(false);
const isTermsOfUseModalOpen = ref(false);
const openModal = () => {
  isModalOpen.value = true;
};
const closeModal = () => {
  isModalOpen.value = false;
};
const openTermsOfUseModal = () => {
  isTermsOfUseModalOpen.value = true;
};
const closeTermsOfUseModal = () => {
  isTermsOfUseModalOpen.value = false;
};
const goToHome = () => {
  router.push("/");
};
watch([isModalOpen, isTermsOfUseModalOpen], ([loginOpen, policyOpen]) => {
  if (loginOpen || policyOpen) {
    document.body.style.overflow = "hidden";
  } else {
    document.body.style.overflow = "";
  }
});
</script>
<style scoped>
@font-face {
  font-family: "WavvePADO-Regular";
  src: url("https://fastly.jsdelivr.net/gh/projectnoonnu/2404@1.0/WavvePADO-Regular.woff2")
    format("woff2");
  font-weight: normal;
  font-style: normal;
}
body {
  margin: 0;
  padding: 0;
}
body.modal-open {
  overflow: hidden;
}

/* #app {
  height: 100vh; 
} */
</style>