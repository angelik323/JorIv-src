export default [
  {
    path: '/contabilidad/consulta-saldos-centro-de-costos',
    name: 'CheckBalanceCostList',
    meta: {
      requiresAuth: true,
      requiresFirstPasswordChanged: true,
      requiredValidRole: {
        module: 'Accounting',
        view: 'CheckBalanceCostList',
      },
    },
    component: () =>
      import(
        '@/views/accounting/check-balance-cost-center/v1/list/CheckBalanceCostList.vue'
      ),
  },
]
