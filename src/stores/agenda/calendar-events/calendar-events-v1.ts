// Apis
import { executeApi } from '@/apis'
import { defineStore } from 'pinia'

// Constants
import { URL_PATH_SCHEDULES } from '@/constants/apis'
import { TIMEOUT_ALERT } from '@/constants/alerts'

// Interfaces
import {
  ICalendarEvent,
  ICalendarAgenda,
  ICalendarEventView,
  ICalendarEventResponse,
} from '@/interfaces/customs/agenda/CalendarEvents'

// Composables
import { useAlert, useShowError } from '@/composables'

const { showAlert } = useAlert()
const { showCatchError } = useShowError()

const URL_PATH = `${URL_PATH_SCHEDULES}/events`

export const useCalendarEventsStoreV1 = defineStore(
  'calendar-events-store-v1',
  {
    state: () => ({
      version: 'v1',
      calendar_event_list: [] as ICalendarEventResponse[],
      calendar_event_pages: {
        currentPage: 1,
        lastPage: 1,
      },
      calendar_agenda_list: [] as ICalendarAgenda[],
      calendar_event_request: null as ICalendarEventResponse | null,
      calendar_event_view: null as ICalendarEventView | null,
    }),
    actions: {
      async _getCalendarEventList(
        params: Record<string, string | number>,
        show_alert: boolean = true
      ) {
        this._clearData()

        await executeApi()
          .get(`${URL_PATH}/get-all-events`, {
            params: { ...params, paginate: 1 },
          })
          .then((response) => {
            const {
              data: { data: items = [], current_page = 0, last_page = 0 },
              message,
              success,
            } = response.data

            this.calendar_event_list = items.map(
              (item: ICalendarEventResponse) => ({
                ...item,
              })
            )
            this.calendar_event_pages.currentPage = current_page
            this.calendar_event_pages.lastPage = last_page

            if (show_alert) {
              showAlert(
                message,
                success ? 'success' : 'error',
                undefined,
                TIMEOUT_ALERT
              )
            }
          })
          .catch((error) => {
            showAlert(showCatchError(error), 'error', undefined, TIMEOUT_ALERT)
          })
      },

      async _getCalendarAgendaByType(params: string) {
        this.calendar_agenda_list = []

        let agendaData: ICalendarAgenda | null = null

        await executeApi()
          .get(`${URL_PATH_SCHEDULES}/agenda/get-agenda-by-type?${params}`)
          .then((response) => {
            const responseData = response.data

            if (responseData.success) {
              const data = responseData.data as ICalendarAgenda

              switch (data.visualization_type) {
                case 'daily':
                case 'weekly':
                case 'monthly':
                case 'yearly':
                  agendaData = data
                  break
                default:
                  showAlert(
                    'Tipo de visualización desconocido',
                    'error',
                    undefined,
                    TIMEOUT_ALERT
                  )
                  agendaData = null
              }
            }

            return showAlert(
              responseData.message,
              responseData.success ? 'success' : 'error',
              undefined,
              TIMEOUT_ALERT
            )
          })
          .catch((error) => {
            showAlert(showCatchError(error), 'error', undefined, TIMEOUT_ALERT)
          })

        return agendaData
      },

      async _createAction(payload: ICalendarEvent) {
        let success = false
        await executeApi()
          .post(`${URL_PATH}/`, payload)
          .then(async (response) => {
            success = response.data.success

            return showAlert(
              response.data.message,
              response.data.success ? 'success' : 'error',
              undefined,
              TIMEOUT_ALERT
            )
          })
          .catch((error) => {
            showAlert(showCatchError(error), 'error', undefined, TIMEOUT_ALERT)
          })

        return success
      },

      async _getByIdAction(id: string) {
        let eventData: ICalendarEventView | null = null

        await executeApi()
          .get(`${URL_PATH}/${id}`)
          .then((response) => {
            if (response.data.success) {
              const data = response.data.data as ICalendarEventView

              data.notifications.users = Array.isArray(
                data.notifications?.users
              )
                ? data.notifications?.users
                : Object.values(data.notifications?.users ?? {})

              eventData = data
              this.calendar_event_view = data
            }

            return showAlert(
              response.data.message,
              response.data.success ? 'success' : 'error',
              undefined,
              TIMEOUT_ALERT
            )
          })
          .catch((error) => {
            showAlert(showCatchError(error), 'error', undefined, TIMEOUT_ALERT)
          })

        return eventData
      },

      async _updateAction(payload: ICalendarEvent) {
        let success = false
        await executeApi()
          .put(`${URL_PATH}/${payload.id}`, payload)
          .then((response) => {
            success = response.data.success
            return showAlert(
              response.data.message,
              success ? 'success' : 'error',
              undefined,
              TIMEOUT_ALERT
            )
          })
          .catch((error) => {
            showAlert(showCatchError(error), 'error', undefined, TIMEOUT_ALERT)
          })
        return success
      },

      async _deleteAction(id: number) {
        await executeApi()
          .delete(`${URL_PATH}/${id}`)
          .then((response) => {
            return showAlert(
              response.data.message,
              response.data.success ? 'success' : 'error',
              undefined,
              TIMEOUT_ALERT
            )
          })
          .catch((error) => {
            showAlert(showCatchError(error), 'error', undefined, TIMEOUT_ALERT)
          })
      },

      _clearData() {
        this.calendar_event_list = []
        this.calendar_event_pages = {
          currentPage: 1,
          lastPage: 1,
        }
      },
    },
  }
)
