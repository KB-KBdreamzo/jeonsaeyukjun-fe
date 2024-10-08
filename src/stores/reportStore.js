import { defineStore } from "pinia";
import axios from 'axios';
import { useRegisterStore } from '@/stores/registerStore';

export const useReportStore = defineStore('reportStore', {
  state: () => ({
    reportData: {}, 
    error: null,    
  }),
  actions: {
    async addReport(report) {
      try {
        const registerStore = useRegisterStore();
        const response = await axios.post(
          'http://localhost:8088/api/report',
          {
            deposit: report.deposit,
            jbAddress: report.jbAddress,
            legalCode: report.legalCode,
            registerDto: registerStore.registerData
          }
        );
        this.reportData = response.data;
      } catch (error) {
        console.error('Error submitting report:', error);
        this.error = '리포트 제출 중 오류가 발생했습니다.';
      } 
    },
  },
});