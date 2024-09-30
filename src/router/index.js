import { createRouter, createWebHistory } from 'vue-router'
import InformationInputView from '../views/report/InformationInput.vue'
import ReportPage from "@/views/ReportView.vue";


const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
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
