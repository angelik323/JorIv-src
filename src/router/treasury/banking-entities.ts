export default [
  {
    path: '/tesoreria/bloques-contables-recaudo/parametros-entidades-bancarias',
    name: 'BankingEntitiesAccountingParametersCommissionsList',
    component: () =>
      import(
        '@/views/treasury/commission-accounting-parameters/banking-entities/list/BankingEntitiesList.vue'
      ),
    meta: { requiresAuth: true, requiresFirstPasswordChanged: true },
  },
  {
    path: '/tesoreria/bloques-contables-recaudo/parametros-entidades-bancarias/crear/:selectID',
    name: 'BankingEntitiesAccountingParametersCommissionsCreate',
    component: () =>
      import(
        '@/views/treasury/commission-accounting-parameters/banking-entities/create/BankingEntitiesCreate.vue'
      ),
    props: true,
    meta: { requiresAuth: true, requiresFirstPasswordChanged: true },
  },
  {
    path: '/tesoreria/bloques-contables-recaudo/parametros-entidades-bancarias/editar/:id/:selectID',
    name: 'BankingEntitiesAccountingParametersCommissionsEdit',
    component: () =>
      import(
        '@/views/treasury/commission-accounting-parameters/banking-entities/edit/BankingEntitiesEdit.vue'
      ),
    props: true,
    meta: { requiresAuth: true, requiresFirstPasswordChanged: true },
  },
]
