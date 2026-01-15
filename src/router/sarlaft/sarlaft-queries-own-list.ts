export default [
  {
    path: '/sarlaft/sarlaft-consultas-listas-propias',
    name: 'SarlaftQueriesOwnList',
    component: () =>
      import(
        '@/views/sarlaft/sarlaft-queries-own-list/v1/list/SarlaftQueriesOwnList.vue'
      ),
    meta: {
      requiresAuth: true,
      requiresFirstPasswordChanged: true,
      requiredValidRole: {
        module: 'Sarlaft',
        view: 'SarlaftQueriesOwnList',
      },
    },
  },
]
