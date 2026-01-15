import { defineStore } from 'pinia'
import { executeApi } from '@/apis'

// Interfaces
import {
  IQualificationsList,
  IQualificationsResponse,
  IQualificationsToCreate,
} from '@/interfaces/customs/investment-portfolio/Qualifications'
import { IErrors } from '@/interfaces/global'

// Composables - Utils
import { useAlert, useShowError, useUtils } from '@/composables'

// Constants
import { URL_PATH_INVESTMENT_PORTFOLIO } from '@/constants/apis'
import { TIMEOUT_ALERT } from '@/constants/alerts'

const { showAlert } = useAlert()
const { showCatchError } = useShowError()

export const useQualificationsStoreV1 = defineStore('qualifications-store-v1', {
  state: () => ({
    version: 'v1',
    headerPropsDefault: {
      title: 'Calificaciones',
      breadcrumbs: [
        {
          label: 'Inicio',
          route: 'HomeView',
        },
        {
          label: 'Portafolio de inversiones',
        },
        {
          label: 'Calificaciones',
          route: 'QualificationsList',
        },
      ],
      btn: {
        label: 'Crear',
        icon: useUtils().defaultIconsLucide.plusCircleOutline,
      },
    },
    qualifications_list: [] as IQualificationsList[],
    qualifications_pages: {
      currentPage: 0,
      lastPage: 0,
    },
    qualifications_response: null as IQualificationsResponse | null,
  }),

  actions: {
    async _getListAction(params: Record<string, string | number>) {
      this._clearData()
      await executeApi()
        .get(`${URL_PATH_INVESTMENT_PORTFOLIO}/qualifications`, {
          params: { ...params, paginate: 1 },
        })
        .then((response) => {
          if (response.data.success) {
            this.qualifications_list = response.data?.data?.data ?? []
            this.qualifications_pages.currentPage =
              response.data?.data?.current_page ?? 1
            this.qualifications_pages.lastPage =
              response.data?.data?.last_page ?? 1
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
        .get(`${URL_PATH_INVESTMENT_PORTFOLIO}/qualifications/${id}`)
        .then((response) => {
          const { data: responseData, message, success } = response.data

          if (success && responseData) {
            this.qualifications_response = { ...responseData }
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

    async _createQualifications(
      data: Partial<IQualificationsToCreate>
    ): Promise<boolean> {
      let success = false
      await executeApi()
        .post(`${URL_PATH_INVESTMENT_PORTFOLIO}/qualifications`, data)
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

    async _updateQualifications(
      data: Partial<IQualificationsToCreate>,
      id: number
    ) {
      let success = false

      await executeApi()
        .put(`${URL_PATH_INVESTMENT_PORTFOLIO}/qualifications/${id}`, data)
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

    _clearData() {
      this.qualifications_list = []
      this.qualifications_pages = {
        currentPage: 0,
        lastPage: 0,
      }
      this.qualifications_response = null
    },
  },
})
