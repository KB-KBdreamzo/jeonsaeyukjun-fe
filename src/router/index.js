import { createRouter, createWebHistory } from 'vue-router'
import InformationInputView from '../views/report/InformationInput.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/report/informationInput',
      name: 'about',
      component: InformationInputView
    }
  ]
})

export default router
