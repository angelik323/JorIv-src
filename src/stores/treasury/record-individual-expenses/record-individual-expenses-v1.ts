import { defineStore } from 'pinia'
import { executeApi } from '@/apis'
import { useAlert, useShowError } from '@/composables'
import {
  IDetailOfIndividualExpensesRequest,
  IDetailOfIndividualExpensesFilterRequest,
} from '@/interfaces/customs'
import { URL_PATH_TREASURIES } from '@/constants/apis'
import { TIMEOUT_ALERT } from '@/constants/alerts'

const { showAlert } = useAlert()
const { showCatchError } = useShowError()
export const useRecordIndividualExpensesStoreV1 = defineStore(
  'record-individual-expenses-store-v1',
  {
    state: () => ({
      data_list: [] as IDetailOfIndividualExpensesRequest[],
      record: {} as IDetailOfIndividualExpensesRequest,
      data_pages: {
        currentPage: 0,
        lastPage: 0,
      },
      data_information_form:
        null as IDetailOfIndividualExpensesFilterRequest | null,
      is_creating: false,
      is_editing: false,
      new_form_data: false,
      effective_date_filter: null as string | null,
      successValidateCreate: false,
      successValidateDetail: false,
      resetFormFilter: false,
      selectedMovementHasCostCenter: false as boolean,
    }),
    actions: {
      async _postRecordIndividualExpensesValidate(
        params: IDetailOfIndividualExpensesFilterRequest
      ): Promise<boolean> {
        await executeApi()
          .post(`${URL_PATH_TREASURIES}/record-expenses/validate`, params)
          .then((response) => {
            if (response.data.success) {
              this.successValidateCreate =
                response.data?.data ?? !this.successValidateCreate
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
        return this.successValidateCreate
      },

      async _postRecordIndividualExpensesValidateDetail(
        params: IDetailOfIndividualExpensesFilterRequest
      ): Promise<boolean> {
        await executeApi()
          .post(
            `${URL_PATH_TREASURIES}/record-expenses/validate-detail`,
            params
          )
          .then((response) => {
            if (response.data.success) {
              this.successValidateDetail = response.data?.data ?? !this.successValidateDetail
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
        return this.successValidateDetail
      },

      async _postRecordIndividualExpenses(payload: object): Promise<boolean> {
        let success = false

        await executeApi()
          .post(`${URL_PATH_TREASURIES}/record-expenses`, payload)
          .then((response) => {
            const { message } = response.data

            if (response.data.success) {
              success = response.data.success

              showAlert(
                response.data.message,
                response.data.success ? 'success' : 'error',
                undefined,
                TIMEOUT_ALERT
              )

              showAlert(
                success
                  ? 'El número consecutivo asignado al registro es el ' +
                      '"' +
                      response.data.data?.id +
                      '"'
                  : message,
                success ? 'success' : 'error',
                undefined,
                TIMEOUT_ALERT
              )
            }
          })
          .catch((error) => {
            showAlert(showCatchError(error), 'error', undefined, TIMEOUT_ALERT)
            this.is_creating = false
          })
        return success
      },

      _setSelectedMovementHasCostCenter(has_cost_center: boolean) {
        this.selectedMovementHasCostCenter = has_cost_center
      },

      async _setDataBasicRecodIndividualExpenses(
        data: IDetailOfIndividualExpensesFilterRequest | null
      ) {
        this.data_information_form = data ? { ...data } : null
      },

      _clearData() {
        this.data_list = []
        this.data_pages = {
          currentPage: 0,
          lastPage: 0,
        }
        this.is_creating = false

        this._setDataBasicRecodIndividualExpenses(null)
      },
    },
  }
)
