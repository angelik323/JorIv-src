export default [
  {
    path: '/fics/generacion-extractos',
    name: 'GenerateExtractsList',
    meta: {
      requiresAuth: true,
      requiresFirstPasswordChanged: true,
      requiredValidRole: {
        module: 'Fics',
        view: 'GenerateExtractsList',
      },
    },

    component: () =>
      import('@/views/fics/generate-extracts/v1/list/GenerateExtractsList.vue'),
  },
  {
    path: '/fics/generacion-extractos/crear',
    name: 'GenerateExtractsCreate',
    meta: {
      requiresAuth: true,
      requiresFirstPasswordChanged: true,
      requiredValidRole: {
        module: 'Fics',
        view: 'GenerateExtractsList',
        action: 'create',
      },
    },
    component: () =>
      import(
        '@/views/fics/generate-extracts/v1/create/GenerateExtractsCreate.vue'
      ),
  },
]
