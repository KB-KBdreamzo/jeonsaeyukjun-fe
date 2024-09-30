<template>
    <aside class="w-20 h-screen bg-gray-100 flex flex-col items-center p-4 shadow-lg">
      <!-- 로고 영역 -->
      <div class="mb-8">
        <img src="/src/assets/logo.png" alt="Logo" class="w-12 h-12" />
      </div>
  
      <!-- 네비게이션 아이콘들 -->
      <nav class="flex flex-col space-y-6">
        <router-link to="/" class="flex items-center justify-center w-12 h-12 text-gray-600 hover:text-gray-900">
          <i class="fa-solid fa-map text-2xl"></i> <!-- 지도 -->
        </router-link>
        <router-link to="/report" class="flex items-center justify-center w-12 h-12 text-gray-600 hover:text-gray-900">
          <!-- SVG 아이콘 삽입 -->
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" class="w-6 h-6" fill="currentColor">
            <path d="M32 32c17.7 0 32 14.3 32 32l0 336c0 8.8 7.2 16 16 16l400 0c17.7 0 32 14.3 32 32s-14.3 32-32 32L80 480c-44.2 0-80-35.8-80-80L0 64C0 46.3 14.3 32 32 32zM160 224c17.7 0 32 14.3 32 32l0 64c0 17.7-14.3 32-32 32s-32-14.3-32-32l0-64c0-17.7 14.3-32 32-32zm128-64l0 160c0 17.7-14.3 32-32 32s-32-14.3-32-32l0-160c0-17.7 14.3-32 32-32s32 14.3 32 32zm64 32c17.7 0 32 14.3 32 32l0 96c0 17.7-14.3 32-32 32s-32-14.3-32-32l0-96c0-17.7 14.3-32 32-32zM480 96l0 224c0 17.7-14.3 32-32 32s-32-14.3-32-32l0-224c0-17.7 14.3-32 32-32s32 14.3 32 32z"/>
          </svg>
        </router-link>
        <router-link to="/contract" class="flex items-center justify-center w-12 h-12 text-gray-600 hover:text-gray-900">
          <i class="fa-regular fa-file-lines text-2xl"></i> <!-- 계약서 -->
        </router-link>
        <router-link to="/profile" class="flex items-center justify-center w-12 h-12 text-gray-600 hover:text-gray-900">
          <i class="fa fa-user text-2xl"></i> <!-- 프로필 -->
        </router-link>
      </nav>
  
      
    </aside>
  </template>
  
  <script>
  export default {
    name: 'Sidebar',
  };
  </script>
  
<style scoped>
</style>
  