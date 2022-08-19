import { createRouter, createWebHistory } from 'vue-router'
import { navigationGuard } from '@okta/okta-vue'
import Todos from "@/components/Todos";
import Home from "@/components/Home";
import { LoginCallback } from '@okta/okta-vue'

const routes = [
  {
    path: '/',
    component: Home
  },
  {
    path: '/todos',
    component: Todos,
    meta: {
      requiresAuth: true
    }
  },
  { path: '/callback', component: LoginCallback },
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
})

router.beforeEach(navigationGuard)

export default router
