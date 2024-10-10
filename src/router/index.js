import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import ReportPage from "@/views/ReportView.vue";
import AgentPage from "@/views/AgentView.vue";
import ReportInputView from '@/views/report/ReportInputView.vue'
import ReportResultView from "@/views/report/ReportResultView.vue";
import MapView from "@/views/MapView.vue";


const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: MapView,
    },
    {
      path: '/report/result',
      name: 'ReportResultPage',
      component: ReportResultView,
    },
    {
      path: '/agent',
      name: 'AgentPage',
      component: AgentPage
    },
    {
      path: '/about',
      name: 'about',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/AboutView.vue')
    },
    {
      path: '/report/input',
      name: 'ReportInputPage',
      component: ReportInputView,
    }
  ]
});

export default router