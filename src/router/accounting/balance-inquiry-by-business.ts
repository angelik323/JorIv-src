export default [
  {
    path: '/contabilidad/consulta-saldos-por-negocio',
    name: 'BalanceInquiryByBusinessList',
    meta: {
      requiresAuth: true,
      requiresFirstPasswordChanged: true,
      requiredValidRole: {
        module: 'Accounting',
        view: 'BalanceInquiryByBusinessList',
      },
    },
    component: () =>
      import(
        '@/views/accounting/balance-inquiry-by-business/v1/list/BalanceInquiryByBusinessList.vue'
      ),
  },
]
