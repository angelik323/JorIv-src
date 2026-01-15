import { executeApi } from '@/apis'
import { useAlert, useShowError } from '@/composables'
import {
  ICreateUpdateUserFormData,
  IErrors,
  IGetUserData,
} from '@/interfaces/global'
import { defineStore } from 'pinia'

// Constants
import { URL_PATH_USERS_LIST, URL_PATH_USERS_GET_BY_ID } from '@/constants/apis'
const TIMEOUT_ALERT = 3000

const { showAlert } = useAlert()
const { showCatchError } = useShowError()

export const useUserStoreV1 = defineStore('user-v1', {
  state: () => ({
    version: 'v1',
    users_pages: {
      currentPage: 0,
      lastPage: 0,
    },
    users_list: [] as never[] | [],
    categorized: {
      status_active: 0,
      status_inactive: 0,
      total: 0,
    },
    users_request: null as object | null,
    user_data: null as IGetUserData | null,
    user_form_data: null as ICreateUpdateUserFormData | null,
  }),
  actions: {
    async _getListAction(params: string) {
      this.users_list = []
      this.categorized = {
        status_active: 0,
        status_inactive: 0,
        total: 0,
      }
      await executeApi()
        .get(`${URL_PATH_USERS_LIST}${params}`)
        .then((response) => {
          if (response.data.success) {
            const data = response.data?.data

            this.users_list = data?.users?.data ?? []
            this.users_pages.currentPage = data?.users?.current_page ?? 0
            this.users_pages.lastPage = data?.users?.last_page ?? 0

            this.categorized = { ...data?.categorized }
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
    async _getUserById(id: number) {
      this.user_data = null
      await executeApi()
        .get(`${URL_PATH_USERS_GET_BY_ID}/u/${id}`)
        .then((response) => {
          if (response.data.success) {
            const { data, message, success } = response.data
            this.user_data = data
            return { message, success }
          }
        })
        .catch((error) => {
          showAlert(showCatchError(error), 'error', undefined, TIMEOUT_ALERT)
        })
    },
    async _updateUser(
      bodyRequest: ICreateUpdateUserFormData,
      id: number
    ): Promise<{ message: string; success: boolean }> {
      try {
        const response = await executeApi().put(
          `${URL_PATH_USERS_GET_BY_ID}/update/${id}`,
          { ...bodyRequest }
        )
        const { message, success } = response.data
        showAlert(message, 'success')
        return { message, success }
      } catch (e) {
        const message = showCatchError(e as IErrors)
        showAlert(message, 'error', undefined, TIMEOUT_ALERT)
        return { message, success: false }
      }
    },

    // Non-async funcions:
    _setUserData(state: ICreateUpdateUserFormData | null) {
      this.user_form_data = null
      if (state) this.user_form_data = state
    },
  },
})
