<template>
    <div class="pdf-viewer-container">
      <iframe :src="pdfUrl" width="100%" height="100%" frameborder="0"></iframe>
    </div>
  </template>
  
  <script>
  import axios from 'axios';
  
  export default {
    props: ['contractName'], 
    data() {
      return {
        pdfUrl: ''
      };
    },
    async mounted() {
      try {
        const response = await axios.get(`http://localhost:8080/api/contract/presigned-url/${this.contractName}`);
        this.pdfUrl = response.data;
      } catch (error) {
        console.error('Error fetching presigned URL:', error);
      }
    }
  };
  </script>
  
  <style scoped>
  .pdf-viewer-container {
    width: 100%;
    height: 100vh; 
  }
  </style>
  