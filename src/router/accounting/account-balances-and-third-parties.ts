export default [
  {
    path: '/contabilidad/consulta-de-saldos-cuenta-y-terceros',
    name: 'AccountBalancesAndThirdPartiesList',
    meta: {
      requiresAuth: true,
      requiresFirstPasswordChanged: true,
      requiredValidRole: {
        module: 'Accounting',
        view: 'AccountBalancesAndThirdPartiesList',
      },
    },
    component: () =>
      import(
        '@/views/accounting/account-balances-and-third-parties/v1/list/AccountBalancesAndThirdPartiesList.vue'
      ),
  },
]
