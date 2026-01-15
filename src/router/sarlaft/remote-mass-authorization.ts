export default [
  {
    path: '/sarlaft/gestion-autorizacion-remota-masiva',
    name: 'SarlaftRemoteMassAuthorization',
    component: () =>
      import(
        '@/views/sarlaft/remote-mass-authorization/v1/list/RemoteMassAuthorizationList.vue'
      ),
    meta: {
      requiresAuth: true,
      requiresFirstPasswordChanged: true,
    },
  },
  {
    path: '/sarlaft/gestion-autorizacion-remota-masiva/:id',
    name: 'SarlaftRemoteMassAuthorizationDetail',
    component: () =>
      import(
        '@/views/sarlaft/remote-mass-authorization/v1/detail/RemoteMassAuthorizationDetail.vue'
      ),
    meta: {
      requiresAuth: true,
      requiresFirstPasswordChanged: true,
    },
  },
]
