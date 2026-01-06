import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('../views/Homeview.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('../views/LoginView.vue') 
    },
    {
      path: '/categories',
      name: 'categories',
      component: () => import('../views/CategoriesView.vue'),
      meta: { requiresAuth: true, roles: ['admin'] }
    },
    {
      path: '/products',
      name: 'products',
      component: () => import('../views/ProductsView.vue'),
      meta: { requiresAuth: true }
    }
  ],
})

// Enkel funktion för att kolla om användaren är inloggad
router.beforeEach((to, from, next) => {
  // Kolla om routen kräver autentisering
  if (to.meta.requiresAuth && !isLoggedIn()) {
    // Om inte inloggad → skicka till login
    return next('/login');
  }

  // Annars, fortsätt som vanligt
  next();
});

export default router
