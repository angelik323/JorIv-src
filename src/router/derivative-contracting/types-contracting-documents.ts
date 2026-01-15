export default [
  {
    path: '/contratacion-derivada/tipos-documento-contratacion',
    name: 'TypesContractingDocumentsList',
    component: () =>
      import(
        '@/views/derivative-contracting/types-contracting-documents/v1/list/TypesContractingDocumentsList.vue'
      ),
    meta: {
      requiresAuth: true,
      requiresFirstPasswordChanged: true,
      requiredValidRole: {
        module: 'DerivativeContracting',
        view: 'TypesContractingDocumentsList',
        action: 'list',
      },
    },
  },
  {
    path: '/contratacion-derivada/tipos-documento-contratacion/crear',
    name: 'TypesContractingDocumentsCreate',
    component: () =>
      import(
        '@/views/derivative-contracting/types-contracting-documents/v1/create/TypesContractingDocumentsCreate.vue'
      ),
    meta: {
      requiresAuth: true,
      requiresFirstPasswordChanged: true,
      requiredValidRole: {
        module: 'DerivativeContracting',
        view: 'TypesContractingDocumentsList',
        action: 'create',
      },
    },
  },
  {
    path: '/contratacion-derivada/tipos-documento-contratacion/editar/:id',
    name: 'TypesContractingDocumentsEdit',
    component: () =>
      import(
        '@/views/derivative-contracting/types-contracting-documents/v1/edit/TypesContractingDocumentsEdit.vue'
      ),
    meta: {
      requiresAuth: true,
      requiresFirstPasswordChanged: true,
      requiredValidRole: {
        module: 'DerivativeContracting',
        view: 'TypesContractingDocumentsList',
        action: 'edit',
      },
    },
  },
  {
    path: '/contratacion-derivada/tipos-documento-contratacion/ver/:id',
    name: 'TypesContractingDocumentsView',
    component: () =>
      import(
        '@/views/derivative-contracting/types-contracting-documents/v1/view/TypesContractingDocumentsView.vue'
      ),
    meta: {
      requiresAuth: true,
      requiresFirstPasswordChanged: true,
      requiredValidRole: {
        module: 'DerivativeContracting',
        view: 'TypesContractingDocumentsList',
        action: 'show',
      },
    },
  },
]
