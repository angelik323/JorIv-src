export default [
  {
    path: '/tesoreria/ajustes-saldo-tesoreria/crear',
    name: 'TreasuryReadjustmentCreate',
    component: () =>
      import(
        '@/views/treasury/treasury-readjustment/v1/create/TreasuryReadjustmentCreate.vue'
      ),
    meta: { requiresAuth: true, requiresFirstPasswordChanged: true },
  },
]