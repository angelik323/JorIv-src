export default [
  {
    path: '/tesoreria/anulaciones-cargue-bancos',
    name: 'CancelLoadBanksList',
    component: () =>
      import(
        '@/views/treasury/cancel-load-banks/v1/list/CancelLoadBanksList.vue'
      ),
    meta: {
      requiresAuth: true,
      requiresFirstPasswordChanged: true,
      requiredValidRole: {
        module: 'Treasury',
        view: 'CancelLoadBanksList',
        action: 'list',
      },
    },
  },
]
