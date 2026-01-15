export default [
  {
    path: '/agenda-y-notificaciones/notificaciones',
    name: 'NotificationsList',
    meta: {
      requiresAuth: true,
      requiresFirstPasswordChanged: true,
    },
    component: () =>
      import('@/views/agenda/notifications/v1/list/NotificationsList.vue'),
  },
]
