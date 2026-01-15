import { defineStore } from 'pinia'
import {
  IDefinitionQuotaCounterpartPermitForm,
  IDefinitionQuotaCounterpartPermitList,
  IDefinitionQuotaCounterpartPermitRequest,
} from '@/interfaces/customs'
import { executeApi } from '@/apis'
import { useAlert, useShowError } from '@/composables'
import { URL_PATH_INVESTMENT_PORTFOLIO } from '@/constants/apis'
import { TIMEOUT_ALERT } from '@/constants/alerts'
import { IErrors } from '@/interfaces/global'

const { showAlert } = useAlert()
const { showCatchError } = useShowError()

const URL_PATH = `${URL_PATH_INVESTMENT_PORTFOLIO}/permits-quotas-counterpart`

export const useDefinitionQuotaCounterpartPermitStoreV1 = defineStore(
  'definition-quota-counterpart-permit-store-v1',
  {
    state: () => ({
      data_form: null as IDefinitionQuotaCounterpartPermitForm | null,
      data_view: null as IDefinitionQuotaCounterpartPermitForm | null,
      data_list: [] as IDefinitionQuotaCounterpartPermitList | [],
      data_pages: {
        currentPage: 0,
        lastPage: 0,
        per_page: 0,
      },
    }),
    actions: {
      async _getListAction(params: string) {
        await executeApi()
          .get(`${URL_PATH}/list?paginate=1${params}`)
          .then((response) => {
            const {
              data: {
                data: items = [],
                current_page = 0,
                last_page = 0,
                per_page = 0,
              },
            } = response.data

            this.data_list = items
            this.data_pages = {
              currentPage: current_page,
              lastPage: last_page,
              per_page: per_page,
            }

            return showAlert(
              response.data.message,
              response.data.success ? 'success' : 'error',
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

      async _getByIdAction(id: number) {
        await executeApi()
          .get(`${URL_PATH}/show/${id}`)
          .then((response) => {
            const { data: responseData, message, success } = response.data

            if (success && responseData) {
              this.data_view = { ...responseData }
            }

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
      },

      async _createAction(data: IDefinitionQuotaCounterpartPermitRequest) {
        let success = true

        await executeApi()
          .post(`${URL_PATH}/new`, data)
          .then((response) => {
            const { message } = response.data
            success = response.data?.success ?? false

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
            success = false
          })

        return success
      },

      async _updateAction(
        data: IDefinitionQuotaCounterpartPermitRequest,
        id: number
      ) {
        let success = false

        await executeApi()
          .put(`${URL_PATH}/update/${id}`, data)
          .then((response) => {
            const { message } = response.data
            success = response.data?.success ?? false

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

        return success
      },

      async _deleteAction(id: number) {
        let success = false

        await executeApi()
          .delete(`${URL_PATH}/destroy/${id}`)
          .then((response) => {
            const { message } = response.data
            success = response.data?.success ?? false

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

        return success
      },

      _setDataForm(data: IDefinitionQuotaCounterpartPermitForm | null) {
        this.data_form = data
      },

      _clearData() {
        this.data_form = null
        this.data_view = null
        this.data_list = []
        this.data_pages = {
          currentPage: 0,
          lastPage: 0,
          per_page: 0,
        }
      },
    },
  }
)
