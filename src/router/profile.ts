export default [
  {
    path: '/cambiar-contrasena',
    name: 'ChangePasswordProfile',
    component: () => import('@/views/change-password/ChangePassword.vue'),
    meta: { requiresAuth: true, requiresFirstPasswordChanged: true },
  },
]
