export default [
  {
    path: '/seguridad/intentos-fallidos',
    name: 'FailedAttemptsList',
    meta: {
      requiresAuth: true,
      requiresFirstPasswordChanged: true,
      requiredValidRole: {
        module: 'Security',
        view: 'FailedAttemptsList',
      },
    },
    component: () =>
      import('@/views/security/failedAttempts/FailedAttempts.vue'),
  },
  {
    path: '/seguridad/usuarios-conectados',
    name: 'UserConnectedList',
    meta: {
      requiresAuth: true,
      requiresFirstPasswordChanged: true,
      requiredValidRole: {
        module: 'Security',
        view: 'UserConnectedList',
      },
    },
    component: () =>
      import('@/views/security/userConnected/UserConnectedList.vue'),
  },
  {
    path: '/seguridad/horario-ingreso-usuarios',
    name: 'CheckinTime',
    meta: {
      requiresAuth: true,
      requiresFirstPasswordChanged: true,
      requiredValidRole: {
        module: 'Security',
        view: 'CheckinTime',
      },
    },
    component: () => import('@/views/security/checkinTime/CheckinTime.vue'),
  },
  {
    path: '/seguridad/estado-usuarios',
    name: 'UserStatus',
    meta: {
      requiresAuth: true,
      requiresFirstPasswordChanged: true,
      requiredValidRole: {
        module: 'Security',
        view: 'UserStatus',
      },
    },
    component: () => import('@/views/security/userStatus/UserStatus.vue'),
  },
  {
    path: '/seguridad/tiempo-conexion',
    name: 'ConnectionTime',
    meta: {
      requiresAuth: true,
      requiresFirstPasswordChanged: true,
      requiredValidRole: {
        module: 'Security',
        view: 'ConnectionTime',
      },
    },
    component: () =>
      import('@/views/security/connectionTime/ConnectionTime.vue'),
  },
  {
    path: '/seguridad/control-version-modulos',
    name: 'VersionControl',
    meta: {
      requiresAuth: true,
      requiresFirstPasswordChanged: true,
      requiredValidRole: {
        module: 'Security',
        view: 'VersionControl',
      },
    },
    component: () =>
      import('@/views/security/versionControl/VersionControl.vue'),
  },
]
