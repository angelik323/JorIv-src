export default [
  {
    path: '/fics/lineas-de-movimiento',
    name: 'SettingMovementClassesList',
    component: () =>
      import(
        '@/views/fics/setting-movement-classes/v1/list/SettingMovementClassesList.vue'
      ),
    meta: {
      requiresAuth: true,
      requiresFirstPasswordChanged: true,
      requiresValidRole: { module: 'Fics', view: 'SettingMovementClassesList' },
    },
  },
]
