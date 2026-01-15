export default [
  {
    path: '/liquidacion-de-comisiones/terceros-de-facturacion',
    name: 'ThirdPartyBillingList',
    component: () =>
      import(
        '@/views/settlement-commissions/third-party-billing/v2/list/ThirdPartyBillingList.vue'
      ),
    meta: {
      requiresAuth: true,
      requiresFirstPasswordChanged: true,
      requiredValidRole: {
        module: 'SettlementCommissions',
        view: 'ThirdPartyBillingList',
        action: 'list',
      },
    },
  },
  {
    path: '/liquidacion-de-comisiones/terceros-de-facturacion/crear',
    name: 'ThirdPartyBillingCreate',
    component: () =>
      import(
        '@/views/settlement-commissions/third-party-billing/v2/create/ThirdPartyBillingCreate.vue'
      ),
    meta: {
      requiresAuth: true,
      requiresFirstPasswordChanged: true,
      requiredValidRole: {
        module: 'SettlementCommissions',
        view: 'ThirdPartyBillingList',
        action: 'create',
      },
    },
  },
  {
    path: '/liquidacion-de-comisiones/terceros-de-facturacion/editar/:id',
    name: 'ThirdPartyBillingEdit',
    component: () =>
      import(
        '@/views/settlement-commissions/third-party-billing/v2/edit/ThirdPartyBillingEdit.vue'
      ),
    meta: {
      requiresAuth: true,
      requiresFirstPasswordChanged: true,
      requiredValidRole: {
        module: 'SettlementCommissions',
        view: 'ThirdPartyBillingList',
        action: 'edit',
      },
    },
  },
  {
    path: '/liquidacion-de-comisiones/terceros-de-facturacion/ver/:id',
    name: 'ThirdPartyBillingRead',
    component: () =>
      import(
        '@/views/settlement-commissions/third-party-billing/v2/view/ThirdPartyBillingView.vue'
      ),
    meta: {
      requiresAuth: true,
      requiresFirstPasswordChanged: true,
      requiredValidRole: {
        module: 'SettlementCommissions',
        view: 'ThirdPartyBillingList',
        action: 'show',
      },
    },
  },
]
