import { createRouter, createWebHistory } from 'vue-router'
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
      path: '/report/input',
      name: 'ReportInputPage',
      component: ReportInputView,
    }
  ]
});

export default router