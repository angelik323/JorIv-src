export default [
  {
    path: '/liquidacion-de-comisiones/periodo-facturacion',
    name: 'BillingPeriodList',
    component: () =>
      import(
        '@/views/settlement-commissions/billing-period/v2/list/BillingPeriodList.vue'
      ),
    meta: {
      requiresAuth: true,
      requiresFirstPasswordChanged: true,
      requiredValidRole: {
        module: 'SettlementCommissions',
        view: 'BillingPeriodList',
        action: 'list',
      },
    },
  },
  {
    path: '/liquidacion-de-comisiones/periodo-facturacion/crear',
    name: 'BillingPeriodCreate',
    component: () =>
      import(
        '@/views/settlement-commissions/billing-period/v2/create/BillingPeriodCreate.vue'
      ),
    meta: {
      requiresAuth: true,
      requiresFirstPasswordChanged: true,
      requiredValidRole: {
        module: 'SettlementCommissions',
        view: 'BillingPeriodList',
        action: 'create',
      },
    },
  },
  {
    path: '/liquidacion-de-comisiones/periodo-facturacion/editar/:id',
    name: 'BillingPeriodEdit',
    component: () =>
      import(
        '@/views/settlement-commissions/billing-period/v2/edit/BillingPeriodEdit.vue'
      ),
    meta: {
      requiresAuth: true,
      requiresFirstPasswordChanged: true,
      requiredValidRole: {
        module: 'SettlementCommissions',
        view: 'BillingPeriodList',
        action: 'edit',
      },
    },
  },
]
