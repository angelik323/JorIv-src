export default [
  {
    path: '/centro-de-costos/listado',
    name: 'CenterCostList',
    meta: {
      requiresAuth: true,
      requiresFirstPasswordChanged: true,
    },
    component: () => import('@/views/cost-center/V2/list/CenterCostList.vue'),
  },
  {
    path: '/centro-de-costos/crear',
    name: 'CreateCenterCost',
    meta: {
      requiresAuth: true,
      requiresFirstPasswordChanged: true,
    },
    component: () =>
      import('@/views/cost-center/V2/create/CreateCenterCost.vue'),
  },
  {
    path: '/centro-de-costos/editar/:id',
    name: 'UpdateCenterCost',
    meta: {
      requiresAuth: true,
      requiresFirstPasswordChanged: true,
    },
    component: () => import('@/views/cost-center/V2/edit/UpdateCenterCost.vue'),
  },
  {
    path: '/centro-de-costos/ver/:id',
    name: 'CenterCostShow',
    meta: {
      requiresAuth: true,
      requiresFirstPasswordChanged: true,
    },
    component: () => import('@/views/cost-center/V2/view/CenterCostView.vue'),
  },
]
