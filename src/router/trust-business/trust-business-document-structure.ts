export default [
  {
    path: '/negocios-fiduciarios/estructura-documento-negocio-fiduciario',
    name: 'TrustBusinessDocumentStructureList',
    component: () =>
      import(
        '@/views/trust-business/trust-business-document-structure/v1/list/TrustBusinessDocumentStructureList.vue'
      ),
    meta: {
      requiresAuth: true,
      requiresFirstPasswordChanged: true,
      requiredValidRole: {
        module: 'BusinessTrust',
        view: 'TrustBusinessDocumentStructureList',
      },
    },
  },
  {
    path: '/negocios-fiduciarios/estructura-documento-negocio-fiduciario/crear',
    name: 'TrustBusinessDocumentStructureCreate',
    component: () =>
      import(
        '@/views/trust-business/trust-business-document-structure/v1/create/TrustBusinessDocumentStructureCreate.vue'
      ),
    meta: {
      requiresAuth: true,
      requiresFirstPasswordChanged: true,
      requiredValidRole: {
        module: 'BusinessTrust',
        view: 'TrustBusinessDocumentStructureList',
        action: 'create',
      },
    },
  },
  {
    path: '/negocios-fiduciarios/estructura-documento-negocio-fiduciario/editar/:id',
    name: 'TrustBusinessDocumentStructureEdit',
    component: () =>
      import(
        '@/views/trust-business/trust-business-document-structure/v1/edit/TrustBusinessDocumentStructureEdit.vue'
      ),
    meta: {
      requiresAuth: true,
      requiresFirstPasswordChanged: true,
      requiredValidRole: {
        module: 'BusinessTrust',
        view: 'TrustBusinessDocumentStructureList',
        action: 'edit',
      },
    },
  },
  {
    path: '/negocios-fiduciarios/estructura-documento-negocio-fiduciario/ver/:id',
    name: 'TrustBusinessDocumentStructureView',
    component: () =>
      import(
        '@/views/trust-business/trust-business-document-structure/v1/view/TrustBusinessDocumentStructureView.vue'
      ),
    meta: {
      requiresAuth: true,
      requiresFirstPasswordChanged: true,
      requiredValidRole: {
        module: 'BusinessTrust',
        view: 'TrustBusinessDocumentStructureList',
        action: 'show',
      },
    },
  },
]
