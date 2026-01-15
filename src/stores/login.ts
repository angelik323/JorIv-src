import { IMenu, IUserData, IUser } from '@/interfaces/global'
import { defineStore } from 'pinia'
import { useAlert, useShowError } from '@/composables'
import { executeApi, executeApiLogin } from '@/apis'
import {
  URL_PATH_SECURITY_LOGIN,
  URL_PATH_SECURITY_LOGOUT,
  URL_PATH_SECURITY_LDAP,
} from '@/constants/apis'
import { TIMEOUT_ALERT, TIME_CODE } from '@/constants/alerts'
// import { MENUS } from '@/constants/menu'

const { showAlert } = useAlert()
const { showCatchError } = useShowError()

export const useLogin = defineStore('login-auth', {
  state: () => {
    return {
      token: null as string | null,
      loggedUser: null as IUserData | null,
      firstLogin: false as boolean,
      contador_sms: TIME_CODE,
      contador_sms_id: null as NodeJS.Timeout | number | null,
      isAdmin: false,
      security_question: null as { reminder: string; question: string } | null,
      menus: [] as IMenu[],
      userProfileInformation: null as IUser | null,
      session_timeout: 10000 as number,
    }
  },
  actions: {
    async _loginAction(data: object): Promise<boolean> {
      let success = false
      await executeApiLogin()
        .post(URL_PATH_SECURITY_LOGIN, data)
        .then((response) => {
          success = response.data.success
          if (response.data.success) {
            this.token = response.data?.data?.authorization?.token ?? null
            this.menus = response.data?.data?.menu ?? []
            // this.menus = MENUS
            this.firstLogin =
              response.data?.data?.user?.first_login === '1' ? true : false
            this.loggedUser = response.data?.data ?? null
            this.isAdmin = response.data.data.role === 'Administrador'
            this.session_timeout = response.data.data.session_timeout
            return showAlert(
              response.data.message,
              'success',
              undefined,
              TIMEOUT_ALERT
            )
          }
          return showAlert(
            response.data.message,
            'error',
            undefined,
            TIMEOUT_ALERT
          )
        })
        .catch((error) => {
          showAlert(showCatchError(error), 'error', undefined, TIMEOUT_ALERT)
        })

      return success
    },

    async _loginLdapAction(data: object): Promise<boolean> {
      let success = false
      await executeApiLogin()
        .post(URL_PATH_SECURITY_LDAP, data)
        .then((response) => {
          success = response.data.success
          if (response.data.success) {
            this.token = response.data?.data?.authorization?.token ?? null
            this.menus = response.data?.data?.menu ?? []
            // this.menus = MENUS
            this.loggedUser = response.data?.data ?? null
            this.isAdmin = response.data.data.role === 'Administrador'
            this.session_timeout = response.data.data.session_timeout

            return showAlert(
              response.data.message,
              'success',
              undefined,
              TIMEOUT_ALERT
            )
          }
          return showAlert(
            response.data.message,
            'error',
            undefined,
            TIMEOUT_ALERT
          )
        })
        .catch((error) => {
          showAlert(showCatchError(error), 'error', undefined, TIMEOUT_ALERT)
        })

      return success
    },

    async _logoutAction(): Promise<boolean> {
      let success = false
      await executeApi()
        .post(URL_PATH_SECURITY_LOGOUT)
        .then((response) => {
          success = response.data.success

          this.token = null
          this.loggedUser = null
          this.firstLogin = false
          localStorage.removeItem('token')
          localStorage.clear()
          useLogin().$reset()

          return showAlert(
            response.data.message,
            response.data?.success ? 'success' : 'error',
            undefined,
            TIMEOUT_ALERT
          )
        })
        .catch((error) => {
          showAlert(showCatchError(error), 'error', undefined, TIMEOUT_ALERT)
        })

      return success
    },

    _updateSessionTimeout(timeout: number) {
      this.session_timeout = timeout * 60 * 1000
    },

    _startCountdownVerifySMSOTP() {
      if (this.contador_sms <= 0) {
        this.contador_sms_id = null
        this.contador_sms = TIME_CODE
      }

      this.contador_sms_id = setInterval(() => {
        this.contador_sms--
        if (this.contador_sms_id && Number(this.contador_sms) <= 0) {
          clearInterval(this.contador_sms_id)
          this.contador_sms_id = null
          this.contador_sms = 0
        }
      }, 1000)
    },

    _restartCountdownVerifySMSOTP() {
      this._stopCountdownVerifySMSOTP()
      this.contador_sms = TIME_CODE
      this._startCountdownVerifySMSOTP()
    },

    _stopCountdownVerifySMSOTP() {
      if (this.contador_sms_id) {
        clearInterval(this.contador_sms_id)
        this.contador_sms_id = null
        this.contador_sms = TIME_CODE
      }
    },
    // async _securityDataAction(email: string): Promise<{
    //   success: boolean
    //   data: { question: string; reminder: string; noMethodAuth: boolean }
    // }> {
    //   let success = false
    //   let reminder = ''
    //   let question = ''
    //   let noMethodAuth = false
    //   await executeApiLogin()
    //     .get(${URL_PATH_RECOVERY}/security-data?email=${email})
    //     .then((response) => {
    //       success = response.data.success
    //       if (response.data.success) {
    //         if (response.data.data.recover_type === 'email_code') {
    //           noMethodAuth = true
    //         } else {
    //           reminder = response.data.data.security_question_reminder ?? ''
    //           question = response.data.data.securityQuestion.question ?? ''
    //         }
    //       }
    //     })
    //     .catch((error) => {
    //       showAlert(showCatchError(error), 'error', undefined, TIMEOUT_ALERT)
    //     })

    //   return { success, data: { reminder, question, noMethodAuth } }https://dev.azure.com/Linktic/384%20-%20CORE%20FIDUPREVISORA/_boards
    // },

    // async _recoveryPasswordAction(
    //   params: object
    // ): Promise<{ success: boolean; password: string }> {
    //   let success = false
    //   let password = ''
    //   await executeApiLogin()
    //     .post(${URL_PATH_RECOVERY}/password, params)
    //     .then((response) => {
    //       success = response.data.success
    //       if (response.data.success) {
    //         password = response.data.data.password
    //       }
    //     })
    //     .catch((error) => {
    //       showAlert(showCatchError(error), 'error', undefined, TIMEOUT_ALERT)
    //     })

    //   return { success, password }
    // },

    // async _recoveryPasswordEmailAction(
    //   params: object
    // ): Promise<{ success: boolean; password: string }> {
    //   let success = false
    //   let password = ''
    //   await executeApiLogin()
    //     .post(${URL_PATH_RECOVERY_BY_EMAIL}, params)
    //     .then((response) => {
    //       success = response.data.success
    //       if (response.data.success) {
    //         password = response.data.data.password
    //       }
    //     })
    //     .catch((error) => {
    //       showAlert(showCatchError(error), 'error', undefined, TIMEOUT_ALERT)
    //     })

    //   return { success, password }
    // },

    // async _changePassword(params: {
    //   password: string
    //   password_confirmation: string
    // }): Promise<boolean> {
    //   let success = false
    //   await executeApi()
    //     .put(${URL_PATH_PROFILE}/update-password, params)
    //     .then((response) => {
    //       success = response.data.success
    //       if (response.data.success) {
    //         this.firstLogin = false
    //         return showAlert(
    //           response.data.message,
    //           'success',
    //           undefined,
    //           TIMEOUT_ALERT
    //         )
    //       }

    //       return showAlert(
    //         response.data.message,
    //         'error',
    //         undefined,
    //         TIMEOUT_ALERT
    //       )
    //     })
    //     .catch((error) => {
    //       showAlert(showCatchError(error), 'error', undefined, TIMEOUT_ALERT)
    //     })

    //   return success
    // },

    // async _updateMyProfile(params: object) {
    //   await executeApi()
    //     .post(${URL_PATH_PROFILE}/update, params)
    //     .then((response) => {
    //       if (response.data.success) {
    //         if (this.loggedUser) {
    //           this.loggedUser.user = response.data.data
    //         }
    //         return showAlert(
    //           response.data.message,
    //           'success',
    //           undefined,
    //           TIMEOUT_ALERT
    //         )
    //       }
    //       return showAlert(
    //         response.data.message,
    //         'error',
    //         undefined,
    //         TIMEOUT_ALERT
    //       )
    //     })
    //     .catch((error) => {
    //       showAlert(showCatchError(error), 'error', undefined, TIMEOUT_ALERT)
    //     })
    // },

    // async _updateMyProfilePhoto(params: object): Promise<boolean> {
    //   let success = false
    //   await executeApi()
    //     .post(${URL_PATH_PROFILE}/update-photo, params, CONFIG)
    //     .then((response) => {
    //       success = response.data.success
    //       if (response.data.success) {
    //         if (this.loggedUser) {
    //           this.loggedUser.user = response.data.data
    //         }
    //         return showAlert(
    //           response.data.message,
    //           'success',
    //           undefined,
    //           TIMEOUT_ALERT
    //         )
    //       }
    //       return showAlert(
    //         response.data.message,
    //         'error',
    //         undefined,
    //         TIMEOUT_ALERT
    //       )
    //     })
    //     .catch((error) => {
    //       showAlert(showCatchError(error), 'error', undefined, TIMEOUT_ALERT)
    //     })

    //   return success
    // },

    // async _getProfileInformation() {
    //   await executeApi()
    //     .get(${URL_PATH_PROFILE})
    //     .then((response) => {
    //       if (response.data.success) {
    //         this.userProfileInformation = response.data.data
    //       }

    //       return showAlert(
    //         response.data.message,
    //         response.data.success ? 'success' : 'error',
    //         undefined,
    //         TIMEOUT_ALERT
    //       )
    //     })
    //     .catch((error) => {
    //       showAlert(showCatchError(error), 'error', undefined, TIMEOUT_ALERT)
    //     })
    // },
  },
  persist: true,
})
