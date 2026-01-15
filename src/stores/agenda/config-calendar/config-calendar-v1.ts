// Apis
import { executeApi } from '@/apis'
import { defineStore } from 'pinia'

// Interfaces
import { IMarkedDay } from '@/interfaces/customs/agenda/CalendarEvents'
import {
  IConfigCalendarData,
  IConfigCalendarRequest,
} from '@interfaces/customs/agenda/ConfigCalendar'

// Composables
import { useAlert, useShowError, useUtils } from '@/composables'

const URL_PATH_CONFIG_CALENDARS = 'schedules/api/schedules/marked-calendars'
const TIMEOUT_ALERT = 3000

const { showAlert } = useAlert()
const { showCatchError } = useShowError()

export const useConfigCalendarV1 = defineStore('config-calendar-v1', {
  state: () => ({
    version: 'v1',
    config_calendar_list: [] as IConfigCalendarData[],
    config_calendar_pages: {
      currentPage: 1,
      lastPage: 1,
    },
    config_calendar_request: null as IConfigCalendarRequest | null,
  }),
  actions: {
    async _getConfigCalendarList(
      params: Record<string, string | number>,
      show_alert = false,
      paginate = 1
    ) {
      this.config_calendar_list = []
      await executeApi()
        .get(`${URL_PATH_CONFIG_CALENDARS}`, {
          params: { ...params, paginate },
        })
        .then((response) => {
          const {
            data: { data: items = [], current_page = 0, last_page = 0 },
            message,
            success,
          } = response.data

          this.config_calendar_list = items.map(
            (item: IConfigCalendarData) => ({
              ...item,
            })
          )
          this.config_calendar_pages.currentPage = current_page
          this.config_calendar_pages.lastPage = last_page

          if (show_alert) {
            return showAlert(
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

    async _getConfigCalendar(params: Record<string, string | number>) {
      this.config_calendar_list = []
      await executeApi()
        .get(`${URL_PATH_CONFIG_CALENDARS}`, {
          params: { ...params },
        })
        .then((response) => {
          const data = response.data

          if (data.success) this.config_calendar_list = data?.data ?? []

          return showAlert(
            data.message,
            data.success ? 'success' : 'error',
            undefined,
            TIMEOUT_ALERT
          )
        })
        .catch((error) => {
          showAlert(showCatchError(error), 'error', undefined, TIMEOUT_ALERT)
        })
    },

    async _createAction(payload: IConfigCalendarRequest): Promise<boolean> {
      let success = false
      await executeApi()
        .post(`${URL_PATH_CONFIG_CALENDARS}`, payload)
        .then((response) => {
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
      this.config_calendar_request = null
      await executeApi()
        .get(`${URL_PATH_CONFIG_CALENDARS}/${id}`)
        .then((response) => {
          if (response.data.success) {
            this.config_calendar_request = response.data?.data ?? null
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
    },

    async _updateAction(payload: IConfigCalendarRequest): Promise<boolean> {
      let success = false
      await executeApi()
        .put(`${URL_PATH_CONFIG_CALENDARS}/${payload.id}`, {
          marked_day: payload.marked_day,
          marking_reason: payload.marking_reason,
        })
        .then((response) => {
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

    async _deleteAction(id: number) {
      await executeApi()
        .delete(`${URL_PATH_CONFIG_CALENDARS}/${id}`)
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

    async _clearConfigCalendarList() {
      this.config_calendar_list = []
      this.config_calendar_pages.currentPage = 0
      this.config_calendar_pages.lastPage = 0
    },
    async _clearRequestConfigCalendar() {
      this.config_calendar_request = null
    },

    async _getHolidays(year: number) {
      const holidays: string[] = []

      await executeApi()
        .get<{ data: IMarkedDay[]; success: boolean }>(
          `${URL_PATH_CONFIG_CALENDARS}`,
          {
            params: { 'filter[years]': year, paginate: 0 },
          }
        )
        .then((response) => {
          const { data, success } = response.data

          if (success) {
            holidays.push(
              ...data
                .filter((item) => item.is_holyday)
                .map((item) =>
                  useUtils().formatDate(
                    item.marked_day,
                    'YYYY-MM-DD',
                    'YYYY-MM-DD HH:mm:ss'
                  )
                )
            )
          }
        })
        .catch((error) => {
          showAlert(showCatchError(error), 'error', undefined, TIMEOUT_ALERT)
        })

      return holidays
    },

    _setCalendarDataForm(state: IConfigCalendarRequest | null) {
      this.config_calendar_request = state || null
    },
  },
})
