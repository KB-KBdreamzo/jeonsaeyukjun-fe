import { createRouter, createWebHistory } from "vue-router";
import HomeView from "../views/HomeView.vue";
import AgentView from "@/views/AgentView.vue";
import ReportInputView from "@/views/report/ReportInputView.vue";
import ReportResultView from "@/views/report/ReportResultView.vue";
import MapView from "@/views/MapView.vue";
import BookingConfirmView from "@/views/Agent/BookingConfirmView.vue";
import AgentBookView from "@/views/Agent/AgentBookView.vue";
import MypageView from "@/views/mypage/MypageView.vue";
import MypageReportView from "@/views/mypage/MypageReportView.vue";
import MypageContractView from "@/views/mypage/MypageContractView.vue";
import KakaoOauth from "@/components/KakaoOauth.vue";
import { useUserStore } from "@/stores/userStore";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "home",
      component: HomeView,
    },
    {
      path: "/map",
      name: "map",
      component: MapView,
    },
    {
      path: "/booking-confirm",
      name: "BookingConfirmPage",
      component: BookingConfirmView,
    },
    {
      path: "/report/input",
      name: "reportInput",
      component: ReportInputView,
    },
    {
      path: "/report/result/:reportId",
      name: "reportResult",
      component: ReportResultView,
    },
    {
      path: "/agent",
      name: "agentPage",
      component: AgentView,
    },
    {
      path: "/agent/book",
      name: "AgentBookPage",
      component: AgentBookView,
    },
    {
      path: "/mypage",
      name: "mypage",
      component: MypageView,
    },
    {
      path: "/mypage/reports",
      name: "mypageReport",
      component: MypageReportView,
    },
    {
      path: "/mypage/contracts",
      name: "mypageContract",
      component: MypageContractView,
    },
    {
      path: '/contract', 
      name: 'contract',
      component: () => import('../views/ContractCreation.vue')
    },
    {
      path: "/oauth/kakao",
      name: "kakaoOauth",
      component: KakaoOauth,
    },
  ],
});

// 네비게이션 가드 설정
router.beforeEach((to, from, next) => {
  const userStore = useUserStore();
  const userId = userStore.userId; 

  if (to.name === 'reportInput' && !userId || to.name === 'reportResult' && !userId
    || to.name === 'mypage' && !userId || to.name === 'contract' && !userId
    || to.name === 'mypageReport' && !userId || to.name === 'mypageContract' && !userId
  ) {
    alert('로그인 후 이용해 주세요.');
    next({ name: 'home' }); 
  } else {
    next(); 
  }
});

export default router;
