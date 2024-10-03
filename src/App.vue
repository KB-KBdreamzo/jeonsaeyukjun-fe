<template>
  <div id="app">
    <!-- 헤더 영역 -->
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

    <!-- 메인 콘텐츠 -->
    <div class="main-content pt-16">
      <!-- 페이지 내용은 여기서 로드됨 -->
      <router-view />
    </div>
  </div>
</template>

<style>
.main-content {
  padding-top: 65px;
  overflow: hidden
}
</style>
