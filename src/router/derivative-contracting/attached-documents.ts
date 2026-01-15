export default [
  {
    path: '/contratacion-derivada/definicion-de-documentos-anexos',
    name: 'AttachedDocumentsList',
    component: () =>
      import(
        '@/views/derivative-contracting/attached-documents-list/v1/list/AttachedDocumentsList.vue'
      ),
    meta: {
      requiresAuth: true,
      requiresFirstPasswordChanged: true,
      requiredValidRole: {
        module: 'DerivativeContracting',
        view: 'AttachedDocumentsList',
        action: 'list',
      },
    },
  },
  {
    path: '/contratacion-derivada/definicion-de-documentos-anexos/crear',
    name: 'AttachedDocumentsCreate',
    component: () =>
      import(
        '@/views/derivative-contracting/attached-documents-list/v1/create/AttachedDocumentsCreate.vue'
      ),
    meta: {
      requiresAuth: true,
      requiresFirstPasswordChanged: true,
      requiredValidRole: {
        module: 'DerivativeContracting',
        view: 'AttachedDocumentsList',
        action: 'create',
      },
    },
  },
  {
    path: '/contratacion-derivada/definicion-de-documentos-anexos/editar/:id',
    name: 'AttachedDocumentsEdit',
    component: () =>
      import(
        '@/views/derivative-contracting/attached-documents-list/v1/edit/AttachedDocumentsEdit.vue'
      ),
    meta: {
      requiresAuth: true,
      requiresFirstPasswordChanged: true,
      requiredValidRole: {
        module: 'DerivativeContracting',
        view: 'AttachedDocumentsList',
        action: 'edit',
      },
    },
  },
]
