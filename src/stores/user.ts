// Pinia
import { defineStore } from 'pinia'

// Utils
import { useAlert } from '@/composables/useAlert'
import { useShowError } from '@/composables/useShowError'
import { executeApi } from '@/apis'

// Interfaces
import { IErrors } from '@/interfaces/global/errorMessage'
import {
  ICreateUpdateUser,
  IUserList,
  IUserCount,
  IUserData,
  IGetUserByDocument,
} from '@/interfaces/global/user'

const URL_PATH_USERS = '/users'
const { showAlert } = useAlert()
const { showCatchError } = useShowError()

export const useUserStore = defineStore('user', {
  state: () => ({
    userList: [] as IUserList[] | [],
    userCount: null as IUserCount | null,
    pages: {
      currentPage: 0,
      lastPage: 0,
    },
    userData: {} as IUserData | null,
    documentUserData: {} as IUserData | null,
    urlExportXlsx: null as string | null,
    userRoleId: null as number | null,

  }),

  actions: {
    // Get user list:
    async getUsersList(
      state: {
        'filter[status_id]': number | string | null
        'filter[search]': string | null
        page: number
      } | null = null
    ) {
      this.userList = []
      this.userCount = null
      try {
        const { data } = await executeApi().get(`${URL_PATH_USERS}/get`, {
          params: state,
        })
        this.userList = data?.data?.paginate?.data ?? []
        this.urlExportXlsx = data.data?.paginate?.route_export ?? ''
        this.userCount = data?.data?.cards ?? []
        this.pages.currentPage = data?.data?.paginate?.current_page ?? 0
        this.pages.lastPage = data?.data?.paginate?.last_page ?? 0
        const { message, success } = data
        return { message, success }
      } catch (e) {
        const error = e as IErrors
        this.userList = []
        this.urlExportXlsx = ''
        this.userCount = null
        showAlert(showCatchError(error), 'error')
        return { message: showCatchError(error), success: false }
      }
    },
    // Read user by Document: (No set data to state)
    async getUserByDocument(params: IGetUserByDocument) {
      this.documentUserData = null
      try {
        const { data } = await executeApi().get(
          `${URL_PATH_USERS}/show-document`,
          { params }
        )
        this.documentUserData = data.data
        const { message, success } = data
        return { message, success }
      } catch (e) {
        const error = e as IErrors
        this.documentUserData = null
        return { success: false, message: showCatchError(error) }
      }
    },
    // Set data to state.
    async getUserById(id: number) {
      this.userData = null
      try {
        const { data } = await executeApi().get(`${URL_PATH_USERS}/show/${id}`)
        this.userData = data.data
        this.userRoleId = this.userData?.role.id as number
        const { message, success } = data
        return { message, success }
      } catch (e) {
        const error = e as IErrors
        const message = showCatchError(error)
        const success = false
        this.userData = null
        this.userRoleId = null
        return { success, message }
      }
    },
    // Export xlsx:
    async getXlsxFile(url: string) {
      try {
        const { data } = await executeApi().get(
          `${URL_PATH_USERS}/export?${url}`,
          { responseType: 'arraybuffer' }
        )
        return data
      } catch (e) {
        const error = e as IErrors
        const data = ''
        showAlert(showCatchError(error), 'error')
        return data
      }
    },
    // Create user:
    async createUser(bodyRequest: ICreateUpdateUser) {
      try {
        const { data } = await executeApi().post(
          `${URL_PATH_USERS}/create`,
          bodyRequest,
          {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          }
        )
        const { success, message } = data
        return { success, message }
      } catch (e) {
        const error = e as IErrors
        showAlert(showCatchError(error), 'error')
        return { success: false, message: showCatchError(error) }
      }
    },
    // Update user:
    async updateUser(id: number, bodyRequest: ICreateUpdateUser) {
      try {
        const { data } = await executeApi().post(
          `${URL_PATH_USERS}/update/${id}`,
          bodyRequest,
          {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          }
        )
        const { success, message } = data
        return { success, message }
      } catch (e) {
        const error = e as IErrors
        showAlert(showCatchError(error), 'error')
        return { success: false, message: showCatchError(error) }
      }
    },
    // Activate / Innactivate user:
    async changeUserStatus(id: number) {
      try {
        const { data } = await executeApi().put(
          `${URL_PATH_USERS}/${id}/change-status`
        )
        const { message, success } = data
        return { message, success }
      } catch (e) {
        const error = e as IErrors
        showAlert(showCatchError(error), 'error')
        return { message: showCatchError(error), success: false }
      }
    },
    // Change password user:
    async changeUserPassword(bodyRequest: any, id: number) {
      try {
        const { data } = await executeApi().put(
          `${URL_PATH_USERS}/update-password/${id}`,
          bodyRequest
        )
        const { message, success } = data
        return { message, success }
      } catch (e) {
        const error = e as IErrors
        showAlert(showCatchError(error), 'error')
        return { message: showCatchError(error), success: false }
      }
    },

    // Non request actions:
    setUserDataByDocument() {
      if (this.documentUserData) {
        this.userData = null
        this.userData = JSON.parse(JSON.stringify(this.documentUserData))
        this.documentUserData = null
      }
    },
  },
})
