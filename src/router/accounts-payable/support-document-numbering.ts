export default [
  {
    path: '/cuentas-por-pagar/resolucion-documento-soporte',
    name: 'SupportDocumentNumberingList',
    meta: {
      requiresAuth: true,
      requiresFirstPasswordChanged: true,
      requiredValidRole: {
        module: 'AccountsPayable',
        view: 'SupportDocumentNumberingList',
        action: 'list',
      },
    },
    component: () =>
      import(
        '@/views/accounts-payable/support-document-numbering/v1/list/SupportDocumentNumberingList.vue'
      ),
  },
  {
    path: '/cuentas-por-pagar/resolucion-documento-soporte/editar/:id',
    name: 'SupportDocumentNumberingEdit',
    meta: {
      requiresAuth: true,
      requiresFirstPasswordChanged: true,
      requiredValidRole: {
        module: 'AccountsPayable',
        view: 'SupportDocumentNumberingList',
        action: 'edit',
      },
    },
    component: () =>
      import(
        '@/views/accounts-payable/support-document-numbering/v1/edit/SupportDocumentNumberingEdit.vue'
      ),
  },
  {
    path: '/cuentas-por-pagar/resolucion-documento-soporte/ver/:id',
    name: 'SupportDocumentNumberingView',
    meta: {
      requiresAuth: true,
      requiresFirstPasswordChanged: true,
      requiredValidRole: {
        module: 'AccountsPayable',
        view: 'SupportDocumentNumberingList',
        action: 'show',
      },
    },
    component: () =>
      import(
        '@/views/accounts-payable/support-document-numbering/v1/view/SupportDocumentNumberingView.vue'
      ),
  },
  {
    path: '/cuentas-por-pagar/resolucion-documento-soporte/ver/:id/crear',
    name: 'SupportDocumentNumberingResolutionsCreate',
    meta: {
      requiresAuth: true,
      requiresFirstPasswordChanged: true,
      requiredValidRole: {
        module: 'AccountsPayable',
        view: 'SupportDocumentNumberingList',
        action: 'create',
      },
    },
    component: () =>
      import(
        '@/views/accounts-payable/support-document-numbering/v1/create/SupportDocumentNumberingResolutionsCreate.vue'
      ),
  },
  {
    path: '/cuentas-por-pagar/resolucion-documento-soporte/ver/:issuer_id/editar/:resolution_id',
    name: 'SupportDocumentNumberingResolutionsEdit',
    meta: {
      requiresAuth: true,
      requiresFirstPasswordChanged: true,
      requiredValidRole: {
        module: 'AccountsPayable',
        view: 'SupportDocumentNumberingList',
        action: 'edit',
      },
    },
    component: () =>
      import(
        '@/views/accounts-payable/support-document-numbering/v1/edit/SupportDocumentNumberingResolutionsEdit.vue'
      ),
  },
  {
    path: '/cuentas-por-pagar/resolucion-documento-soporte/ver/:issuer_id/resolucion/:resolution_id/editar/negocio/:business_id',
    name: 'SupportDocumentNumberingBusinessEdit',
    meta: {
      requiresAuth: true,
      requiresFirstPasswordChanged: true,
      requiredValidRole: {
        module: 'AccountsPayable',
        view: 'SupportDocumentNumberingList',
        action: 'edit',
      },
    },
    component: () =>
      import(
        '@/views/accounts-payable/support-document-numbering/v1/edit/SupportDocumentNumberingBusinessEdit.vue'
      ),
  },
  {
    path: '/cuentas-por-pagar/resolucion-documento-soporte/ver/:issuer_id/resolucion/:resolution_id/ver/negocio/:business_id',
    name: 'SupportDocumentNumberingBusinessView',
    meta: {
      requiresAuth: true,
      requiresFirstPasswordChanged: true,
      requiredValidRole: {
        module: 'AccountsPayable',
        view: 'SupportDocumentNumberingList',
        action: 'show',
      },
    },
    component: () =>
      import(
        '@/views/accounts-payable/support-document-numbering/v1/view/SupportDocumentNumberingBusinessView.vue'
      ),
  },
]
