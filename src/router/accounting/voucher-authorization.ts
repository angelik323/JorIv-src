export default [
  {
    path: '/contabilidad/autorizacion-comprobantes',
    name: 'VoucherAuthorization',
    component: () =>
      import(
        '@/views/accounting/voucher-authorization/v1/authorize/VoucherAuthorization.vue'
      ),
    meta: {
      requiresAuth: true,
      requiresFirstPasswordChanged: true,
      requiredValidRole: {
        module: 'Accounting',
        view: 'VoucherAuthorization',
      },
    },
  },
]
