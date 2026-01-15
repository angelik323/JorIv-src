import { defineStore } from 'pinia'
import { executeApi } from '@/apis'
import { URL_PATH_TREASURIES } from '@/constants/apis'
import { TIMEOUT_ALERT } from '@/constants/alerts'
import { useAlert, useShowError, useUtils } from '@/composables'
import {
  IConsecutiveDetailResponse,
  IMovementConsecutivesResponse,
} from '@/interfaces/customs'

const { showAlert } = useAlert()
const { showCatchError } = useShowError()
export const useConsecutiveMovementsV1 = defineStore(
  'consecutive-movements-store-v1',
  {
    state: () => ({
      consecutiveMovementList: [] as IMovementConsecutivesResponse[],
      consecutiveMovemenPages: {
        currentPage: 0,
        lastPage: 0,
      },
    }),
    actions: {
      async _getConsecutiveMovementList(
        params: Record<string, string | number>
      ) {
        this.consecutiveMovementList = []

        await executeApi()
          .get(`${URL_PATH_TREASURIES}/treasury-movement-consecutives`, {
            params: { ...params, paginate: 1 },
          })
          .then((response) => {
            if (response.data.success) {
              this.consecutiveMovementList = response.data?.data?.data ?? []
              this.consecutiveMovemenPages = {
                currentPage: response.data?.data?.current_page ?? 1,
                lastPage: response.data?.data?.last_page ?? 1,
              }

              showAlert(
                response.data.message,
                'success',
                undefined,
                TIMEOUT_ALERT
              )
            }
          })
          .catch((error) => {
            this.consecutiveMovementList = []
            showAlert(showCatchError(error), 'error', undefined, TIMEOUT_ALERT)
          })
      },

      async _showConsecutiveDetail(id: number) {
        return await executeApi()
          .get(`${URL_PATH_TREASURIES}/treasury-movement-consecutives/${id}`)
          .then((response) => {
            if (response.data.success)
              return response.data as IConsecutiveDetailResponse

            showAlert(
              response.data.message,
              response.data.success ? 'success' : 'error',
              undefined,
              TIMEOUT_ALERT
            )
            return null
          })
          .catch((error) => {
            showAlert(showCatchError(error), 'error', undefined, TIMEOUT_ALERT)
            return null
          })
      },

      async _downloadExcelAction(params: string) {
        await executeApi()
          .get(
            `${URL_PATH_TREASURIES}/treasury-movement-consecutives/export?${params}`,
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

            showAlert(
              'Archivo descargado correctamente',
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
