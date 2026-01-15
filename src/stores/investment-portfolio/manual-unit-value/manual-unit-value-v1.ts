// store
import { defineStore } from 'pinia'

// composables
import { useAlert, useShowError } from '@/composables'

// utils
import { executeApi } from '@/apis'
import { URL_PATH_INVESTMENT_PORTFOLIO } from '@/constants/apis'
import { TIMEOUT_ALERT } from '@/constants/alerts'
import { IManualUnitValueForm } from '@/interfaces/customs'

const { showAlert } = useAlert()
const { showCatchError } = useShowError()
const URL_PATH = `${URL_PATH_INVESTMENT_PORTFOLIO}/manual-unit-value`
export const useManualUnitValueStoreV1 = defineStore(
  'manual-unit-value-store-v1',
  {
    state: () => ({
      version: 'v1',
      manual_unit_value_list: [] as IManualUnitValueForm[],
      manual_unit_value_pages: {
        currentPage: 0,
        lastPage: 0,
      },
      data_information_form: null as IManualUnitValueForm | null,
    }),

    actions: {
      async _getListAction(params: string = '') {
        this._cleanData()
        await executeApi()
          .get(`${URL_PATH}/list?paginate=1${params}`)
          .then((response) => {
            if (response.data.success) {
              this.manual_unit_value_list = response.data.data.data ?? []
              this.manual_unit_value_pages = {
                currentPage: response.data?.data?.current_page ?? 0,
                lastPage: response.data?.data?.last_page ?? 0,
              }
            }
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
      },

      async _getByIdManualUnitValue(id: number) {
        await executeApi()
          .get(`${URL_PATH}/show/${id}`)
          .then((response) => {
            if (response.data.success) {
              const res = response.data.data
              if (res) {
                this.data_information_form = res
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

      async _createManualUnitValue(data: IManualUnitValueForm) {
        let success = false

        await executeApi()
          .post(`${URL_PATH}/new`, data)
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
      async _deleteManualUnitValue(id: number) {
        let success = false
        await executeApi()
          .delete(`${URL_PATH}/destroy/${id}`)
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
      _setDataInformationForm(data_to_set: IManualUnitValueForm | null) {
        this.data_information_form = data_to_set ? { ...data_to_set } : null
      },

      _cleanData() {
        this.manual_unit_value_list = []
        this.manual_unit_value_pages = {
          currentPage: 0,
          lastPage: 0,
        }
      },
    },
  }
)
