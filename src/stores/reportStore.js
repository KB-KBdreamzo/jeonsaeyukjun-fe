import { defineStore } from "pinia";
import axios from 'axios';
import { useRegisterStore } from '@/stores/registerStore';
import { useUserStore } from "@/stores/userStore";

export const useReportStore = defineStore('reportStore', {
  state: () => ({
    reportId: 0, 
    reportData: {},
    error: null,    
  }),
  actions: {
    async addReport(report) {
      try {
        const registerStore = useRegisterStore();
        const userStore = useUserStore(); 
        console.log("리포트 생성하고 저장합니다",report.deposit, report.jbAddress, report.detailedAddress, report.legalCode, registerStore.registerData)
        const response = await axios.post(
          `http://localhost:8080/api/report/${userStore.userId}`,
          {
            deposit: report.deposit,
            jbAddress: report.jbAddress,
            detailAddress: report.detailedAddress,
            legalCode: report.legalCode,
            registerDto: registerStore.registerData
          },{
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}` 
            }
          }
        );
        this.reportId = response.data
      } catch (error) {
        console.error('Error submitting report:', error);
        this.error = '리포트 제출 중 오류가 발생했습니다.';
      } 
    },
  },
});