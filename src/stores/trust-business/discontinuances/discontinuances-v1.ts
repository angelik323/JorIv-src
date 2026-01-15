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
  IDiscontinuances,
  IDiscontinuancesExtraDataResponse,
  IDiscontinuancesList,
  IDiscontinuancesResponse,
} from '@/interfaces/customs'
import { IErrors } from '@/interfaces/global'

const { showAlert } = useAlert()
const { showCatchError } = useShowError()

export const useDiscontinuancesStoreV1 = defineStore(
  'discontinuances-store-v1',
  {
    state: () => ({
      version: 'v1',
      discontinuances_list: [] as IDiscontinuancesList[],
      discontinuances_pages: {
        currentPage: 0,
        lastPage: 0,
      },
      data_information_form: null as IDiscontinuances | null,
      data_response: null as IDiscontinuancesResponse | null,
      data_tables: null as IDiscontinuancesExtraDataResponse | null,
    }),
    actions: {
      async _getListAction(params: string) {
        await executeApi()
          .get(
            `${TRUST_BUSINESS_API_URL}/property-withdrawals?paginate=1${params}`
          )
          .then((response) => {
            if (response.data.success) {
              this.discontinuances_list = response.data?.data?.data ?? []
              this.discontinuances_pages = {
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
          .get(
            `${TRUST_BUSINESS_API_URL}/property-withdrawals/payment/plan/${id}`
          )
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
            this.data_tables = null
            useAlert().showAlert(
              useShowError().showCatchError(error),
              'error',
              undefined,
              TIMEOUT_ALERT
            )
          })
      },

      async _createAction(data: IDiscontinuances) {
        let id_create = 0

        await executeApi()
          .post(`${TRUST_BUSINESS_API_URL}/property-withdrawals`, data)
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

      async _updateAction(id: number, data: IDiscontinuances) {
        let success = false

        await executeApi()
          .put(`${TRUST_BUSINESS_API_URL}/property-withdrawals/${id}`, data)
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
          .get(`${TRUST_BUSINESS_API_URL}/property-withdrawals/show/${id}`)
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

      async _addFile(name: string, type: string, original_name_file: string) {
        let success = false
        let documentId = 0
        let uploadUrl = ''
        let filePath = ''

        await executeApi()
          .post(`${TRUST_BUSINESS_API_URL}/property-withdrawals/file/signed`, {
            document_type: type,
            name: name,
            original_name_file: original_name_file,
          })
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

      async _deleteActionFile(id: number) {
        let success = false

        await executeApi()
          .delete(`${TRUST_BUSINESS_API_URL}/property-withdrawals/file/${id}`)
          .then((response) => {
            success = response.data?.success ?? false
          })
          .catch((e) => {
            const error = e as IErrors
            const message = showCatchError(error)
            showAlert(message, 'error', undefined, TIMEOUT_ALERT)
          })

        return success
      },

      async _deleteAction(id: number) {
        let success = false

        await executeApi()
          .delete(`${TRUST_BUSINESS_API_URL}/property-withdrawals/${id}`)
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

      async _authorize(
        id: number,
        action: string = 'approved',
        observation: string
      ) {
        let success = false

        await executeApi()
          .post(
            `${TRUST_BUSINESS_API_URL}/property-withdrawals/${action}/${id}`,
            {
              observations: observation,
            }
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

      _setDataInformationForm(data: IDiscontinuances | null) {
        this.data_information_form = data
      },

      _clearData() {
        this.data_information_form = null
      },
    },
  }
)
