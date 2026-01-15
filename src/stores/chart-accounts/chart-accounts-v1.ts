import { executeApi } from '@/apis'
import { useAlert, useShowError, useUtils } from '@/composables'

// pinia
import { defineStore } from 'pinia'

// interfaces
import {
  IChartAccountCreate,
  IChartAccount,
  IStructureChartAccount,
  IChartAccountResponse,
  ITemplateResponse,
  IErrorFileResponse,
  IPaginated,
} from '@/interfaces/customs'

import { URL_PATH_ACCOUNTING } from '@/constants/apis'

const URL_PATH_CHART_ACCOUNT = `${URL_PATH_ACCOUNTING}/account-charts`
const TIMEOUT_ALERT = 3000
const CONFIG = {
  headers: {
    'Content-Type': 'multipart/form-data',
  },
}

const { showAlert } = useAlert()
const { showCatchError } = useShowError()

export const useChartAccountsStoreV1 = defineStore('chart-accounts-v1', {
  state: () => ({
    version: 'v1',
    chart_accounts_list: [] as IStructureChartAccount[],
    chart_accounts_pages: {
      currentPage: 0,
      lastPage: 0,
    },
    data_information_form: null as IChartAccountCreate | null,
    data_modal: null as IChartAccount | null,
    chart_accounts_request: null as IChartAccountCreate | null,
    documents_import: null as File | null,
    data_errors_file: null as ITemplateResponse | null,
    total_records: null as number | null,
    temp_data_import: null as IChartAccountCreate | null,
    is_temp_data_import: false as boolean | null,
    queue_id: null as number | null,
    url_file: null as IErrorFileResponse | null,
    selected_structure_accounts: {
      list: [],
      pages: {
        currentPage: 1,
        lastPage: 1,
      },
    } as IPaginated<IChartAccount>,
  }),
  actions: {
    async _getListAction(params: string) {
      this._clearData()
      await executeApi()
        .get(`${URL_PATH_CHART_ACCOUNT}?paginate=1${params}`)
        .then((response) => {
          if (response.data.success) {
            this.chart_accounts_list = response.data?.data?.data ?? []
            this.chart_accounts_pages.currentPage =
              response.data?.data?.current_page ?? 0
            this.chart_accounts_pages.lastPage =
              response.data?.data?.last_page ?? 0
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

    async _getByIdChartAccount(id: number) {
      this._clearData()
      await executeApi()
        .get(`${URL_PATH_CHART_ACCOUNT}/${id}`)
        .then((response) => {
          if (response.data.success) {
            const res: IChartAccountResponse = response.data?.data
            if (res) {
              this.chart_accounts_request = {
                account_structure_id: res.structure.id,
                arrAccounts: res.accounts,
                structure: res.structure,
              }
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

    async _createChartAccount(data: IChartAccountCreate): Promise<boolean> {
      let success = false
      await executeApi()
        .post(`${URL_PATH_CHART_ACCOUNT}`, data)
        .then((response) => {
          success = response.data.success
          this._clearData()

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
      return success
    },

    async _importChartAccount(id: number): Promise<boolean> {
      let success = false
      await executeApi()
        .post(
          `${URL_PATH_CHART_ACCOUNT}/validate-import/excel/${id}`,
          { file: this.documents_import },
          CONFIG
        )
        .then((response) => {
          this._clearData()
          success = response.data.success
          this.queue_id = response.data.data?.queue_id

          return showAlert(
            response.data.success
              ? response.data.message
              : 'Error al importar el archivo',
            response.data.success ? 'success' : 'error',
            undefined,
            TIMEOUT_ALERT
          )
        })
        .catch((error) => {
          showAlert(showCatchError(error), 'error', undefined, TIMEOUT_ALERT)
        })

      return success
    },

    async _getInfoQueue(): Promise<string> {
      let state = ''

      await executeApi()
        .get(`${URL_PATH_ACCOUNTING}/queues/${this.queue_id}`)
        .then((response) => {
          this._clearData()
          state = response.data.data?.status

          const data = response.data.data?.data
          if (data?.accounts && state === 'Procesado') {
            this.total_records = data?.total_records
            this.temp_data_import = {
              arrAccounts:
                data?.accounts.map((item: IChartAccount) => ({
                  ...item,
                  code: `${item.code ?? ''}`,
                  status_id: item.status_id,
                })) ?? [],
              account_structure_id: data?.account_structure_id,
            } as IChartAccountCreate

            showAlert(
              response.data.success
                ? response.data.message
                : 'Error al importar el archivo',
              response.data.success ? 'success' : 'error',
              undefined,
              TIMEOUT_ALERT
            )
          }

          if (!data?.arrAccounts && response.data.data?.status === 'Errores') {
            this.url_file = {
              url: response.data.data?.error_file_url,
              name: response.data.data?.path,
            }
          }
        })
        .catch((error) => {
          showAlert(showCatchError(error), 'error', undefined, TIMEOUT_ALERT)
        })

      return state
    },

    async _saveImport(): Promise<boolean> {
      let success = false
      await executeApi()
        .post(`${URL_PATH_ACCOUNTING}/queues/${this.queue_id}`)
        .then((response) => {
          success = response.data.success
          this._clearData()

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
      return success
    },

    async _getFormatExcel(): Promise<void> {
      await executeApi()
        .get(`${URL_PATH_CHART_ACCOUNT}/excel/template`, {
          responseType: 'blob',
        })
        .then((response) => {
          const blob = new Blob([response.data], {
            type: response.headers['content-type'],
          })

          const name = useUtils().getNameBlob(response)
          useUtils().downloadBlobXlxx(blob, name)
        })
        .catch((error) => {
          showAlert(showCatchError(error), 'error', undefined, TIMEOUT_ALERT)
        })
    },

    async _updateChartAccount(data: IChartAccountCreate, id: number) {
      let success = false
      this.chart_accounts_request = null

      await executeApi()
        .put(`${URL_PATH_CHART_ACCOUNT}/${id}`, data)
        .then((response) => {
          success = response.data.success
          this._clearData()

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
      return success
    },

    async _changeStatusAction(id: number, statusId: number) {
      let success = false
      this.chart_accounts_request = null
      await executeApi()
        .patch(`${URL_PATH_CHART_ACCOUNT}/${id}/status`, {
          status_id: statusId === 1 ? 2 : 1,
        })
        .then((response) => {
          success = response.data.success
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

      return success
    },

    async _export(id: number) {
      let xlsFile = null
      await executeApi()
        .get(`${URL_PATH_CHART_ACCOUNT}/${id}/export`, {
          responseType: 'arraybuffer',
        })
        .then((response) => {
          xlsFile = response.data
          return showAlert(
            response.data.message ?? 'Exportación exitosa',
            response.status === 200 ? 'success' : 'error',
            undefined,
            TIMEOUT_ALERT
          )
        })
        .catch((error) => {
          showAlert(showCatchError(error), 'error', undefined, TIMEOUT_ALERT)
        })

      return xlsFile
    },

    async _getExportFile(queue_id: number) {
      let statusResponse = null
      await executeApi()
        .get(`${URL_PATH_ACCOUNTING}/queues/export/${queue_id}/status`)
        .then((response) => {
          statusResponse = response.data.data
        })
        .catch((error) => {
          showAlert(showCatchError(error), 'error', undefined, TIMEOUT_ALERT)
        })

      return statusResponse
    },

    _setDataInformationForm(data_to_set: IChartAccountCreate | null) {
      this.data_information_form = data_to_set ? { ...data_to_set } : null
    },

    _setDataDocuments(data_to_set: File | null) {
      this.documents_import = data_to_set
    },

    _setDataModalForm(data_to_set: IChartAccount | null) {
      this.data_modal = data_to_set ? { ...data_to_set } : null
    },

    _addDataModal(data: IChartAccount) {
      this.data_information_form?.accounts?.push(data)
    },

    _clearData() {
      this.chart_accounts_list = []
      this.chart_accounts_request = null
      this.data_information_form = null
      this.temp_data_import = null
    },

    _clearDataQueue() {
      this.queue_id = null
      this.url_file = null
    },
  },
})
