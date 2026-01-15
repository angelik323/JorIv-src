import { defineStore } from 'pinia'
import { executeApi } from '@/apis'
import { useAlert, useShowError, useUtils } from '@/composables'
import { URL_PATH_ACCOUNTING } from '@/constants/apis'
import { TIMEOUT_ALERT } from '@/constants/alerts'
import {
  IEquivalentVaucherList,
  IExportFailureItem,
} from '@/interfaces/customs/accounting'

const { showAlert } = useAlert()
const { showCatchError } = useShowError()

const URL_PATH = `${URL_PATH_ACCOUNTING}/treasury_movements_cancelled`

export const useTreasuryMovementsCancelledStoreV1 = defineStore(
  'equivalent-vaucher-store-v1',
  {
    state: () => ({
      version: 'v1',
      treasury_movements_cancelled_list: [] as IEquivalentVaucherList[],
      treasury_movements_cancelled_pages: {
        currentPage: 0,
        lastPage: 0,
        total: 0,
      },
    }),

    actions: {
      async _getTreasuryMovementsCanceled(params = '') {
        await executeApi()
          .get(`${URL_PATH}?paginate=true${params}`)
          .then((response) => {
            const data = response.data
            if (data.success) {
              this.treasury_movements_cancelled_list = Array.isArray(data.data)
                ? data.data
                : data.data.data
              this.treasury_movements_cancelled_pages = {
                currentPage: data?.data?.current_page ?? 1,
                lastPage: data?.data?.last_page ?? 1,
                total: data?.data?.total ?? 0,
              }

              showAlert(data.message, 'success', undefined, TIMEOUT_ALERT)
            }
          })
          .catch((error) => {
            showAlert(showCatchError(error), 'error', undefined, TIMEOUT_ALERT)
          })
      },

      async _downloadMovementsCancelledXlsx(
        movements: IExportFailureItem[]
      ): Promise<void> {
        executeApi()
          .post(
            `${URL_PATH}/export-treasury-movements-cancelled`,
            { movements },
            { responseType: 'blob' }
          )
          .then((response) => {
            const blob = new Blob([response.data], {
              type: response.headers['content-type'],
            })

            const fileName = useUtils().getNameBlob(response)
            useUtils().downloadBlobXlxx(blob, fileName)

            showAlert(
              'Movimientos de tesorería anulados exportados correctamente.',
              'success',
              undefined,
              TIMEOUT_ALERT
            )
          })
          .catch((error) => {
            showAlert(showCatchError(error), 'error', undefined, TIMEOUT_ALERT)
          })
      },
    },
  }
)
