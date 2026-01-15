import { defineStore } from 'pinia'
import { executeApi } from '@/apis'
import { useAlert, useShowError } from '@/composables'
import { URL_PATH_INVESTMENT_PORTFOLIO } from '@/constants/apis'
import {
  IQualificationsMaintenance,
  IQualificationsMaintenanceUpdate,
} from '@/interfaces/customs'
import { TIMEOUT_ALERT } from '@/constants/alerts'

const { showAlert } = useAlert()
const { showCatchError } = useShowError()

export const useQualificationsMaintenanceStoreV1 = defineStore(
  'qualifications-maintenance-store-v1',
  {
    state: () => ({
      version: 'v1',
      qualifications_list: [] as IQualificationsMaintenance[],
      qualifications_historial: [],

      qualifications_view: {},
      qualifications_pages: {
        currentPage: 0,
        lastPage: 0,
      },
      qualifications_historial_pages: {
        currentPage: 0,
        lastPage: 0,
      },
      data_information_form: {} as IQualificationsMaintenance | null,
      type_qualifications_request: null,
    }),

    actions: {
      async _getListAction(params: string = '', pages: number = 1) {
        this._cleanQualificationsData()
        await executeApi()
          .get(
            `${URL_PATH_INVESTMENT_PORTFOLIO}/issuers-counter-party/get?paginate=1&page=${pages}${params}`
          )
          .then((response) => {
            if (response.data.success) {
              this.qualifications_list = response.data?.data?.data ?? []
              this.qualifications_pages = {
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

      async _getByIdQualifications(id: number) {
        await executeApi()
          .get(
            `${URL_PATH_INVESTMENT_PORTFOLIO}/issuers-counter-party/show/${id}`
          )
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
      async _getByIdHistorial(id: number, params: string) {
        await executeApi()
          .get(
            `${URL_PATH_INVESTMENT_PORTFOLIO}/maintenance-qualification/show/${id}?${params}&paginate=1`
          )
          .then((response) => {
            if (response.data.success) {
              this.qualifications_historial = response.data?.data?.data ?? []
              this.qualifications_historial_pages = {
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

      async _updateQualifications(
        data: IQualificationsMaintenanceUpdate,
        id: number
      ) {
        let success = false
        this.type_qualifications_request = null

        await executeApi()
          .put(
            `${URL_PATH_INVESTMENT_PORTFOLIO}/maintenance-qualification/update/${id}`,
            data
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
      _setDataInformationForm(data_to_set: IQualificationsMaintenance | null) {
        this.data_information_form = data_to_set ? { ...data_to_set } : null
      },

      _cleanQualificationsData() {
        this.qualifications_list = []
        this.qualifications_pages = {
          currentPage: 0,
          lastPage: 0,
        }
      },
    },
  }
)
