export default [
  {
    path: '/tesoreria/autorizacion-remota-tesoreria',
    name: 'RemoteAuthorizationList',
    component: () =>
      import(
        '@/views/treasury/remote-authorization/v2/list/RemoteAuthorizationList.vue'
      ),
    meta: { requiresAuth: true, requiresFirstPasswordChanged: true },
  },
  {
    path: '/tesoreria/autorizacion-remota-tesoreria/ver/:id',
    name: 'RemoteAuthorizationView',
    component: () =>
      import(
        '@/views/treasury/remote-authorization/v2/view/RemoteAuthorizationView.vue'
      ),
    meta: { requiresAuth: true, requiresFirstPasswordChanged: true },
  },
]
