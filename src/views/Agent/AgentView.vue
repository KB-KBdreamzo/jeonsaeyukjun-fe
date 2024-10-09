<template>
    <div>
      <button @click="toggleModal">모달</button>
      <AgentBookModal v-if="showModal" @close="toggleModal" />
    </div>
  </template>
  
  <script>
  import AgentBookModal from '@/components/Agent/AgentBookModal.vue';
  
  export default {
    components: {
      AgentBookModal,
    },
    data() {
      return {
        showModal: false, 
      };
    },
    methods: {
      toggleModal() {
        this.showModal = !this.showModal; 
      },
    },
  };
  </script>
  
  <style scoped>
  /* 여기에 스타일을 추가하세요 */
  </style>
  