export default [
  {
    path: '/fics/configurar-permisos-por-usuario',
    name: 'ConfigureUserPermissionsFicsList',
    component: () =>
      import(
        '@/views/fics/configure-user-permissions-and-operations/v1/list/ConfigureUserPermissionsFicsList.vue'
      ),
    meta: {
      requiresAuth: true,
      requiresFirstPasswordChanged: true,
      requiredValidRole: {
        module: 'Fics',
        view: 'ConfigureUserPermissionsFicsList',
      },
    },
  },
]
