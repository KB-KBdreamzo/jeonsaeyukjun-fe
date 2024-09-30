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
    <RouterView />
  </div>
</template>
