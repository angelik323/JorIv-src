export default [
  {
    path: '/sarlaft/consulta-individual-listas-cautelares',
    name: 'ConsultIndividualListPreventionList',
    component: () =>
      import(
        '@/views/sarlaft/consult-individual-list-prevention/v1/list/ConsultIndividualListPreventionList.vue'
      ),
    meta: {
      requiresAuth: true,
      requiresFirstPasswordChanged: true,
    },
  },
]
