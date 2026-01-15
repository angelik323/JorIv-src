export default [
  {
    path: '/tributario/tipos-de-impuestos',
    name: 'TaxTypeList',
    component: () => import('@/views/tax/tax-types/v1/list/TaxTypeList.vue'),
    meta: {
      requiresAdmin: true,
      requiresAuth: true,
      requiresFirstPasswordChanged: true,
      requiredValidRole: {
        module: 'Tax',
        view: 'TaxTypeList',
      },
    },
  },
  {
    path: '/tributario/tipos-de-impuestos/crear',
    name: 'TaxTypeCreate',
    component: () =>
      import('@/views/tax/tax-types/v1/create/TaxTypeCreate.vue'),
    meta: {
      requiresAdmin: true,
      requiresAuth: true,
      requiresFirstPasswordChanged: true,
      requiredValidRole: {
        module: 'Tax',
        view: 'TaxTypeList',
        action: 'create',
      },
    },
  },
  {
    path: '/tributario/tipos-de-impuestos/editar/:id',
    name: 'TaxTypeEdit',
    component: () => import('@/views/tax/tax-types/v1/edit/TaxTypeEdit.vue'),
    meta: {
      requiresAdmin: true,
      requiresAuth: true,
      requiresFirstPasswordChanged: true,
      requiredValidRole: {
        module: 'Tax',
        view: 'TaxTypeList',
        action: 'edit',
      },
    },
  },
]
