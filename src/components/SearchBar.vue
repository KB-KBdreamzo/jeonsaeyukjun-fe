<template>
  <div class="search-bar-container" @click.stop>
    <div class="search-bar" :class="{ expanded: isExpanded }" @click="expandSearch">
      <div class="search-icon">
        <img src="../assets/searchIcon.svg" alt="돋보기"/>
      </div>

      <input
          type="text"
          placeholder="장소, 버스, 지하철, 도로 검색"
          class="search-input"
          v-model="searchQuery"
          @keydown.enter="onSearch"
          @blur="collapseSearch"
      />
    </div>

    <transition name="fade">
      <div v-if="isExpanded" class="search-history">
        <ul>
          <li
              v-for="(history, index) in searchHistory"
              :key="index"
              class="history-item"
          >
            <span @mousedown="selectHistory(history)">{{ history }}</span>
            <span class="delete-icon" @mousedown.stop="deleteHistory(index)">×</span>
          </li>
        </ul>
      </div>
    </transition>

    <!-- 오버레이 -->
    <div v-if="isExpanded" class="overlay" @click="collapseSearch"></div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      searchQuery: "",
      isExpanded: false, // 검색창 확장 여부
      searchHistory: [], // 이전 검색 기록
    };
  },
  mounted() {
    // 페이지 로드 시 로컬 스토리지에서 검색 기록 불러오기
    this.loadSearchHistory();
  },
  methods: {
    expandSearch() {
      this.isExpanded = true; // 검색창 확장
    },
    collapseSearch() {
      this.isExpanded = false; // 검색창 축소
    },
    onSearch() {
      if (this.searchQuery.trim() === "") {
        alert("검색어를 입력하세요.");
        return;
      }
      this.saveSearchQuery(this.searchQuery); // 검색어 저장
      this.$emit("search", this.searchQuery);
      this.collapseSearch();
    },
    selectHistory(history) {
      this.searchQuery = history;
      this.collapseSearch(); // 검색 기록 선택 후 축소
    },
    saveSearchQuery(query) {
      let history = JSON.parse(localStorage.getItem("searchHistory")) || [];

      // 중복된 검색어가 없을 경우에만 추가
      if (!history.includes(query)) {
        history.unshift(query); // 새 검색어를 배열 앞에 추가
        if (history.length > 5) {
          history.pop(); // 기록이 5개 이상이면 마지막 검색어 제거
        }
        localStorage.setItem("searchHistory", JSON.stringify(history));
        this.searchHistory = history; // 검색 기록 업데이트
      }
    },
    loadSearchHistory() {
      const history = JSON.parse(localStorage.getItem("searchHistory"));
      if (history) {
        this.searchHistory = history; // 로컬 스토리지에서 검색 기록 불러오기
      }
    },
    deleteHistory(index) {
      this.searchHistory.splice(index, 1); // 검색 기록 배열에서 해당 항목 삭제
      localStorage.setItem("searchHistory", JSON.stringify(this.searchHistory)); // 로컬 스토리지 업데이트
    },
  },
};
</script>

<style scoped>
.search-bar-container {
  position: relative;
  z-index: 1000;
}

.search-bar {
  position: absolute;
  top: 30px;
  left: 20px;
  width: 400px;
  z-index: 1001;
  display: flex;
  align-items: center;
  background-color: white;
  padding: 10px;
  border-radius: 10px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
  transition: height 0.3s ease; /* 높이 변화 애니메이션 */
}

.search-bar.expanded {
  height: 62px; /* 확장된 높이 설정 */
}

.search-input {
  flex-grow: 1;
  padding: 8px 8px 8px 40px;
  border: 1px solid #ccc;
  border-radius: 5px;
  outline: none;
  position: relative;
}

.search-icon {
  position: absolute;
  left: 10px;
  top: 50%;
  transform: translateY(-50%);
  z-index: 1001;
}

.search-icon img {
  width: 30px;
  height: 30px;
  display: block;
}

/* 검색 기록 리스트 */
.search-history {
  position: absolute;
  top: 70px; /* 검색창 아래에 위치 */
  left: 20px;
  width: 400px;
  max-height: 200px; /* 최대 높이 */
  background-color: white;
  //box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
  border-radius: 0 0 10px 10px;
  overflow-y: auto;
  z-index: 1000;
  padding: 10px;
}

.search-history ul {
  list-style: none;
  margin: 0;
  padding: 0;
}

.history-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 0;
  cursor: pointer;
}

.history-item:hover {
  background-color: #f5f5f5;
}

/* 삭제 아이콘 */
.delete-icon {
  color: black;
  cursor: pointer;
  font-size: 18px;
  padding-left: 10px;
}

.delete-icon:hover {
  color: darkred;
}

/* 오버레이 */
.overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  z-index: 999;
}

/* 애니메이션 */
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter, .fade-leave-to {
  opacity: 0;
}
</style>
