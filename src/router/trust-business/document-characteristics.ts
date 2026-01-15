export default [
  {
    path: '/negocios-fiduciarios/caracteristicas-de-documento',
    name: 'DocumentCharacteristicsList',
    component: () =>
      import(
        '@/views/trust-business/document-characteristics/v1/list/DocumentCharacteristicsList.vue'
      ),
    meta: {
      requiresAuth: true,
      requiresFirstPasswordChanged: true,
      requiredValidRole: {
        module: 'BusinessTrust',
        view: 'DocumentCharacteristicsList',
      },
    },
  },
  {
    path: '/negocios-fiduciarios/caracteristicas-de-documento/crear',
    name: 'DocumentCharacteristicsCreate',
    component: () =>
      import(
        '@/views/trust-business/document-characteristics/v1/create/DocumentCharacteristicsCreate.vue'
      ),
    meta: {
      requiresAuth: true,
      requiresFirstPasswordChanged: true,
      requiredValidRole: {
        module: 'BusinessTrust',
        view: 'DocumentCharacteristicsList',
        action: 'create',
      },
    },
  },
  {
    path: '/negocios-fiduciarios/caracteristicas-de-documento/editar/:id',
    name: 'DocumentCharacteristicsEdit',
    component: () =>
      import(
        '@/views/trust-business/document-characteristics/v1/edit/DocumentCharacteristicsEdit.vue'
      ),
    meta: {
      requiresAuth: true,
      requiresFirstPasswordChanged: true,
      requiredValidRole: {
        module: 'BusinessTrust',
        view: 'DocumentCharacteristicsList',
        action: 'edit',
      },
    },
  },
  {
    path: '/negocios-fiduciarios/caracteristicas-de-documento/ver/:id',
    name: 'DocumentCharacteristicsView',
    component: () =>
      import(
        '@/views/trust-business/document-characteristics/v1/view/DocumentCharacteristicsView.vue'
      ),
    meta: {
      requiresAuth: true,
      requiresFirstPasswordChanged: true,
      requiredValidRole: {
        module: 'BusinessTrust',
        view: 'DocumentCharacteristicsList',
        action: 'show',
      },
    },
  },
]
