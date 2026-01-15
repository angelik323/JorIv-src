export default [
  {
    path: '/fics/validacion-cierre-de-fondos-inversion-colectiva',
    name: 'ValidationFicsClosingList',
    meta: {
      requiresAuth: true,
      requiresFirstPasswordChanged: true,
      requiredValidRole: {
        module: 'Fics',
        view: 'ValidationFicsClosingList',
      },
    },
    component: () =>
      import(
        '@/views/fics/validation-fics-closing/v1/list/ValidationFicsClosingList.vue'
      ),
  },
]
