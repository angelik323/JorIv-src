import { executeApi } from '@/apis'
import { useAlert, useShowError } from '@/composables'
import { TIMEOUT_ALERT } from '@/constants/alerts'
import { URL_PATH_TREASURIES } from '@/constants/apis'
import {
  ICheckBankAccountMovementItem,
  ICheckBankAccountMovementRequest,
} from '@/interfaces/customs'
import { createAndDownloadBlobByArrayBuffer } from '@/utils'
import { defineStore } from 'pinia'

const { showAlert } = useAlert()
const { showCatchError } = useShowError()

export const useCheckBankAccountMovementStoreV1 = defineStore(
  'check-bank-account-movement-store-v1',
  {
    state: () => ({
      data_check_bank_account_movement: [] as ICheckBankAccountMovementItem[],
      rowSelectedCheckBankAccountMovementRequest:
        null as ICheckBankAccountMovementRequest | null,
      headerPropsDefault: {
        title: 'Consulta movimiento cuenta bancaria',
        breadcrumbs: [
          {
            label: 'Inicio',
            route: 'HomeView',
          },
          {
            label: 'Tesorería',
          },
          {
            label: 'Consulta movimiento cuenta bancaria',
            route: 'CheckBankAccountMovementList',
          },
        ],
      },
      pages: {
        currentPage: 1,
        lastPage: 1,
      },
    }),
    actions: {
      async _getListCheckBankAccountMovement(params: string) {
        await executeApi()
          .get(
            `${URL_PATH_TREASURIES}/bank-account-movements?paginate=1&page=1${params}`
          )
          .then((response) => {
            if (response.data.success) {
              this.data_check_bank_account_movement =
                (response.data?.data
                  ?.data as ICheckBankAccountMovementItem[]) ?? []
              this.pages.currentPage = response.data?.data?.current_page ?? 1
              this.pages.lastPage = response.data?.data?.last_page ?? 1
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
      async _exportXlsxCheckBankAccountMovementList(params: string) {
        const nameFile = `Listado_de_consulta_movimiento_cuenta_bancaria`
        await executeApi()
          .get(
            `${URL_PATH_TREASURIES}/bank-account-movements/export?${params}`,
            {
              responseType: 'arraybuffer',
            }
          )
          .then((response) => {
            createAndDownloadBlobByArrayBuffer(
              response.data,
              nameFile,
              undefined,
              true
            )
          })
          .catch((error) => {
            showAlert(showCatchError(error), 'error', undefined, TIMEOUT_ALERT)
          })
      },

      async _getDetailCheckBankAccountMovement(
        id: number,
        from_date: string | null,
        to_date: string | null
      ) {
        await executeApi()
          .get(
            `${URL_PATH_TREASURIES}/bank-account-movements/details/${id}?from_date=${from_date}&to_date=${to_date}`
          )
          .then((response) => {
            if (response.data.success) {
              this.rowSelectedCheckBankAccountMovementRequest = response.data
                ?.data as ICheckBankAccountMovementRequest
            } else {
              showAlert(
                response.data.message,
                'error',
                undefined,
                TIMEOUT_ALERT
              )
            }
          })
          .catch((error) => {
            showAlert(showCatchError(error), 'error', undefined, TIMEOUT_ALERT)
          })
        return this.rowSelectedCheckBankAccountMovementRequest
      },
    },
  }
)
