export default [
  {
    path: '/fics/parametros-contabilidad/:activeTab?',
    name: 'AccountingParametersList',
    component: () =>
      import(
        '@/views/fics/accounting-parameters/v1/list/AccountingParametersList.vue'
      ),
    meta: {
      requiresAuth: true,
      requiresFirstPasswordChanged: true,
      requiredValidRole: {
        module: 'Fics',
        view: 'AccountingParametersList',
      },
    },
    props: true,
  },
]
