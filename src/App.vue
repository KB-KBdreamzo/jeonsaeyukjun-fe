<script setup>
import { RouterLink, RouterView } from "vue-router";
import IconSideBar from "./components/IconSideBar.vue";
import SearchBar from "./components/SearchBar.vue"; // 검색창 컴포넌트 추가
</script>

<template>
  <div id="app">
    <header
        class="flex justify-between items-center p-2 bg-white fixed top-0 w-full z-10 border-b"
    >
      <div class="flex items-center ml-20">
        <img
            src="@/assets/logo.png"
            alt="전세역전 로고"
            class="w-12 h-12 mr-2"
        />
        <span class="text-xl font-normal">전세역전</span>
      </div>
      <nav class="mr-20">
        <ul class="flex space-x-20">
          <li>
            <a href="#" class="text-black font-bold hover:text-gray-300 font-normal">리포트</a>
          </li>
          <li>
            <a href="#" class="text-black font-bold hover:text-gray-300 font-normal">지도</a>
          </li>
          <li>
            <a href="#" class="text-black font-bold hover:text-gray-300 font-normal">계약서</a>
          </li>
          <li>
            <a href="#" class="text-black font-bold hover:text-gray-300 font-normal">Login</a>
          </li>
        </ul>
      </nav>
    </header>

    <div class="main-content pt-16">
      <router-view />
    </div>
  </div>
</template>

<style>

html, body, #app {
  height: 100%;
  margin: 0;
  padding: 0;
}

#app {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.main-content {
  flex-grow: 1;
  padding-top: 65px;
}

#map-container {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
}

#map {
  width: 100%;
  height: 100%;
}

</style>
