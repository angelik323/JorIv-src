export default [
  {
    path: '/seccionales',
    name: 'SectionalList',
    meta: {
      requiresAuth: true,
      requiresFirstPasswordChanged: true,
    },
    component: () => import('@/views/sectionals/list/SectionalsList.vue'),
  },
  {
    path: '/seccionales/crear',
    name: 'SectionalCreate',
    meta: {
      requiresAuth: true,
      requiresFirstPasswordChanged: true,
    },
    component: () => import('@/views/sectionals/create/SectionalsCreate.vue'),
  },
  {
    path: '/seccionales/editar/:id',
    name: 'SectionalUpdate',
    meta: {
      requiresAuth: true,
      requiresFirstPasswordChanged: true,
    },
    component: () => import('@/views/sectionals/edit/SectionalsUpdate.vue'),
  },
]
