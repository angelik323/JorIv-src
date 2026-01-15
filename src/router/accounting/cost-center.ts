export default [
  {
    path: '/centro-de-costos',
    name: 'CostCenterList',
    meta: {
      requiresAuth: true,
      requiresFirstPasswordChanged: true,
      requiredValidRole: {
        module: 'Accounting',
        view: 'CostCenterList',
      },
    },
    component: () =>
      import('@/views/accounting/cost-centers/v2/list/CostCenterList.vue'),
  },
  {
    path: '/centro-de-costos/crear',
    name: 'CostCenterCreate',
    meta: {
      requiresAuth: true,
      requiresFirstPasswordChanged: true,
      requiredValidRole: {
        module: 'Accounting',
        view: 'CostCenterList',
        action: 'create',
      },
    },
    component: () =>
      import('@/views/accounting/cost-centers/v2/create/CostCenterCreate.vue'),
  },
  {
    path: '/centro-de-costos/editar/:id',
    name: 'CostCenterEdit',
    meta: {
      requiresAuth: true,
      requiresFirstPasswordChanged: true,
      requiredValidRole: {
        module: 'Accounting',
        view: 'CostCenterList',
        action: 'edit',
      },
    },
    component: () =>
      import('@/views/accounting/cost-centers/v2/edit/CostCenterEdit.vue'),
  },
  {
    path: '/centro-de-costos/ver/:id',
    name: 'CostCenterView',
    meta: {
      requiresAuth: true,
      requiresFirstPasswordChanged: true,
      requiredValidRole: {
        module: 'Accounting',
        view: 'CostCenterList',
        action: 'show',
      },
    },
    component: () =>
      import('@/views/accounting/cost-centers/v2/view/CostCenterView.vue'),
  },
]
