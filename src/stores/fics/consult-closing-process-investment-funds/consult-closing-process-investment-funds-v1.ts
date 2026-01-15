// Apis - Pinia
import { executeApi } from '@/apis'
import { defineStore } from 'pinia'

// Interfaces - Constants
import { TIMEOUT_ALERT } from '@/constants/alerts'
import { URL_PATH_FICS } from '@/constants/apis'
import {
  IFicMovementTable,
  IFicFundBusinessLine,
} from '@/interfaces/customs/fics/ConsultClosingProcessInvestmentFunds'

// Composables
import { useAlert, useShowError, useUtils } from '@/composables'

const { showAlert } = useAlert()
const { showCatchError } = useShowError()

const URL_PATH = `${URL_PATH_FICS}/closing-funds`

export const useConsultClosingProcessInvestmentFundsStoreV1 = defineStore(
  'consult-closing-process-investment-funds-v1',
  {
    state: () => ({
      version: 'v1',
      participation_type_list: [] as IFicFundBusinessLine[],
      participation_type_pages: {
        currentPage: 1,
        lastPage: 1,
      },
      movements_list: [] as IFicMovementTable[],
      movements_pages: {
        currentPage: 1,
        lastPage: 1,
      },
    }),
    actions: {
      async _listAction(params: Record<string, string | number>) {
        this._clearData()

        await executeApi()
          .get(
            `${URL_PATH_FICS}/collective-investment-funds/participation-types`,
            { params: { ...params, paginate: 1 } }
          )
          .then((response) => {
            const {
              data: { data: items = [], current_page = 0, last_page = 0 },
              message,
              success,
            } = response.data

            this.participation_type_list = items.map(
              (item: IFicFundBusinessLine) => ({
                ...item,
              })
            )
            this.participation_type_pages.currentPage = current_page
            this.participation_type_pages.lastPage = last_page

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

      async _listDetailAction(params: Record<string, string | number>) {
        this._clearDetailData()

        await executeApi()
          .get(`${URL_PATH}/detailed-movements?include[]=movement`, {
            params: { ...params, paginate: 1 },
          })
          .then((response) => {
            const {
              data: { data: items = [], current_page = 0, last_page = 0 },
              message,
              success,
            } = response.data

            this.movements_list = items.map((item: IFicMovementTable) => ({
              ...item,
            }))
            this.movements_pages.currentPage = current_page
            this.movements_pages.lastPage = last_page

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

      async _exportExcelAction(params: string) {
        await executeApi()
          .get(`${URL_PATH}/export-closure-process?${params}`, {
            responseType: 'blob',
          })
          .then((response) => {
            const blob = new Blob([response.data], {
              type: response.headers['content-type'],
            })
            const fileName = useUtils().getNameBlob(response)
            useUtils().downloadBlobXlxx(blob, fileName)

            return showAlert(
              'Descarga realizada correctamente',
              'success',
              undefined,
              TIMEOUT_ALERT
            )
          })
          .catch((error) => {
            showAlert(showCatchError(error), 'error', undefined, TIMEOUT_ALERT)
          })
      },

      _clearData() {
        this.participation_type_list = []
        this.participation_type_pages = {
          currentPage: 1,
          lastPage: 1,
        }
      },

      _clearDetailData() {
        this.movements_list = []
        this.movements_pages = {
          currentPage: 1,
          lastPage: 1,
        }
      },
    },
  }
)
