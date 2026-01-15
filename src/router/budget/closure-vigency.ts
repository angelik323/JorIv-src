export default [
  {
    path: '/presupuesto/cierre-vigencia',
    name: 'BudgetValidityClosureList',
    component: () =>
      import('@/views/budget/closure-vigency/v1/list/ClosureVigencyList.vue'),
    meta: {
      requiresAuth: true,
      requiresFirPasswordChange: true,
      requiredValidRole: {
        module: 'Budget',
        view: 'BudgetValidityClosureList',
        action: 'list'
      },
    },
  },
  {
    path: '/presupuesto/cierre-vigencia/crear',
    name: 'BudgetValidityClosureCreate',
    component: () =>
      import(
        '@/views/budget/closure-vigency/v1/create/ClosureVigencyCreate.vue'
      ),
    meta: {
      requiresAuth: true,
      requiresFirPasswordChange: true,
      requiredValidRole: {
        module: 'Budget',
        view: 'BudgetValidityClosureList',
        action: 'create'
      },
    },
  },
  {
    path: '/presupuesto/cierre-vigencia/ver/:id',
    name: 'BudgetValidityClosureView',
    component: () =>
      import('@/views/budget/closure-vigency/v1/view/ClosureVigencyView.vue'),
    meta: {
      requiresAuth: true,
      requiresFirPasswordChange: true,
      requiredValidRole: {
        module: 'Budget',
        view: 'BudgetValidityClosureList',
        action: 'show'
      },
    },
  },
]
