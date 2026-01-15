export default [
  {
    path: '/tesoreria/equivalencias-estructuras-bancos',
    name: 'BankStructureEquivalencesList',
    meta: {
      requiresAuth: true,
      requiresFirstPasswordChanged: true,
      requiredValidRole: {
        module: 'Treasury',
        view: 'BankStructureEquivalencesList',
      },
    },
    component: () =>
      import(
        '@/views/treasury/bank-structure-equivalences/v1/list/BankStructureEquivalencesList.vue'
      ),
  },
]
