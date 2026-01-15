export default [
  {
    path: '/negocios-fiduciarios/tipo-de-documentos-negocio',
    name: 'TypeOfBusinessDocumentsList',
    component: () =>
      import(
        '@/views/trust-business/type-of-business-documents/v1/list/TypeOfBusinessDocumentsList.vue'
      ),
    meta: {
      requiresAuth: true,
      requiresFirstPasswordChanged: true,
      requiredValidRole: {
        module: 'BusinessTrust',
        view: 'TypeOfBusinessDocumentsList',
      },
    },
  },
  {
    path: '/negocios-fiduciarios/tipo-de-documentos-negocio/crear',
    name: 'TypeOfBusinessDocumentsCreate',
    component: () =>
      import(
        '@/views/trust-business/type-of-business-documents/v1/create/TypeOfBusinessDocumentsCreate.vue'
      ),
    meta: {
      requiresAuth: true,
      requiresFirstPasswordChanged: true,
      requiredValidRole: {
        module: 'BusinessTrust',
        view: 'TypeOfBusinessDocumentsList',
        action: 'create',
      },
    },
  },
  {
    path: '/negocios-fiduciarios/tipo-de-documentos-negocio/editar/:id',
    name: 'TypeOfBusinessDocumentsEdit',
    component: () =>
      import(
        '@/views/trust-business/type-of-business-documents/v1/edit/TypeOfBusinessDocumentsEdit.vue'
      ),
    meta: {
      requiresAuth: true,
      requiresFirstPasswordChanged: true,
      requiredValidRole: {
        module: 'BusinessTrust',
        view: 'TypeOfBusinessDocumentsList',
        action: 'edit',
      },
    },
  },
  {
    path: '/negocios-fiduciarios/tipo-de-documentos-negocio/ver/:id',
    name: 'TypeOfBusinessDocumentsView',
    component: () =>
      import(
        '@/views/trust-business/type-of-business-documents/v1/view/TypeOfBusinessDocumentsView.vue'
      ),
    meta: {
      requiresAuth: true,
      requiresFirstPasswordChanged: true,
      requiredValidRole: {
        module: 'BusinessTrust',
        view: 'TypeOfBusinessDocumentsList',
        action: 'show',
      },
    },
  },
]
