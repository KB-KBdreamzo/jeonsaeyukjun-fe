import { createRouter, createWebHistory } from "vue-router";
import HomeView from "../views/HomeView.vue";
import ReportPage from "@/views/ReportView.vue";
import KakaoOauth from "@/components/KakaoOauth.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "home",
      component: HomeView,
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
      path: "/oauth/kakao",
      name: "kakaoOauth",
      component: KakaoOauth,
    },
  ],
});

export default router;
