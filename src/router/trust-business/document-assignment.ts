export default [
  {
    path: '/negocios-fiduciarios/asignacion-de-documentos',
    name: 'DocumentAssigns',
    component: () =>
      import(
        '@/views/trust-business/document-assignment/v1/list/DocumentAssignmentList.vue'
      ),
    meta: {
      requiresAuth: true,
      requiresFirstPasswordChanged: true,
      requiredValidRole: {
        module: 'BusinessTrust',
        view: 'DocumentAssigns',
      },
    },
  },
  {
    path: '/negocios-fiduciarios/asignacion-de-documentos/crear',
    name: 'DocumentAssignmentCreate',
    component: () =>
      import(
        '@/views/trust-business/document-assignment/v1/create/DocumentAssignmentCreate.vue'
      ),
    meta: {
      requiresAuth: true,
      requiresFirstPasswordChanged: true,
      requiredValidRole: {
        module: 'BusinessTrust',
        view: 'DocumentAssigns',
        action: 'create',
      },
    },
  },
  {
    path: '/negocios-fiduciarios/asignacion-de-documentos/editar/:id',
    name: 'DocumentAssignmentEdit',
    component: () =>
      import(
        '@/views/trust-business/document-assignment/v1/edit/DocumentAssignmentEdit.vue'
      ),
    meta: {
      requiresAuth: true,
      requiresFirstPasswordChanged: true,
      requiredValidRole: {
        module: 'BusinessTrust',
        view: 'DocumentAssigns',
        action: 'edit',
      },
    },
  },
  {
    path: '/negocios-fiduciarios/asignacion-de-documentos/ver/:id',
    name: 'DocumentAssignmentRead',
    component: () =>
      import(
        '@/views/trust-business/document-assignment/v1/read/DocumentAssignmentRead.vue'
      ),
    meta: {
      requiresAuth: true,
      requiresFirstPasswordChanged: true,
      requiredValidRole: {
        module: 'BusinessTrust',
        view: 'DocumentAssigns',
        action: 'show',
      },
    },
  },
]
