export default [
  {
    path: '/contabilidad/Consulta-de-saldos-por-centro-de-costos',
    name: 'CostCenterBalanceQueryList',
    component: () =>
      import(
        '@/views/accounting/cost-center-balance-query/v1/list/costCenterBalanceQueryList.vue'
      ),
    meta: {
      requiresAuth: true,
      requiresFirstPasswordChanged: true,
      requiredValidRole: {
        module: 'Accounting',
        view: 'CostCenterBalanceQueryList',
      },
    },
  },
]
