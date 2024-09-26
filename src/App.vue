<script setup>
import { RouterLink, RouterView } from 'vue-router';
import IconSideBar from './components/IconSideBar.vue';

</script>

<template>
  <div id="app">
    <div class="sidebar">
      <!-- 사이드바 메뉴 -->
      <IconSideBar />
    </div>

    <div class="main-content">
      <!-- 페이지 내용은 여기서 로드됨 -->
      전체 내용      
      <router-view />
    </div>
  </div>
</template>

<style>
#app {
  display: flex;
  height: 100vh;
  font-family: 'Arial', sans-serif;
  margin-left: 5rem; 
}

.sidebar {
  width: 2rem;
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
  flex-grow: 1;
  padding: 20px;
  background-color: #fff;
  overflow-y: auto;
  margin-left: 5rem; 
}

</style>
