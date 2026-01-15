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
  ISaleRealEstate,
  ISaleRealEstateList,
  ISaleRealEstateResponse,
} from '@/interfaces/customs'
import { IErrors } from '@/interfaces/global'

const { showAlert } = useAlert()
const { showCatchError } = useShowError()

export const useSaleRealEstateStoreV1 = defineStore(
  'sale-real-estate-store-v1',
  {
    state: () => ({
      version: 'v1',
      sale_real_estate_list: [] as ISaleRealEstateList[],
      sale_real_estate_pages: {
        currentPage: 0,
        lastPage: 0,
      },
      data_information_form: null as ISaleRealEstate | null,
      data_response: null as ISaleRealEstateResponse | null,
    }),
    actions: {
      async _getListAction(params: string) {
        await executeApi()
          .get(
            `${TRUST_BUSINESS_API_URL}/property-sale/list?paginate=1${params}`
          )
          .then((response) => {
            if (response.data.success) {
              this.sale_real_estate_list = response.data?.data?.data ?? []
              this.sale_real_estate_pages = {
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

      async _createAction(data: ISaleRealEstate) {
        let id_create = 0

        await executeApi()
          .post(
            `${TRUST_BUSINESS_API_URL}/property-sale/new/${data.real_estate_project_id}`,
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

      async _updateAction(id: number, data: ISaleRealEstate) {
        let success = false

        await executeApi()
          .put(`${TRUST_BUSINESS_API_URL}/property-sale/update/${id}`, data)
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
          .get(`${TRUST_BUSINESS_API_URL}/property-sale/show/${id}`)
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

      async _addFile(
        name: string,
        type: string,
        id: number,
        original_name_file: string
      ) {
        let success = false
        let documentId = 0
        let uploadUrl = ''
        let filePath = ''

        await executeApi()
          .get(
            `${TRUST_BUSINESS_API_URL}/property-sale/file/signed?name=${name}&document_type=${type}&property_sale_id=${id}&original_name_file=${original_name_file}`
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

      _setDataInformationForm(data: ISaleRealEstate | null) {
        this.data_information_form = data
      },

      _clearData() {
        this.data_information_form = null
      },
    },
  }
)
