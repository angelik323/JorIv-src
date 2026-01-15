import { executeApi } from '@/apis'
import { useAlert, useShowError } from '@/composables'
import { ITypesOperation } from '@/interfaces/customs/'
import { defineStore } from 'pinia'
import { URL_PATH_INVESTMENT_PORTFOLIO } from '@/constants/apis'
const TIMEOUT_ALERT = 3000
const { showAlert } = useAlert()
const { showCatchError } = useShowError()

export const useTypesOperationCollectionStoreV1 = defineStore(
  'types-operation-collection-store-v1',
  {
    state: () => ({
      types_operation_list: [] as ITypesOperation[] | [],
      types_operation_pages: {
        currentPage: 0,
        lastPage: 0,
      },
      data_information_form: null as ITypesOperation | null,
    }),
    actions: {
      async _getTypesOperationList(params: string = '') {
        this.types_operation_list = []
        await executeApi()
          .get(`${URL_PATH_INVESTMENT_PORTFOLIO}/operation-types?${params}`)
          .then((response) => {
            if (response.data.success) {
              this.types_operation_list = response.data?.data?.data ?? []
              this.types_operation_pages.currentPage =
                response.data?.data?.current_page ?? 0
              this.types_operation_pages.lastPage =
                response.data?.data?.last_page ?? 0
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
      async _getTypesOperationById(id: number | string) {
        this.data_information_form = null
        await executeApi()
          .get(`${URL_PATH_INVESTMENT_PORTFOLIO}/operation-types/show/${id}`)
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
          .catch((error) => {
            showAlert(showCatchError(error), 'error', undefined, TIMEOUT_ALERT)
          })
      },
      async _createTypesOperation(payload: ITypesOperation) {
        let success = false
        await executeApi()
          .post(`${URL_PATH_INVESTMENT_PORTFOLIO}/operation-types/new`, payload)
          .then((response) => {
            success = response.data.success
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
        return success
      },
      async _updateTypesOperation(
        payload: ITypesOperation,
        id: number | string
      ) {
        let success = false
        await executeApi()
          .put(
            `${URL_PATH_INVESTMENT_PORTFOLIO}/operation-types/update/${id}`,
            payload
          )
          .then((response) => {
            success = response.data.success

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
        return success
      },
      _setDataInformationForm(data: ITypesOperation | null) {
        this.data_information_form = data
      },
    },
  }
)
