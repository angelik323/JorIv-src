// Pinia - Axios
import { defineStore } from 'pinia'

// Interfaces
import {
  IIndexingIpcProcessItem,
  IIndexingListRequest,
  IFundInfoRequest,
} from '@/interfaces/customs'

// Composables
import { useAlert, useShowError, useUtils } from '@/composables'

// Utils
import { TIMEOUT_ALERT } from '@/constants/alerts'
import { URL_PATH_FICS } from '@/constants/apis'
import { executeApi } from '@/apis'

const URL_PATH = `${URL_PATH_FICS}/indexation`

const initialState = () => ({
  version: 'v1',
  indexing_ipc_list: [] as IIndexingListRequest[],
  indexing_ipc_process_list: [] as IIndexingIpcProcessItem[],
  indexing_ipc_pages: {
    currentPage: 0,
    lastPage: 0,
  },
  indexing_process_ipc_pages: {
    currentPage: 0,
    lastPage: 0,
  },
  indexing_fund: {
    fund_id: null as string | string[] | null,
    fund_rate: null as string | null,
    fund_info: {} as IFundInfoRequest,
  },
})

export const useIndexingIpcStoreV1 = defineStore('indexing-ipc-store-v1', {
  state: initialState,
  actions: {
    async _getIndexingIpcList(params: string) {
      this._cleanData()

      const { showAlert } = useAlert()
      const { showCatchError } = useShowError()

      await executeApi()
        .get(`${URL_PATH}?paginate=1&${params}`)
        .then((response) => {
          const {
            data: { data: items, current_page, last_page },
            message,
            success,
          } = response.data

          if (success) {
            this.indexing_ipc_list = items ?? []
            this.indexing_ipc_pages.currentPage = current_page ?? 0
            this.indexing_ipc_pages.lastPage = last_page ?? 0
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
    async _createIndexingIpc(fund_id: string | string[], rate: string | null) {
      let isSuccess = false

      const { showAlert } = useAlert()
      const { showCatchError } = useShowError()

      await executeApi()
        .post(`${URL_PATH}`, { fund_id, rate })
        .then((response) => {
          const { message, success } = response.data

          isSuccess = success
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

      return isSuccess
    },

    async _processIndexingIpc(
      fund_id: String | String[],
      rate?: string | null
    ) {
      const { showAlert } = useAlert()
      const { showCatchError } = useShowError()

      await executeApi()
        .get(`${URL_PATH}/process/${fund_id}?paginate=1`, {
          params: { rate },
        })
        .then((response) => {
          const {
            data: { data: items, current_page, last_page },
            message,
            success,
          } = response.data

          if (success) {
            this.indexing_ipc_process_list = items ?? []
            this.indexing_process_ipc_pages.currentPage = current_page ?? 0
            this.indexing_process_ipc_pages.lastPage = last_page ?? 0
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

    async _downloadIndexingIpc(
      fund_id: String | string[],
      _code_fund: string,
      origin: string
    ) {
      const { showAlert } = useAlert()
      const { showCatchError } = useShowError()
      const utils = useUtils()

      await executeApi()
        .get(
          `${URL_PATH}/${
            origin === 'create' || origin === 'read'
              ? 'export-process'
              : 'export'
          }/${fund_id}`,
          {
            responseType: 'blob',
          }
        )
        .then((response) => {
          const blob = new Blob([response.data], {
            type: response.headers['content-type'],
          })

          const fileName = utils.getNameBlob(response)
          utils.downloadBlobXlxx(blob, fileName)

          return showAlert(
            'Descarga exitosa',
            'success',
            undefined,
            TIMEOUT_ALERT
          )
        })
        .catch(async (error) => {
          showAlert(showCatchError(error), 'error', undefined, TIMEOUT_ALERT)
        })
    },

    _cleanData() {
      this.indexing_ipc_list = []
      this.indexing_ipc_pages = {
        currentPage: 0,
        lastPage: 0,
      }
      this.indexing_process_ipc_pages = {
        currentPage: 0,
        lastPage: 0,
      }
      this.indexing_fund = initialState().indexing_fund
    },
  },
  persist: true,
})
