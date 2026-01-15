import { executeApi } from '@/apis'
import { URL_PATH_DERIVATIVE_CONTRACTING_GENERAL_CONTRACT_INQUIRY } from '@/constants/apis'
import { defineStore } from 'pinia'
import { useAlert, useShowError } from '@/composables'
import {
  IGeneralContractInquiryListItem,
  IGeneralContractInquiryForm,
  IScheduledPaymentMilestone,
  IAssociatedBudget,
  IAnnexDocument,
  IAnnexRelation,
  IPolicyCoverage,
  IAttachment,
  IContractClause,
  IDocumentFile,
} from '@/interfaces/customs/derivative-contracting/GeneralContractInquiry'
import { IErrors } from '@/interfaces/global'

import { useUtils } from '@/composables'

const TIMEOUT_ALERT = 3000
const { showAlert } = useAlert()
const { showCatchError } = useShowError()

export const useGeneralContractInquiryStoreV1 = defineStore(
  'general-contract-inquiry-store-v1',
  {
    state: () => ({
      version: 'v1',
      general_contract_inquiry_list: [] as IGeneralContractInquiryListItem[],
      scheduled_payment_milestones_view: [] as IScheduledPaymentMilestone[],
      associated_budget_view: [] as IAssociatedBudget[],
      associated_budget_commitment_view: [] as IAssociatedBudget[],
      annex_documents_view: [] as IAnnexDocument[],
      relation_annex_documents_view: [] as IAnnexRelation[],
      coverings_view: [] as IPolicyCoverage[],
      attached_documents_view: [] as IAttachment[],
      clauses_view: [] as IContractClause[],
      document_file_view: null as IDocumentFile | null,
      general_contract_inquiry_response: null as IGeneralContractInquiryForm | null,
      general_contract_inquiry_pages: {
        currentPage: 0,
        lastPage: 0,
      },
    }),
    actions: {
      /**
       * Obtener lista de documentos anexos
       * @param params - Parámetros de filtrado (ej: 'page=1&search=test')
       */
      async _getGeneralContractInquiryList(params: Record<string, string | number>) {
        this.general_contract_inquiry_list = []
        await executeApi()
          .get(`${URL_PATH_DERIVATIVE_CONTRACTING_GENERAL_CONTRACT_INQUIRY}/`, {
            params: { ...params, paginate: 1 },
          })
          .then((response) => {
            const {
              data: { data: items = [], current_page = 0, last_page = 0 },
              message,
              success,
            } = response.data

            this.general_contract_inquiry_list = items.map(
              (item: IGeneralContractInquiryListItem) => ({
                ...item,
              })
            )
            this.general_contract_inquiry_pages.currentPage = current_page
            this.general_contract_inquiry_pages.lastPage = last_page

            showAlert(
              message,
              success ? 'success' : 'error',
              undefined,
              TIMEOUT_ALERT
            )
          })
          .catch((e) => {
            const error = e as IErrors
            const message = showCatchError(error)
            showAlert(message, 'error', undefined, TIMEOUT_ALERT)
          })
      },

      /**
       * Obtener un documento anexo por ID
       * @param id - ID del documento anexo
       * @returns IGeneralContractInquiryForm | null - Los datos del contrato o null si falla
       */
      async _getGeneralContractInquiryById(id: number): Promise<IGeneralContractInquiryForm | null> {
        let result: IGeneralContractInquiryForm | null = null
        await executeApi()
          .get(`${URL_PATH_DERIVATIVE_CONTRACTING_GENERAL_CONTRACT_INQUIRY}/${id}`)
          .then((response) => {
            if (response.data.success) {
              this.general_contract_inquiry_response = response.data.data
              result = response.data.data
            }
          })
          .catch((error) => {
            showAlert(showCatchError(error), 'error', undefined, TIMEOUT_ALERT)
          })
        return result
      },


      /**
       * Obtener lista de hitos de pagos programados
       * routeParams: { id: number }
       */
      async _getScheduledPaymentMilestonesView(id: number) {
        this.scheduled_payment_milestones_view = []
        await executeApi()
          .get(`${URL_PATH_DERIVATIVE_CONTRACTING_GENERAL_CONTRACT_INQUIRY}/${id}/list-payment-milestone`)
          .then((response) => {
            const {
              data: items = [],
              message,
              success,
            } = response.data

            this.scheduled_payment_milestones_view = items.map(
              (item: IScheduledPaymentMilestone) => ({
                ...item,
              })
            )
            
            // La paginación no viene en esta respuesta, así que la establecemos manualmente
            this.general_contract_inquiry_pages.currentPage = 1
            this.general_contract_inquiry_pages.lastPage = 1

            showAlert(
              message,
              success ? 'success' : 'error',
              undefined,
              TIMEOUT_ALERT
            )
          })
          .catch((e) => {
            const error = e as IErrors
            const message = showCatchError(error)
            showAlert(message, 'error', undefined, TIMEOUT_ALERT)
          })
      },


      /**
       * Obtener dos listas de presupuesto asociado
       * routeParams: { id: number }
       */
      async _getAssociatedBudgetView(id: number) {
        this.associated_budget_view = []
        await executeApi()
          .get(`${URL_PATH_DERIVATIVE_CONTRACTING_GENERAL_CONTRACT_INQUIRY}/${id}/list-availability`)
          .then((response) => {
            const {
              data: items = [],
              message,
              success,
            } = response.data

            this.associated_budget_view = items.map(
              (item: IAssociatedBudget) => ({
                ...item,
              })
            )
            
            // La paginación no viene en esta respuesta, así que la establecemos manualmente
            this.general_contract_inquiry_pages.currentPage = 1
            this.general_contract_inquiry_pages.lastPage = 1

            showAlert(
              message,
              success ? 'success' : 'error',
              undefined,
              TIMEOUT_ALERT
            )
          })
          .catch((e) => {
            const error = e as IErrors
            const message = showCatchError(error)
            showAlert(message, 'error', undefined, TIMEOUT_ALERT)
          })
      },


      /**
       * Obtener dos listas de compromiso presupuestario
       * queryParams: source_type=contrato&budget_id=13
       */
      async _getAssociatedBudgetCommitmentView(contractId: number, sourceType: string, budgetId: number) {
        this.associated_budget_commitment_view = []
        await executeApi()
          .get(`${URL_PATH_DERIVATIVE_CONTRACTING_GENERAL_CONTRACT_INQUIRY}/${contractId}/list-commitment`, {
            params: {
              source_type: sourceType,
              budget_id: budgetId,
            },
          })
          .then((response) => {
            const {
              data: items = [],
              message,
              success,
            } = response.data

            this.associated_budget_commitment_view = items.map(
              (item: IAssociatedBudget) => ({
                ...item,
              })
            )
            
            // La paginación no viene en esta respuesta, así que la establecemos manualmente
            this.general_contract_inquiry_pages.currentPage = 1
            this.general_contract_inquiry_pages.lastPage = 1

            showAlert(
              message,
              success ? 'success' : 'error',
              undefined,
              TIMEOUT_ALERT
            )
          })
          .catch((e) => {
            const error = e as IErrors
            const message = showCatchError(error)
            showAlert(message, 'error', undefined, TIMEOUT_ALERT)
          })
      },

      /**
       * Obtener 1 lista de documentos anexos
       * routeParams: { id: number }
       */
      async _getAnnexDocumentsView(contractId: number) {
        this.annex_documents_view = []
        await executeApi()
          .get(`${URL_PATH_DERIVATIVE_CONTRACTING_GENERAL_CONTRACT_INQUIRY}/${contractId}/annex-documents`)
          .then((response) => {
            const {
              data: items = [],
              message,
              success,
            } = response.data

            this.annex_documents_view = items.map(
              (item: IAnnexDocument) => ({
                ...item,
              })
            )
            
            // La paginación no viene en esta respuesta, así que la establecemos manualmente
            this.general_contract_inquiry_pages.currentPage = 1
            this.general_contract_inquiry_pages.lastPage = 1

            showAlert(
              message,
              success ? 'success' : 'error',
              undefined,
              TIMEOUT_ALERT
            )
          })
          .catch((e) => {
            const error = e as IErrors
            const message = showCatchError(error)
            showAlert(message, 'error', undefined, TIMEOUT_ALERT)
          })
      },

      /**
       * Obtener una lista de la relación de documentos anexos 
       * queryParams: list-relation-annex/8?source_type=contrato
       */
      async _getRelationAnnexDocumentsView(contractId: number, annexId: number, sourceType: string) {
        this.relation_annex_documents_view = []
        await executeApi()
          .get(`${URL_PATH_DERIVATIVE_CONTRACTING_GENERAL_CONTRACT_INQUIRY}/${contractId}/list-relation-annex/${annexId}`, {
            params: {
              source_type: sourceType,
            },
          })
          .then((response) => {
            const {
              data: item,
              message,
              success,
            } = response.data

            // La respuesta es un objeto único, no un array
            if (item) {
              this.relation_annex_documents_view = [item]
            }
            
            // La paginación no viene en esta respuesta, así que la establecemos manualmente
            this.general_contract_inquiry_pages.currentPage = 1
            this.general_contract_inquiry_pages.lastPage = 1

            showAlert(
              message,
              success ? 'success' : 'error',
              undefined,
              TIMEOUT_ALERT
            )
          })
          .catch((e) => {
            const error = e as IErrors
            const message = showCatchError(error)
            showAlert(message, 'error', undefined, TIMEOUT_ALERT)
          })
      },


      /**
       * Obtener una lista de cubrimientos 
       * queryParams: list-policy-coverage/8?source_type=contrato
       */
      async _getCoveringsView(contractId: number, annexId: number, sourceType: string) {
        this.coverings_view = []
        await executeApi()
          .get(`${URL_PATH_DERIVATIVE_CONTRACTING_GENERAL_CONTRACT_INQUIRY}/${contractId}/list-policy-coverage/${annexId}`, {
            params: {
              source_type: sourceType,
            },
          })
          .then((response) => {
            const {
              data: items = [],
              message,
              success,
            } = response.data

            // La respuesta es un array de cubrimientos
            this.coverings_view = items.map(
              (item: IPolicyCoverage) => ({
                ...item,
              })
            )
            
            // La paginación no viene en esta respuesta, así que la establecemos manualmente
            this.general_contract_inquiry_pages.currentPage = 1
            this.general_contract_inquiry_pages.lastPage = 1

            showAlert(
              message,
              success ? 'success' : 'error',
              undefined,
              TIMEOUT_ALERT
            )
          })
          .catch((e) => {
            const error = e as IErrors
            const message = showCatchError(error)
            showAlert(message, 'error', undefined, TIMEOUT_ALERT)
          })
      },


      /**
       * Obtener una lista de documentos adjuntos de un documento anexo
       * queryParams: list-attachments/:documentId?source_type=contrato&attachment_type=contrato
       */
      async _getAttachedDocumentsView(contractId: number, documentId: number, sourceType: string) {
        this.attached_documents_view = []
        await executeApi()
          .get(`${URL_PATH_DERIVATIVE_CONTRACTING_GENERAL_CONTRACT_INQUIRY}/${contractId}/list-attachments/${documentId}`, {
            params: {
              source_type: sourceType,
              attachment_type: sourceType,
            },
          })
          .then((response) => {
            const {
              data: responseData,
              message,
              success,
            } = response.data

            // Verificar si la respuesta tiene una propiedad attached_documents
            let items = []
            if (Array.isArray(responseData)) {
              // Si data es directamente un array
              items = responseData
            } else if (responseData && Array.isArray(responseData.attached_documents)) {
              // Si data es un objeto con propiedad attached_documents
              items = responseData.attached_documents
            } else if (responseData && responseData.attached_documents) {
              // Si attached_documents es un objeto único
              items = [responseData.attached_documents]
            }

            // La respuesta es un array de documentos adjuntos
            this.attached_documents_view = items.map((item: IAttachment) => ({ ...item }))
            
            // La paginación no viene en esta respuesta, así que la establecemos manualmente
            this.general_contract_inquiry_pages.currentPage = 1
            this.general_contract_inquiry_pages.lastPage = 1

            showAlert(
              message,
              success ? 'success' : 'error',
              undefined,
              TIMEOUT_ALERT
            )
          })
          .catch((e) => {
            const error = e as IErrors
            const message = showCatchError(error)
            showAlert(message, 'error', undefined, TIMEOUT_ALERT)
          })
      },


      /**
       * Obtener 1 lista de clausulas
       * routeParams: list-clauses?source_type=contrato
       */
      async _getClausesView(contractId: number, sourceType: string) {
        this.clauses_view = []
        await executeApi()
          .get(`${URL_PATH_DERIVATIVE_CONTRACTING_GENERAL_CONTRACT_INQUIRY}/${contractId}/list-clauses`, {
            params: {
              source_type: sourceType,
            },
          })
          .then((response) => {
            const {
              data: items = [],
              message,
              success,
            } = response.data

            this.clauses_view = items.map(
              (item: IContractClause) => ({
                ...item,
              })
            )
            
            // La paginación no viene en esta respuesta, así que la establecemos manualmente
            this.general_contract_inquiry_pages.currentPage = 1
            this.general_contract_inquiry_pages.lastPage = 1

            showAlert(
              message,
              success ? 'success' : 'error',
              undefined,
              TIMEOUT_ALERT
            )
          })
          .catch((e) => {
            const error = e as IErrors
            const message = showCatchError(error)
            showAlert(message, 'error', undefined, TIMEOUT_ALERT)
          })
      },


      async _downloadGeneralContractInquiry(params: Record<string, string | number>) {
        await executeApi()
          .get(`${URL_PATH_DERIVATIVE_CONTRACTING_GENERAL_CONTRACT_INQUIRY}/export`, {
            params,
            responseType: 'blob',
          })
          .then((response) => {
            const blob = new Blob([response.data], {
              type: response.headers['content-type'],
            })

            const fileName = useUtils().getNameBlob(response)
            useUtils().downloadBlobXlxx(blob, fileName.replace(/['"]/g, ''))
          })
          .catch((e) => {
            const error = e as IErrors
            const message = showCatchError(error)
            showAlert(message, 'error', undefined, TIMEOUT_ALERT)
          })
      },


      /**
       * Obtener 1 lista de clausulas
       * routeParams: document-attachments/:fileId/view
       */
      async _getDocumentFileView(contractId: number, sourceType: string, fileId: number) {
        this.document_file_view = null
        await executeApi()
          .get(`${URL_PATH_DERIVATIVE_CONTRACTING_GENERAL_CONTRACT_INQUIRY}/${contractId}/document-attachments/${fileId}/view`, {
            params: {
              source_type: sourceType,
            },
          })
          .then((response) => {
            const {
              data: item,
              message,
              success,
            } = response.data

            if (success && item) {
              this.document_file_view = item
            }
            
            // La paginación no viene en esta respuesta, así que la establecemos manualmente
            this.general_contract_inquiry_pages.currentPage = 1
            this.general_contract_inquiry_pages.lastPage = 1

            showAlert(
              message,
              success ? 'success' : 'error',
              undefined,
              TIMEOUT_ALERT
            )
          })
          .catch((e) => {
            const error = e as IErrors
            const message = showCatchError(error)
            showAlert(message, 'error', undefined, TIMEOUT_ALERT)
          })
      },

      /**
       * Cambiar estado de un documento anexo
       * @param id - ID del documento anexo
       * @param status_id - Nuevo estado
       */
      async _changeStatus(id: number, status: string) {
        await executeApi()
          .patch(
            `${URL_PATH_DERIVATIVE_CONTRACTING_GENERAL_CONTRACT_INQUIRY}/${id}/${status}`
          )
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

      /**
       * Eliminar un documento anexo
       * @param id - ID del documento anexo
       */
      async _deleteGeneralContractInquiry(id: number) {
        await executeApi()
          .delete(`${URL_PATH_DERIVATIVE_CONTRACTING_GENERAL_CONTRACT_INQUIRY}/${id}`)
          .then((response) => {
            //this._getAttachedDocuments('')
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

      /**
       * Establecer datos del formulario de información
       * @param data - Datos del formulario o null para limpiar
       */
      _setDataInformationForm(data: IGeneralContractInquiryForm | null) {
        this.general_contract_inquiry_response = data ? { ...data } : null
      },

      _clearData() {
        this.general_contract_inquiry_list = []
        this.general_contract_inquiry_pages.currentPage = 0
        this.general_contract_inquiry_pages.lastPage = 0
      },
    },
  }
)
