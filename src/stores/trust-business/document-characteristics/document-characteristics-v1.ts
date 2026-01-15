import { executeApi } from '@/apis'
import { useAlert, useShowError } from '@/composables'
import { TIMEOUT_ALERT } from '@/constants/alerts'
import { TRUST_BUSINESS_API_URL } from '@/constants/apis'
import {
  IDocumentCharacteristicsForm,
  IDocumentCharacteristicsList,
  IDocumentCharacteristicsPayload,
} from '@/interfaces/customs'
import { defaultIconsLucide } from '@/utils'
import { defineStore } from 'pinia'

const { showAlert } = useAlert()
const { showCatchError } = useShowError()

export const useDocumentCharacteristicsStoreV1 = defineStore(
  'document-characteristics-store-v1',
  {
    state: () => ({
      data_document_characteristics_list: [] as IDocumentCharacteristicsList[],
      data_document_characteristics_form:
        {} as IDocumentCharacteristicsForm | null,
      headerPropsDefault: {
        title: 'Características de documento',
        breadcrumbs: [
          {
            label: 'Inicio',
            route: 'HomeView',
          },
          {
            label: 'Negocios Fiduciarios',
          },
          {
            label: 'Características de documento',
            route: 'DocumentCharacteristicsList',
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
      async _getListDocumentCharacteristics(params: string) {
        await executeApi()
          .get(
            `${TRUST_BUSINESS_API_URL}/characteristic-document/list?paginate=1${params}`
          )
          .then((response) => {
            if (response.data.success) {
              this.data_document_characteristics_list =
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
      async _createAction(
        idTrustBusiness: number | string,
        payload: IDocumentCharacteristicsPayload
      ): Promise<boolean> {
        let success = false
        await executeApi()
          .post(
            `${TRUST_BUSINESS_API_URL}/characteristic-document/new/${idTrustBusiness}`,
            payload
          )
          .then((response) => {
            success = response.data.success
            if (success) {
              this.data_document_characteristics_form = null
              this.data_document_characteristics_list = []
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
      async _getDocumentCharacteristicsById(id: number | string) {
        await executeApi()
          .post(`${TRUST_BUSINESS_API_URL}/characteristic-document/show/${id}`)
          .then((response) => {
            if (response.data.success) {
              this.data_document_characteristics_form =
                response.data?.data ?? ({} as IDocumentCharacteristicsForm)
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
      async _deleteAction(id: number | string) {
        let success = false
        await executeApi()
          .delete(
            `${TRUST_BUSINESS_API_URL}/characteristic-document/delete/${id}`
          )
          .then((response) => {
            success = response.data.success
            if (success) {
              this.data_document_characteristics_form = null
              this.data_document_characteristics_list = []
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
    },
  }
)
