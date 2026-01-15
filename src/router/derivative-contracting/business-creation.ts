export default [
  {
    path: '/contratacion-derivada/creacion-negocios',
    name: 'BusinessCreationList',
    component: () =>
      import(
        '@/views/derivative-contracting/business-creation/v1/list/BusinessCreationList.vue'
      ),
    meta: {
      requiresAuth: true,
      requiresFirstPasswordChanged: true,
      requiredValidRole: {
        module: 'DerivativeContracting',
        view: 'BusinessCreationList',
        action: 'create',
      },
    },
  },
]
