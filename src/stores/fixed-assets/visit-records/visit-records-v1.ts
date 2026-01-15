// pinia
import { defineStore } from 'pinia'

// interfaces
import { IErrors } from '@/interfaces/global/errorMessage'
import {
  IVisitRecordForm,
  IVisitRecordList,
} from '@/interfaces/customs/fixed-assets/v1/VisitRecords'

// composables
import { useAlert, useShowError } from '@/composables'

// apis
import { executeApi } from '@/apis'
import { URL_PATH_FIXED_ASSETS } from '@/constants/apis'

const TIMEOUT_ALERT = 3000

const { showAlert } = useAlert()
const { showCatchError } = useShowError()

export const useVisitRecordsV1 = defineStore('visit-records-v1', {
  state: () => ({
    version: 'v1',
    visit_records_list: [] as IVisitRecordList[],
    visit_records_pages: {
      currentPage: 0,
      lastPage: 0,
    },
    headerPropsDefault: {
      title: 'Registro de visitas activos fijos y bienes',
      breadcrumbs: [
        {
          label: 'Inicio',
          route: 'HomeView',
        },
        {
          label: 'Activos fijos',
        },
        {
          label: 'Registro de visitas activos fijos y bienes',
          route: 'VisitRecordsList',
        },
      ],
    },
  }),
  actions: {
    _clearData() {
      this.visit_records_list = []
      this.visit_records_pages = {
        currentPage: 0,
        lastPage: 0,
      }
    },
    async _getVisitRecordsList(params: string): Promise<void> {
      this._clearData()

      await executeApi()
        .get(`${URL_PATH_FIXED_ASSETS}/fixed-assets-visit-records?${params}`)
        .then((response) => {
          const {
            data: items = [],
            message,
            success,
            current_page,
            last_page,
          } = response.data
          this.visit_records_list = items
          this.visit_records_pages = {
            currentPage: current_page,
            lastPage: last_page,
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

    async _getVisitRecordsById(id: number): Promise<IVisitRecordForm | null> {
      let responseData: IVisitRecordForm | null = null
      await executeApi()
        .get(`${URL_PATH_FIXED_ASSETS}/fixed-assets-visit-records/${id}`)
        .then((response) => {
          const { data, message, success } = response.data
          showAlert(
            message,
            success ? 'success' : 'error',
            undefined,
            TIMEOUT_ALERT
          )
          if (success) {
            responseData = data
          }
        })
        .catch((e) => {
          const error = e as IErrors
          const message = showCatchError(error)
          showAlert(message, 'error', undefined, TIMEOUT_ALERT)
        })

      return responseData
    },

    async _createVisitRecords(payload: IVisitRecordForm): Promise<boolean> {
      let success = false
      await executeApi()
        .post(`${URL_PATH_FIXED_ASSETS}/fixed-assets-visit-records`, payload)
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

    async _updateVisitRecords(
      payload: Partial<IVisitRecordForm> | null
    ): Promise<boolean> {
      let success = false
      await executeApi()
        .put(
          `${URL_PATH_FIXED_ASSETS}/fixed-assets-visit-records/${payload?.id}`,
          payload
        )
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
  },
})
