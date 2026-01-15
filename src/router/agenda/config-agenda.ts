export default [
  {
    path: '/agenda',
    name: 'CalendarEventList',
    meta: {
      requiresAuth: true,
      requiresFirstPasswordChanged: true,
      requiredValidRole: {
        module: 'ScheduleNotifications',
        view: 'CalendarEventList',
      },
    },
    component: () =>
      import('@/views/agenda/config-agenda/v1/list/CalendarEventList.vue'),
  },
  {
    path: '/agenda/crear',
    name: 'CalendarEventCreate',
    meta: {
      requiresAuth: true,
      requiresFirstPasswordChanged: true,
      requiredValidRole: {
        module: 'ScheduleNotifications',
        view: 'CalendarEventList',
        action: 'create',
      },
    },
    component: () =>
      import('@/views/agenda/config-agenda/v1/create/CalendarEventCreate.vue'),
  },
  {
    path: '/agenda/editar/:id',
    name: 'CalendarEventEdit',
    meta: {
      requiresAuth: true,
      requiresFirstPasswordChanged: true,
      requiredValidRole: {
        module: 'ScheduleNotifications',
        view: 'CalendarEventList',
        action: 'edit',
      },
    },
    component: () =>
      import('@/views/agenda/config-agenda/v1/edit/CalendarEventEdit.vue'),
  },
  {
    path: '/agenda/ver/:id',
    name: 'CalendarEventView',
    meta: {
      requiresAuth: true,
      requiresFirstPasswordChanged: true,
      requiredValidRole: {
        module: 'ScheduleNotifications',
        view: 'CalendarEventList',
        action: 'show',
      },
    },
    component: () =>
      import('@/views/agenda/config-agenda/v1/view/CalendarEventView.vue'),
  },
  {
    path: '/agenda/visualizar-eventos',
    name: 'CalendarAgendaView',
    meta: {
      requiresAuth: true,
      requiresFirstPasswordChanged: true,
      requiredValidRole: {
        module: 'ScheduleNotifications',
        view: 'CalendarEventList',
        action: 'show',
      },
    },
    component: () =>
      import(
        '@/views/agenda/config-agenda/calendar-agenda/v1/view/CalendarAgendaView.vue'
      ),
  },
]
