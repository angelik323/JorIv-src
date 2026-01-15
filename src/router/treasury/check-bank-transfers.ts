export default [
  {
    path: '/tesoreria/consulta-traslados-bancarios',
    name: 'CheckBankTransfersList',
    component: () =>
      import(
        '@/views/treasury/check-bank-transfers/v1/list/CheckBankTransfersList.vue'
      ),
    meta: {
      requiresAuth: true,
      requiresFirstPasswordChanged: true,
      requiredValidRole: {
        module: 'Treasury',
        view: 'CheckBankTransfersList',
      },
    },
  },
]
