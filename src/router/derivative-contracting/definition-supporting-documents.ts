export default [
  {
    path: '/contratacion-derivada/definicion-documentos-soporte',
    name: 'DefinitionSupportingDocumentsList',
    component: () =>
      import(
        '@/views/derivative-contracting/definition-supporting-documents/v1/list/DefinitionSupportingDocumentsList.vue'
      ),
    meta: {
      requiresAuth: true,
      requiresFirstPasswordChanged: true,
      requiredValidRole: {
        module: 'DerivativeContracting',
        view: 'DefinitionSupportingDocumentsList',
        action: 'list',
      },
    },
  },
  {
    path: '/contratacion-derivada/definicion-documentos-soporte/crear',
    name: 'DefinitionSupportingDocumentsCreate',
    component: () =>
      import(
        '@/views/derivative-contracting/definition-supporting-documents/v1/create/DefinitionSupportingDocumentsCreate.vue'
      ),
    meta: {
      requiresAuth: true,
      requiresFirstPasswordChanged: true,
      requiredValidRole: {
        module: 'DerivativeContracting',
        view: 'DefinitionSupportingDocumentsList',
        action: 'create',
      },
    },
  },
  {
    path: '/contratacion-derivada/definicion-documentos-soporte/editar/:id',
    name: 'DefinitionSupportingDocumentsEdit',
    component: () =>
      import(
        '@/views/derivative-contracting/definition-supporting-documents/v1/edit/DefinitionSupportingDocumentsEdit.vue'
      ),
    meta: {
      requiresAuth: true,
      requiresFirstPasswordChanged: true,
      requiredValidRole: {
        module: 'DerivativeContracting',
        view: 'DefinitionSupportingDocumentsList',
        action: 'edit',
      },
    },
  },
  {
    path: '/contratacion-derivada/definicion-documentos-soporte/ver/:id',
    name: 'DefinitionSupportingDocumentsRead',
    component: () =>
      import(
        '@/views/derivative-contracting/definition-supporting-documents/v1/read/DefinitionSupportingDocumentsRead.vue'
      ),
    meta: {
      requiresAuth: true,
      requiresFirstPasswordChanged: true,
      requiredValidRole: {
        module: 'DerivativeContracting',
        view: 'DefinitionSupportingDocumentsList',
        action: 'show',
      },
    },
  },
]
