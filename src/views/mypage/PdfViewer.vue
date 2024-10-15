<template>
    <div class="pdf-viewer-container">
      <iframe :src="pdfUrl" width="100%" height="100%" frameborder="0"></iframe>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue';
  import axios from 'axios';
  import { useRoute } from 'vue-router';
  
  const route = useRoute();
  const contractName = route.params.contractName; 
  
  const pdfUrl = ref('');
  
  onMounted(async () => {
    try {
      const response = await axios.get(`http://localhost:8080/api/contract/presigned-url/${contractName}`);
      pdfUrl.value = response.data; 
    } catch (error) {
      console.error('Error fetching presigned URL:', error);
    }
  });
  </script>
  
  <style scoped>
  .pdf-viewer-container {
    width: 100%;
    height: 100vh; 
  }
  </style>
  