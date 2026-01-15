export default [
  {
    path: '/tesoreria/cuentas-bancarias',
    name: 'BankingAccountsList',
    component: () =>
      import(
        '@/views/treasury/banking-accounts/v2/list/BankingAccountsList.vue'
      ),
    meta: {
      requiresAuth: true,
      requiresFirstPasswordChanged: true,
      requiredValidRole: {
        module: 'Treasury',
        view: 'BankingAccountsList',
      },
    },
  },
  {
    path: '/tesoreria/cuentas-bancarias/crear',
    name: 'BankingAccountsCreate',
    component: () =>
      import(
        '@/views/treasury/banking-accounts/v2/create/BankingAccountsCreate.vue'
      ),
    meta: {
      requiresAuth: true,
      requiresFirstPasswordChanged: true,
      requiredValidRole: {
        module: 'Treasury',
        view: 'BankingAccountsList',
        action: 'create',
      },
    },
  },
  {
    path: '/tesoreria/cuentas-bancarias/editar/:id',
    name: 'BankingAccountsEdit',
    component: () =>
      import(
        '@/views/treasury/banking-accounts/v2/edit/BankingAccountsEdit.vue'
      ),
    meta: {
      requiresAuth: true,
      requiresFirstPasswordChanged: true,
      requiredValidRole: {
        module: 'Treasury',
        view: 'BankingAccountsList',
        action: 'edit',
      },
    },
  },
  {
    path: '/tesoreria/cuentas-bancarias/ver/:id',
    name: 'BankingAccountsView',
    component: () =>
      import(
        '@/views/treasury/banking-accounts/v2/read/BankingAccountsView.vue'
      ),
    meta: {
      requiresAuth: true,
      requiresFirstPasswordChanged: true,
      requiredValidRole: {
        module: 'Treasury',
        view: 'BankingAccountsList',
        action: 'show',
      },
    },
  },
]
