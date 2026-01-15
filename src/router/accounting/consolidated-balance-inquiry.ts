export default [
  {
    path: '/contabilidad/consultas-de-saldos-consolidados',
    name: 'ConsolidatedBalanceInquiryList',
    component: () =>
      import(
        '@/views/accounting/consolidated-balance-inquiry/v1/list/ConsolidatedBalanceInquiryList.vue'
      ),
    meta: {
      requiresAuth: true,
      requiresFirstPasswordChanged: true,
      requiredValidRole: {
        module: 'Accounting',
        view: 'ConsolidatedBalanceInquiryList',
      },
    },
  },
]
