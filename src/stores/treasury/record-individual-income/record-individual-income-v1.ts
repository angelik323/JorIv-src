import { defineStore } from 'pinia'
import {
  IRecordIndividualIncomeFilterForm,
  IRecordIndividualIncomeDetailForm,
  IRecordIndividualIncomeDetailView,
  IRecordIndividualIncomeDetailList,
  IRecordIndividualIncomeToCreate,
  IRecordIndividualIncomeToEdit,
  IRecordIndividualIncomeResponse,
  IRecordIndividualIncomeToConfirm,
  ISelectorResources,
} from '@/interfaces/customs'
import { executeApi } from '@/apis'
import { useAlert, useShowError } from '@/composables'
import { URL_PATH_TREASURIES } from '@/constants/apis'
import { TIMEOUT_ALERT } from '@/constants/alerts'
import { IErrors } from '@/interfaces/global'

const { showAlert } = useAlert()
const { showCatchError } = useShowError()

const URL_PATH = `${URL_PATH_TREASURIES}/income-records`

export const useRecordIndividualIncomeStoreV1 = defineStore(
  'record-individual-income-store-v1',
  {
    state: () => ({
      data_filter_form: null as IRecordIndividualIncomeFilterForm | null,
      data_detail_form: null as IRecordIndividualIncomeDetailForm | null,
      data_detail_view: null as IRecordIndividualIncomeDetailView | null,
      data_list: [] as IRecordIndividualIncomeDetailList | [],
      data_response: null as IRecordIndividualIncomeResponse | null,
      business_selected: null as ISelectorResources | null,
      income_record_id: null as number | null,
      selectedMovementHasCostCenter: false as boolean,
      data_pages: {
        currentPage: 0,
        lastPage: 0,
        total_items: 0,
        per_page: 0,
      },
    }),
    actions: {
      async _getRecordIndividualIncomeList(params: string) {
        await executeApi()
          .get(`${URL_PATH}?paginate=1${params}`)
          .then((response) => {
            const {
              data: {
                data: responseData,
                current_page = 0,
                last_page = 0,
                total = 0,
                per_page = 0,
              },
            } = response.data

            this.data_response = { ...responseData[0] }
            this.data_list = this.data_response?.details ?? []
            this.data_pages.currentPage = current_page
            this.data_pages.lastPage = last_page
            this.data_pages.total_items = total
            this.data_pages.per_page = per_page

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

      async _getByIdRecordIndividualIncomeDetail(id: number) {
        await executeApi()
          .get(`${URL_PATH}/detail/${id}`)
          .then((response) => {
            const { data: responseData, message, success } = response.data

            if (success && responseData) {
              this.data_detail_view = { ...responseData }
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

      async _validateRecordIndividualIncomeFilter(
        data: IRecordIndividualIncomeFilterForm
      ) {
        let success = false

        await executeApi()
          .post(`${URL_PATH}/validate`, data)
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

      async _createRecordIndividualIncome(
        data: IRecordIndividualIncomeToCreate
      ) {
        let success = true

        await executeApi()
          .post(`${URL_PATH}`, data)
          .then((response) => {
            const { message } = response.data
            success = response.data?.success ?? false
            this.income_record_id = response.data?.data?.id ?? null

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

      async _updateRecordIndividualIncomeDetail(
        data: IRecordIndividualIncomeToEdit,
        id: number
      ) {
        let success = false

        await executeApi()
          .put(`${URL_PATH}/detail/${id}`, data)
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

      async _confirmRecordIndividualIncome(
        data: IRecordIndividualIncomeToConfirm,
        id: number
      ) {
        let success = false

        await executeApi()
          .put(`${URL_PATH}/confirm/${id}`, data)
          .then((response) => {
            const { message } = response.data
            success = response.data?.success ?? false

            showAlert(
              success ? 'Registro creado exitosamente' : message,
              success ? 'success' : 'error',
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
          })
          .catch((e) => {
            const error = e as IErrors
            const message = showCatchError(error)
            showAlert(message, 'error', undefined, TIMEOUT_ALERT)
          })

        return success
      },

      async _deleteRecordIndividualIncomeDetail(id: number) {
        let success = false

        await executeApi()
          .delete(`${URL_PATH}/detail/${id}`)
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

      _setDataFilterForm(data: IRecordIndividualIncomeFilterForm | null) {
        this.data_filter_form = data
      },

      _setDataDetailForm(data: IRecordIndividualIncomeDetailForm | null) {
        this.data_detail_form = data
      },

      _setDataDetailView(data: IRecordIndividualIncomeDetailView | null) {
        this.data_detail_view = data
      },

      _setBusinessSelected(data: ISelectorResources | null) {
        this.business_selected = data
      },

      _setSelectedMovementHasCostCenter(has_cost_center: boolean) {
        this.selectedMovementHasCostCenter = has_cost_center
      },

      _clearData() {
        this.data_filter_form = null
        this.data_detail_form = null
        this.data_detail_view = null
        this.data_list = []
        this.business_selected = null
        this.data_response = null
        this.income_record_id = null
        this.data_pages = {
          currentPage: 0,
          lastPage: 0,
          total_items: 0,
          per_page: 0,
        }
      },
    },

    persist: true,
  }
)
