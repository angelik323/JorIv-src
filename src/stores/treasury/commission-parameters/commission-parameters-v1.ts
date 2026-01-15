import { defineStore } from 'pinia'
import { executeApi } from '@/apis'

// Interfaces
import { IErrors } from '@/interfaces/global'
import { ICommissionParametersForm, ICommissionParametersList} from '@/interfaces/customs/treasury/CommissionParameters'

// Composables
import { useAlert, useShowError } from '@/composables'

// Constants
import { URL_PATH_TREASURIES } from '@/constants/apis'
import { TIMEOUT_ALERT } from '@/constants/alerts'

const { showAlert } = useAlert()
const { showCatchError } = useShowError()

export const useCommissionParametersV1 = defineStore(
  'commission-parameters-v1',
  {
    state: () => ({
      version: 'v1',
      commission_accounting_parameters_list: [] as ICommissionParametersList[],
      commission_accounting_parameters_request: null as ICommissionParametersList | null,
      commission_accounting_parameters_pages: {
        currentPage: 0,
        lastPage: 0,
      },
    }),

    actions: {
      async _getCommissionAccountingParameters(params: string = '', pages: number = 20) {
        this._clearData()

        await executeApi()
          .get(`${URL_PATH_TREASURIES}/v2/commission-accounting-parameters?paginate=1&rows=${pages}&${params}`)
          .then((response) => {
            const {
              data: { data: items = [], current_page = 0, last_page = 0 },
              message,
              success,
            } = response.data

            this.commission_accounting_parameters_list = items.map(
              (item: ICommissionParametersList) => ({
                ...item,
              })
            )
            this.commission_accounting_parameters_pages.currentPage =
              current_page
            this.commission_accounting_parameters_pages.lastPage = last_page

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

      async _getByIdCommissionAccountingParameters(id: number) {
        this._clearData()

        await executeApi()
          .get(`${URL_PATH_TREASURIES}/v2/commission-accounting-parameters/${id}`)
          .then((response) => {
            if (response.data.success) {
              const res: ICommissionParametersList = response.data?.data
              if (res) {
                this.commission_accounting_parameters_request = res
              }
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

      async _createCommissionAccountingParameters(data: Partial<ICommissionParametersForm>) {
        let success = false

        await executeApi()
          .post(`${URL_PATH_TREASURIES}/v2/commission-accounting-parameters`, data)
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

      async _editCommissionAccountingParameters(data: Partial<ICommissionParametersForm>, id: number) {
        let success = false

        await executeApi()
          .put(`${URL_PATH_TREASURIES}/v2/commission-accounting-parameters/${id}`,data)
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

      _clearData() {
        this.commission_accounting_parameters_list = []
        this.commission_accounting_parameters_request = null
        this.commission_accounting_parameters_pages = {
          currentPage: 0,
          lastPage: 0,
        }
      },
    },
  }
)
