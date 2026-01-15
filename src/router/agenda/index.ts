import configCalendarRouter from '@/router/agenda/config-calendar'
import configAgendaRouter from '@/router/agenda/config-agenda'
import notificationsRouter from '@/router/agenda/notifications'

export default [
  ...configCalendarRouter,
  ...configAgendaRouter,
  ...notificationsRouter,
]
