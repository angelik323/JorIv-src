import { defineStore } from 'pinia'
import { executeApi } from '@/apis'
import { useAlert, useShowError, useUtils } from '@/composables'
import { URL_PATH_TREASURIES } from '@/constants/apis'
import { TIMEOUT_ALERT } from '@/constants/alerts'
import {
  IApiResponseMovementsCancelled,
  ICancelledMovementItem,
  ICancelledMovementShow,
  ICancelledMovementsResponse,
  IExportMovementCancelledParam,
} from '@/interfaces/customs'

const { showAlert } = useAlert()
const { showCatchError } = useShowError()

const URL_PATH = `${URL_PATH_TREASURIES}/treasury-movements-cancelled`

export const useMovementsCancelledStoreV1 = defineStore(
  'movements-cancelled-store-v1',
  {
    state: () => ({
      version: 'v1',
      movements_cancelled_list: [] as ICancelledMovementItem[],
      movements_cancelled_pages: {
        currentPage: 0,
        lastPage: 0,
        total: 0,
      },
    }),

    actions: {
      async _listMovementsCancelled(params: string) {
        this.movements_cancelled_list = []

        await executeApi()
          .get<IApiResponseMovementsCancelled<ICancelledMovementsResponse>>(
            `${URL_PATH}?paginate=1${params}`
          )
          .then((response) => {
            const { success, message, data } = response.data

            if (success) {
              this.movements_cancelled_list = data.data ?? []
              this.movements_cancelled_pages = {
                currentPage: data.current_page ?? 1,
                lastPage: data.last_page ?? 1,
                total: data.total ?? 0,
              }
            }

            return showAlert(
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

      async _showCancelledMovementById(
        treasuryMovementId: number
      ): Promise<ICancelledMovementShow | null> {
        return await executeApi()
          .get<IApiResponseMovementsCancelled<ICancelledMovementShow>>(
            `${URL_PATH}/${treasuryMovementId}`
          )
          .then((response) => {
            const { success, message, data } = response.data

            if (success) {
              return data
            }

            showAlert(message, 'error', undefined, TIMEOUT_ALERT)
            return null
          })
          .catch((error) => {
            showAlert(showCatchError(error), 'error', undefined, TIMEOUT_ALERT)
            return null
          })
      },

      async _downloadExcelMovementsCancelled(
        params: IExportMovementCancelledParam
      ) {
        await executeApi()
          .get(`${URL_PATH}/export?format=xlsx`, {
            responseType: 'blob',
            params: { ...params, paginate: 1 },
          })
          .then((response) => {
            const blob = new Blob([response.data], {
              type: response.headers['content-type'],
            })
            const filename = useUtils().fileNameValidate(
              '',
              'Movimientos_de_tesorería_anulados'
            )

            useUtils().downloadBlobXlxx(blob, filename)
          })
          .catch((error) => {
            showAlert(showCatchError(error), 'error', undefined, TIMEOUT_ALERT)
          })
      },
    },
  }
)
