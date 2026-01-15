export default [
  {
    path: '/poc/input-money',
    name: 'InputMoneyPoc',
    component: () => import('@/views/poc/input-money/InputMoneyPoc.vue'),
    meta: { requiresAuth: true, requiresFirstPasswordChanged: true },
  },
]
