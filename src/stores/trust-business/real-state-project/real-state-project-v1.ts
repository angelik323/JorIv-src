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
  IRealStateProject,
  IRealStateProjectStages,
  IResponseRealStateProject,
} from '@/interfaces/customs'
import { IErrors } from '@/interfaces/global'

const { showAlert } = useAlert()
const { showCatchError } = useShowError()

export const useRealStateProjectStoreV1 = defineStore(
  'real-state-project-store-v1',
  {
    state: () => ({
      version: 'v1',
      real_state_project_transfers_list: [] as IRealStateProject[],
      real_state_project_transfers_pages: {
        currentPage: 0,
        lastPage: 0,
      },
      data_information_form: null as IRealStateProject | null,
      data_response: null as IResponseRealStateProject | null,
    }),
    actions: {
      async _getListAction(params: string) {
        await executeApi()
          .get(
            `${TRUST_BUSINESS_API_URL}/real-state-project/list?paginate=1${params}`
          )
          .then((response) => {
            if (response.data.success) {
              this.real_state_project_transfers_list =
                response.data?.data?.data ?? []
              this.real_state_project_transfers_pages = {
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
          .get(`${TRUST_BUSINESS_API_URL}/real-state-project/export/${id}`, {
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

      async _createRealStateProject(id: number, data: IRealStateProject) {
        let id_create = 0

        await executeApi()
          .post(`${TRUST_BUSINESS_API_URL}/real-state-project/new/${id}`, data)
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

      async _createRealStateProjecStages(
        id: number,
        data: IRealStateProjectStages
      ) {
        let id_create = 0

        await executeApi()
          .post(
            `${TRUST_BUSINESS_API_URL}/real-state-project/new/stage/${id}`,
            data
          )
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

      async _addFile(
        name: string,
        type: string,
        id: number,
        asocitedDocument: string
      ) {
        let success = false
        let documentId = 0
        let uploadUrl = ''
        let filePath = ''

        await executeApi()
          .get(
            `${TRUST_BUSINESS_API_URL}/real-state-project/file/signed?name=${name}&document_type=${type}&project_stage_id=${id}&asocited_document=${asocitedDocument}`
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

      async _updateRealStateProject(id: number, data: IRealStateProject) {
        let success = false

        await executeApi()
          .put(
            `${TRUST_BUSINESS_API_URL}/real-state-project/update/${id}`,
            data
          )
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

      async _updateRealStateProjectStage(
        id: number,
        data: IRealStateProjectStages
      ) {
        let success = false

        await executeApi()
          .put(
            `${TRUST_BUSINESS_API_URL}/real-state-project/update/stage/${id}`,
            data
          )
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

      async _deleteRealStateProject(id: number) {
        let success = false

        await executeApi()
          .delete(`${TRUST_BUSINESS_API_URL}/real-state-project/delete/${id}`)
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

      async _getRealStateProject(id: number) {
        await executeApi()
          .get(`${TRUST_BUSINESS_API_URL}/real-state-project/show/${id}`)
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

      async _deleteActionFile(id: number, showMessage: boolean = true) {
        let success = false

        await executeApi()
          .delete(`${TRUST_BUSINESS_API_URL}/property-sale/file/${id}`)
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

      _setDataInformationForm(data: IRealStateProject | null) {
        this.data_information_form = data
      },

      _setDataInformationStagesForm(data: IRealStateProjectStages[]) {
        if (this.data_information_form?.num_stages) {
          this.data_information_form.stages = data ? [...data] : []
        }
      },

      _clearData() {
        this.data_information_form = null
      },
    },
  }
)
