export default [
  {
    path: '/sarlaft/consulta-masiva-listas-cautelares',
    name: 'SarlaftMassConsultationPrecautionaryLists',
    component: () =>
      import(
        '@/views/sarlaft/mass-consultation-precautionary-lists/v1/cautelar-lists-mass-query-view/CautelarListsMassQueryView.vue'
      ),
    meta: {
      requiresAuth: true,
      requiresFirstPasswordChanged: true,
      requiredValidRole: {
        module: 'Sarlaft',
        view: 'SarlaftMassConsultationPrecautionaryLists',
        action: 'list',
      },
    },
  },
]
