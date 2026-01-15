import { executeApi } from '@/apis'
import { useAlert, useShowError } from '@/composables'
import { TIMEOUT_ALERT } from '@/constants/alerts'
import { TRUST_BUSINESS_API_URL } from '@/constants/apis'
import {
  IBusinessTrustOnCreate,
  ITypeOfBusinessDocumentForm,
  ITypeOfBusinessDocumentList,
} from '@/interfaces/customs'
import { defaultIconsLucide } from '@/utils'
import { defineStore } from 'pinia'

const { showAlert } = useAlert()
const { showCatchError } = useShowError()

export const useTypeOfBusinessDocumentsStoreV1 = defineStore(
  'type-of-business-documents-store-v1',
  {
    state: () => ({
      data_type_of_business_documents_list: [] as ITypeOfBusinessDocumentList[],
      data_type_of_business_documents_form:
        {} as ITypeOfBusinessDocumentForm | null,
      data_business_trust_on_create: null as IBusinessTrustOnCreate | null,
      headerPropsDefault: {
        title: 'Tipo de documentos negocio',
        breadcrumbs: [
          {
            label: 'Inicio',
            route: 'HomeView',
          },
          {
            label: 'Negocios Fiduciarios',
          },
          {
            label: 'Tipo de documentos negocio',
            route: 'TypeOfBusinessDocumentsList',
          },
        ],
        btn: {
          label: 'Crear',
          icon: defaultIconsLucide.plusCircleOutline,
        },
      },
      pages: {
        currentPage: 1,
        lastPage: 1,
      },
    }),
    actions: {
      async _getListTypeOfBusinessDocuments(params: string) {
        await executeApi()
          .get(
            `${TRUST_BUSINESS_API_URL}/document-type/list?paginate=1${params}`
          )
          .then((response) => {
            if (response.data.success) {
              this.data_type_of_business_documents_list =
                response.data?.data?.data ?? []
              this.pages.currentPage = response.data?.data?.current_page ?? 1
              this.pages.lastPage = response.data?.data?.last_page ?? 1
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
      _setDataTypeOfBusinessDocumentsForm(
        data: ITypeOfBusinessDocumentForm | null
      ) {
        this.data_type_of_business_documents_form =
          data || ({} as ITypeOfBusinessDocumentForm)
      },
      async _createAction(
        idTrustBusiness: number,
        payload: ITypeOfBusinessDocumentForm
      ): Promise<boolean> {
        let success = false
        await executeApi()
          .post(
            `${TRUST_BUSINESS_API_URL}/document-type/new/${idTrustBusiness}`,
            payload
          )
          .then((response) => {
            success = response.data.success
            if (success) {
              this.data_type_of_business_documents_form = null
              this.data_business_trust_on_create = null
              this.data_type_of_business_documents_list = []
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
        return success
      },
      async _searchBusinessTrust(textSearch: string) {
        await executeApi()
          .get(`${TRUST_BUSINESS_API_URL}/manage/list?filter[id]=${textSearch}`)
          .then((response) => {
            if (response.data.success) {
              this.data_business_trust_on_create =
                response.data?.data?.data[0] ?? []
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
      async _getTypeOfBusinessDocumentsById(id: number | string) {
        await executeApi()
          .get(`${TRUST_BUSINESS_API_URL}/document-type/show/${id}`)
          .then((response) => {
            if (response.data.success) {
              this.data_type_of_business_documents_form =
                response.data?.data ?? ({} as ITypeOfBusinessDocumentForm)
              this.data_business_trust_on_create =
                response.data?.data?.business_trust ?? null
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
      async _updateAction(id: number | string) {
        let success = false
        await executeApi()
          .put(
            `${TRUST_BUSINESS_API_URL}/document-type/update/${id}`,
            this.data_type_of_business_documents_form
          )
          .then((response) => {
            success = response.data.success
            if (success) {
              this.data_type_of_business_documents_form = null
              this.data_business_trust_on_create = null
              this.data_type_of_business_documents_list = []
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
        return success
      },
      async _deleteAction(id: number | string) {
        let success = false
        await executeApi()
          .delete(`${TRUST_BUSINESS_API_URL}/document-type/delete/${id}`)
          .then((response) => {
            success = response.data.success
            if (success) {
              this.data_type_of_business_documents_form = null
              this.data_business_trust_on_create = null
              this.data_type_of_business_documents_list = []
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
        return success
      },
      async _validateDocumentCode(code: string, idTrustBusiness?: number) {
        let available: boolean = true
        await executeApi()
          .get(
            `${TRUST_BUSINESS_API_URL}/document-type/list?paginate=1${
              idTrustBusiness ? `&business_trust_id=${idTrustBusiness}` : ''
            }`
          )
          .then((response) => {
            if (response.data.success) {
              const documents = response.data?.data?.data ?? []
              const normalizedCode = String(code).trim()
              const foundDocument = documents.find(
                (doc: { document_code: string }) =>
                  String(doc.document_code).trim() === normalizedCode
              )
              available = !foundDocument
            }
          })
          .catch(() => {
            available = true
          })
        return available
      },
    },
  }
)
