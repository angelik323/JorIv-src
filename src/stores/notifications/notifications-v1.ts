import { defineStore } from 'pinia'
import { useAlert, useShowError } from '@/composables'
import { executeApi } from '@/apis'

const { showAlert } = useAlert()
const { showCatchError } = useShowError()

import { INotificationList, INotificationsList } from '@/interfaces/global'
import { IPaginated } from '@/interfaces/customs/IPages'

import { URL_PATH_SCHEDULES_NOTIFICATIONS } from '@/constants/apis'
import { TIMEOUT_ALERT } from '@/constants/alerts'

export const useNotificationsV1 = defineStore('notifications', {
  state: () => ({
    notifications: [] as INotificationList[],
    count_notification_pending: 0,
    loading: false,
  }),
  actions: {
    async _getListAction(page: number) {
      if (page === 1) {
        this.loading = true
      }
      await executeApi()
        .get(`${URL_PATH_SCHEDULES_NOTIFICATIONS}?page=${page}`)
        .then((response) => {
          const notifications = response.data?.data?.data ?? []

          if (notifications.length > 0) {
            if (this.notifications.length === 0) {
              this.notifications = [...notifications]
            } else {
              this.notifications = [...this.notifications, ...notifications]
            }
          }
        })
        .catch((error) => {
          logError(error, '_getListAction notifications-v1')
        })

      setTimeout(() => {
        this.loading = false
      }, 2000)
    },
    async _deleteNotificationAction(id: number) {
      await executeApi()
        .put(`${URL_PATH_SCHEDULES_NOTIFICATIONS}/remove/${id}`)
        .then((response) => {
          if (response.data.success) {
            this.notifications = []
            this._getListAction(1)
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
    async _confirmNotificationAction(id: number) {
      await executeApi()
        .put(`${URL_PATH_SCHEDULES_NOTIFICATIONS}/confirm/${id}`)
        .then((response) => {
          if (response.data.success) {
            this.notifications = []
            this._getListAction(1)
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
    async _getCountPendingNotifications() {
      await executeApi()
        .get(`${URL_PATH_SCHEDULES_NOTIFICATIONS}/count-notifications`)
        .then((response) => {
          this.count_notification_pending = response.data?.data ?? 0
        })
        .catch((error) => {
          logError(error, '_getCountPendingNotifications notifications-v1')
        })
    },

    async _listAction(params: Record<string, string | number>) {
      let responseList: IPaginated<INotificationsList> | null = {
        list: [],
        pages: { currentPage: 0, lastPage: 0 },
      }

      await executeApi()
        .get(`${URL_PATH_SCHEDULES_NOTIFICATIONS}/list-notifications`, {
          params: { ...params, paginate: 1 },
        })
        .then((response) => {
          const {
            data: { data: items = [], current_page = 0, last_page = 0 },
            message,
            success,
          } = response.data

          responseList = {
            list: items,
            pages: { currentPage: current_page, lastPage: last_page },
          }

          showAlert(
            message,
            success ? 'success' : 'error',
            undefined,
            TIMEOUT_ALERT
          )
        })
        .catch((error) => {
          showAlert(showCatchError(error), 'error', undefined, TIMEOUT_ALERT)
        })

      return responseList
    },
  },
})
