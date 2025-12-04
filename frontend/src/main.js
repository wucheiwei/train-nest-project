import { createApp } from 'vue';
import { createRouter, createWebHistory } from 'vue-router';
import App from './App.vue';
import Login from './views/Login.vue';
import Register from './views/Register.vue';
import Dashboard from './views/Dashboard.vue';
import Chat from './views/Chat.vue';

const routes = [
  { path: '/', redirect: '/login' },
  { path: '/login', component: Login },
  { path: '/register', component: Register },
  { path: '/dashboard', component: Dashboard },
  { path: '/chat', component: Chat },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

// 路由守衛
router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('access_token');
  const protectedRoutes = ['/dashboard', '/chat'];
  
  if (protectedRoutes.includes(to.path) && !token) {
    next('/login');
  } else if ((to.path === '/login' || to.path === '/register') && token) {
    next('/chat'); // 登入後導向聊天室
  } else {
    next();
  }
});

const app = createApp(App);
app.use(router);
app.mount('#app');

