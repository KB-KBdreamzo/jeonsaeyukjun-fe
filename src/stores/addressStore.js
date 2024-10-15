import { defineStore } from 'pinia';
import axios from 'axios';

const ADDRESS_API_KEY = import.meta.env.VITE_ADDRESS_API_KEY;


export const useAddressStore = defineStore('address', {
  state: () => ({
    addressResults: [],  
    selectedAddress: '', 
  }),
  actions: {
    async fetchAddress(query) {
      if (query.trim() === '') {
        this.addressResults = [];
        return;
      }
      const apiKey = ADDRESS_API_KEY; 
      const apiUrl = `https://business.juso.go.kr/addrlink/addrLinkApi.do?confmKey=${apiKey}&currentPage=1&countPerPage=10&keyword=${query}&resultType=json`;
      try {
        const response = await axios.get(apiUrl, {  withCredentials: false });
        if (response.data.results.juso) {
          this.addressResults = response.data.results.juso;
        } else {
          this.addressResults = [];
        }
      } catch (error) {
        console.error('API 요청 중 오류 발생:', error);
        this.addressResults = [];
      }
    },

    selectAddress(address) {
      this.selectedAddress = address; 
      console.log(">>>",this.selectedAddress);
    },

  },
});
