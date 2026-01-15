export default [
  {
    path: '/fics/congelamiento-descongelamiento-recursos',
    name: 'FreezeResourcesList',
    component: () =>
      import('@/views/fics/freeze-resources/v1/list/FreezeResourcesList.vue'),
    meta: {
      requiresAuth: true,
      title: 'Freeze Resources',
      requiredValidRole: {
        module: 'Fics',
        view: 'FreezeResourcesList',
      },
    },
  },
  {
    path: '/fics/congelamiento-recursos/crear/congelamiento',
    name: 'FreezeResourcesCreate',
    component: () =>
      import(
        '@/views/fics/freeze-resources/v1/create/FreezeResourcesCreate.vue'
      ),
    meta: {
      requiresAuth: true,
      title: 'Crear congelamiento de recursos',
      requiredValidRole: {
        module: 'Fics',
        view: 'FreezeResourcesList',
        action: 'create',
      },
    },
  },
  {
    path: '/fics/congelamiento-recursos/crear/descongelamiento',
    name: 'UnFreezeResourcesCreate',
    component: () =>
      import(
        '@/views/fics/freeze-resources/v1/create/UnFreezeResourcesCreate.vue'
      ),
    meta: {
      requiresAuth: true,
      title: 'Crear descongelamiento de recursos',
      requiredValidRole: {
        module: 'Fics',
        view: 'FreezeResourcesList',
        action: 'create',
      },
    },
  },
  {
    path: '/fics/congelamiento-recursos/ver/:id',
    name: 'FreezeResourcesView',
    component: () =>
      import('@/views/fics/freeze-resources/v1/view/FreezeResourcesView.vue'),
    meta: {
      requiresAuth: true,
      title: 'Ver congelamiento de recursos',
      requiredValidRole: {
        module: 'Fics',
        view: 'FreezeResourcesList',
        action: 'show',
      },
    },
  },
]
