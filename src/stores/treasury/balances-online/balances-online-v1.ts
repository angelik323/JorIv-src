// store
import { defineStore } from 'pinia'

// composables
import { useAlert } from '@/composables/useAlert'
import { useShowError } from '@/composables/useShowError'

// utils
import { executeApi } from '@/apis'
import { IBalancesOnlineList } from '@/interfaces/customs'
import { URL_PATH_TREASURIES } from '@/constants/apis'
import { TIMEOUT_ALERT } from '@/constants/alerts'
import { useUtils } from '@/composables'

const URL_PATH = `${URL_PATH_TREASURIES}/bank-accounts`

export const useBalancesOnlineStoreV1 = defineStore(
  'balances-online-store-v1',
  {
    state: () => ({
      data_balances_online_list: [] as IBalancesOnlineList[],
      data_balances_online_pages: {
        currentPage: 0,
        lastPage: 0,
      },
      data_information_form: null as IBalancesOnlineList | null,
    }),

    actions: {
      async _getBalancesOnline(params: string) {
        const { showAlert } = useAlert()
        const { showCatchError } = useShowError()

        this._clearData()
        await executeApi()
          .get(`${URL_PATH}/balance?paginate=1${params}`)
          .then((response) => {
            if (response.data.success) {
              this.data_balances_online_list = response.data?.data?.data ?? []
              this.data_balances_online_pages = {
                currentPage: response.data?.data?.current_page ?? 1,
                lastPage: response.data?.data?.last_page ?? 1,
              }
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
      async _downloadPdf(params: string) {
        const { showAlert } = useAlert()

        await executeApi()
          .get(`${URL_PATH}/balance/export?${params}`, {
            responseType: 'blob',
          })
          .then((response) => {
            const blob = new Blob([response.data], {
              type: response.headers['content-type'],
            })

            const today = new Date()
            const year = today.getFullYear()
            const month = String(today.getMonth() + 1).padStart(2, '0')
            const day = String(today.getDate()).padStart(2, '0')
            const fileName = `Saldos_Cuentas_Bancarias_${year}-${month}-${day}.xlsx`

            useUtils().downloadBlobXlxx(blob, fileName)
            showAlert('Descarga exitosa', 'success', undefined, TIMEOUT_ALERT)
          })
          .catch(async (error) => {
            let errorMessage = 'Error al descargar el archivo Excel'

            if (error.response) {
              if (error.response.data instanceof Blob) {
                try {
                  const text = await error.response.data.text()

                  if (
                    error.response.headers['content-type']?.includes(
                      'application/json'
                    )
                  ) {
                    const jsonError = JSON.parse(text)
                    errorMessage = jsonError.message || errorMessage
                  }
                } catch (parseError) {}
              } else if (error.response.data?.message) {
                errorMessage = error.response.data.message
              }
            } else if (error.message) {
              errorMessage = error.message
            }

            showAlert(errorMessage, 'error', undefined, TIMEOUT_ALERT)
          })
      },

      _clearData() {
        this.data_balances_online_list = []
        this.data_balances_online_pages = {
          currentPage: 0,
          lastPage: 0,
        }
      },
    },
  }
)
