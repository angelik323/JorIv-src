export default [
  {
    path: '/liquidacion-de-comisiones/fideicomisos-de-facturacion',
    name: 'BillingTrustList',
    component: () =>
      import(
        '@/views/settlement-commissions/billing-trust/v1/list/BillingTrustList.vue'
      ),
    meta: { requiresAuth: true, requiresFirstPasswordChanged: true },
  },
  {
    path: '/liquidacion-de-comisiones/fideicomisos-de-facturacion/crear',
    name: 'BillingTrustCreate',
    component: () =>
      import(
        '@/views/settlement-commissions/billing-trust/v1/create/BillingTrustCreate.vue'
      ),
    meta: { requiresAuth: true, requiresFirstPasswordChanged: true },
  },
  {
    path: '/liquidacion-de-comisiones/fideicomisos-de-facturacion/editar/:id',
    name: 'BillingTrustEdit',
    component: () =>
      import(
        '@/views/settlement-commissions/billing-trust/v1/edit/BillingTrustEdit.vue'
      ),
    meta: { requiresAuth: true, requiresFirstPasswordChanged: true },
  },
  {
    path: '/liquidacion-de-comisiones/fideicomisos-de-facturacion/ver/:id',
    name: 'BillingTrustRead',
    component: () =>
      import(
        '@/views/settlement-commissions/billing-trust/v1/read/BillingTrustRead.vue'
      ),
    meta: { requiresAuth: true, requiresFirstPasswordChanged: true },
  },

  {
    path: '/liquidacion-de-comisiones/fideicomisos-de-facturacion/parametros-contables/crear/:id',
    name: 'AccountingParametersCreate',
    component: () =>
      import(
        '@/views/settlement-commissions/billing-trust/v1/create/AccountingParametersCreate.vue'
      ),
    meta: { requiresAuth: true, requiresFirstPasswordChanged: true },
  },
  {
    path: '/liquidacion-de-comisiones/fideicomisos-de-facturacion/parametros-contables/editar/:id',
    name: 'AccountingParametersEdit',
    component: () =>
      import(
        '@/views/settlement-commissions/billing-trust/v1/edit/AccountingParametersEdit.vue'
      ),
    meta: { requiresAuth: true, requiresFirstPasswordChanged: true },
  },
  {
    path: '/liquidacion-de-comisiones/fideicomisos-de-facturacion/parametros-contables/ver/:id',
    name: 'AccountingParametersRead',
    component: () =>
      import(
        '@/views/settlement-commissions/billing-trust/v1/read/AccountingParametersRead.vue'
      ),
    meta: { requiresAuth: true, requiresFirstPasswordChanged: true },
  },
]
