import { defineStore } from 'pinia'
import { executeApi } from '@/apis'

import { useAlert, useShowError, useUtils } from '@/composables'
import { URL_PATH_TREASURIES } from '@/constants/apis'
import { TIMEOUT_ALERT } from '@/constants/alerts'

import { IErrors } from '@/interfaces/global'

import {
  IBankingNetworkUpload,
  IBankingNetworkUploadRecord,
  IBankingNetworkUploadAnnulate,
  IBankingNetworkUploadAnnulateFailure,
} from '@/interfaces/customs/treasury/CancelLoadBanks'

const { showAlert } = useAlert()
const { showCatchError } = useShowError()

export const useCancelBankLoadsStoreV1 = defineStore(
  'cancel-bank-loads-store-v1',
  {
    state: () => ({
      banking_network_uploads_data: null as IBankingNetworkUpload | null,
      banking_network_uploads_record: [] as IBankingNetworkUploadRecord[] | [],
      banking_network_uploads_annulate_failure: [] as IBankingNetworkUploadAnnulateFailure[] | [],
      business_options: [],
      is_downloading_log: false,
    }),

    actions: {
      async _getBankingNetworkUploads(data: Partial<number>) {
        let success = false

        await executeApi()
          .get(`${URL_PATH_TREASURIES}/banking-network-uploads/${data}`)
          .then((response) => {
            const { message } = response.data
            success = response.data?.success ?? false

            this.banking_network_uploads_data = response.data?.data

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

      async _getBankingNetworkUploadsRecords(data: Partial<number>) {
        let success = false
        this.banking_network_uploads_record = []

        await executeApi()
          .get(`${URL_PATH_TREASURIES}/banking-network-uploads/${data}/records`)
          .then((response) => {
            const { message } = response.data
            success = response.data?.success ?? false

            this.banking_network_uploads_record = response.data?.data

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

      async _postBankingNetworkUploadsAnnulate(id: Partial<number>, data: IBankingNetworkUploadAnnulate) {
        let success = false

        await executeApi()
          .post(`${URL_PATH_TREASURIES}/banking-network-uploads/${id}/annulate`, data)
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
          .catch((e: IErrors) => {
            this.banking_network_uploads_annulate_failure = e.response?.data?.data.failed_records as unknown[] as IBankingNetworkUploadAnnulateFailure[] || []
            const msg = showCatchError(e)
            showAlert(msg, 'error', undefined, TIMEOUT_ALERT)
          })

        return success
      },

      async _getBankingNetworkUploadsExport(id: Partial<number>){
        await executeApi()
          .post(`${URL_PATH_TREASURIES}/banking-network-uploads/${id}/annulate/export-failures`, {
            failed_records: this.banking_network_uploads_annulate_failure
          })
          .then((response) => {
            const blob = new Blob([response.data], {
              type: response.headers['content-type'],
            })

            const fileName = useUtils().getNameBlob(response)
            useUtils().downloadBlobXlxx(blob, fileName.replace(/['"]/g, ''))
          })
          .catch((e) => {
            const error = e as IErrors
            const message = showCatchError(error)
            showAlert(message, 'error', undefined, TIMEOUT_ALERT)
          })
      },

      _clearData() {
        this.business_options = []
      },
    },

    persist: true,
  }
)
