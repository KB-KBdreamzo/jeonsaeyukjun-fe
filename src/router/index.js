import { createRouter, createWebHistory } from "vue-router";
import HomeView from "../views/HomeView.vue";
import ReportPage from "@/views/ReportView.vue";
import MapView from "@/views/MapView.vue";
import MypageView from "@/views/MypageView.vue";
import MypageReport from "@/views/MypageReport.vue";
import MypageContract from "@/views/MypageContract.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "home",
      component: MapView,
    },
    {
      path: "/report",
      name: "ReportPage",
      component: ReportPage,
    },
    {
      path: "/about",
      name: "about",
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import("../views/AboutView.vue"),
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

export default router;
