export default [
  {
    path: '/tesoreria/autorizaciones-tesoreria',
    name: 'AuthorizationTreasuryList',
    component: () =>
      import(
        '@/views/treasury/authorization-treasury/v1/list/AuthorizationTreasuryList.vue'
      ),
    meta: {
      requiresAuth: true,
      requiresFirstPasswordChanged: true,
    },
  },
]
