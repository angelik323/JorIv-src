// pinia
import { defineStore } from 'pinia'
import { executeApi } from '@/apis'

// composables
import { useAlert, useShowError, useUtils } from '@/composables'

// constants
import { TRUST_BUSINESS_API_URL } from '@/constants/apis'

// constants
import { TIMEOUT_ALERT } from '@/constants/alerts'

// interfaces
import {
  IRecordTransfers,
  IRecordTransfersAssignees,
  IRecordTransfersCreate,
  IRecordTransfersPrincipal,
  IRecordTransfersResponse,
  IRecordTransfersTransferors,
  IResponseDocuments,
  IResponseImport,
  IResponseRecordTransfers,
} from '@/interfaces/customs'
import { IErrors } from '@/interfaces/global'

const { showAlert } = useAlert()
const { showCatchError } = useShowError()

const CONFIG = {
  headers: {
    'Content-Type': 'multipart/form-data',
  },
}

export const useRecordTransfersStorev1 = defineStore('record-transfers-v1', {
  state: () => ({
    version: 'v1',
    record_transfers_list: [] as IRecordTransfers[],
    record_transfers_pages: {
      currentPage: 0,
      lastPage: 0,
    },
    data_information_form: null as IRecordTransfersResponse | null,
    data_transferors_list: [] as IRecordTransfersTransferors[] | [],
    data_assignees_list: [] as IRecordTransfersAssignees[] | [],
    data_final_list: [] as IRecordTransfersPrincipal[] | [],
    documents_import: null as File | null,
    data_import_response: null as IResponseImport | null,
    total_records: null as number | null,

    data_documents_form: [] as File[] | [],
    record_tranfers_request: null as IResponseRecordTransfers | null,
    documents_request: null as IResponseDocuments[] | null,
    data_authorization: null as string | null,

    // seleccion del registro
    selectedThirdId: null as number | null,
    selectedThird: null as IRecordTransfersTransferors | null,

    // persistir los porcentajes a ceder
    participations: {} as { [thirdId: string]: number },
    ids_to_delete: [] as number[] | [],
  }),
  actions: {
    async _getListAction(params: string) {
      await executeApi()
        .get(
          `${TRUST_BUSINESS_API_URL}/participant-transfer/list?paginate=1${params}`
        )
        .then((response) => {
          if (response.data.success) {
            this.record_transfers_list = response.data?.data?.data ?? []
            this.record_transfers_pages = {
              currentPage: response.data?.data?.current_page ?? 0,
              lastPage: response.data?.data?.last_page ?? 0,
            }
          }

          return useAlert().showAlert(
            response.data.message,
            response.data.success ? 'success' : 'error',
            undefined,
            TIMEOUT_ALERT
          )
        })
        .catch((error) => {
          useAlert().showAlert(
            useShowError().showCatchError(error),
            'error',
            undefined,
            TIMEOUT_ALERT
          )
        })
    },

    async _downloadByRowdData(id: number): Promise<void> {
      await executeApi()
        .get(
          `${TRUST_BUSINESS_API_URL}/participant-transfer/export/individual/${id}`,
          {
            responseType: 'blob',
          }
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

    async _downloadGeneralReport(): Promise<void> {
      await executeApi()
        .get(`${TRUST_BUSINESS_API_URL}/participant-transfer/export/massive`, {
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

    async _getMainData(
      business_id: number,
      participant_type_id: number,
      flag: boolean,
      id?: number
    ) {
      await executeApi()
        .get(
          `${TRUST_BUSINESS_API_URL}/participant-transfer/main-data/${business_id}?participantType=${participant_type_id}&cedent=${
            flag ? 'true' : 'false'
          }${!flag ? `&transfer_id=${id}` : ''}`
        )
        .then((response) => {
          this.data_transferors_list = response.data?.data?.data ?? []

          return useAlert().showAlert(
            response.data.message,
            response.data.success ? 'success' : 'error',
            undefined,
            TIMEOUT_ALERT
          )
        })
        .catch((error) => {
          this._clearData()
          this.data_transferors_list = []
          useAlert().showAlert(
            useShowError().showCatchError(error),
            'error',
            undefined,
            TIMEOUT_ALERT
          )
        })
    },

    async _getFormatExcel(): Promise<void> {
      await executeApi()
        .get(`${TRUST_BUSINESS_API_URL}/participant-transfer/export/template`, {
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

    async _importRecordTransfers(): Promise<boolean> {
      let success = false
      await executeApi()
        .post(
          `${TRUST_BUSINESS_API_URL}/participant-transfer/import/massive`,
          { file: this.documents_import },
          CONFIG
        )
        .then((response) => {
          success = response.data.success
          this.data_import_response = response.data?.data
          this.total_records =
            (this.data_import_response?.successful?.count ?? 0) +
            (this.data_import_response?.failed?.count ?? 0)
          if (this.total_records) {
            success = (this.data_import_response?.successful?.count ?? 0) > 0
          }
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

    async _deleteFilesAction(id: number): Promise<boolean> {
      let success = false
      if (!this.ids_to_delete.length) return success
      await executeApi()
        .post(
          `${TRUST_BUSINESS_API_URL}/participant-transfer/delete-files/${id}`,
          { documents: this.ids_to_delete },
          CONFIG
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

    async _getErrorsFile(): Promise<void> {
      await executeApi()
        .post(
          `${TRUST_BUSINESS_API_URL}/participant-transfer/export/rejection-reason`,
          { data: this.data_import_response?.failed.data },
          {
            responseType: 'blob',
          }
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

    async _getByIdRecordTransfer(id: number) {
      await executeApi()
        .get(`${TRUST_BUSINESS_API_URL}/participant-transfer/show/${id}`)
        .then((response) => {
          if (response.data.success) {
            this.record_tranfers_request = response.data?.data
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

    async _getByIdRecordTransferDocuments(id: number) {
      await executeApi()
        .get(`${TRUST_BUSINESS_API_URL}/participant-transfer/list-files/${id}`)
        .then((response) => {
          if (response.data.success) {
            this.documents_request = response.data.data
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
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    async _addFile(id: number, data: Record<string, any>) {
      let success = false
      let documentId = 0
      let uploadUrl = ''
      let filePath = ''

      await executeApi()
        .post(
          `${TRUST_BUSINESS_API_URL}/participant-transfer/save-documental-support/${id}`,
          data
        )
        .then((response) => {
          const {
            data: responseData,
            message,
            success: responseSuccess,
          } = response.data

          success = responseSuccess
          documentId = responseData.document_id ?? documentId
          uploadUrl = responseData.upload_url ?? ''
          filePath = responseData.file_path ?? ''

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

      return { success, documentId, uploadUrl, filePath }
    },

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    async _updateDocuments(id: number, data: Record<string, any>) {
      let success = false

      await executeApi()
        .put(
          `${TRUST_BUSINESS_API_URL}/participant-transfer/save-documental-support/${id}`,
          data
        )
        .then((response) => {
          const { message, success: responseSuccess } = response.data
          success = responseSuccess

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

      return success
    },

    async _createRecordTransfers(id: number, data: IRecordTransfersCreate) {
      let id_create = 0

      await executeApi()
        .post(`${TRUST_BUSINESS_API_URL}/participant-transfer/new/${id}`, data)
        .then((response) => {
          id_create = response.data.data?.id

          this._setDataInformationForm(null)

          return useAlert().showAlert(
            response.data.message,
            response.data.success ? 'success' : 'error',
            undefined,
            TIMEOUT_ALERT
          )
        })
        .catch((error) => {
          useAlert().showAlert(
            useShowError().showCatchError(error),
            'error',
            undefined,
            TIMEOUT_ALERT
          )
        })
      return id_create
    },

    async _updateRecordTransfers(id: number, data: IRecordTransfersCreate) {
      let success = false

      await executeApi()
        .put(
          `${TRUST_BUSINESS_API_URL}/participant-transfer/update/${id}`,
          data
        )
        .then((response) => {
          success = response.data.data?.id

          this._setDataInformationForm(null)

          return useAlert().showAlert(
            response.data.message,
            response.data.success ? 'success' : 'error',
            undefined,
            TIMEOUT_ALERT
          )
        })
        .catch((error) => {
          useAlert().showAlert(
            useShowError().showCatchError(error),
            'error',
            undefined,
            TIMEOUT_ALERT
          )
        })
      return success
    },

    async _deleteRecordTransfers(id: number) {
      let success = false

      await executeApi()
        .delete(`${TRUST_BUSINESS_API_URL}/participant-transfer/delete/${id}`)
        .then((response) => {
          const { message } = response.data
          success = response.data?.success ?? false

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

      return success
    },

    async _authorize(id: number, action: boolean, observation: string) {
      let success = false

      await executeApi()
        .put(`${TRUST_BUSINESS_API_URL}/participant-transfer/authorize/${id}`, {
          action: action,
          observations: observation,
        })
        .then((response) => {
          const { message, success: responseSuccess } = response.data
          success = responseSuccess

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

      return success
    },

    _clearData() {
      this.data_transferors_list = []
      this.data_assignees_list = []
      this.data_final_list = []
      this.data_authorization = null
      this.selectedThirdId = null
      this.selectedThird = null
      this.participations = {}
      this.data_documents_form = []
    },

    _setDataInformationForm(data: IRecordTransfersResponse | null) {
      this.data_information_form = data
    },

    _setDataRecordTransfersList() {
      this.record_transfers_list = []
    },

    _setListFinal(data: IRecordTransfersPrincipal[]) {
      this.data_final_list = data.length > 0 ? [...data] : []
    },

    _setListAssignees(data: IRecordTransfersAssignees[]) {
      this.data_assignees_list = data.length > 0 ? [...data] : []
    },

    _setDataDocuments(data_to_set: File | null) {
      this.documents_import = data_to_set
    },

    _setDataDocumentsTab(data_to_set: File[] | []) {
      this.data_documents_form = data_to_set.length ? [...data_to_set] : []
    },

    _setSelectedThird(
      thirdId: number | null,
      row?: IRecordTransfersTransferors
    ) {
      this.selectedThirdId = thirdId
      this.selectedThird = row ? { ...row } : null
    },

    _setParticipation(thirdId: string, percentage: number) {
      this.participations[thirdId] = percentage
    },

    _setIdToDelete(ids: number[] | []) {
      this.ids_to_delete = [...this.ids_to_delete, ...ids]
    },

    _setDataAuthorize(observation: string | null) {
      this.data_authorization = observation
    },

    _clearParticipations() {
      this.participations = {}
    },
  },
})
