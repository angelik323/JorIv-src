export default [
  {
    path: '/fics/canales-operacion-sistema',
    name: 'SystemOperationChannelsList',
    component: () =>
      import(
        '@/views/fics/system-operation-channels/v1/list/SystemOperationChannelsList.vue'
      ),
    meta: {
      requiresAuth: true,
      requiresFirstPasswordChanged: true,
      requiredValidRole: {
        module: 'Fics',
        view: 'SystemOperationChannelsList',
      },
    },
  },
]
