// src/stores/reportStore.js
import { defineStore } from "pinia";

export const useReportStore = defineStore("report", {
  state: () => ({
    estimatedPrice: 1280000000, // 추정 시세
    auctionRate: 78, // 낙찰가율
    expectedAuctionPrice: 998400000, // 예상 경매 낙찰가
    securedDebt: 280000000, // 선순위 채권액
    refundableDeposit: 718400000, // 환불 가능한 보증금
    myDeposit: 700000000, // 내 전세금
    estimatedLoss: 0, // 예측 손실액
  }),
  actions: {
    setReportData(reportData) {
      this.estimatedPrice = reportData.estimatedPrice;
      this.auctionRate = reportData.auctionRate;
      this.expectedAuctionPrice = reportData.expectedAuctionPrice;
      this.securedDebt = reportData.securedDebt;
      this.refundableDeposit = reportData.refundableDeposit;
      this.myDeposit = reportData.myDeposit;
      this.estimatedLoss = reportData.estimatedLoss;
    },
  },
});
