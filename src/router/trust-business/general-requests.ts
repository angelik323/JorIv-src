export default [
  {
    path: '/negocios-fiduciarios/encargos-generales',
    name: 'GeneralRequestsList',
    component: () =>
      import(
        '@/views/trust-business/general-requests/v1/list/GeneralRequestsList.vue'
      ),
    meta: {
      requiresAuth: true,
      requiresFirstPasswordChanged: true,
      requiredValidRole: {
        module: 'BusinessTrust',
        view: 'GeneralRequestsList',
      },
    },
  },
  {
    path: '/negocios-fiduciarios/encargos-generales/crear',
    name: 'GeneralRequestsCreate',
    component: () =>
      import(
        '@/views/trust-business/general-requests/v1/create/GeneralRequestsCreate.vue'
      ),
    meta: {
      requiresAuth: true,
      requiresFirstPasswordChanged: true,
      requiredValidRole: {
        module: 'BusinessTrust',
        view: 'GeneralRequestsList',
        action: 'create',
      },
    },
  },
  {
    path: '/negocios-fiduciarios/encargos-generales/editar/:id',
    name: 'GeneralRequestsEdit',
    component: () =>
      import(
        '@/views/trust-business/general-requests/v1/edit/GeneralRequestsEdit.vue'
      ),
    meta: {
      requiresAuth: true,
      requiresFirstPasswordChanged: true,
      requiredValidRole: {
        module: 'BusinessTrust',
        view: 'GeneralRequestsList',
        action: 'edit',
      },
    },
  },
  {
    path: '/negocios-fiduciarios/encargos-generales/ver/:id',
    name: 'GeneralRequestsView',
    component: () =>
      import(
        '@/views/trust-business/general-requests/v1/view/GeneralRequestsView.vue'
      ),
    meta: {
      requiresAuth: true,
      requiresFirstPasswordChanged: true,
      requiredValidRole: {
        module: 'BusinessTrust',
        view: 'GeneralRequestsList',
        action: 'show',
      },
    },
  },
]
