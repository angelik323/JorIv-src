// Core - Pinia - API
import { defineStore } from 'pinia'
import { executeApi } from '@/apis'
import { URL_PATH_BUDGET } from '@/constants/apis'
import { TIMEOUT_ALERT } from '@/constants/alerts'
// Composables
import { useAlert, useShowError, useUtils } from '@/composables'
// Interfaces & types
import type {
  IClosureVigency,
  IClosureVigencyRow,
  IBusinessForClosure,
  IBusinessForClosureAPIResponse,
  IClosureVigencyCreatePayload,
  IClosureVigencyExecutionResult,
  IClosureVigencyConfirmPayload,
  IClosureVigencyDetail,
  IProcessedBusiness,
  IBusinessDocument,
} from '@/interfaces/customs/budget/ClosureVigency'

const URL_PATH = `${URL_PATH_BUDGET}/v2/budget-year-closing`

const { showAlert } = useAlert()
const { showCatchError } = useShowError()

export const useClosureVigencyStoreV1 = defineStore(
  'closure-vigency-store-v1',
  {
    state: () => ({
      version: 'v1',
      closure_vigency_list: [] as IClosureVigencyRow[],
      closure_vigency_pages: {
        currentPage: 1,
        lastPage: 1,
      },
      selected_closure_vigency: null as IClosureVigency | null,
      // Para el formulario de crear
      businesses_for_closure: [] as IBusinessForClosure[],
      // Para la vista de ejecución
      execution_result: null as IClosureVigencyExecutionResult | null,
      // Para la vista de Ver (View)
      process_detail: null as IClosureVigencyDetail | null,
      processed_businesses: [] as IProcessedBusiness[],
      processed_businesses_pages: {
        currentPage: 1,
        lastPage: 1,
      },
      business_documents: [] as IBusinessDocument[],
      business_documents_pages: {
        currentPage: 1,
        lastPage: 1,
      },
    }),

    actions: {
      _clearData() {
        this.closure_vigency_list = []
        this.closure_vigency_pages = {
          currentPage: 1,
          lastPage: 1,
        }
        this.selected_closure_vigency = null
      },

      _clearBusinessesForClosure() {
        this.businesses_for_closure = []
      },

      async _listAction(params: Record<string, string | number>) {
        this._clearData()
        await executeApi()
          .get(`${URL_PATH}`, { params: { ...params, paginate: 1 } })
          .then((response) => {
            const {
              data: { data = [], current_page = 0, last_page = 0 },
              message,
              success,
            } = response.data

            this.closure_vigency_list = data.map(
              (item: IClosureVigencyRow, index: number) => ({
                ...item,
                _row_number: index + 1,
              })
            )
            this.closure_vigency_pages.currentPage = current_page
            this.closure_vigency_pages.lastPage = last_page

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

      async _showAction(id: string | number) {
        let result: IClosureVigency | null = null
        await executeApi()
          .get(`${URL_PATH}/${id}`)
          .then((response) => {
            if (response.data.success) {
              result = response.data.data
              this.selected_closure_vigency = result
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
        return result
      },

      async _downloadErrorReportAction(id: string | number) {
        await executeApi()
          .get(`${URL_PATH}/${id}/error-report`, {
            responseType: 'blob',
          })
          .then((response) => {
            const blob = new Blob([response.data], {
              type: response.headers['content-type'],
            })
            const fileName = useUtils().getNameBlob(response)
            useUtils().downloadBlobXlxx(blob, fileName)

            return showAlert(
              response.data.message || 'La descarga comenzará pronto',
              'success',
              undefined,
              TIMEOUT_ALERT
            )
          })
          .catch((error) => {
            showAlert(showCatchError(error), 'error', undefined, TIMEOUT_ALERT)
          })
      },

      // Buscar negocios para cierre/deshacer cierre
      async _listBusinessTrustInRangeAction(
        params: Record<string, string | number>
      ) {
        this._clearBusinessesForClosure()
        let result = false
        await executeApi()
          .get(`${URL_PATH}/list-business-trust-in-range`, {
            params: { ...params, paginate: 1 },
          })
          .then((response) => {
            const {
              data: { data = [] },
              message,
              success,
            } = response.data

            if (success) {
              // Mapear los datos de la API al formato esperado por la interfaz
              this.businesses_for_closure = data.map(
                (item: IBusinessForClosureAPIResponse) => {
                  // Extraer código y nombre del campo business_trust que viene como "888930 - Inversiones Bolivar Regionales"
                  const businessTrustParts =
                    item.business_trust?.split(' - ') || []
                  const code = businessTrustParts[0] || null
                  const name = businessTrustParts.slice(1).join(' - ') || null

                  return {
                    id: item['#'] || null,
                    code,
                    name,
                    closure_type: item.closing_type || null,
                    document_type_code: item.document_type || null,
                    document_type_name: null, // El API no devuelve este campo separado
                    document_number: item.document_number
                      ? String(item.document_number)
                      : null,
                    last_closed_vigency:
                      item.last_closing_date &&
                      item.last_closing_date !== 'Sin cierre previo'
                        ? new Date(item.last_closing_date).getFullYear()
                        : null,
                    selected: false,
                  }
                }
              )
              result = true
            }
            return showAlert(
              message,
              success ? 'success' : 'info',
              undefined,
              TIMEOUT_ALERT
            )
          })
          .catch((error) => {
            showAlert(showCatchError(error), 'error', undefined, TIMEOUT_ALERT)
          })
        return result
      },

      // Ejecutar cierre/deshacer cierre
      async _executeClosureAction(
        payload: IClosureVigencyCreatePayload
      ): Promise<IClosureVigencyExecutionResult | null> {
        let result: IClosureVigencyExecutionResult | null = null
        await executeApi()
          .post(`${URL_PATH}`, payload)
          .then((response) => {
            const { data, message, success } = response.data
            if (success && data) {
              result = data
              this.execution_result = data
            }

            showAlert(
              message || 'Proceso ejecutado exitosamente',
              success ? 'success' : 'error',
              undefined,
              success ? 5000 : TIMEOUT_ALERT
            )
          })
          .catch((error) => {
            showAlert(
              showCatchError(error) || 'El proceso no pudo ser ejecutado.',
              'error',
              undefined,
              TIMEOUT_ALERT
            )
          })
        return result
      },

      // Confirmar el proceso de cierre/deshacer cierre
      async _confirmClosureAction(payload: IClosureVigencyConfirmPayload) {
        let result = false
        await executeApi()
          .post(`${URL_PATH}/confirm`, payload)
          .then((response) => {
            const { message, success } = response.data
            result = success

            showAlert(
              message ||
                (payload.process_partial
                  ? 'Proceso parcial completado exitosamente'
                  : 'Proceso completado exitosamente'),
              success ? 'success' : 'error',
              undefined,
              success ? 5000 : TIMEOUT_ALERT
            )
          })
          .catch((error) => {
            showAlert(
              showCatchError(error) || 'El proceso no pudo ser confirmado.',
              'error',
              undefined,
              TIMEOUT_ALERT
            )
          })
        return result
      },

      // Descargar reporte de errores de una ejecución
      async _downloadExecutionErrorReport(executionId: string | number) {
        await executeApi()
          .get(`${URL_PATH}/execution/${executionId}/error-report`, {
            responseType: 'blob',
          })
          .then((response) => {
            const blob = new Blob([response.data], {
              type: response.headers['content-type'],
            })
            const fileName = useUtils().getNameBlob(response)
            useUtils().downloadBlobXlxx(blob, fileName)

            return showAlert(
              'La descarga comenzará pronto',
              'success',
              undefined,
              TIMEOUT_ALERT
            )
          })
          .catch((error) => {
            showAlert(showCatchError(error), 'error', undefined, TIMEOUT_ALERT)
          })
      },

      _clearExecutionResult() {
        this.execution_result = null
      },

      // === Acciones para la vista de Ver (View) ===

      _clearViewData() {
        this.process_detail = null
        this.processed_businesses = []
        this.processed_businesses_pages = { currentPage: 1, lastPage: 1 }
        this.business_documents = []
        this.business_documents_pages = { currentPage: 1, lastPage: 1 }
      },

      // Obtener detalle del proceso
      async _getProcessDetailAction(processId: string | number) {
        let result: IClosureVigencyDetail | null = null
        await executeApi()
          .get(`${URL_PATH}/${processId}`)
          .then((response) => {
            if (response.data.success) {
              result = response.data.data
              this.process_detail = result
            }
          })
          .catch((error) => {
            showAlert(showCatchError(error), 'error', undefined, TIMEOUT_ALERT)
          })
        return result
      },

      // Listar negocios procesados
      async _listProcessedBusinessesAction(
        processId: string | number,
        params: Record<string, string | number>
      ) {
        this.processed_businesses = []
        await executeApi()
          .get(`${URL_PATH}/${processId}/businesses`, {
            params: { ...params, paginate: 1 },
          })
          .then((response) => {
            const {
              data: { data = [], current_page = 1, last_page = 1 },
            } = response.data

            this.processed_businesses = data.map(
              (item: IProcessedBusiness, index: number) => ({
                ...item,
                _row_number: index + 1,
                selected: false,
              })
            )
            this.processed_businesses_pages.currentPage = current_page
            this.processed_businesses_pages.lastPage = last_page
          })
          .catch((error) => {
            showAlert(showCatchError(error), 'error', undefined, TIMEOUT_ALERT)
          })
      },

      // Listar documentos de un negocio
      async _listBusinessDocumentsAction(
        processId: string | number,
        businessId: string | number,
        params: Record<string, string | number>
      ) {
        this.business_documents = []
        await executeApi()
          .get(`${URL_PATH}/${processId}/businesses/${businessId}/documents`, {
            params: { ...params, paginate: 1 },
          })
          .then((response) => {
            const {
              data: { data = [], current_page = 1, last_page = 1 },
            } = response.data

            this.business_documents = data.map(
              (item: IBusinessDocument, index: number) => ({
                ...item,
                _row_number: index + 1,
              })
            )
            this.business_documents_pages.currentPage = current_page
            this.business_documents_pages.lastPage = last_page
          })
          .catch((error) => {
            showAlert(showCatchError(error), 'error', undefined, TIMEOUT_ALERT)
          })
      },
    },
  }
)
