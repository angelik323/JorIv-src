export default [
  {
    path: '/presupuesto/areas-responsabilidad',
    name: 'BudgetAreasResponsibilityList',
    meta: {
      requiresAuth: true,
      requiresFirstPasswordChanged: true,
      requiredValidRole: {
        module: 'Budget',
        view: 'BudgetAreasResponsibilityList',
      },
    },
    component: () =>
      import(
        '@/views/budget/areas-responsibility/v1/list/BudgetAreasResponsibilityList.vue'
      ),
  },
  {
    path: '/presupuesto/areas-responsabilidad/crear',
    name: 'BudgetAreasResponsibilityCreate',
    meta: {
      requiresAuth: true,
      requiresFirstPasswordChanged: true,
      requiredValidRole: {
        module: 'Budget',
        view: 'BudgetAreasResponsibilityList',
        action: 'create',
      },
    },
    component: () =>
      import(
        '@/views/budget/areas-responsibility/v1/create/BudgetAreasResponsibilityCreate.vue'
      ),
  },
  {
    path: '/presupuesto/areas-responsibilidad/editar/:id',
    name: 'BudgetAreasResponsibilityEdit',
    meta: {
      requiresAuth: true,
      requiresFirstPasswordChanged: true,
      requiredValidRole: {
        module: 'Budget',
        view: 'BudgetAreasResponsibilityList',
        action: 'edit',
      },
    },
    component: () =>
      import(
        '@/views/budget/areas-responsibility/v1/edit/BudgetAreasResponsibilityEdit.vue'
      ),
  },
]
