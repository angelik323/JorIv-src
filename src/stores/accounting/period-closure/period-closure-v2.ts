import { executeApi } from '@/apis'
import { defineStore } from 'pinia'
import { useAlert, useShowError, useUtils } from '@/composables'
import {
  IPeriodClosureModel,
  IPeriodClosureV2Model,
} from '@/interfaces/customs'
import { TIMEOUT_ALERT } from '@/constants/alerts'
import { URL_PATH_ACCOUNTING } from '@/constants/apis'

const { showAlert } = useAlert()
const { showCatchError } = useShowError()

export const usePeriodClosureV2 = defineStore('period-closure-v2', {
  state: () => ({
    version: 'v2',
    period_closure_list: [],
    period_closure_pages: {
      currentPage: 1,
      lastPage: 1,
    },
    period_closure: {} as IPeriodClosureModel,
  }),
  actions: {
    async _getPeriodClosureList(params: string) {
      this._cleanPeriodClosureData()
      await executeApi()
        .get(
          `${URL_PATH_ACCOUNTING}/v2/business-trust-period-closure/list-with-filters?paginate=1${params}`
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

    async _createPeriodClosure(payload: IPeriodClosureV2Model) {
      let responseData: { success: boolean; message: string; data?: unknown } =
        {
          success: false,
          message: 'Error desconocido',
          data: null,
        }

      await executeApi()
        .post(
          `${URL_PATH_ACCOUNTING}/v2/business-trust-period-closure/execute-closure`,
          payload
        )
        .then((response) => {
          const data = response.data

          responseData = {
            success: data.success,
            message: data.message,
            data: data.data ?? null,
          }

          showAlert(
            data.data?.data?.message,
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

    async _downloadPeriodClosureReport(params: {
      period: string
      data: string
    }) {
      await executeApi()
        .get(
          `${URL_PATH_ACCOUNTING}/v2/business-trust-period-closure/download-report`,
          {
            params,
            responseType: 'blob',
          }
        )
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
