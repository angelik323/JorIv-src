// Vue - pinia
import { defineStore } from 'pinia'
import { executeApi } from '@/apis'

// Interfaces
import {
  ICollectiveInvestmentFund,
  IOperationPermission,
  IOfficePermission,
  IOfficeItem,
  IPagination,
} from '@/interfaces/customs/fics/ConfigureUserPermissions'
import { IErrors } from '@/interfaces/global'

// Composables
import { useAlert, useShowError } from '@/composables'

// Constants
import { TIMEOUT_ALERT } from '@/constants/alerts'
import { URL_PATH_FICS } from '@/constants/apis'

const URL_PATH = `${URL_PATH_FICS}/entity-permissions`

export const useConfigureUserPermissionsFicsStoreV1 = defineStore(
  'configure-user-permissions-fics-store-v1',
  {
    state: () => ({
      version: 'v1',
      collective_investment_fund_list: [] as ICollectiveInvestmentFund[],
      collective_investment_fund_pages: {
        currentPage: 1,
        lastPage: 1,
      } as IPagination,
      office_permission_list: [] as IOfficePermission[],
      office_permission_pages: { currentPage: 1, lastPage: 1 } as IPagination,
      operation_permission_list: [] as IOperationPermission[],
      operation_permission_pages: {
        currentPage: 1,
        lastPage: 1,
      } as IPagination,
      offices_list: [] as IOfficeItem[],
      offices_list_pages: {
        currentPage: 1,
        lastPage: 1,
      } as IPagination,
    }),

    actions: {
      async assignFundPermission(user_id: number, resources_id: number[]) {
        let isSuccess = false

        const { showAlert } = useAlert()
        const { showCatchError } = useShowError()

        await executeApi()
          .post(`${URL_PATH}/funds/assign`, { user_id, resources_id })
          .then((response) => {
            const { message, success } = response.data

            isSuccess = success ?? false
            return showAlert(
              message ?? 'Permiso asignado correctamente',
              success ? 'success' : 'error',
              undefined,
              TIMEOUT_ALERT
            )
          })
          .catch((e) => {
            const error = e as IErrors
            const message = showCatchError(error)
            showAlert(message, 'error', undefined, TIMEOUT_ALERT)
          })

        return isSuccess
      },

      async assignOfficePermission(user_id: number, resources_id: number[]) {
        let isSuccess = false

        const { showAlert } = useAlert()
        const { showCatchError } = useShowError()

        await executeApi()
          .post(`${URL_PATH}/offices/assign`, { user_id, resources_id })
          .then((response) => {
            const { message, success } = response.data

            isSuccess = success ?? false
            return showAlert(
              message ?? 'Permiso asignado correctamente',
              success ? 'success' : 'error',
              undefined,
              TIMEOUT_ALERT
            )
          })
          .catch((e) => {
            const error = e as IErrors
            const message = showCatchError(error)
            showAlert(message, 'error', undefined, TIMEOUT_ALERT)
          })

        return isSuccess
      },

      async _listActionFundsPermission(params: string) {
        this.collective_investment_fund_list = []

        const { showAlert } = useAlert()
        const { showCatchError } = useShowError()

        await executeApi()
          .get(`${URL_PATH}/collective_investment_fund?${params}`)
          .then((response) => {
            const {
              data: { data: items, current_page, last_page, per_page, total },
              message,
              success,
            } = response.data

            if (success) {
              this.collective_investment_fund_list = items ?? []
              this.collective_investment_fund_pages = {
                currentPage: current_page ?? 1,
                lastPage: last_page ?? 1,
                rowsPerPage: per_page ?? 20,
                rowsNumber: total ?? 0,
              }
            }

            return showAlert(
              message,
              success ? 'success' : 'error',
              undefined,
              TIMEOUT_ALERT
            )
          })
          .catch((e) => {
            const error = e as IErrors
            const message = showCatchError(error)
            showAlert(message, 'error', undefined, TIMEOUT_ALERT)
          })
      },

      async _listActionOfficesPermission(params: string) {
        this.office_permission_list = []

        const { showAlert } = useAlert()
        const { showCatchError } = useShowError()

        await executeApi()
          .get(`${URL_PATH}/operation_office?${params}`)
          .then((response) => {
            const {
              data: { data: items, current_page, last_page, per_page, total },
              message,
              success,
            } = response.data

            if (success) {
              this.office_permission_list = items ?? []
              this.office_permission_pages = {
                currentPage: current_page ?? 1,
                lastPage: last_page ?? 1,
                rowsPerPage: per_page ?? 20,
                rowsNumber: total ?? 0,
              }
            }

            return showAlert(
              message,
              success ? 'success' : 'error',
              undefined,
              TIMEOUT_ALERT
            )
          })
          .catch((e) => {
            const error = e as IErrors
            const message = showCatchError(error)
            showAlert(message, 'error', undefined, TIMEOUT_ALERT)
          })
      },

      async _listActionOperationType(params: string) {
        this.operation_permission_list = []

        const { showAlert } = useAlert()
        const { showCatchError } = useShowError()

        await executeApi()
          .get(`${URL_PATH}/operation_type?${params}`)
          .then((response) => {
            const {
              data: { data: items, current_page, last_page, per_page, total },
              message,
              success,
            } = response.data

            if (success) {
              this.operation_permission_list = items ?? []
              this.operation_permission_pages = {
                currentPage: current_page ?? 1,
                lastPage: last_page ?? 1,
                rowsPerPage: per_page ?? 20,
                rowsNumber: total ?? 0,
              }
            }

            return showAlert(
              message,
              success ? 'success' : 'error',
              undefined,
              TIMEOUT_ALERT
            )
          })
          .catch((e) => {
            const error = e as IErrors
            const message = showCatchError(error)
            showAlert(message, 'error', undefined, TIMEOUT_ALERT)
          })
      },

      async _listOffices(params: string) {
        this.offices_list = []

        const { showAlert } = useAlert()
        const { showCatchError } = useShowError()

        await executeApi()
          .get(`${URL_PATH_FICS}/operating-offices/offices?paginate=1${params}`)
          .then((response) => {
            const {
              data: { data: items, current_page, last_page, per_page, total },
              message,
              success,
            } = response.data

            if (success) {
              this.offices_list = items ?? []
              this.offices_list_pages = {
                currentPage: current_page ?? 1,
                lastPage: last_page ?? 1,
                rowsPerPage: per_page ?? 10,
                rowsNumber: total ?? 0,
              }
            }

            return showAlert(
              message,
              success ? 'success' : 'error',
              undefined,
              TIMEOUT_ALERT
            )
          })
          .catch((e) => {
            const error = e as IErrors
            const message = showCatchError(error)
            showAlert(message, 'error', undefined, TIMEOUT_ALERT)
          })
      },

      async _deletePermission(permitAssignmentId: number) {
        let isSuccess = false

        const { showAlert } = useAlert()
        const { showCatchError } = useShowError()

        await executeApi()
          .delete(`${URL_PATH}/${permitAssignmentId}`)
          .then((response) => {
            const { message, success } = response.data

            isSuccess = success

            showAlert(
              message,
              success ? 'success' : 'error',
              undefined,
              TIMEOUT_ALERT
            )
          })
          .catch((e) => {
            const error = e as IErrors
            const message = showCatchError(error)
            showAlert(message, 'error', undefined, TIMEOUT_ALERT)
          })

        return isSuccess
      },

      async _updateStatus(permitAssignmentId: number) {
        let isSuccess = false

        const { showAlert } = useAlert()
        const { showCatchError } = useShowError()

        await executeApi()
          .patch(`${URL_PATH}/${permitAssignmentId}/toggle-status`)
          .then((response) => {
            const { message, success } = response.data

            isSuccess = success ?? false

            showAlert(
              message,
              success ? 'success' : 'error',
              undefined,
              TIMEOUT_ALERT
            )
          })
          .catch((e) => {
            const error = e as IErrors
            const message = showCatchError(error)
            showAlert(message, 'error', undefined, TIMEOUT_ALERT)
          })

        return isSuccess
      },
    },
  }
)
