import { useAlert, useShowError } from '@/composables'
import { defineStore } from 'pinia'
import { executeApi } from '@/apis'
import {
  IAccountingParameters,
  ICollectionAccountingBlocksResponse,
} from '@/interfaces/customs'
import { URL_PATH_TREASURIES } from '@/constants/apis'
import { IErrors } from '@/interfaces/global'

const TIMEOUT_ALERT = 3000
const { showAlert } = useAlert()
const { showCatchError } = useShowError()

export const useAccountingParametersCollection = defineStore(
  'accounting-parameters-collection',
  {
    state: () => ({
      accounting_parameters_list: [] as IAccountingParameters[],
      accounting_parameters_pages: {
        current_page: 0,
        lastpage: 0,
      },
      idSelected: 0 as number,
      perPage: 20 as number,
      data_information_form: null as IAccountingParameters | null,
      type_accounting_blocks_collections_request:
        null as ICollectionAccountingBlocksResponse | null,
      cash_flow_structure: null as { name: string; id: number } | null,
      id_selected_edit: null as number | null | undefined,
    }),

    actions: {
      async _getAccountParameters(params: number) {
        this.accounting_parameters_list = []
        await executeApi()
          .get(
            `${URL_PATH_TREASURIES}/commission-accounting-parameters?paginate=1&accounting_blocks_collection_id=${params}`
          )
          .then((response) => {
            if (response.data.success) {
              this.accounting_parameters_list = response.data?.data?.data ?? []
              this.accounting_parameters_pages.current_page =
                response.data?.data?.current_page ?? 0
              this.accounting_parameters_pages.lastpage =
                response.data?.data?.last_page ?? 0
              this.cash_flow_structure =
                response.data?.data?.data?.length > 0
                  ? response.data.data.data[0].cash_flow_structure
                  : []
            }
          })
          .catch((error: IErrors) => {
            showAlert(showCatchError(error), 'error', undefined, TIMEOUT_ALERT)
          })
      },
      async _getAccountingParameter(id: number) {
        this.data_information_form = null
        await executeApi()
          .get(`${URL_PATH_TREASURIES}/commission-accounting-parameters/${id}`)
          .then((response) => {
            if (response.data.success) {
              this.data_information_form = response.data?.data ?? null
            }
            return showAlert(
              response.data.message,
              response.data.success ? 'success' : 'error',
              undefined,
              TIMEOUT_ALERT
            )
          })
          .catch((error: IErrors) => {
            showAlert(showCatchError(error), 'error', undefined, TIMEOUT_ALERT)
          })
      },
      async _createAccountingParameter(payload: IAccountingParameters) {
        let success = false
        await executeApi()
          .post(
            `${URL_PATH_TREASURIES}/commission-accounting-parameters`,
            payload
          )
          .then((response) => {
            success = response.data.success
            if (response.data.success) {
              this._setDataInformationForm(response.data.data)
              return showAlert(
                response.data.message,
                response.data.success ? 'success' : 'error',
                undefined,
                TIMEOUT_ALERT
              )
            }
          })
          .catch((error: IErrors) => {
            showAlert(showCatchError(error), 'error', undefined, TIMEOUT_ALERT)
          })
        return success
      },

      async _updateAccountingParameter(
        id: number,
        payload: IAccountingParameters
      ) {
        let success = false
        await executeApi()
          .put(
            `${URL_PATH_TREASURIES}/commission-accounting-parameters/${id}`,
            payload
          )
          .then((response) => {
            success = response.data.success
            if (response.data.success) {
              this._setDataInformationForm(response.data.data)
              showAlert(
                response.data.message,
                response.data.success ? 'success' : 'error',
                undefined,
                TIMEOUT_ALERT
              )
            }
          })
          .catch((error: IErrors) => {
            showAlert(showCatchError(error), 'error', undefined, TIMEOUT_ALERT)
          })
        return success
      },

      _setDataInformationForm(data_to_set: IAccountingParameters | null) {
        this.data_information_form = data_to_set ? { ...data_to_set } : null
      },

      _setDataIds(id: number) {
        this.idSelected = id
      },
      _setIdSelectedEdit(id: number | undefined) {
        this.id_selected_edit = id
      },
    },
  }
)
