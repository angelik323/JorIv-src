import { executeApi } from '@/apis'
import { useAlert, useShowError } from '@/composables'
import { TIMEOUT_ALERT } from '@/constants/alerts'
import { TRUST_BUSINESS_API_URL } from '@/constants/apis'
import {
  IBusinessTrustOnCreateDocumentStructure,
  ITrustBusinessDocumentStructureForm,
  ITrustBusinessDocumentStructureList,
} from '@/interfaces/customs'
import { defaultIconsLucide } from '@/utils'
import { defineStore } from 'pinia'

const { showAlert } = useAlert()
const { showCatchError } = useShowError()

export const useTrustBusinessDocumentStructureStoreV1 = defineStore(
  'trust-business-document-structure-store-v1',
  {
    state: () => ({
      data_trust_business_document_structure_list:
        [] as ITrustBusinessDocumentStructureList[],
      data_trust_business_document_structure_form:
        {} as ITrustBusinessDocumentStructureForm | null,
      data_business_trust_on_create:
        null as IBusinessTrustOnCreateDocumentStructure | null,
      headerPropsDefault: {
        title: 'Estructura documento negocios fiduciarios',
        breadcrumbs: [
          {
            label: 'Inicio',
            route: 'HomeView',
          },
          {
            label: 'Negocios Fiduciarios',
          },
          {
            label: 'Estructura documento negocios fiduciarios',
            route: 'TrustBusinessDocumentStructureList',
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
      async _getListTrustBusinessDocumentStructure(params: string) {
        await executeApi()
          .get(
            `${TRUST_BUSINESS_API_URL}/document-structure/list?paginate=1${params}`
          )
          .then((response) => {
            if (response.data.success) {
              this.data_trust_business_document_structure_list =
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
      _setDataTrustBusinessDocumentStructureForm(
        data: ITrustBusinessDocumentStructureForm | null
      ) {
        this.data_trust_business_document_structure_form =
          data || ({} as ITrustBusinessDocumentStructureForm)
      },
      async _createAction(
        idTrustBusiness: number,
        payload: ITrustBusinessDocumentStructureForm
      ): Promise<boolean> {
        let success = false
        await executeApi()
          .post(
            `${TRUST_BUSINESS_API_URL}/document-structure/new/${idTrustBusiness}`,
            payload
          )
          .then((response) => {
            success = response.data.success
            if (success) {
              this.data_trust_business_document_structure_form = null
              this.data_business_trust_on_create = null
              this.data_trust_business_document_structure_list = []
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
      async _getTrustBusinessDocumentStructureById(id: number | string) {
        await executeApi()
          .get(`${TRUST_BUSINESS_API_URL}/document-structure/show/${id}`)
          .then((response) => {
            if (response.data.success) {
              this.data_trust_business_document_structure_form =
                response.data?.data ??
                ({} as ITrustBusinessDocumentStructureForm)
              this.data_business_trust_on_create = {
                id: response.data?.data?.business_trust_code ?? 0,
                name: response.data?.data?.business_trust_name ?? '',
              }
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
            `${TRUST_BUSINESS_API_URL}/document-structure/update/${id}`,
            this.data_trust_business_document_structure_form
          )
          .then((response) => {
            success = response.data.success
            if (success) {
              this.data_trust_business_document_structure_form = null
              this.data_business_trust_on_create = null
              this.data_trust_business_document_structure_list = []
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
          .delete(`${TRUST_BUSINESS_API_URL}/document-structure/delete/${id}`)
          .then((response) => {
            success = response.data.success
            if (success) {
              this.data_trust_business_document_structure_form = null
              this.data_business_trust_on_create = null
              this.data_trust_business_document_structure_list = []
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
      async _validateCharacteristicCode(code: string, idTrustBusiness?: number) {
        let available: boolean = true
        await executeApi()
          .get(
            `${TRUST_BUSINESS_API_URL}/document-structure/list?paginate=1${
              idTrustBusiness ? `&business_trust_id=${idTrustBusiness}` : ''
            }`
          )
          .then((response) => {
            if (response.data.success) {
              const documentStructures = response.data?.data?.data ?? []
              const normalizedCode = String(code).trim()
              const foundStructure = documentStructures.find(
                (structure: { characteristic_code: string }) =>
                  String(structure.characteristic_code).trim() === normalizedCode
              )
              available = !foundStructure
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
