import { defineStore } from 'pinia'
import { executeApi } from '@/apis'
import { useAlert, useShowError, useUtils } from '@/composables'
import { URL_PATH_TREASURIES } from '@/constants/apis'
import { TIMEOUT_ALERT } from '@/constants/alerts'
import { ITreasuryRecordsConsultationList } from '@/interfaces/customs'
import { IErrors } from '@/interfaces/global'

const { showAlert } = useAlert()
const { showCatchError } = useShowError()

export const useTreasuryRecordsConsultationStoreV1 = defineStore(
  'treasury-records-consultation-store-v1',
  {
    state: () => ({
      version: 'v1',
      treasury_records_consultation_list:
        [] as ITreasuryRecordsConsultationList[],
      treasury_records_consultation_pages: {
        currentPage: 1,
        lastPage: 1,
      },
    }),
    actions: {
      async _getTreasuryRecordsConsultationList(params: string) {
        this.treasury_records_consultation_list = []
        await executeApi()
          .get(`${URL_PATH_TREASURIES}/record-treasury?paginate=1${params}`)
          .then((response) => {
            const {
              data: { data: items = [], current_page = 0, last_page = 0 },
              message,
              success,
            } = response.data

            this.treasury_records_consultation_list = items

            this.treasury_records_consultation_pages.currentPage = current_page
            this.treasury_records_consultation_pages.lastPage = last_page

            showAlert(
              message,
              success ? 'success' : 'error',
              undefined,
              TIMEOUT_ALERT
            )
          })
          .catch((error) => {
            showAlert(showCatchError(error), 'error', undefined, TIMEOUT_ALERT)
          })
      },

      async _exportTreasuryRecordsConsultationListXLS(gotUrl: string) {
        await executeApi()
          .get(`${URL_PATH_TREASURIES}/record-treasury/export?${gotUrl}`, {
            responseType: 'blob',
          })
          .then((response) => {
            const blob = new Blob([response.data], {
              type: response.headers['content-type'],
            })

            const fileName = useUtils().getNameBlob(response)
            useUtils().downloadBlobXlxx(blob, fileName)

            return showAlert(
              'Descarga exitosa',
              'success',
              undefined,
              TIMEOUT_ALERT
            )
          })
          .catch((e) => {
            const error = e as IErrors
            const message = showCatchError(error)
            showAlert(message, 'error')
          })
      },
    },
  }
)
