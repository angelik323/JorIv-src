export default [
  {
    path: '/parametros-usuario',
    name: 'UserParametersList',
    component: () =>
      import('@/views/user-parameter/list/ListUserParameterView.vue'),
    meta: {
      requiresAdmin: true,
      requiresAuth: true,
      requiresFirstPasswordChanged: true,
      requiredValidRole: {
        module: 'Users',
        view: 'UserParametersList',
      },
    },
  },
]
