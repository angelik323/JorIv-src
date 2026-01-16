export default [
  {
    path: '/negocios-fiduciarios/cesion-comprador',
    name: 'AssignmentBuyerList',
    meta: {
      requiresAuth: true,
      requiresFirstPasswordChanged: true,
      requiredValidRole: {
        module: 'BusinessTrust',
        view: 'AssignmentBuyerList',
      },
    },
    component: () =>
      import(
        '@/views/trust-business/assignment-buyer/v1/list/AssignmentBuyerList.vue'
      ),
  },
  {
    path: '/negocios-fiduciarios/cesion-comprador/crear',
    name: 'AssignmentBuyerCreate',
    meta: {
      requiresAuth: true,
      requiresFirstPasswordChanged: true,
      requiredValidRole: {
        module: 'BusinessTrust',
        view: 'AssignmentBuyerList',
        action: 'create',
      },
    },
    component: () =>
      import(
        '@/views/trust-business/assignment-buyer/v1/create/AssignmentBuyerCreate.vue'
      ),
  },
  {
    path: '/negocios-fiduciarios/cesion-comprador/editar/:id',
    name: 'AssignmentBuyerEdit',
    meta: {
      requiresAuth: true,
      requiresFirstPasswordChanged: true,
      requiredValidRole: {
        module: 'BusinessTrust',
        view: 'AssignmentBuyerList',
        action: 'edit',
      },
    },
    component: () =>
      import(
        '@/views/trust-business/assignment-buyer/v1/edit/AssignmentBuyerEdit.vue'
      ),
  },
  {
    path: '/negocios-fiduciarios/cesion-comprador/ver/:id',
    name: 'AssignmentBuyerView',
    meta: {
      requiresAuth: true,
      requiresFirstPasswordChanged: true,
      requiredValidRole: {
        module: 'BusinessTrust',
        view: 'AssignmentBuyerList',
        action: 'show',
      },
    },
    component: () =>
      import(
        '@/views/trust-business/assignment-buyer/v1/view/AssignmentBuyerView.vue'
      ),
  },
  {
    path: '/negocios-fiduciarios/cesion-comprador/autorizar/:id',
    name: 'AssignmentBuyerAuthorize',
    meta: {
      requiresAuth: true,
      requiresFirstPasswordChanged: true,
      requiredValidRole: {
        module: 'BusinessTrust',
        view: 'AssignmentBuyerList',
        action: 'action_authorize',
      },
    },
    component: () =>
      import(
        '@/views/trust-business/assignment-buyer/v1/authorize/AssignmentBuyerAuthorize.vue'
      ),
  },
]
