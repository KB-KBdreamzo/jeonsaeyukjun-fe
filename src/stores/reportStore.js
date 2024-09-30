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
    reportMessage:
      "전세가가 매매가(추정 시세)의 54.69% 이므로 깡통 전세는 아닙니다.",
    safetyStatus: "보통",
    address: "서울특별시 강서구 방화대로47가길 22",
    riskFactor: 2, //위험진단요소
    safeScore: 70, //안전점수
    homeRelativeScore: 85, //그래프 우리집 상대점수
    domesticRelativeScore: 65, //그래프 국내평균 상대점수
    regionRelativeScore: 42, //그래프 구 상대점수
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
      this.reportMessage = reportData.reportMessage;
      this.safetyStatus = reportData.safetyStatus;
      this.address = reportData.address;
      this.riskFactor = reportData.riskFactor;
      this.safeScore = reportData.safeScore;
      this.homeRelativeScore = reportData.homeRelativeScore;
      this.domesticRelativeScore = reportData.domesticRelativeScore;
      this.regionRelativeScore = reportData.regionRelativeScore;
    },
  },
});
