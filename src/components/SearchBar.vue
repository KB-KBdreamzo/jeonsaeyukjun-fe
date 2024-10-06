<template>
  <div class="search-bar">
    <div class="search-icon" @click="toggleSidebar">
      <img src="../assets/searchIcon.svg" alt="돋보기" />
    </div>

    <input
        type="text"
        placeholder="장소, 버스, 지하철, 도로 검색"
        class="search-input"
        v-model="searchQuery"
        @keydown.enter="onSearch"
    />

    <div :class="['sidebar', isSidebarVisible ? 'open' : '']">
      <div class="sidebar-header">
        <button @click="closeSidebar">닫기</button>
      </div>
      <div class="sidebar-content">
        <input
            type="text"
            placeholder="장소, 버스, 지하철, 도로 검색"
            class="modal-search-input"
            v-model="searchQuery"
            @keydown.enter="onSearch"
        />
        <button @click="onSearch">검색</button>
      </div>
    </div>

    <div v-if="isSidebarVisible" class="overlay" @click="closeSidebar"></div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      searchQuery: "",
      isSidebarVisible: false,
    };
  },
  methods: {
    toggleSidebar() {
      this.isSidebarVisible = true;
    },
    closeSidebar() {
      this.isSidebarVisible = false;
    },
    onSearch() {
      if (this.searchQuery.trim() === "") {
        alert("검색어를 입력하세요.");
        return;
      }
      console.log("검색어:", this.searchQuery);

      this.$emit("search", this.searchQuery);
      this.closeSidebar();
    },
  },
};
</script>

<style scoped>
/* 지도 상단에 고정된 검색바 */
.search-bar {
  position: absolute;
  top: 20px;
  left: 20px;
  width: 400px;
  z-index: 1000;
  display: flex;
  align-items: center;
  background-color: white;
  padding: 10px;
  border-radius: 10px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
}

/* 돋보기 아이콘을 검색창 안 왼쪽으로 이동 */
.search-input {
  flex-grow: 1;
  padding: 8px 8px 8px 40px; /* 왼쪽에 아이콘 공간을 위한 패딩 */
  border: 1px solid #ccc;
  border-radius: 5px;
  outline: none;
  position: relative;
}

.search-icon {
  position: absolute;
  left: 10px; /* 검색창 내부 왼쪽에 배치 */
}

.search-icon img {
  width: 20px;
  height: 20px;
}

/* 사이드바 스타일 */
.sidebar {
  position: fixed;
  top: 0;
  left: -300px; /* 기본적으로 숨김 */
  width: 300px;
  height: 100vh;
  background-color: white;
  z-index: 2000;
  padding: 20px;
  box-shadow: 2px 0 5px rgba(0, 0, 0, 0.1);
  transition: left 0.3s ease; /* 왼쪽으로 이동 애니메이션 */
}

.sidebar.open {
  left: 0; /* 사이드바가 열릴 때 */
}

.sidebar-header {
  display: flex;
  justify-content: flex-end;
}

.sidebar-content {
  margin-top: 20px;
}

/* 모달창에서 검색어 입력창에 테두리 추가 */
.modal-search-input {
  width: 100%;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 10px;
  margin-bottom: 20px;
  font-size: 16px;
  outline: none;
}

/* 오버레이 */
.overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 1500;
}
</style>
