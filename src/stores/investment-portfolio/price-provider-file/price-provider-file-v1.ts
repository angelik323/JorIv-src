// Pinia - Axios
import { defineStore } from 'pinia'
import { executeApi } from '@/apis'

// Interfaces
import {
  IPriceProviderFileFormModel,
  IPriceProviderFileFormViewModel,
  IPricesProviderFileItem,
} from '@/interfaces/customs/investment-portfolio/PriceProviderFile'
import { IErrors } from '@/interfaces/global'

// Composables
import { useAlert, useShowError } from '@/composables'

// Constants
import { URL_PATH_INVESTMENT_PORTFOLIO } from '@/constants/apis'
import { TIMEOUT_ALERT } from '@/constants/alerts'

const { showAlert } = useAlert()
const { showCatchError } = useShowError()

export const usePriceProviderFileStoreV1 = defineStore(
  'price-provider-file-store-v1',
  {
    state: () => ({
      price_provider_file: {
        currentPage: 0,
        lastPage: 0,
      },
      price_provider_file_list: [] as IPricesProviderFileItem[],
      data_information_form: null as
        | IPriceProviderFileFormModel
        | IPriceProviderFileFormViewModel
        | null,
      information_receipt_request:
        null as IPriceProviderFileFormViewModel | null,
      information_receipt_request_delete: [] as string[],
    }),

    actions: {
      async _getPriceProviderFileList(params: string) {
        this._clearData()
        await executeApi()
          .get(
            `${URL_PATH_INVESTMENT_PORTFOLIO}/price-provider/list?paginate=1${params}`
          )
          .then((response) => {
            this.price_provider_file_list = response.data?.data?.data ?? []
            this.price_provider_file.currentPage =
              response.data?.data?.current_page
            this.price_provider_file.lastPage = response.data?.data?.last_page
            showAlert(
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

      async _createPriceProviderFile(payload: object): Promise<boolean> {
        let success = false
        await executeApi()
          .post(`${URL_PATH_INVESTMENT_PORTFOLIO}/price-provider/new`, payload)
          .then((response) => {
            success = response.data.success
            showAlert(
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
        return success
      },

      async _getByIdPriceProviderFile(id: number) {
        this.information_receipt_request = null

        await executeApi()
          .get(`${URL_PATH_INVESTMENT_PORTFOLIO}/price-provider/show/${id}`)
          .then((response) => {
            if (response.data.success) {
              this.information_receipt_request = response.data.data ?? null
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

      async _updatePriceProviderFile(id: number): Promise<boolean> {
        let success = false
        await executeApi()
          .patch(
            `${URL_PATH_INVESTMENT_PORTFOLIO}/price-provider/file/toggle-status/${id}`
          )
          .then((response) => {
            success = response.data.success
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

      async _deletePriceProviderFile(params: number) {
        let success = false
        await executeApi()
          .delete(
            `${URL_PATH_INVESTMENT_PORTFOLIO}/price-provider/file/destroy/${params}`
          )
          .then((response) => {
            success = response.data.success
            showAlert(
              response.data.message,
              response.data.success ? 'success' : 'error',
              undefined,
              TIMEOUT_ALERT
            )
          })
          .catch((error) => {
            const errorData = error?.response?.data?.data ?? [
              'Ocurrió un error inesperado',
            ]
            this.information_receipt_request_delete = errorData
            showAlert(showCatchError(error), 'error', undefined, TIMEOUT_ALERT)
          })

        return success
      },

      _setDataInformationForm(data_to_set: IPriceProviderFileFormModel | null) {
        this.data_information_form = data_to_set ? { ...data_to_set } : null
      },

      _clearData() {
        this.price_provider_file_list = []
        this.price_provider_file = {
          currentPage: 0,
          lastPage: 0,
        }
        this.data_information_form = null
        this.information_receipt_request = null
        this.information_receipt_request_delete = [] as string[]
      },
    },
  }
)
