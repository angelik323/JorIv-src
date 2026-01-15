import { executeApi } from '@/apis'
import { defineStore } from 'pinia'
import { useAlert, useShowError, useUtils } from '@/composables'
import { IPeriodClosureItem, IPeriodClosureModel } from '@/interfaces/customs'
import { TIMEOUT_ALERT } from '@/constants/alerts'
import { URL_PATH_ACCOUNTING } from '@/constants/apis'

const { showAlert } = useAlert()
const { showCatchError } = useShowError()

export const usePeriodClosureV1 = defineStore('period-closure-v1', {
  state: () => ({
    version: 'v1',
    period_closure_list: [] as IPeriodClosureItem[],
    period_closure_pages: {
      currentPage: 0,
      lastPage: 0,
    },
    period_closure: {} as IPeriodClosureModel,
  }),
  actions: {
    async _getPeriodClosureList(params: string) {
      this._cleanPeriodClosureData()
      await executeApi()
        .get(
          `${URL_PATH_ACCOUNTING}/business-trust/period-closure?paginate=1${params}`
        )
        .then((response) => {
          if (response.data.success) {
            this.period_closure_list = response.data?.data?.data ?? []
            this.period_closure_pages.currentPage =
              response.data?.data?.current_page ?? 0
            this.period_closure_pages.lastPage =
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

    _cleanPeriodClosureData() {
      this.period_closure_list = []
      this.period_closure_pages = {
        currentPage: 0,
        lastPage: 0,
      }
      this.period_closure = {} as IPeriodClosureModel
    },

    async _createPeriodClosure(payload: IPeriodClosureModel) {
      let responseData = {
        success: false,
        message: 'Error desconocido',
      }

      await executeApi()
        .post(
          `${URL_PATH_ACCOUNTING}/business-trust/generate-period-close`,
          payload
        )
        .then((response) => {
          const data = response.data

          responseData = {
            success: data.success,
            message: data.message,
            ...(data.data?.url && { url: data.data.url }),
          }

          showAlert(
            data.message,
            data.success ? 'success' : 'error',
            undefined,
            TIMEOUT_ALERT
          )
        })
        .catch((error) => {
          responseData = {
            success: false,
            message: showCatchError(error),
          }

          showAlert(responseData.message, 'error', undefined, TIMEOUT_ALERT)
        })

      return responseData
    },

    async _downloadPeriodClosureReport() {
      await executeApi()
        .get(`${URL_PATH_ACCOUNTING}/report/export`, {
          responseType: 'blob',
        })
        .then((response) => {
          const blob = new Blob([response.data], {
            type: response.headers['content-type'],
          })

          const contentDisposition = response.headers['content-disposition']
          let fileName = 'reporte_cierre.xlsx'
          if (contentDisposition) {
            const matches = contentDisposition.match(/filename="?(.+?)"?$/)
            if (matches && matches[1]) {
              fileName = matches[1].replace(/"/g, '')
            }
          }

          useUtils().downloadBlobXlxx(blob, fileName)
        })
    },
  },
})
