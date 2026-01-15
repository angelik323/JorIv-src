import { executeApi } from '@/apis'
import { useAlert, useShowError, useUtils } from '@/composables'
import { URL_PATH_INVESTMENT_PORTFOLIO } from '@/constants/apis'
import {
  IAmortizationTitleInformationForm,
  IAmortizationTitleTable,
  IAmortizationTitleTableRows,
} from '@/interfaces/customs/'
import { IUploadedFile } from '@/interfaces/global'
import { defineStore } from 'pinia'
import { TIMEOUT_ALERT } from '@/constants/alerts'
const { showAlert } = useAlert()
const { showCatchError } = useShowError()
const CONFIG = {
  headers: {
    'Content-Type': 'multipart/form-data',
  },
}

export const useAmortizationTitleTableCollectionStoreV1 = defineStore(
  'amortization-title-table-collection-store-v1',
  {
    state: () => ({
      amortization_title_table_list: [] as IAmortizationTitleTableRows[],
      amortization_title_table_pages: {
        currentPage: 0,
        lastPage: 0,
      },
      data_information_form: null as IAmortizationTitleTable | null,
      document_import: null as File | IUploadedFile | null,
      document_data_table: null as IAmortizationTitleInformationForm[] | null,
    }),
    actions: {
      async _getAmortizationTableList(params: string = ''): Promise<void> {
        this.amortization_title_table_list = []
        await executeApi()
          .get(
            `${URL_PATH_INVESTMENT_PORTFOLIO}/amortizable-title/list?paginate=true&${params}`
          )
          .then((response) => {
            if (response.data.success) {
              this.amortization_title_table_list =
                response.data?.data.data ?? []
              this.amortization_title_table_pages.currentPage =
                response.data?.data?.current_page ?? 0
              this.amortization_title_table_pages.lastPage =
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
      async _createAmortizationTitle(
        payload: IAmortizationTitleTable
      ): Promise<boolean> {
        let success = false
        await executeApi()
          .post(
            `${URL_PATH_INVESTMENT_PORTFOLIO}/amortizable-title/new`,
            payload
          )
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
      async _updateAmortizationTitle(
        id: string | number,
        payload: IAmortizationTitleTable
      ): Promise<boolean> {
        let success = false
        await executeApi()
          .put(
            `${URL_PATH_INVESTMENT_PORTFOLIO}/amortizable-title/update/${id}`,
            payload
          )
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
      async _deleteAmortizationTitle(id: string | number): Promise<boolean> {
        let success = false
        await executeApi()
          .delete(
            `${URL_PATH_INVESTMENT_PORTFOLIO}/amortizable-title/destroy/${id}`
          )
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
      async _getAmortizationTableById(id: string | number): Promise<void> {
        this.data_information_form = null
        await executeApi()
          .get(`${URL_PATH_INVESTMENT_PORTFOLIO}/amortizable-title/show/${id}`)
          .then((response) => {
            if (response.data.success) {
              this.data_information_form = response.data?.data ?? null
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
      async _importFileAmortization(origin: string): Promise<boolean> {
        let success = false
        await executeApi()
          .post(
            `${URL_PATH_INVESTMENT_PORTFOLIO}/amortizable-title/upload-file`,
            { file: this.document_import, origin },
            CONFIG
          )
          .then((response) => {
            if (response.data.success) {
              this.document_data_table = response.data?.data ?? null
              success = response.data.success
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
        return success
      },
      async _getTemplate(): Promise<void> {
        await executeApi()
          .get(
            `${URL_PATH_INVESTMENT_PORTFOLIO}/amortizable-title/download-template`,
            { responseType: 'blob' }
          )
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
      _setDataInformationForm(data: IAmortizationTitleTable | null) {
        this.data_information_form = data
      },
      _setDataDocuments(data_to_set: File | IUploadedFile | null) {
        this.document_import = data_to_set
      },
    },
  }
)
