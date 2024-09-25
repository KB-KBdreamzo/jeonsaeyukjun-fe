import { defineStore } from 'pinia';
import axios from 'axios';

export const useRegisterStore = defineStore('registerStore', {
  state: () => ({
    registerData: [], 
    error: null,        
  }),
  actions: {
    async fetchRegister(file) {
      const formData = new FormData();
      formData.append('file', file);

      try {
        const response = await axios.post(
          'http://localhost:8088/api/report/upload-pdf',
          formData,
          { headers: { 'Content-Type': 'multipart/form-data' } }
        );
        this.registerData = response.data; 
      } catch (error) {
        console.error('Error fetching register data:', error);
        this.error = '파일 처리 중 오류가 발생했습니다.';
      }
    },
  },
});
