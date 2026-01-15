export default [
  {
    path: '/tesoreria/consulta-registros-tesoreria',
    name: 'TreasuryRecordsConsultationList',
    component: () =>
      import(
        '@/views/treasury/treasury-records-consultation/v1/list/TreasuryRecordsConsultationList.vue'
      ),
    meta: {
      requiresAuth: true,
      requiresFirstPasswordChanged: true,
      requiredValidRole: {
        module: 'Treasury',
        view: 'TreasuryRecordsConsultationList',
      },
    },
  },
]
