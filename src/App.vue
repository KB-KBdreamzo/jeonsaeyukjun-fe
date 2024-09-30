<template>
    <div class="sidebar">
      <!-- 사이드바 메뉴 -->
      <IconSideBar />
    </div>

    <div class="main-content">
      <!-- 페이지 내용은 여기서 로드됨 -->
      <RouterView />
    </div>
</template>

<script setup>
import { RouterLink, RouterView } from 'vue-router';
import IconSideBar from './components/IconSideBar.vue';
import SearchBar from './components/SearchBar.vue';  // 검색창 컴포넌트 추가
</script>

<style>
.sidebar {
  width: 3rem;
  position: fixed;
  top: 0;
  left: 0;
  height: 100vh;
  background-color: #f0f0f0;
  z-index: 1000;
}

.main-content {
  margin-left: 3rem;
  width: calc(100vw - 3rem);
  height: 100vh;
  padding: 0;
  position: relative;
  background-color: #fff;
}

.search-bar {
  position: absolute;
  top: 20px;
  left: 3.5rem; /* 검색창을 사이드바에서 3.5rem 떨어지도록 설정 */
  z-index: 1001;
  background-color: white;
  padding: 10px;
  border-radius: 5px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

#map {
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
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
