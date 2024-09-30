import { createRouter, createWebHistory } from 'vue-router'
import InformationInputView from '../views/report/InformationInput.vue'
import ReportPage from "@/views/ReportView.vue";
import MapView from "@/views/MapView.vue";


const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: MapView
    },
    {
      path: '/report',
      name: 'ReportPage',
      component: ReportPage,
    },
    {
      path: '/report/informationInput',
      name: 'InformationInputPage',
      component: InformationInputView
    }
  ]
})

export default router
