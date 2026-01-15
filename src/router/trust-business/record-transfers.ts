export default [
  {
    path: '/negocios-fiduciarios/registrar-cesiones',
    name: 'RecordTransfersList',
    component: () =>
      import(
        '@/views/trust-business/record-transfers/v1/list/RecordTransfersList.vue'
      ),
    meta: {
      requiresAuth: true,
      requiresFirstPasswordChanged: true,
      requiredValidRole: {
        module: 'BusinessTrust',
        view: 'RecordTransfersList',
      },
    },
  },
  {
    path: '/negocios-fiduciarios/registrar-cesiones/crear',
    name: 'RecordTransfersCreate',
    component: () =>
      import(
        '@/views/trust-business/record-transfers/v1/create/RecordTransfersCreate.vue'
      ),
    meta: {
      requiresAuth: true,
      requiresFirstPasswordChanged: true,
      requiredValidRole: {
        module: 'BusinessTrust',
        view: 'RecordTransfersList',
        action: 'create',
      },
    },
  },
  {
    path: '/negocios-fiduciarios/asignacion-documentos/editar/:id',
    name: 'RecordTransfersEdit',
    component: () =>
      import(
        '@/views/trust-business/record-transfers/v1/edit/RecordTransfersEdit.vue'
      ),
    meta: {
      requiresAuth: true,
      requiresFirstPasswordChanged: true,
      requiredValidRole: {
        module: 'BusinessTrust',
        view: 'RecordTransfersList',
        action: 'edit',
      },
    },
  },
  {
    path: '/negocios-fiduciarios/asignacion-documentos/ver/:id',
    name: 'DocumentAssignmentView',
    component: () =>
      import(
        '@/views/trust-business/record-transfers/v1/view/RecordTransfersView.vue'
      ),
    meta: {
      requiresAuth: true,
      requiresFirstPasswordChanged: true,
      requiredValidRole: {
        module: 'BusinessTrust',
        view: 'RecordTransfersList',
        action: 'show',
      },
    },
  },
  {
    path: '/negocios-fiduciarios/asignacion-documentos/autorizar/:id',
    name: 'DocumentAssignmentAuthorize',
    component: () =>
      import(
        '@/views/trust-business/record-transfers/v1/authorize/RecordTransfersAuthorize.vue'
      ),
    meta: {
      requiresAuth: true,
      requiresFirstPasswordChanged: true,
      requiredValidRole: {
        module: 'BusinessTrust',
        view: 'RecordTransfersList',
        action: 'action_authorize',
      },
    },
  },
]
