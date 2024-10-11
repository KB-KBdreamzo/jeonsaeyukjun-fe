import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/HomeView.vue'
import AgentView from "@/views/AgentView.vue";
import ReportInputView from '@/views/report/ReportInputView.vue'
import ReportResultView from "@/views/report/ReportResultView.vue";
import MapView from "@/views/MapView.vue";
import BookingConfirmView from '@/views/Agent/BookingConfirmView.vue';
import AgentBookView from '@/views/Agent/AgentBookView.vue';
import MypageView from '@/views/MypageView.vue';
import MypageReport from '@/views/MypageReport.vue';
import MypageContract from '@/views/MypageContract.vue';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/agent',
      name: 'AgentPage',
      component: AgentView,
    },
    {
      path: '/booking-confirm',
      name: 'BookingConfirmPage',
      component: BookingConfirmView,
    },
    {
      path: "/report/input",
      name: "ReportInputPage",
      component: ReportInputView,
    },
    {
      path: '/report/result',
      name: 'ReportResultPage',
      component: ReportResultView,
    },
    {
      path: '/agent/book',
      name: 'AgentBookPage',
      component: AgentBookView,
    },
    {
      path: "/mypage",
      name: "Mypage",
      component: MypageView,
    },
    {
      path: "/mypage/reports",
      name: "MypageReport",
      component: MypageReport,
    },
    {
      path: "/mypage/contracts",
      name: "MypageContract",
      component: MypageContract,
    },
  ],
});
export default router
