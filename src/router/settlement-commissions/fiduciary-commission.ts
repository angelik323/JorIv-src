export default [
  {
    path: '/liquidacion-de-comisiones/comisiones-fiduciarias',
    name: 'SettlementFiduciaryCommissionsList',
    component: () =>
      import(
        '@/views/settlement-commissions/fiduciary-commission/v2/list/FiduciaryCommissionList.vue'
      ),
    meta: {
      requiresAuth: true,
      requiresFirstPasswordChanged: true,
      requiredValidRole: {
        module: 'SettlementCommissions',
        view: 'SettlementFiduciaryCommissionsList',
        action: 'list',
      },
    },
  },
]
