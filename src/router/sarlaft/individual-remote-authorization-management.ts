export default [
  {
    path: '/sarlaft/gestion-autorizacion-remota-individual',
    name: 'IndividualRemoteAuthorizationManagement',
    component: () =>
      import(
        '@/views/sarlaft/individual-remote-authorization-management/v1/list/IndividualRemoteAuthorizationManagementList.vue'
      ),
    meta: {
      requiresAuth: true,
      requiresFirstPasswordChanged: true,
      requiredValidRole: {
        module: 'Sarlaft',
        view: 'IndividualRemoteAuthorizationManagement',
      },
    },
  },
]
