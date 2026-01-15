export default [
  {
    path: '/fics/parametros-contabilidad/codigos-procesos/crear',
    name: 'ProcessCodesCreate',
    component: () =>
      import(
        '@/views/fics/accounting-parameters/process-codes/v1/create/ProcessCodesCreate.vue'
      ),
    meta: {
      requiresAuth: true,
      requiresFirstPasswordChanged: true,
      requiresValidRole: {
        module: 'Fics',
        view: 'ProcessCodesCreate',
        action: 'create',
      },
    },
  },
]
