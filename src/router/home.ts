export default [
  {
    path: '/home',
    name: 'HomeView',
    component: () => import('@/views/home/HomeView.vue'),
    meta: { requiresAuth: true, requiresFirstPasswordChanged: true },
  },
]
