import {
  IAccountEquivalenceV2Create,
  IAccountingEquivalenceFailures,
} from '@/interfaces/customs'
import { useUtils, useAlert, useShowError } from '@/composables'
import { URL_PATH_ACCOUNTING } from '@/constants/apis'
import { TIMEOUT_ALERT } from '@/constants/alerts'
import { defineStore } from 'pinia'
import { executeApi } from '@/apis'
import { IErrors, IUploadedFile } from '@/interfaces/global'

const { showAlert } = useAlert()
const { showCatchError } = useShowError()
const CONFIG = {
  headers: {
    'Content-Type': 'multipart/form-data',
  },
}
export const usePucAccountEquivalenceStoreV2 = defineStore(
  'puc-account-equivalence-store-v2',
  {
    state: () => ({
      version: 'v2',
      account_equivalence_list: [],
      account_equivalence_pages: {
        currentPage: 1,
        lastPage: 1,
      },
      document_import: null as File | null | IUploadedFile | [],
      account_edit: {} as IAccountEquivalenceV2Create,
      validate_list: [],
      total_count: 0,
      file_name: '',
      valid_count: 0,
      failures_list: [] as IAccountingEquivalenceFailures[],
    }),

    actions: {
      async _getAccountEquivalences(params: string) {
        await executeApi()
          .get(
            `${URL_PATH_ACCOUNTING}/v2/account-equivalences?paginate=1${params}`
          )
          .then((response) => {
            if (response.data.success) {
              this.account_equivalence_list = response.data.data.data ?? []
              this.account_equivalence_pages = {
                currentPage: response.data?.data.current_page ?? 1,
                lastPage: response.data?.data.last_page ?? 1,
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

      async _createAccountEquivalence(data: IAccountEquivalenceV2Create) {
        await executeApi()
          .post(`${URL_PATH_ACCOUNTING}/v2/account-equivalences`, data)
          .then((response) => {
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

      async _getAccountingEquivalenceById(id: string | number): Promise<void> {
        return await executeApi()
          .get(`${URL_PATH_ACCOUNTING}/v2/account-equivalences/${id}`)
          .then((response) => {
            if (response.data.success) {
              this.account_edit = response.data.data
              return response.data.data
            }

            showAlert(
              response.data.message || 'Error al obtener el balance',
              'error',
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

      async _exportAccountingEquivalence(
        sourceStructure?: number,
        equivalentStructure?: number
      ) {
        await executeApi()
          .get(`${URL_PATH_ACCOUNTING}/v2/account-equivalences/excel/export`, {
            responseType: 'blob',
            params: {
              'filter[source_structure_id]': sourceStructure,
              'filter[equivalent_structure_id]': equivalentStructure,
            },
          })
          .then((response) => {
            const blob = new Blob([response.data], {
              type: response.headers['content-type'],
            })
            const fileName = useUtils().getNameBlob(response)
            useUtils().downloadBlobXlxx(blob, fileName)
            if (response.status === 200) {
              return showAlert(
                response.data.message
                  ? response.data.message
                  : 'Archivo descargado con éxito',
                'success',
                undefined,
                TIMEOUT_ALERT
              )
            }
          })
          .catch((error) => {
            showAlert(showCatchError(error), 'error', undefined, TIMEOUT_ALERT)
          })
      },
      async _downloadTemplate(id?: number | string) {
        await executeApi()
          .get(
            `${URL_PATH_ACCOUNTING}/v2/account-equivalences/download-template?filter[source_structure_id]=${id}`,
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
            if (response.status === 200) {
              return showAlert(
                response.data.message
                  ? response.data.message
                  : 'Archivo descargado con éxito',
                'success',
                undefined,
                TIMEOUT_ALERT
              )
            }
          })
          .catch((e) => {
            const error = e as IErrors
            const message = showCatchError(error)
            showAlert(message)
          })
      },
      async _validateImportFile(): Promise<boolean> {
        let success = false
        await executeApi()
          .post(
            `${URL_PATH_ACCOUNTING}/v2/account-equivalences/validate`,
            { file: this.document_import },
            CONFIG
          )
          .then((response) => {
            this.validate_list =
              response.data.data.valid_accounts_equivalences ?? []
            this.failures_list = response.data.data.failures ?? []
            if (response.data.success) {
              this.file_name = response.data.data.file_name ?? ''
              this.total_count = response.data.data.total_count
              this.valid_count = response.data.data.valid_count
              this.validate_list =
                response.data.data.validated_accounts_equivalences ?? []

              success = true
            }
            return showAlert(
              response.data.message,
              response.data.success ? 'success' : 'error',
              undefined,
              TIMEOUT_ALERT
            )
          })
          .catch((error) => {
            this.file_name = ''
            this.total_count = 0
            this.valid_count = 0
            this.validate_list = []
            showAlert(showCatchError(error), 'error', undefined, TIMEOUT_ALERT)
          })
        return success
      },
      async _exportExcel() {
        await executeApi()
          .get(`${URL_PATH_ACCOUNTING}/v2/account-equivalences/excel/export`, {
            responseType: 'blob',
          })
          .then((response) => {
            const blob = new Blob([response.data], {
              type: response.headers['content-type'],
            })
            const fileName = useUtils().getNameBlob(response)
            useUtils().downloadBlobXlxx(blob, fileName)

            return showAlert(
              response.data.message,
              'success',
              undefined,
              TIMEOUT_ALERT
            )
          })
          .catch((error) => {
            showAlert(showCatchError(error), 'error', undefined, TIMEOUT_ALERT)
          })
      },
      async _downloadFailuresExcel(
        failures: IAccountingEquivalenceFailures[]
      ): Promise<void> {
        await executeApi()
          .post(
            `${URL_PATH_ACCOUNTING}/v2/account-equivalences/export-failures`,
            { failures },
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
            return showAlert(
              '¡Errores descargados con éxito!',
              'success',
              undefined,
              TIMEOUT_ALERT
            )
          })
          .catch((error) => {
            showAlert(showCatchError(error), 'error', undefined, TIMEOUT_ALERT)
          })
      },
      _setDataDocuments(data_to_set: File | IUploadedFile | null) {
        this.document_import = data_to_set
      },
    },
  }
)
