import { createRouter, createWebHistory } from 'vue-router'
import { isLoggedIn, getRole } from '../api/auth.service.js';

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
  // Kollar om routen kräver autentisering och om användaren är inloggad
  if (to.meta.requiresAuth && !isLoggedIn()) {
    return next('/login');
  }

  // Kollar om routen har rollbaserad åtkomstkontroll
  if (to.meta.roles) {
    const role = getRole();
    // Om användarens roll inte finns i de tillåtna rollerna, omdirigera till startsidan
    if (!to.meta.roles.includes(role)) {
      return next('/');
    }
  }

  next();
});

export default router
