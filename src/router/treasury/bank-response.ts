export default [
  {
    path: '/tesoreria/respuesta-banco',
    name: 'BankResponseList',
    component: () =>
      import('@/views/treasury/bank-response/v1/list/BankResponseList.vue'),
    meta: {
      requiresAuth: true,
      requiresFirstPasswordChanged: true,
      // requiredValidRole: {
      //   module: 'Treasury',
      //   view: 'BankResponseList',
      // },
    },
  },
]
