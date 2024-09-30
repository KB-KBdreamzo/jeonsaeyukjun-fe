import { createRouter, createWebHistory } from "vue-router";
import HomeView from "../views/HomeView.vue";
import ReportResult from "../components/ReportResult.vue";
import ReportSafeScore from "../components/ReportSafeScore.vue";
import ReportView from "../views/ReportView.vue"; // ReportView import 추가

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "home",
      component: HomeView,
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
      path: "/report-result",
      component: ReportResult,
    },
    {
      path: "/report-score",
      component: ReportSafeScore,
    },
    {
      path: "/report",
      name: "report",
      component: ReportView, // ReportView 컴포넌트를 경로로 연결
    },
  ],
});

export default router;
