export default [
  {
    path: '/sarlaft/sarlaft-parametrizacion',
    name: 'SarlaftParameterizationList',
    component: () =>
      import(
        '@/views/sarlaft/sarlaft-parameterization/v1/list/SarlaftParameterizationList.vue'
      ),
    meta: {
      requiresAuth: true,
      requiresFirstPasswordChanged: true,
      requiredValidRole: {
        module: 'Sarlaft',
        view: 'SarlaftParameterizationList',
        action: 'list',
      },
    },
  },
]
