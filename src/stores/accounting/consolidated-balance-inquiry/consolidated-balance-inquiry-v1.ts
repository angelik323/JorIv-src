import { defineStore } from 'pinia'
import { executeApi } from '@/apis'
import { useAlert, useShowError, useUtils } from '@/composables'
import { TIMEOUT_ALERT } from '@/constants/alerts'
import { URL_PATH_ACCOUNTING } from '@/constants/apis'
import { IConsolidatedBalanceInquiryList } from '@/interfaces/customs'
import { IErrors } from '@/interfaces/global'

const { showAlert } = useAlert()
const { showCatchError } = useShowError()

export const useConsolidatedBalanceInquiryV1 = defineStore(
  'consolidated-balance-inquiry-v1',
  {
    state: () => ({
      consolidatedBalanceInquiryList: [] as IConsolidatedBalanceInquiryList[],
      consolidatedBalanceInquiryPages: {
        currentPage: 0,
        lastPage: 0,
      },
    }),

    actions: {
      async _getConsolidatedBalanceInquiryList(params: string) {
        this.consolidatedBalanceInquiryList = []
        await executeApi()
          .get(
            `${URL_PATH_ACCOUNTING}/consolidated-balance-inquiry?paginate=1${params}`
          )
          .then((response) => {
            if (response.data.success) {
              this.consolidatedBalanceInquiryList =
                response.data?.data?.data ?? []
              this.consolidatedBalanceInquiryPages.currentPage =
                response.data?.data?.current_page ?? 0
              this.consolidatedBalanceInquiryPages.lastPage =
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

      async _exportConsolidateBalanceInquiryListXLS(gotUrl: string) {
        await executeApi()
          .get(
            `${URL_PATH_ACCOUNTING}/consolidated-balance-inquiry/export?${gotUrl}`,
            {
              responseType: 'blob',
            }
          )
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
