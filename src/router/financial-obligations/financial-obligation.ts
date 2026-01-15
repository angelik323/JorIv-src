export default [
  {
    path: '/negocios-fiduciarios/obligaciones-financieras',
    name: 'FinancialObligationList',
    meta: {
      requiresAuth: true,
      requiresFirstPasswordChanged: true,
      requiredValidRole: {
        module: 'FinancialObligations',
        view: 'FinancialObligationList',
      },
    },
    component: () =>
      import(
        '@/views/financial-obligations/financial-obligation/v2/list/FinancialObligationList.vue'
      ),
  },
  {
    path: '/negocios-fiduciarios/obligaciones-financieras/crear',
    name: 'FinancialObligationCreate',
    meta: {
      requiresAuth: true,
      requiresFirstPasswordChanged: true,
      requiredValidRole: {
        module: 'FinancialObligations',
        view: 'FinancialObligationList',
        action: 'create',
      },
    },
    component: () =>
      import(
        '@/views/financial-obligations/financial-obligation/v2/create/FinancialObligationCreate.vue'
      ),
  },
  {
    path: '/negocios-fiduciarios/obligaciones-financieras/editar/:id',
    name: 'FinancialObligationEdit',
    meta: {
      requiresAuth: true,
      requiresFirstPasswordChanged: true,
      requiredValidRole: {
        module: 'FinancialObligations',
        view: 'FinancialObligationList',
        action: 'edit',
      },
    },
    component: () =>
      import(
        '@/views/financial-obligations/financial-obligation/v2/edit/FinancialObligationEdit.vue'
      ),
  },
  {
    path: '/negocios-fiduciarios/obligaciones-financieras/editar/:id/documentos',
    name: 'FinancialObligationEditDocuments',
    meta: {
      requiresAuth: true,
      requiresFirstPasswordChanged: true,
      requiredValidRole: {
        module: 'FinancialObligations',
        view: 'FinancialObligationList',
        action: 'edit',
      },
    },
    component: () =>
      import(
        '@/views/financial-obligations/financial-obligation/v2/edit-documents/FinancialObligationEditDocuments.vue'
      ),
  },
  {
    path: '/negocios-fiduciarios/obligaciones-financieras/ver/:id',
    name: 'FinancialObligationView',
    meta: {
      requiresAuth: true,
      requiresFirstPasswordChanged: true,
      requiredValidRole: {
        module: 'FinancialObligations',
        view: 'FinancialObligationList',
        action: 'show',
      },
    },
    component: () =>
      import(
        '@/views/financial-obligations/financial-obligation/v2/view/FinancialObligationView.vue'
      ),
  },
  {
    path: '/negocios-fiduciarios/obligaciones-financieras/ver/:id/documentos',
    name: 'FinancialObligationViewDocuments',
    meta: {
      requiresAuth: true,
      requiresFirstPasswordChanged: true,
      requiredValidRole: {
        module: 'FinancialObligations',
        view: 'FinancialObligationList',
        action: 'show',
      },
    },
    component: () =>
      import(
        '@/views/financial-obligations/financial-obligation/v2/view-documents/FinancialObligationViewDocuments.vue'
      ),
  },
]
