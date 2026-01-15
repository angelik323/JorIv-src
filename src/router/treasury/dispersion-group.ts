export default [
  {
    path: '/tesoreria/consulta-grupo-de-dispersion',
    name: 'DispersionGroupList',
    component: () =>
      import(
        '@/views/treasury/dispersion-group/v1/list/DispersionGroupList.vue'
      ),
    meta: {
      requiresAuth: true,
      requiresFirstPasswordChanged: true,
      requiredValidRole: {
        module: 'Treasury',
        view: 'DispersionGroupList',
      },
    },
  },
  {
    path: '/tesoreria/consulta-grupo-de-dispersion/ver/:id',
    name: 'DispersionGroupView',
    component: () =>
      import(
        '@/views/treasury/dispersion-group/v1/view/DispersionGroupView.vue'
      ),
    meta: {
      requiresAuth: true,
      requiresFirstPasswordChanged: true,
      requiredValidRole: {
        module: 'Treasury',
        view: 'DispersionGroupList',
        action: 'show',
      },
    },
  },
]
