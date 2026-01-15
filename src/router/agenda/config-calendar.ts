export default [
  {
    path: '/calendario',
    name: 'ConfigCalendarList',
    meta: {
      requiresAuth: true,
      requiresFirstPasswordChanged: true,
      requiredValidRole: {
        module: 'ScheduleNotifications',
        view: 'ConfigCalendarList',
      },
    },
    component: () =>
      import('@/views/agenda/config-calendar/v1/list/ConfigCalendarList.vue'),
  },
  {
    path: '/calendario/crear',
    name: 'ConfigCalendarCreate',
    meta: {
      requiresAuth: true,
      requiresFirstPasswordChanged: true,
      requiredValidRole: {
        module: 'ScheduleNotifications',
        view: 'ConfigCalendarList',
        action: 'create',
      },
    },
    component: () =>
      import(
        '@/views/agenda/config-calendar/v1/create/ConfigCalendarCreate.vue'
      ),
  },
  {
    path: '/calendario/editar/:id',
    name: 'ConfigCalendarEdit',
    meta: {
      requiresAuth: true,
      requiresFirstPasswordChanged: true,
      requiredValidRole: {
        module: 'ScheduleNotifications',
        view: 'ConfigCalendarList',
        action: 'edit',
      },
    },
    component: () =>
      import('@/views/agenda/config-calendar/v1/edit/ConfigCalendarEdit.vue'),
  },
  {
    path: '/calendario/ver',
    name: 'ConfigCalendarView',
    meta: {
      requiresAuth: true,
      requiresFirstPasswordChanged: true,
      requiredValidRole: {
        module: 'ScheduleNotifications',
        view: 'ConfigCalendarList',
        action: 'show',
      },
    },
    component: () =>
      import('@/views/agenda/config-calendar/v1/view/ConfigCalendarView.vue'),
  },
]
