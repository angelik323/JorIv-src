// pinia
import { defineStore } from 'pinia'
import { executeApi } from '@/apis'

// composables
import { useAlert, useShowError } from '@/composables'

// constants
import { TRUST_BUSINESS_API_URL } from '@/constants/apis'

// constants
import { TIMEOUT_ALERT } from '@/constants/alerts'

// interfaces
import {
  IAssignmentBuyer,
  IAssignmentBuyerCreate,
  IAssignmentBuyerExtraDataOwnerList,
  IAssignmentBuyerExtraDataResponse,
  IAssignmentBuyerList,
  IAssignmentBuyerResponse,
} from '@/interfaces/customs'

import { IErrors } from '@/interfaces/global'

const { showAlert } = useAlert()
const { showCatchError } = useShowError()

export const useAssignmentBuyerStoreV1 = defineStore(
  'assignment-buyer-store-v1',
  {
    state: () => ({
      version: 'v1',
      assignment_buyer_list: [] as IAssignmentBuyerList[],
      assignment_buyer_pages: {
        currentPage: 0,
        lastPage: 0,
      },
      data_information_form: null as IAssignmentBuyer | null,
      data_response: null as IAssignmentBuyerResponse | null,
      data_tables: null as IAssignmentBuyerExtraDataResponse | null,

      // seleccion del registro
      selectedThirdId: null as number | null,
      selectedThird: null as IAssignmentBuyerExtraDataOwnerList | null,

      // documents
      data_documents_form: [] as File[] | [],
      data_authorization: null as string | null,
    }),
    actions: {
      async _getListAction(params: string) {
        await executeApi()
          .get(
            `${TRUST_BUSINESS_API_URL}/property-transfer/list?paginate=1${params}`
          )
          .then((response) => {
            if (response.data.success) {
              this.assignment_buyer_list = response.data?.data?.data ?? []
              this.assignment_buyer_pages = {
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

      async _getDataTablesAction(id: number) {
        await executeApi()
          .get(`${TRUST_BUSINESS_API_URL}/payment-plan/installments/${id}`)
          .then((response) => {
            if (response.data.success) {
              this.data_tables = response.data?.data ?? null
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

      async _createAction(data: IAssignmentBuyerCreate) {
        let id_create = 0

        await executeApi()
          .post(`${TRUST_BUSINESS_API_URL}/property-transfer/new`, data)
          .then((response) => {
            id_create = response.data.data?.id

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

      async _updateAction(id: number, data: IAssignmentBuyerCreate) {
        let success = false

        await executeApi()
          .put(`${TRUST_BUSINESS_API_URL}/property-transfer/update/${id}`, data)
          .then((response) => {
            success = response.data.data?.id

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

      async _getByIdAction(id: number) {
        await executeApi()
          .get(`${TRUST_BUSINESS_API_URL}/property-transfer/show/${id}`)
          .then((response) => {
            if (response.data.success) {
              this.data_response = response.data?.data ?? null
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

      async _addFile(name: string, type: string, property_transfer_id: number) {
        let success = false
        let documentId = 0
        let uploadUrl = ''
        let filePath = ''

        await executeApi()
          .get(
            `${TRUST_BUSINESS_API_URL}/property-transfer/file/signed?name=${name}&document_type=${type}&property_transfer_id=${property_transfer_id}`
          )
          .then((response) => {
            const { data: responseData, success: responseSuccess } =
              response.data

            success = responseSuccess
            documentId = responseData.document_id ?? documentId
            uploadUrl = responseData.upload_url ?? ''
            filePath = responseData.file_path ?? ''
          })
          .catch((e) => {
            const error = e as IErrors
            const message = showCatchError(error)
            showAlert(message, 'error', undefined, TIMEOUT_ALERT)
          })

        return { success, documentId, uploadUrl, filePath }
      },

      async _deleteAction(id: number) {
        let success = false

        await executeApi()
          .delete(`${TRUST_BUSINESS_API_URL}/property-transfer/delete/${id}`)
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

      async _deleteActionFile(id: number, showMessage: boolean = true) {
        let success = false

        await executeApi()
          .delete(`${TRUST_BUSINESS_API_URL}/property-transfer/file/${id}`)
          .then((response) => {
            const { message } = response.data
            success = response.data?.success ?? false

            if (showMessage) {
              showAlert(
                message,
                success ? 'success' : 'error',
                undefined,
                TIMEOUT_ALERT
              )
            }
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
          .post(`${TRUST_BUSINESS_API_URL}/property-transfer/authorize/${id}`, {
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

      _setDataInformationForm(data: IAssignmentBuyer | null) {
        this.data_information_form = data ? { ...data } : null
      },

      _setDataDocumentsTab(data_to_set: File[] | []) {
        this.data_documents_form = [...data_to_set]
      },

      _setSelectedThird(
        thirdId: number | null,
        row?: IAssignmentBuyerExtraDataOwnerList
      ) {
        this.selectedThirdId = thirdId
        this.selectedThird = row ? { ...row } : null
      },

      _setDataAuthorize(observation: string | null) {
        this.data_authorization = observation
      },

      _clearData() {
        this.data_information_form = null
        this.data_response = null
        this.data_tables = null
        this.selectedThirdId = null
        this.selectedThird = null
        this.data_documents_form = []
        this.data_authorization = null
      },
    },
  }
)
