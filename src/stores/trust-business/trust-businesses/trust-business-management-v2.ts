// pinia
import { defineStore } from 'pinia'
import { executeApi } from '@/apis'

// interfaces
import {
  ITrustBusinessCreate,
  ITrustBusinessItemList,
  ITrustBusinessRegisterThird,
  IMassiveUploadItem,
} from '@/interfaces/customs/trust-business/v2/TrustBusinessManagement'
import { IErrors } from '@/interfaces/global'

// composables
import { useAlert, useShowError, useUtils } from '@/composables'

// constants
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

export const useTrustBusinessManagementStoreV2 = defineStore(
  'trust-business-management-store-v2',
  {
    state: () => ({
      version: 'v2',
      trust_business_list: [] as ITrustBusinessItemList[],
      trust_business_pages: {
        currentPage: 0,
        lastPage: 0,
      },

      headerPropsDefault: {
        title: 'Negocios fiduciarios',
        breadcrumbs: [
          {
            label: 'Inicio',
            route: 'HomeView',
          },
          {
            label: 'Negocios fiduciarios',
          },
          {
            label: 'Gestionar negocios fiduciarios',
            route: 'TrustBusinessesList',
          },
        ],
      },
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

      async _createTrustBusiness(data: ITrustBusinessCreate) {
        let success = false
        let id = INITIAL_ID_VALUE

        await executeApi()
          .post(`${TRUST_BUSINESS_API_URL}/manage`, data)
          .then((response) => {
            const { message } = response.data
            success = response.data?.success ?? false
            id = response.data?.data?.id ?? INITIAL_ID_VALUE

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

      async _addTrustBusinessFile(
        businessId: number,
        data: Record<string, string>
      ) {
        let success = false
        let documentId = INITIAL_ID_VALUE
        let uploadUrl = ''
        let filePath = ''

        await executeApi()
          .post(`${TRUST_BUSINESS_API_URL}/manage/file/${businessId}`, data)
          .then((response) => {
            const { data: responseData, success: responseSuccess } =
              response.data

            success = responseSuccess
            documentId = responseData.document_id ?? INITIAL_ID_VALUE
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

      async _deleteTrustBusinessDocuments(businessId: number, data: number[]) {
        let success = false

        await executeApi()
          .post(`${TRUST_BUSINESS_API_URL}/manage/delete-files/${businessId}`, {
            documents: data,
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

      async _updateTrustBusinessDocuments(
        businessId: number,
        data: Record<string, string | boolean | string[]>
      ) {
        let success = false

        await executeApi()
          .put(`${TRUST_BUSINESS_API_URL}/manage/files/${businessId}`, data)
          .then((response) => {
            const { success: responseSuccess } = response.data
            success = responseSuccess
          })
          .catch((e) => {
            const error = e as IErrors
            const message = showCatchError(error)
            showAlert(message, 'error', undefined, TIMEOUT_ALERT)
          })

        return success
      },

      async _getByIdTrustBusiness(id: number) {
        let responseData = null
        await executeApi()
          .get(`${TRUST_BUSINESS_API_URL}/manage/${id}`)
          .then((response) => {
            showAlert(
              response.data.message,
              response.data.success ? 'success' : 'error',
              undefined,
              TIMEOUT_ALERT
            )

            responseData = response.data.data
          })
          .catch((e) => {
            const error = e as IErrors
            const message = showCatchError(error)
            showAlert(message, 'error', undefined, TIMEOUT_ALERT)
            responseData = {}
          })
        return responseData
      },

      async _updateTrustBusiness(data: ITrustBusinessCreate, id: number) {
        let success = false

        await executeApi()
          .put(`${TRUST_BUSINESS_API_URL}/manage/${id}`, data)
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

      async _validateCode(code: string) {
        let available: boolean = false
        await executeApi()
          .get(
            `${TRUST_BUSINESS_API_URL}/manage/business-code/validate/${code}`
          )
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

      async _uploadMassiveTrustBusinessList(
        type_resource: number,
        file: File
      ): Promise<ITrustBusinessRegisterThird[]> {
        let data_trust_business: ITrustBusinessRegisterThird[] = []

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
              response.data?.data?.map((item: IMassiveUploadItem) => {
                return {
                  third_party_id: item.third_party_id,
                  percentage_participation: item.percentage_participation,
                  type_resource: Number(item.type_resource),
                }
              }).filter((item: ITrustBusinessRegisterThird) => item.third_party_id) ?? []
          })
          .catch((error) => {
            showAlert(showCatchError(error), 'error', undefined, TIMEOUT_ALERT)
          })

        return data_trust_business
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

      _clearData() {
        this.trust_business_list = []
        this.trust_business_pages = {
          currentPage: 0,
          lastPage: 0,
        }
      },
    },
  }
)
