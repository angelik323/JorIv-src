export default [
  {
    path: '/:pathMatch(.*)*',
    redirect: '/not-found/404',
  },
  {
    path: '/not-found/404',
    name: '404NotFoundView',
    component: () => import('@/views/not-found/404NotFoundView.vue'),
    meta: { requiresAuth: false },
  },
]
