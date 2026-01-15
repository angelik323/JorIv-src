import {
  IDefinitionAccountingParametersForm,
  IDefinitionAccountingParametersList,
  IDefinitionAccountingParametersDetails,
  IDefinitionAccountingParametersPositions,
  IDefinitionAccountingParametersDerivates,
} from '@/interfaces/customs'
import { IErrors } from '@/interfaces/global'
import { defineStore } from 'pinia'
import { useAlert } from '@/composables/useAlert'
import { useShowError } from '@/composables/useShowError'
import { executeApi } from '@/apis'
import { URL_PATH_INVESTMENT_PORTFOLIO } from '@/constants/apis'
import { TIMEOUT_ALERT } from '@/constants/alerts'

const { showAlert } = useAlert()
const { showCatchError } = useShowError()

const URL_PATH = `${URL_PATH_INVESTMENT_PORTFOLIO}/definition-accounting-parameters`

export const useDefinitionAccountingParametersStoreV1 = defineStore(
  'definition-accounting-parameters-store-v1',
  {
    state: () => ({
      definition_accounting_parameters_list:
        [] as IDefinitionAccountingParametersList,
      definition_accounting_parameters_pages: {
        currentPage: 0,
        lastPage: 0,
        total_items: 0,
        per_page: 0,
      },
      definition_accounting_parameters_form:
        null as IDefinitionAccountingParametersForm | null,
      definition_accounting_parameters_view:
        null as IDefinitionAccountingParametersForm | null,
      definition_accounting_parameters_details:
        null as IDefinitionAccountingParametersDetails | null,
      definition_accounting_parameters_positions:
        null as IDefinitionAccountingParametersPositions | null,
      definition_accounting_parameters_derivates:
        null as IDefinitionAccountingParametersDerivates | null,
      is_required_fields_positions: false as boolean,
      is_required_fields_derivates: false as boolean,
    }),

    actions: {
      async _getDefinitionAccountingParameters(params: string) {
        this._clearData()

        await executeApi()
          .get(`${URL_PATH}/list?paginate=1${params}`)
          .then((response) => {
            const {
              data: {
                data: items = [],
                current_page = 0,
                last_page = 0,
                total = 0,
                per_page = 0,
              },
            } = response.data

            this.definition_accounting_parameters_list = items
            this.definition_accounting_parameters_pages.currentPage =
              current_page
            this.definition_accounting_parameters_pages.lastPage = last_page
            this.definition_accounting_parameters_pages.total_items = total
            this.definition_accounting_parameters_pages.per_page = per_page

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

      async _getByIdDefinitionAccountingParameters(id: number) {
        await executeApi()
          .get(`${URL_PATH}/show/${id}`)
          .then((response) => {
            const { data: responseData, message, success } = response.data

            if (success && responseData) {
              this.definition_accounting_parameters_view = { ...responseData }
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

      async _createDefinitionAccountingParameters(
        data: IDefinitionAccountingParametersForm
      ) {
        let success = false

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
          })

        return success
      },

      async _updateDefinitionAccountingParameters(
        data: IDefinitionAccountingParametersForm,
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

      async _deleteDefinitionAccountingParameters(id: number) {
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

      _setDefinitionAccountingParametersForm(
        data: IDefinitionAccountingParametersForm | null
      ) {
        this.definition_accounting_parameters_form = data ? { ...data } : null
      },

      _setDefinitionAccountingParametersDetails(
        data: IDefinitionAccountingParametersDetails | null
      ) {
        this.definition_accounting_parameters_details = data
          ? { ...data }
          : null
      },

      _setDefinitionAccountingParametersPositions(
        data: IDefinitionAccountingParametersPositions | null
      ) {
        this.definition_accounting_parameters_positions = data
          ? { ...data }
          : null
      },

      _setDefinitionAccountingParametersDerivates(
        data: IDefinitionAccountingParametersDerivates | null
      ) {
        this.definition_accounting_parameters_derivates = data
          ? { ...data }
          : null
      },

      _clearData() {
        this.$reset()
      },
    },
  }
)
