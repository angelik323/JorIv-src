import { defineStore } from 'pinia'
import { executeApi } from '@/apis'
import { useAlert, useShowError } from '@/composables'
import { URL_PATH_INVESTMENT_PORTFOLIO } from '@/constants/apis'
import { TIMEOUT_ALERT } from '@/constants/alerts'
import { IErrors } from '@/interfaces/global'
import {
  IUploadFilesInvestmentValuationForm,
  IUploadFilesInvestmentValuationListFilesResponse,
  IUploadFilesInvestmentValuationCheckFileUploadStatus,
} from '@/interfaces/customs'

const { showAlert } = useAlert()
const { showCatchError } = useShowError()

const URL_PATH = `${URL_PATH_INVESTMENT_PORTFOLIO}/upload-files-investment-valuation`

export const useUploadFilesInvestmentValuationStoreV1 = defineStore(
  'upload-files-investment-valuation-store-v1',
  {
    state: () => ({
      upload_files_investment_valuation_form:
        null as IUploadFilesInvestmentValuationForm | null,
      group_charging_id: null as number | null,
      upload_files_investment_valuation_list_files:
        [] as IUploadFilesInvestmentValuationListFilesResponse[],
      check_file_upload_status_list:
        [] as IUploadFilesInvestmentValuationCheckFileUploadStatus[],
    }),

    actions: {
      async _getFilesTypesCheckbox(params: string) {
        this._clearData()

        await executeApi()
          .get(`${URL_PATH}/list-files/${params}`)
          .then((response) => {
            this.upload_files_investment_valuation_list_files =
              response.data.data

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

      async _getCheckFileUploadStatus(): Promise<void> {
        await executeApi()
          .get(`${URL_PATH}/check-file-upload-status/${this.group_charging_id}`)
          .then((response) => {
            const { success, data, message } = response.data

            if (success) {
              if (!data || data.length === 0) {
                showAlert(
                  'No se encontraron registros en el seguimiento de la carga.',
                  'error',
                  undefined,
                  TIMEOUT_ALERT
                )
                this.check_file_upload_status_list = []
                return
              }

              this.check_file_upload_status_list = data
              showAlert(message, 'success', undefined, TIMEOUT_ALERT)
            }
          })
          .catch((e) => {
            const error = e as IErrors
            const message = showCatchError(error)
            showAlert(message, 'error', undefined, TIMEOUT_ALERT)
          })
      },

      async _createUploadFiles(data: FormData) {
        let success = false

        await executeApi()
          .post(`${URL_PATH}/upload-files`, data, {
            headers: { 'Content-Type': 'multipart/form-data' },
          })
          .then((response) => {
            const { message, data } = response.data
            success = response.data?.success ?? false

            if (data?.group_charging_id) {
              this.group_charging_id = data.group_charging_id
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

        return success
      },

      _setUploadFilesInvestmentValuationListFiles(
        data: IUploadFilesInvestmentValuationListFilesResponse[] | null
      ) {
        this.upload_files_investment_valuation_list_files = data || []
      },

      _setUploadFilesInvestmentValuationForm(
        data: IUploadFilesInvestmentValuationForm | null
      ) {
        this.upload_files_investment_valuation_form = data || null
      },

      _clearData() {
        this.upload_files_investment_valuation_form = null
        this.group_charging_id = null
        this.upload_files_investment_valuation_list_files = []
        this.check_file_upload_status_list = []
      },
    },
  }
)
