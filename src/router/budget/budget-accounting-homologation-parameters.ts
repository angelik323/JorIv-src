export default [
  {
    path: '/presupuesto/parametros-homologacion-presupuesto-contabilidad',
    name: 'BudgetAccountingHomologationParametersList',
    component: () =>
      import(
        '@/views/budget/budget-accounting-homologation-parameters/v1/list/BudgetAccountingHomologationParametersList.vue'
      ),
    meta: {
      requiresAuth: true,
      requiresFirPasswordChange: true,
      requiredValidRole: {
        module: 'Budget',
        view: 'BudgetAccountingHomologationParametersList',
      },
    },
  },
  {
    path: '/presupuesto/parametros-homologacion-contabilidad-presupuesto/crear',
    name: 'AccountingBudgetHomologationParametersCreate',
    component: () =>
      import(
        '@/views/budget/budget-accounting-homologation-parameters/v1/create/AccountingBudgetHomologationParametersCreate.vue'
      ),
    meta: {
      requiresAuth: true,
      requiresFirPasswordChange: true,
      requiredValidRole: {
        module: 'Budget',
        view: 'BudgetAccountingHomologationParametersList',
        action: 'create',
      },
    },
  },
  {
    path: '/presupuesto/parametros-homologacion-contabilidad-presupuesto/editar/:id',
    name: 'AccountingBudgetHomologationParametersEdit',
    component: () =>
      import(
        '@/views/budget/budget-accounting-homologation-parameters/v1/edit/AccountingBudgetHomologationParametersEdit.vue'
      ),
    meta: {
      requiresAuth: true,
      requiresFirPasswordChange: true,
      requiredValidRole: {
        module: 'Budget',
        view: 'BudgetAccountingHomologationParametersList',
        action: 'edit',
      },
    },
  },
  {
    path: '/presupuesto/parametros-homologacion-contabilidad-presupuesto/ver/:id',
    name: 'AccountingBudgetHomologationParametersView',
    component: () =>
      import(
        '@/views/budget/budget-accounting-homologation-parameters/v1/view/AccountingBudgetHomologationParametersView.vue'
      ),
    meta: {
      requiresAuth: true,
      requiresFirPasswordChange: true,
      requiredValidRole: {
        module: 'Budget',
        view: 'BudgetAccountingHomologationParametersList',
        action: 'show',
      },
    },
  },
  {
    path: '/presupuesto/parametros-homologacion-presupuesto-contabilidad/crear',
    name: 'BudgetAccountingHomologationParametersCreate',
    component: () =>
      import(
        '@/views/budget/budget-accounting-homologation-parameters/v1/create/BudgetAccountingHomologationParametersCreate.vue'
      ),
    meta: {
      requiresAuth: true,
      requiresFirPasswordChange: true,
      requiredValidRole: {
        module: 'Budget',
        view: 'BudgetAccountingHomologationParametersList',
        action: 'create',
      },
    },
  },
  {
    path: '/presupuesto/parametros-homologacion-presupuesto-contabilidad/editar/:id',
    name: 'BudgetAccountingHomologationParametersEdit',
    component: () =>
      import(
        '@/views/budget/budget-accounting-homologation-parameters/v1/edit/BudgetAccountingHomologationParametersEdit.vue'
      ),
    meta: {
      requiresAuth: true,
      requiresFirPasswordChange: true,
      requiredValidRole: {
        module: 'Budget',
        view: 'BudgetAccountingHomologationParametersList',
        action: 'edit',
      },
    },
  },
  {
    path: '/presupuesto/parametros-homologacion-presupuesto-contabilidad/ver/:id',
    name: 'BudgetAccountingHomologationParametersView',
    component: () =>
      import(
        '@/views/budget/budget-accounting-homologation-parameters/v1/view/BudgetAccountingHomologationParametersView.vue'
      ),
    meta: {
      requiresAuth: true,
      requiresFirPasswordChange: true,
      requiredValidRole: {
        module: 'Budget',
        view: 'BudgetAccountingHomologationParametersList',
        action: 'show',
      },
    },
  },
]
