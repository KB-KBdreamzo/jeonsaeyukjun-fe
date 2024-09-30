<template>
  <div class="search-bar">
    <input
        v-model="searchQuery"
        @keydown.enter="onSearch"
        placeholder="검색어를 입력하세요"
        class="search-input"
    />
  </div>
</template>

<script>
export default {
  data() {
    return {
      searchQuery: "",
    };
  },
  methods: {
    onSearch() {
      // 검색 기능을 추가하려면 이 부분을 수정하세요.
      console.log("검색어:", this.searchQuery);
      this.$emit('search', this.searchQuery);  // 검색어를 부모 컴포넌트로 전달
    },
  },
};
</script>

<style scoped>
.search-bar {
  position: absolute;
  top: 20px;
  left: 40px;
  width: 80%;
  max-width: 200px;
  z-index: 1000;
}


</style>

