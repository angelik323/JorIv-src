export default [
  {
    path: '/tesoreria/saldos-iniciales-cuentas',
    name: 'BankAccountBalancesList',
    component: () =>
      import(
        '@/views/treasury/bank-account-balances/v1/list/BankAccountBalancesList.vue'
      ),
    meta: {
      requiresAuth: true,
      requiresFirstPasswordChanged: true,
      requiredValidRole: {
        module: 'Treasury',
        view: 'BankAccountBalancesList',
      },
    },
  },
  {
    path: '/tesoreria/saldos-iniciales-cuentas/crear',
    name: 'BankAccountBalancesCreate',
    component: () =>
      import(
        '@/views/treasury/bank-account-balances/v1/create/BankAccountBalancesCreate.vue'
      ),
    meta: {
      requiresAuth: true,
      requiresFirstPasswordChanged: true,
      requiredValidRole: {
        module: 'Treasury',
        view: 'BankAccountBalancesList',
        action: 'create',
      },
    },
  },
  {
    path: '/tesoreria/saldos-iniciales-cuentas/editar/:id',
    name: 'BankAccountBalancesEdit',
    component: () =>
      import(
        '@/views/treasury/bank-account-balances/v1/edit/BankAccountBalancesEdit.vue'
      ),
    meta: {
      requiresAuth: true,
      requiresFirstPasswordChanged: true,
      requiredValidRole: {
        module: 'Treasury',
        view: 'BankAccountBalancesList',
        action: 'edit',
      },
    },
  },
]
