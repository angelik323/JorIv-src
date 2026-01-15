// pinia
import { defineStore } from 'pinia'

// interfaces
import {
  IAccountingConfigFileValidation,
  IAccountingConfigurationCreate,
  IAccountingConfigurationForm,
  IAccountingConfigurationItemList,
} from '@/interfaces/customs/fixed-assets/v1/AcountingConfiguration'
import { IErrors } from '@/interfaces/global'

// composables
import { useAlert, useShowError } from '@/composables'
import { useUtils } from '@/composables/useUtils'
import { executeApi } from '@/apis'

// constants
import { URL_PATH_FIXED_ASSETS } from '@/constants/apis'

const TIMEOUT_ALERT = 3000

const { showAlert } = useAlert()
const { showCatchError } = useShowError()
const { getNameBlob, downloadBlobXlxx } = useUtils()

export const useAccountingConfigurationV1 = defineStore(
  'accounting-configuration-v1',
  {
    state: () => ({
      version: 'v1',
      accounting_configuration_list: [] as IAccountingConfigurationItemList[],
      accounting_configuration_pages: {
        currentPage: 0,
        lastPage: 0,
      },
      headerPropsDefault: {
        title: 'Configuración contable de activos fijos y bienes',
        breadcrumbs: [
          {
            label: 'Inicio',
            route: 'HomeView',
          },
          {
            label: 'Activos fijos',
          },
          {
            label: 'Configuración contable de activos fijos y bienes',
            route: 'AccountingConfigurationList',
          },
        ],
      },
    }),
    actions: {
      _clearData() {
        this.accounting_configuration_list = []
        this.accounting_configuration_pages = {
          currentPage: 0,
          lastPage: 0,
        }
      },
      async _getAccountingConfigurationList(params: string): Promise<void> {
        this._clearData()

        await executeApi()
          .get(`${URL_PATH_FIXED_ASSETS}/configuration-accountings?${params}`)
          .then((response) => {
            const {
              data: items = [],
              message,
              success,
              current_page,
              last_page,
            } = response.data
            this.accounting_configuration_list = items
            this.accounting_configuration_pages = {
              currentPage: current_page,
              lastPage: last_page,
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

      async _getAccountingConfigurationById(
        id: number
      ): Promise<IAccountingConfigurationForm | null> {
        let responseData: IAccountingConfigurationForm | null = null
        await executeApi()
          .get(`${URL_PATH_FIXED_ASSETS}/configuration-accountings/${id}`)
          .then((response) => {
            const { data, message, success } = response.data
            showAlert(
              message,
              success ? 'success' : 'error',
              undefined,
              TIMEOUT_ALERT
            )
            if (success) {
              responseData = data
            }
          })
          .catch((e) => {
            const error = e as IErrors
            const message = showCatchError(error)
            showAlert(message, 'error', undefined, TIMEOUT_ALERT)
          })

        return responseData
      },

      async _createAccountingConfiguration(
        payload: IAccountingConfigurationCreate
      ): Promise<boolean> {
        let success = false
        await executeApi()
          .post(`${URL_PATH_FIXED_ASSETS}/configuration-accountings`, payload)
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
      async _updateAccountingConfiguration(
        payload: Partial<IAccountingConfigurationCreate> | null,
        id: number
      ): Promise<boolean> {
        let success = false
        await executeApi()
          .put(
            `${URL_PATH_FIXED_ASSETS}/configuration-accountings/${id}`,
            payload
          )
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

      async _deleteAccountingConfiguration(id: number): Promise<boolean> {
        let success = false
        await executeApi()
          .delete(`${URL_PATH_FIXED_ASSETS}/configuration-accountings/${id}`)
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

      async _downloadExcelAccountingConfigTemplate() {
        await executeApi()
          .get(
            `${URL_PATH_FIXED_ASSETS}/configuration-accountings/import/template`,
            {
              responseType: 'blob',
            }
          )
          .then((response) => {
            const blob = new Blob([response.data], {
              type: response.headers['content-type'],
            })

            const name = getNameBlob(response)
            downloadBlobXlxx(blob, name)
          })
          .catch((e) => {
            const error = e as IErrors
            const message = showCatchError(error)
            showAlert(message, 'error', undefined, TIMEOUT_ALERT)
          })
      },

      async _validateAccountingConfigFile(file: File) {
        let responseData: IAccountingConfigFileValidation = {
          name: '',
          status_id: null,
          size: 0,
          has_errors: false,
          id: null,
          validated_rows: [],
        }

        const formData = new FormData()
        formData.append('file', file)

        await executeApi()
          .post(
            `${URL_PATH_FIXED_ASSETS}/configuration-accountings/import/process`,
            formData,
            {
              headers: {
                'Content-Type': 'multipart/form-data',
              },
            }
          )
          .then((response) => {
            responseData = response.data.data
          })
          .catch((e) => {
            const error = e as IErrors
            const message = showCatchError(error)
            showAlert(message, 'error', undefined, TIMEOUT_ALERT)
          })

        return responseData
      },

      async _downloadExcelAccountingConfigErrorsFile(batch_id: string) {
        await executeApi()
          .post(
            `${URL_PATH_FIXED_ASSETS}/configuration-accountings/import/${batch_id}/errors`,
            {
              responseType: 'blob',
            }
          )
          .then((response) => {
            const blob = new Blob([response.data], {
              type: response.headers['content-type'],
            })

            const name = getNameBlob(response)
            downloadBlobXlxx(blob, name)
          })
          .catch((e) => {
            const error = e as IErrors
            const message = showCatchError(error)
            showAlert(message, 'error', undefined, TIMEOUT_ALERT)
          })
      },

      async _createAccountingConfigBulk(batchId: string) {
        let success = false
        await executeApi()
          .post(
            `${URL_PATH_FIXED_ASSETS}/configuration-accountings/import/${batchId}`
          )
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
    },
  }
)
