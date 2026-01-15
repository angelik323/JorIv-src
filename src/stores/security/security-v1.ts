import { defineStore } from 'pinia'
// Interfaces:
import { IErrors } from '@/interfaces/global/errorMessage'
import { useAlert, useShowError } from '@/composables'
import { executeApi } from '@/apis'
import {
  IFailedAttemptsChart,
  IUserConnectedCount,
  IUserConnectedList,
  IUserConnectionTime,
  IUsersStatus,
  IUsersStatusList,
} from '@/interfaces/customs'

// Constants
import { TIMEOUT_ALERT } from '@/constants/alerts'
import {
  URL_PATH_SECURITY_FAILED_LOGIN_ATTEMPS,
  URL_PATH_SECURITY_FAILED_LOGIN_ATTEMPS_EXPORT,
  URL_PATH_SECURITY_USERS_STATUS,
  URL_PATH_SECURITY_USERS_STATUS_LIST,
  URL_PATH_SECURITY_USERS_STATUS_EXPORT,
  URL_PATH_SECURITY_USERS_CONNECTED,
  URL_PATH_SECURITY_USER_CONNECTIONS,
  URL_PATH_SECURITY_USER_CHECKIN,
  URL_PATH_SECURITY_USER_VERSIONS_MODULES,
} from '@/constants/apis'

const { showAlert } = useAlert()
const { showCatchError } = useShowError()

// Utils
import { createAndDownloadBlobByArrayBuffer } from '@/utils'

export const useSecurityV1 = defineStore('security', {
  state: () => {
    return {
      failedAttemptsChart: [] as IFailedAttemptsChart[],

      usersStatus: [] as IUsersStatus[] | [],
      usersStatusList: [] as IUsersStatusList[] | [],

      userConnectedCount: null as IUserConnectedCount | null,
      userConnectedList: [] as IUserConnectedList[] | [],

      userConnectionTime: [] as IUserConnectionTime[] | [],

      checkinTime: [],
      checkinTimeList: [],

      versionControlList: [],

      pages: {
        currentPage: 1,
        lastPage: 1,
      },
    }
  },
  actions: {
    // Failed Attempts
    async _getFailedAttempts(
      state: {
        'filter[startDate]': number | string | null
        'filter[endDate]': string | null
      } | null = null
    ): Promise<boolean> {
      let success = false
      this.failedAttemptsChart = []
      await executeApi()
        .get(URL_PATH_SECURITY_FAILED_LOGIN_ATTEMPS, {
          params: state,
        })
        .then((response) => {
          success = response.data.success
          this.failedAttemptsChart = response.data.data ?? []

          showAlert(
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
    async _exportFailedAttempts(
      state: {
        'filter[startDate]': number | string | null
        'filter[endDate]': string | null
      } | null = null
    ) {
      await executeApi()
        .get(URL_PATH_SECURITY_FAILED_LOGIN_ATTEMPS_EXPORT, {
          params: state,
          responseType: 'arraybuffer',
        })
        .then((response) => {
          const stream = response.data
          if (stream.success === false) return
          createAndDownloadBlobByArrayBuffer(
            stream,
            'Listado_intentos_fallidos_de_ingreso'
          )
        })
        .catch((error) => {
          showAlert(showCatchError(error), 'error', undefined, TIMEOUT_ALERT)
        })
    },
    // Users Status
    async _getUsersStatus(): Promise<boolean> {
      let success = false
      this.usersStatus = []
      await executeApi()
        .get(URL_PATH_SECURITY_USERS_STATUS)
        .then((response) => {
          success = response.data.success
          this.usersStatus = response.data.data ?? []
          showAlert(
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
    async _getUsersStatusID(
      params: {
        [key: string]: string | number | null | undefined
        status_id?: number | string | null
        page?: number
      } | null
    ) {
      this.usersStatusList = []
      await executeApi()
        .get(`${URL_PATH_SECURITY_USERS_STATUS_LIST}`, {
          params: params ? params : {},
        })
        .then((response) => {
          const {
            data: { data: users = [], current_page = 0, last_page = 0 },
          } = response.data

          this.usersStatusList = users
          this.pages.currentPage = current_page
          this.pages.lastPage = last_page

          showAlert(
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
    async _exportUsersStatus(params: {
      status_id: number | string | null
      page?: number
    }) {
      await executeApi()
        .get(URL_PATH_SECURITY_USERS_STATUS_EXPORT, {
          params,
          responseType: 'arraybuffer',
        })
        .then((response) => {
          const stream = response.data
          if (stream.success === false) return
          createAndDownloadBlobByArrayBuffer(stream, 'Listado_estado_usuarios')
        })
        .catch((error) => {
          showAlert(showCatchError(error), 'error', undefined, TIMEOUT_ALERT)
        })
    },

    // Connected Users
    async _getUserConnected() {
      this.userConnectedCount = null
      await executeApi()
        .get(`${URL_PATH_SECURITY_USERS_CONNECTED}/count`)
        .then(({ data }) => {
          this.userConnectedCount = data?.data ?? []
        })
        .catch((error) => {
          showAlert(showCatchError(error), 'error', undefined, TIMEOUT_ALERT)
        })
    },

    async _getConnectedUsersList(
      params: {
        [key: string]: string | number | null | undefined
        page?: number
      } | null
    ) {
      this.userConnectedList = []
      await executeApi()
        .get(`${URL_PATH_SECURITY_USERS_CONNECTED}/list`, {
          params,
        })
        .then(({ data }) => {
          this.userConnectedList = data?.data?.active_users?.data ?? []
          this.pages.currentPage = data?.data?.active_users?.current_page ?? 0
          this.pages.lastPage = data?.data?.active_users?.last_page ?? 0
        })
        .catch((error) => {
          showAlert(showCatchError(error), 'error', undefined, TIMEOUT_ALERT)
        })
    },
    async _exportConnectedUsers() {
      try {
        const { data } = await executeApi().get(
          `${URL_PATH_SECURITY_USERS_CONNECTED}/export`,
          {
            responseType: 'arraybuffer',
          }
        )
        return data
      } catch (e) {
        const error = e as IErrors
        showAlert(showCatchError(error), 'error')
        return { message: showCatchError(error), success: false }
      }
    },

    // User Connection Time
    async _getUserConnectionTime(
      state: {
        'filter[startDate]': number | string | null
        'filter[endDate]': string | null
        'filter[search]': string | null
        page?: number
      } | null = null
    ) {
      this.userConnectionTime = []
      try {
        const { data } = await executeApi().get(
          `${URL_PATH_SECURITY_USER_CONNECTIONS}`,
          {
            params: state,
          }
        )
        const {
          data: { data: items = [], current_page = 0, last_page = 0 },
          message,
          success,
        } = data

        this.userConnectionTime = items
        this.pages.currentPage = current_page
        this.pages.lastPage = last_page
        return { message, success }
      } catch (e) {
        const error = e as IErrors
        showAlert(showCatchError(error), 'error')
        return { message: showCatchError(error), success: false }
      }
    },
    async _exportUserConnectionTime(
      state: {
        'filter[startDate]': number | string | null
        'filter[endDate]': string | null
        'filter[search]': string | null
        page?: number
      } | null = null
    ) {
      await executeApi()
        .get(`${URL_PATH_SECURITY_USER_CONNECTIONS}/export`, {
          params: state,
          responseType: 'arraybuffer',
        })
        .then((response) => {
          createAndDownloadBlobByArrayBuffer(
            response.data,
            'Listado_tiempo_de_conexion_de_usuarios'
          )
        })
        .catch((error) => {
          showAlert(showCatchError(error), 'error', undefined, TIMEOUT_ALERT)
        })
    },

    // Checkin Time
    async _getCheckinTimes(
      state: {
        'filter[startDate]': number | string | null
        'filter[endDate]': string | null
        'filter[startHour]': string | null
        'filter[endHour]': string | null
      } | null = null
    ): Promise<boolean> {
      this.checkinTime = []
      let success = false
      await executeApi()
        .get(`${URL_PATH_SECURITY_USER_CHECKIN}`, {
          params: state,
        })
        .then((response) => {
          success = response.data.success
          this.checkinTime = response.data.data ?? []
          this.pages.currentPage = response.data.current_page ?? 0
          this.pages.lastPage = response.data.last_page ?? 0

          showAlert(
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
    async _getCheckinTimesList(
      state: {
        page?: number
        'filter[date]': number | string | null
        'filter[startHour]': string | null
      } | null = null
    ) {
      this.checkinTimeList = []
      await executeApi()
        .get(`${URL_PATH_SECURITY_USER_CHECKIN}/list`, {
          params: state,
        })
        .then((response) => {
          this.checkinTimeList = response.data.data.data ?? []
          this.pages.currentPage = response.data.data?.current_page ?? 0
          this.pages.lastPage = response.data.data?.last_page ?? 0

          showAlert(
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
    async _exportCheckInTimes(
      state: {
        'filter[startHour]': string | null
        'filter[date]': string | null
      } | null = null
    ) {
      await executeApi()
        .get(`${URL_PATH_SECURITY_USER_CHECKIN}/export`, {
          params: state,
          responseType: 'arraybuffer',
        })
        .then((response) => {
          createAndDownloadBlobByArrayBuffer(
            response.data,
            'Listado_de_usuarios_que_ingresan'
          )
        })
        .catch((error) => {
          showAlert(showCatchError(error), 'error', undefined, TIMEOUT_ALERT)
        })
    },

    async _getVersionControlList(params: string = '') {
      this.versionControlList = []
      await executeApi()
        .get(
          `${URL_PATH_SECURITY_USER_VERSIONS_MODULES}?paginate=true${params}`
        )
        .then((response) => {
          if (response.data.success) {
            this.versionControlList = response.data?.data?.data ?? []
            this.pages.currentPage = response.data?.data?.current_page ?? 1
            this.pages.lastPage = response.data?.data?.last_page ?? 1
          }
          return showAlert(
            response.data.message,
            response.data.success ? 'success' : 'error',
            undefined,
            TIMEOUT_ALERT
          )
        })
        .catch((error) => {
          showAlert(showCatchError(error), 'error')
        })
    },
    async _exportXlsxVersionControlList() {
      const nameFile = `Control_de_versiones_de_Modulos`
      await executeApi()
        .get(`${URL_PATH_SECURITY_USER_VERSIONS_MODULES}/export`, {
          responseType: 'arraybuffer',
        })
        .then((response) => {
          createAndDownloadBlobByArrayBuffer(
            response.data,
            nameFile,
            undefined,
            true
          )
        })
        .catch((error) => {
          showAlert(showCatchError(error), 'error', undefined, TIMEOUT_ALERT)
        })
    },
  },
})
