export default [
  {
    path: '/cuentas-por-pagar/tipos-de-documentos',
    name: 'TypeOfDocumentsList',
    meta: {
      requiresAuth: true,
      requiresFirstPasswordChanged: true,
      requiredValidRole: {
        module: 'AccountsPayable',
        view: 'TypeOfDocumentsList',
        action: 'list',
      },
    },
    component: () =>
      import(
        '@/views/accounts-payable/type-of-documents/v1/list/TypeOfDocumentsList.vue'
      ),
  },

  {
    path: '/cuentas-por-pagar/tipos-de-documentos/crear',
    name: 'TypeOfDocumentsCreate',
    meta: {
      requiresAuth: true,
      requiresFirstPasswordChanged: true,
      requiredValidRole: {
        module: 'AccountsPayable',
        view: 'TypeOfDocumentsList',
        action: 'create',
      },
    },
    component: () =>
      import(
        '@/views/accounts-payable/type-of-documents/v1/create/TypeOfDocumentsCreate.vue'
      ),
  },

  {
    path: '/cuentas-por-pagar/tipos-de-documentos/editar/:id',
    name: 'TypeOfDocumentsEdit',
    meta: {
      requiresAuth: true,
      requiresFirstPasswordChanged: true,
      requiredValidRole: {
        module: 'AccountsPayable',
        view: 'TypeOfDocumentsList',
        action: 'edit',
      },
    },
    component: () =>
      import(
        '@/views/accounts-payable/type-of-documents/v1/edit/TypeOfDocumentsEdit.vue'
      ),
  },
]


