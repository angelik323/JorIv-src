export default [
  {
    path: '/presupuesto/homologacion-contabilidad-presupuesto',
    name: 'BudgetAccountingHomologationList',
    component: () =>
      import(
        '@/views/budget/budget-accounting-homologation/v1/list/BudgetAccountingHomologationList.vue'
      ),
    meta: {
      requiresAuth: true,
      requiresFirPasswordChange: true,
      requiredValidRole: {
        module: 'Budget',
        view: 'BudgetAccountingHomologationList',
      },
    },
  },
  {
    path: '/presupuesto/homologacion-contabilidad-presupuesto/crear',
    name: 'BudgetAccountingHomologationCreate',
    component: () =>
      import(
        '@/views/budget/budget-accounting-homologation/v1/create/BudgetAccountingHomologationCreate.vue'
      ),
    meta: {
      requiresAuth: true,
      requiresFirPasswordChange: true,
      requiredValidRole: {
        module: 'Budget',
        view: 'BudgetAccountingHomologationList',
        action: 'create',
      },
    },
  },
  {
    path: '/presupuesto/homologacion-contabilidad-presupuesto/ver/:id/:operation',
    name: 'BudgetAccountingHomologationView',
    component: () =>
      import(
        '@/views/budget/budget-accounting-homologation/v1/view/BudgetAccountingHomologationView.vue'
      ),
    meta: {
      requiresAuth: true,
      requiresFirPasswordChange: true,
      requiredValidRole: {
        module: 'Budget',
        view: 'BudgetAccountingHomologationList',
        action: 'show',
      },
    },
  },
]
