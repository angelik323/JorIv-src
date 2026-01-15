import { executeApi } from '@/apis'
import { useAlert, useShowError, useUtils } from '@/composables'
import { URL_PATH_INVESTMENT_PORTFOLIO } from '@/constants/apis'
import { defineStore } from 'pinia'
import { TIMEOUT_ALERT } from '@/constants/alerts'
import {
  ICreateBallotPayload,
  IGenerateBallotMenu,
  ISelectionMenuPayload,
} from '@/interfaces/customs'

const { showAlert } = useAlert()
const { showCatchError } = useShowError()

export const useGenerateBallotCollectionStoreV1 = defineStore(
  'generate-ballot-collection-store-v1',
  {
    state: () => ({
      menu_data: {} as IGenerateBallotMenu | null,
      investmentId: null as number | null,
      nature_operation: '' as string,
      request_flag: false,
      isForeign: false,
    }),

    actions: {
      async _createBallot(payload: ICreateBallotPayload): Promise<boolean> {
        let success = false
        await executeApi()
          .post(
            `${URL_PATH_INVESTMENT_PORTFOLIO}/instruction-slip/store`,
            payload,
            {
              responseType: 'blob',
            }
          )
          .then((response) => {
            const blob = new Blob([response.data], {
              type: response.headers['content-type'],
            })
            if (blob.size > 0) {
              success = true
              const fileName = useUtils().getNameBlob(response)
              useUtils().downloadBlobXlxx(blob, fileName)
              showAlert(
                'Archivo generado con éxito',
                'success',
                undefined,
                TIMEOUT_ALERT
              )
            } else {
              success = false
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
        return success
      },

      async _getSelectionMenu(payload: ISelectionMenuPayload) {
        return executeApi()
          .post(
            `${URL_PATH_INVESTMENT_PORTFOLIO}/instruction-slip/selection-menu`,
            payload
          )
          .then(({ data }) => {
            if (data.success) {
              return data.data
            }
          })
          .catch((error) => {
            showAlert(showCatchError(error), 'error', undefined, TIMEOUT_ALERT)
          })
      },

      _setMenuData(data: IGenerateBallotMenu | null) {
        this.menu_data = data
      },
      _setInvestmentId(id: number | null) {
        this.investmentId = id
      },
      _setNatureOperation(nature: string) {
        this.nature_operation = nature
      },
      _setRequestFlag(flag: boolean) {
        this.request_flag = flag
      },

      _setIsForeign(value: boolean) {
        this.isForeign = value
      },
    },
  }
)
