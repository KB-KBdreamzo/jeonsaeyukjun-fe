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

    <div v-if="isExpanded" class="overlay" @click="collapseSearch"></div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      searchQuery: "",
      isExpanded: false,
      searchHistory: [],
    };
  },
  mounted() {
    this.loadSearchHistory();
  },
  methods: {
    expandSearch() {
      this.isExpanded = true;
    },
    collapseSearch() {
      this.isExpanded = false;
    },
    onSearch() {
      if (this.searchQuery.trim() === "") {
        alert("검색어를 입력하세요.");
        return;
      }
      this.saveSearchQuery(this.searchQuery);
      this.$emit("search", this.searchQuery);
      this.collapseSearch();
    },
    selectHistory(history) {
      this.searchQuery = history;
      this.$emit("search", history);
      this.collapseSearch();
    },
    saveSearchQuery(query) {
      let history = JSON.parse(localStorage.getItem("searchHistory")) || [];

      if (!history.includes(query)) {
        history.unshift(query);
        if (history.length > 5) {
          history.pop();
        }
        localStorage.setItem("searchHistory", JSON.stringify(history));
        this.searchHistory = history;
      }
    },
    loadSearchHistory() {
      const history = JSON.parse(localStorage.getItem("searchHistory"));
      if (history) {
        this.searchHistory = history;
      }
    },
    deleteHistory(index) {
      this.searchHistory.splice(index, 1);
      localStorage.setItem("searchHistory", JSON.stringify(this.searchHistory));
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
  transition: height 0.3s ease;
}

.search-bar.expanded {
  height: 62px;
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

.search-history {
  position: absolute;
  top: 70px;
  left: 20px;
  width: 400px;
  max-height: 200px;
  background-color: white;
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


.delete-icon {
  color: black;
  cursor: pointer;
  font-size: 18px;
  padding-left: 10px;
}

.delete-icon:hover {
  color: darkred;
}

.overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  z-index: 999;
}

.fade-enter-active, .fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter, .fade-leave-to {
  opacity: 0;
}
</style>
