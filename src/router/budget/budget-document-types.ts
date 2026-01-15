export default [
  {
    path: '/presupuesto/tipos-de-documentos',
    name: 'BudgetDocumentTypesList',
    component: () =>
      import(
        '@/views/budget/document-types/v1/list/BudgetDocumentTypesList.vue'
      ),
    meta: {
      requiresAuth: true,
      requiresFirPasswordChange: true,
    },
  },
  {
    path: '/presupuesto/tipos-de-documentos/crear',
    name: 'BudgetDocumentTypesCreate',
    component: () =>
      import(
        '@/views/budget/document-types/v1/create/BudgetDocumentTypesCreate.vue'
      ),
    meta: {
      requiresAuth: true,
      requiresFirPasswordChange: true,
    },
  },
  {
    path: '/presupuesto/tipos-de-documentos/editar/:id',
    name: 'BudgetDocumentTypesEdit',
    component: () =>
      import(
        '@/views/budget/document-types/v1/edit/BudgetDocumentTypesEdit.vue'
      ),
    meta: {
      requiresAuth: true,
      requiresFirPasswordChange: true,
    },
  },
  {
    path: '/presupuesto/tipos-de-documentos/agregar/:id',
    name: 'BudgetDocumentTypesBalanceValidationCreate',
    component: () =>
      import(
        '@/views/budget/document-types/v1/balance/BalanceValidationCreate.vue'
      ),
    meta: {
      requiresAuth: true,
      requiresFirPasswordChange: true,
    },
  },
  {
    path: '/presupuesto/tipos-de-documentos/editar-validacion/:id',
    name: 'BudgetDocumentTypesBalanceValidationEdit',
    component: () =>
      import(
        '@/views/budget/document-types/v1/balance/BalanceValidationEdit.vue'
      ),
    meta: {
      requiresAuth: true,
      requiresFirPasswordChange: true,
    },
  },
]
