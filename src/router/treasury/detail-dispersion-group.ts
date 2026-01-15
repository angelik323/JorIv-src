export default [
  {
    path: '/tesoreria/grupo-de-dispersion',
    name: 'DetailDispersionGroupList',
    meta: {
      requiresAuth: true,
      requiresFirstPasswordChanged: true,
      requiredValidRole: {
        module: 'Treasury',
        view: 'DetailDispersionGroupList',
      },
    },
    component: () =>
      import(
        '@/views/treasury/detail-dispersion-group/v2/list/DetailDispersionGroupList.vue'
      ),
  },
]
