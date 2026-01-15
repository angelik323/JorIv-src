import { defineStore } from 'pinia'
import { executeApi } from '@/apis'

// Interfaces
import {
  ITrustBusinessResponse,
  ITrustBusinessInformationForm,
  ITrustBusinessDocumentsForm,
  ITrustBusinessItemList,
  ITrustBusinessToCreate,
  ITrustBusinessToEdit,
  BusinessType,
  ITrustBusinessRequest,
  IResponseDocument,
} from '@/interfaces/customs'
import { IErrors } from '@/interfaces/global'

// Composables
import { useAlert, useShowError, useUtils } from '@/composables'

// Constants
import { TRUST_BUSINESS_API_URL } from '@/constants/apis'
import { TIMEOUT_ALERT } from '@/constants/alerts'

const CONFIG = {
  headers: {
    'Content-Type': 'multipart/form-data',
  },
}
const INITIAL_ID_VALUE = 0

const { showAlert } = useAlert()
const { showCatchError } = useShowError()

export const useTrustBusinessStoreV1 = defineStore('trust-business-store-v1', {
  state: () => ({
    version: 'v1',
    business_type: null as BusinessType | null,
    trust_business_list: [] as ITrustBusinessItemList[],
    trust_business_response: null as ITrustBusinessResponse | null,
    trust_business_pages: {
      currentPage: 0,
      lastPage: 0,
    },
    data_information_form: null as ITrustBusinessInformationForm | null,
    data_documents_form: null as ITrustBusinessDocumentsForm | null,
    data_business_resources: null as ITrustBusinessRequest[] | null,
  }),

  actions: {
    async _getTrustBusinessList(params: string) {
      this._clearData()

      await executeApi()
        .get(`${TRUST_BUSINESS_API_URL}/manage/list?${params}`)
        .then((response) => {
          this.trust_business_list = response.data?.data?.data ?? []
          this.trust_business_pages.currentPage =
            response.data?.data?.current_page
          this.trust_business_pages.lastPage = response.data?.data?.last_page

          showAlert(
            response.data.message,
            response.data.success ? 'success' : 'error',
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

    async _getByIdTrustBusiness(id: number) {
      await executeApi()
        .get(`${TRUST_BUSINESS_API_URL}/manage/${id}`)
        .then((response) => {
          const { data: responseData, message, success } = response.data

          if (success && responseData) {
            this.trust_business_response = { ...responseData }
            this.data_business_resources = [
              ...responseData.resources.map((item: ITrustBusinessRequest) => {
                return {
                  ...item,
                  type_resource: Number(item.type_resource),
                  third_party: { ...item.third_party },
                }
              }),
            ]
          }

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

    async _createTrustBusiness(data: Partial<ITrustBusinessToCreate>) {
      let success = false
      let id = INITIAL_ID_VALUE

      await executeApi()
        .post(`${TRUST_BUSINESS_API_URL}/manage`, data)
        .then((response) => {
          const { message } = response.data
          success = response.data?.success ?? false
          id = response.data?.data?.id ?? INITIAL_ID_VALUE

          this.data_business_resources = null

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

      return id
    },

    async _updateTrustBusiness(
      data: Partial<ITrustBusinessToEdit>,
      id: number
    ) {
      let success = false

      await executeApi()
        .put(`${TRUST_BUSINESS_API_URL}/manage/${id}`, data)
        .then((response) => {
          const { message } = response.data
          success = response.data?.success ?? false

          this.data_business_resources = null

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

    async _deleteTrustBusiness(id: number) {
      let success = false

      await executeApi()
        .delete(`${TRUST_BUSINESS_API_URL}/manage/${id}`)
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

    async _dowloadTrustBusinessList(params: string) {
      await executeApi()
        .get(
          `${TRUST_BUSINESS_API_URL}/manage/export/masive?paginate=1${params}`,
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
        })
        .catch((e) => {
          const error = e as IErrors
          const message = showCatchError(error)
          showAlert(message, 'error', undefined, TIMEOUT_ALERT)
        })
    },

    async _dowloadTrustBusinessByRow(id: number, data: number[]) {
      await executeApi()
        .post(
          `${TRUST_BUSINESS_API_URL}/manage/export/individual/${id}`,
          {
            id_resources_downloads: data,
          },
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
        })
        .catch(async (e) => {
          if (
            e.response &&
            e.response.data instanceof Blob &&
            e.response.data.type === 'application/json'
          ) {
            e = JSON.parse(await e.response.data.text())
          }
          const error = e as IErrors
          const message = showCatchError(error)
          showAlert(message, 'error', undefined, TIMEOUT_ALERT)
        })
    },

    async _dowloadTemplateTrustors() {
      await executeApi()
        .get(`${TRUST_BUSINESS_API_URL}/manage/export/template`, {
          responseType: 'blob',
        })
        .then((response) => {
          const blob = new Blob([response.data], {
            type: response.headers['content-type'],
          })

          const fileName = useUtils().getNameBlob(response)
          useUtils().downloadBlobXlxx(blob, fileName)
        })
        .catch((e) => {
          const error = e as IErrors
          const message = showCatchError(error)
          showAlert(message, 'error', undefined, TIMEOUT_ALERT)
        })
    },

    async _uploadMassiveTrustBusinessList(
      type_resource: number,
      file: File
    ): Promise<ITrustBusinessRequest[]> {
      let data_trust_business: ITrustBusinessRequest[] = []

      await executeApi()
        .post(
          `${TRUST_BUSINESS_API_URL}/valid-file/massive-resource/${type_resource}`,
          { file: file },
          CONFIG
        )
        .then((response) => {
          showAlert(
            response.data.message,
            response.data.success ? 'success' : 'error',
            undefined,
            TIMEOUT_ALERT
          )

          data_trust_business =
            response.data?.data?.map((item: IResponseDocument) => {
              return {
                third_party_id: item.id,
                percentage_participation: item.percentage_participation,
                type_resource: Number(item.type_resource),
              }
            }) ?? []
        })
        .catch((error) => {
          showAlert(showCatchError(error), 'error', undefined, TIMEOUT_ALERT)
        })

      return data_trust_business
    },

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    async _addTrustBusinessFile(businessId: number, data: Record<string, any>) {
      let success = false
      let documentId = INITIAL_ID_VALUE
      let uploadUrl = ''
      let filePath = ''

      await executeApi()
        .post(`${TRUST_BUSINESS_API_URL}/manage/file/${businessId}`, data)
        .then((response) => {
          const {
            data: responseData,
            message,
            success: responseSuccess,
          } = response.data

          success = responseSuccess
          documentId = responseData.document_id ?? INITIAL_ID_VALUE
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

    async _updateTrustBusinessDocuments(
      businessId: number,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      data: Record<string, any>
    ) {
      let success = false

      await executeApi()
        .put(`${TRUST_BUSINESS_API_URL}/manage/files/${businessId}`, data)
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

    async _deleteTrustBusinessDocuments(
      businessId: number,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      data: Record<string, any>
    ) {
      let success = false

      await executeApi()
        .post(
          `${TRUST_BUSINESS_API_URL}/manage/delete-files/${businessId}`,
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

    async _validateCode(code: string) {
      let available: boolean = false
      await executeApi()
        .get(`${TRUST_BUSINESS_API_URL}/manage/business-code/validate/${code}`)
        .then((response) => {
          available = response.data.data.available
        })
        .catch((e) => {
          const error = e as IErrors
          const message = showCatchError(error)
          showAlert(message, 'error', undefined, TIMEOUT_ALERT)
        })

      return available
    },

    _setBusinessType(state: BusinessType | null) {
      this.business_type = null
      if (state) this.business_type = state
    },

    _setDataInformationForm(data_to_set: ITrustBusinessInformationForm | null) {
      this.data_information_form = data_to_set ? { ...data_to_set } : null
    },

    _setDataDocumentsForm(data_to_set: ITrustBusinessDocumentsForm | null) {
      this.data_documents_form = data_to_set ? { ...data_to_set } : null
    },

    _setBusinessResource(
      data_to_set: ITrustBusinessRequest[] | null,
      type_resource: number
    ) {
      this.data_business_resources = [
        ...(this.data_business_resources || []).filter(
          (item) => item.type_resource !== type_resource
        ),
        ...(data_to_set || []),
      ]
    },

    _clearData() {
      this.trust_business_list = []
      this.trust_business_response = null
      this.trust_business_pages = {
        currentPage: 0,
        lastPage: 0,
      }

      this._setDataInformationForm(null)
      this._setDataDocumentsForm(null)
      this.data_business_resources = null
    },
  },
})
