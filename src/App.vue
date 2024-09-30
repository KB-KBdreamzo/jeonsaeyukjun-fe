<script setup>
import { RouterLink, RouterView } from "vue-router";
import IconSideBar from "./components/IconSideBar.vue";
</script>

<template>
  <div id="app">
    <div class="sidebar">
      <!-- 사이드바 메뉴 -->
      <IconSideBar />
    </div>

    <div class="main-content">
      <!-- 페이지 내용은 여기서 로드됨 -->
      <router-view />
    </div>
  </div>
</template>

<style>
#app {
  display: flex;
  justify-content: center; /* 수평 가운데 정렬 */
  align-items: center; /* 수직 가운데 정렬 */
  height: 100vh;
  font-family: "Arial", sans-serif;
  /* margin-left: 2rem; */
}

.sidebar {
  width: 4rem; /*기본설정 2rem */
  position: fixed;
  top: 0;
  left: 0;
  height: 100vh;
}

.sidebar .logo {
  display: block;
  margin-bottom: 20px;
}

.sidebar ul {
  list-style: none;
  padding: 0;
}

.sidebar ul li {
  margin: 10px 0;
}

.sidebar ul li a {
  text-decoration: none;
  color: #333;
}

.main-content {
  width: 800px; /* 중앙 콘텐츠의 너비 조절 */
  max-width: 1200px; /* 최대 너비 설정 */
  flex-grow: 1;
  padding: 20px;
  background-color: #fff;
  overflow-y: auto;
  /* margin-left: 5rem; */
}
</style>
