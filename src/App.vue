<script setup>
import { RouterLink, RouterView } from "vue-router";
import IconSideBar from "./components/IconSideBar.vue";
</script>

<template>
  <div id="app">
    <!-- <div class="sidebar"> -->
    <!-- 사이드바 메뉴 -->
    <!-- <IconSideBar /> -->
    <!-- </div> -->

    <div class="main-content">
      <!-- 페이지 내용은 여기서 로드됨 -->
      <router-view />
    </div>
  </div>
</template>

<style></style>
