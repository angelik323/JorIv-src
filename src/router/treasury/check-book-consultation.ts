export default [
  {
    path: '/tesoreria/consulta-libro-cheques',
    name: 'CheckbookConsultationList',
    component: () =>
      import(
        '@/views/treasury/check-book-consultation/v1/list/CheckBookConsultationList.vue'
      ),
  },
  {
    path: '/tesoreria/libro-cheques/ver/:id',
    name: 'CheckbookConsultationView',
    component: () =>
      import(
        '@/views/treasury/check-book-consultation/v1/view/CheckBookConsultationView.vue'
      ),
    meta: { requiresAuth: true, requiresFirstPasswordChanged: true },
  },
]
