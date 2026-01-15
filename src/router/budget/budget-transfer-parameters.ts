export default [
  {
    path: '/presupuesto/parametros-traslados',
    name: 'BudgetTransferParametersList',
    component: () =>
      import(
        '@/views/budget/budget-transfer-parameters/v1/list/BudgetTransferParametersList.vue'
      ),
    meta: { requiresAuth: true, requiresFirstPasswordChanged: true },
    requiredValidRole: {
      module: 'Budget',
      view: 'BudgetTransferParametersList',
      action: 'list',
    },
  },
  {
    path: '/presupuesto/parametros-traslados/crear',
    name: 'BudgetTransferParametersCreate',
    component: () =>
      import(
        '@/views/budget/budget-transfer-parameters/v1/create/BudgetTransferParametersCreate.vue'
      ),
    meta: { requiresAuth: true, requiresFirstPasswordChanged: true },
    requiredValidRole: {
      module: 'Budget',
      view: 'BudgetTransferParametersList',
      action: 'create',
    },
  },
  {
    path: '/presupuesto/parametros-traslados/editar/:id',
    name: 'BudgetTransferParametersEdit',
    component: () =>
      import(
        '@/views/budget/budget-transfer-parameters/v1/edit/BudgetTransferParametersEdit.vue'
      ),
    meta: { requiresAuth: true, requiresFirstPasswordChanged: true },
    requiredValidRole: {
      module: 'Budget',
      view: 'BudgetTransferParametersList',
      action: 'edit',
    },
  },
  {
    path: '/presupuesto/parametros-traslados/ver/:id',
    name: 'BudgetTransferParametersView',
    component: () =>
      import(
        '@/views/budget/budget-transfer-parameters/v1/view/BudgetTransferParametersView.vue'
      ),
    meta: { requiresAuth: true, requiresFirstPasswordChanged: true },
    requiredValidRole: {
      module: 'Budget',
      view: 'BudgetTransferParametersList',
      action: 'show',
    },
  },
]
