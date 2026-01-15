import { defineStore } from 'pinia'
import { executeApi } from '@/apis'
import { URL_PATH_ACCOUNTING } from '@/constants/apis'
import { useAlert, useShowError, useUtils } from '@/composables'
import { TIMEOUT_ALERT } from '@/constants/alerts'
import { IBalanceInquiryByBusinessResponse } from '@/interfaces/customs'
import { IErrors } from '@/interfaces/global'

const { showAlert } = useAlert()
const { showCatchError } = useShowError()

export const useBalanceInquiryByBusiness = defineStore(
  'balance-inquiry-by-business-v1',
  {
    state: () => ({
      version: 'v1',
      balance_inquiry_by_business_list:
        [] as IBalanceInquiryByBusinessResponse[],
      balance_inquiry_by_business_pages: {
        currentPage: 1,
        lastPage: 1,
      },
      urlExportXlsx: null as string | null,
    }),
    actions: {
      async _getBalanceInquiryByBusinnesList(params: string) {
        this.balance_inquiry_by_business_list = []
        await executeApi()
          .get(
            `${URL_PATH_ACCOUNTING}/balance-inquiry-by-business?paginate=1${params}`
          )
          .then((response) => {
            if (response.data.success) {
              this.balance_inquiry_by_business_list =
                response.data?.data?.data ?? []
              this.balance_inquiry_by_business_pages.currentPage =
                response.data.data.current_page ?? 0
              this.balance_inquiry_by_business_pages.lastPage =
                response.data?.data.last_page ?? 0
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

      async _exportBalanceInquiryByBusinessListXLS(gotUrl: string) {
        await executeApi()
          .get(
            `${URL_PATH_ACCOUNTING}/balance-inquiry-by-business/export?${gotUrl}`,
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
