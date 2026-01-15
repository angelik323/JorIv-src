export default [
  {
    path: '/negocios-fiduciarios/punto-de-equilibrio',
    name: 'BalancePointList',
    meta: {
      requiresAuth: true,
      requiresFirstPasswordChanged: true,
      requiredValidRole: {
        module: 'BusinessTrust',
        view: 'BalancePointList',
      },
    },
    component: () =>
      import(
        '@/views/trust-business/balance-point/v1/list/BalancePointList.vue'
      ),
  },
  {
    path: '/negocios-fiduciarios/punto-de-equilibrio/crear',
    name: 'BalancePointCreate',
    meta: {
      requiresAuth: true,
      requiresFirstPasswordChanged: true,
      requiredValidRole: {
        module: 'BusinessTrust',
        view: 'BalancePointList',
        action: 'create',
      },
    },
    component: () =>
      import(
        '@/views/trust-business/balance-point/v1/create/BalancePointCreate.vue'
      ),
  },
  {
    path: '/negocios-fiduciarios/punto-de-equilibrio/editar/:id',
    name: 'BalancePointEdit',
    meta: {
      requiresAuth: true,
      requiresFirstPasswordChanged: true,
      requiredValidRole: {
        module: 'BusinessTrust',
        view: 'BalancePointList',
        action: 'edit',
      },
    },
    component: () =>
      import(
        '@/views/trust-business/balance-point/v1/edit/BalancePointEdit.vue'
      ),
  },
  {
    path: '/negocios-fiduciarios/punto-de-equilibrio/ver/:id',
    name: 'BalancePointView',
    meta: {
      requiresAuth: true,
      requiresFirstPasswordChanged: true,
      requiredValidRole: {
        module: 'BusinessTrust',
        view: 'BalancePointList',
        action: 'show',
      },
    },
    component: () =>
      import(
        '@/views/trust-business/balance-point/v1/view/BalancePointView.vue'
      ),
  },
  {
    path: '/negocios-fiduciarios/punto-de-equilibrio/autorizar/:id',
    name: 'BalancePointAuthorize',
    meta: {
      requiresAuth: true,
      requiresFirstPasswordChanged: true,
      requiredValidRole: {
        module: 'BusinessTrust',
        view: 'BalancePointList',
        action: 'action_authorize',
      },
    },
    component: () =>
      import(
        '@/views/trust-business/balance-point/v1/authorize/BalancePointAuthorize.vue'
      ),
  },
]
