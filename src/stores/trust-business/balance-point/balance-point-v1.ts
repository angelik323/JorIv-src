import { executeApi } from '@/apis'
import { useAlert, useShowError, useUtils } from '@/composables'
import { TIMEOUT_ALERT } from '@/constants/alerts'
import { TRUST_BUSINESS_API_URL } from '@/constants/apis'
import {
  IAuthorizationForm,
  IBalancePointBasicDataForm,
  IBalancePointCharacteristicsDetails,
  IBalancePointCreatePayload,
  IBalancePointList,
  IBalancePointMandateForm,
  IBalancePointResponse,
  IBalancePointStageMandateList,
  ITrustBusinessDocumentsForm,
} from '@/interfaces/customs'
import { createAndDownloadBlobByArrayBuffer } from '@/utils'
import { saveAs } from 'file-saver'
import { defineStore } from 'pinia'

const INITIAL_ID_VALUE = 0

const { showAlert } = useAlert()
const { showCatchError } = useShowError()
const { defaultIconsLucide } = useUtils()

export const useBalancePointStoreV1 = defineStore('balance-point-store-v1', {
  state: () => ({
    data_balance_point_list: [] as IBalancePointList[],
    data_balance_point_basic_data_form:
      null as IBalancePointBasicDataForm | null,
    data_documents_form: null as ITrustBusinessDocumentsForm | null,
    data_balance_point_mandate_form: null as IBalancePointMandateForm | null,
    balance_point_response: null as IBalancePointResponse | null,
    data_authorization_form: null as IAuthorizationForm | null,
    characteristic_document_details:
      [] as IBalancePointCharacteristicsDetails[],
    headerPropsDefault: {
      title: 'Punto de equilibrio',
      breadcrumbs: [
        {
          label: 'Inicio',
          route: 'HomeView',
        },
        {
          label: 'Negocios fiduciarios',
        },
        {
          label: 'Punto de equilibrio',
          route: 'BalancePointList',
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
    async _getListBalancePoint(params: string) {
      await executeApi()
        .get(`${TRUST_BUSINESS_API_URL}/equilibrium-point?paginate=1${params}`)
        .then((response) => {
          if (response.data.success) {
            this.data_balance_point_list =
              (response.data?.data?.data as IBalancePointList[]) ?? []
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
    async _createBalancePoint(payload: IBalancePointCreatePayload) {
      let success = false
      let id = INITIAL_ID_VALUE

      await executeApi()
        .post(`${TRUST_BUSINESS_API_URL}/equilibrium-point`, payload)
        .then((response) => {
          success = response.data?.success ?? false
          id = response.data?.data?.id ?? INITIAL_ID_VALUE
          if (success) {
            this._resetDataStore()
          }
          showAlert(
            response.data.message,
            success ? 'success' : 'error',
            undefined,
            TIMEOUT_ALERT
          )
        })
        .catch((error) => {
          showAlert(showCatchError(error), 'error', undefined, TIMEOUT_ALERT)
        })

      return id
    },
    async _updateBalancePoint(
      idBalancePoint: number | string,
      payload: IBalancePointCreatePayload
    ) {
      let success = false
      await executeApi()
        .put(
          `${TRUST_BUSINESS_API_URL}/equilibrium-point/${idBalancePoint}`,
          payload
        )
        .then((response) => {
          success = response.data?.success ?? false
          if (success) {
            this._resetDataStore()
          }
          showAlert(
            response.data.message,
            success ? 'success' : 'error',
            undefined,
            TIMEOUT_ALERT
          )
        })
        .catch((error) => {
          showAlert(showCatchError(error), 'error', undefined, TIMEOUT_ALERT)
        })

      return success
    },
    async _exportXlsxBalancePointList(params: string) {
      const nameFile = `Listado_de_punto_de_equilibrio`
      await executeApi()
        .get(
          `${TRUST_BUSINESS_API_URL}/equilibrium-point/export/excel?${params}`,
          {
            responseType: 'arraybuffer',
          }
        )
        .then((response) => {
          createAndDownloadBlobByArrayBuffer(
            response.data,
            nameFile,
            undefined,
            true
          )
        })
        .catch((error) => {
          showAlert(showCatchError(error), 'error', undefined, TIMEOUT_ALERT)
        })
    },
    async _exportXlsxBalancePointRow(idBalancePoint: number | string) {
      const nameFile = `Punto_de_equilibrio`
      await executeApi()
        .get(
          `${TRUST_BUSINESS_API_URL}/equilibrium-point/export/excel?ids[]=${idBalancePoint}`,
          {
            responseType: 'arraybuffer',
          }
        )
        .then((response) => {
          createAndDownloadBlobByArrayBuffer(
            response.data,
            nameFile,
            undefined,
            true
          )
        })
        .catch((error) => {
          showAlert(showCatchError(error), 'error', undefined, TIMEOUT_ALERT)
        })
    },
    async _downloadZipBalancePointByRow(idBalancePoint: number | string) {
      const nameFile = `Punto_de_equilibrio`
      await executeApi()
        .get(
          `${TRUST_BUSINESS_API_URL}/equilibrium-point/${idBalancePoint}/download`,
          {
            responseType: 'blob',
          }
        )
        .then((response) => {
          saveAs(
            response.data,
            nameFile ||
              `punto_de_equilibrio_archivos_${new Date().getTime()}.zip`
          )
        })
        .catch((error) => {
          showAlert(showCatchError(error), 'error', undefined, TIMEOUT_ALERT)
        })
    },
    async _deleteAction(id: number | string) {
      let success = false
      await executeApi()
        .delete(`${TRUST_BUSINESS_API_URL}/equilibrium-point/${id}`)
        .then((response) => {
          success = response.data.success
          if (success) {
            this._resetDataStore()
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
    async _getCharacteristicDocumentDetailsByID(
      characteristicDocumentId: string | number
    ) {
      let characteristicDocumentDetails: IBalancePointCharacteristicsDetails[] =
        []
      await executeApi()
        .get(
          `${TRUST_BUSINESS_API_URL}/equilibrium-point/characteristic/document/details/?filter[characteristic_document_id]=${characteristicDocumentId}`
        )
        .then((response) => {
          if (response.data.success) {
            characteristicDocumentDetails = response.data.data
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
      return characteristicDocumentDetails
    },
    async _addBalancePointFile(
      balancePointId: number | string,
      data: { name: string; document_type: string }
    ) {
      let success = false
      let documentId = INITIAL_ID_VALUE
      let uploadUrl = ''
      let filePath = ''

      await executeApi()
        .get(
          `${TRUST_BUSINESS_API_URL}/equilibrium-point/file/signed?name=${data.name}&document_type=${data.document_type}&equilibrium_point_id=${balancePointId}&associated_document=Licencias`
        )
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
        .catch((error) => {
          showAlert(showCatchError(error), 'error', undefined, TIMEOUT_ALERT)
        })

      return { success, documentId, uploadUrl, filePath }
    },
    async _deleteBalancePointFile(id: number | string) {
      let success = false
      await executeApi()
        .delete(`${TRUST_BUSINESS_API_URL}/equilibrium-point/file/${id}`)
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
    _setDataBasicDataForm(data_to_set: IBalancePointBasicDataForm | null) {
      this.data_balance_point_basic_data_form = data_to_set
        ? { ...data_to_set }
        : null
    },
    _setDataMandateForm(data_to_set: IBalancePointMandateForm | null) {
      this.data_balance_point_mandate_form = data_to_set
        ? { ...data_to_set }
        : null
    },
    _setDataAuthorizationForm(data_to_set: IAuthorizationForm | null) {
      this.data_authorization_form = data_to_set ? { ...data_to_set } : null
    },
    _setDataDocumentsForm(data_to_set: ITrustBusinessDocumentsForm | null) {
      this.data_documents_form = data_to_set ? { ...data_to_set } : null
    },
    _setCharacteristicDocumentDetails(
      data_to_set: IBalancePointCharacteristicsDetails[]
    ) {
      this.characteristic_document_details = data_to_set ? [...data_to_set] : []
    },
    async _getStageMandateByID(stageMandateId: string | number) {
      let stageMandateDetails: IBalancePointStageMandateList[] = []
      await executeApi()
        .get(
          `${TRUST_BUSINESS_API_URL}/equilibrium-point/stage/mandates?filter[stage_id]=${stageMandateId}`
        )
        .then((response) => {
          if (response.data.success) {
            stageMandateDetails = response.data.data
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
      return stageMandateDetails
    },
    async _getBalancePointById(id: string | number) {
      let success = false
      await executeApi()
        .get(`${TRUST_BUSINESS_API_URL}/equilibrium-point/${id}`)
        .then((response) => {
          success = response.data.success
          if (success) {
            this.balance_point_response = response.data.data
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
    async _authorizeOrDenyBalancePoint(
      id: string | number,
      observation: string | null,
      statusId: number
    ) {
      let success = false

      await executeApi()
        .patch(
          `${TRUST_BUSINESS_API_URL}/equilibrium-point/${id}/authorize?equilibrium_point_id=${id}&observation=${observation}&status_id=${statusId}`,
          { observation }
        )
        .then((response) => {
          success = response.data?.success ?? false
          id = response.data?.data?.id ?? INITIAL_ID_VALUE
          if (success) {
            this._resetDataStore()
          }
          showAlert(
            response.data.message,
            success ? 'success' : 'error',
            undefined,
            TIMEOUT_ALERT
          )
        })
        .catch((error) => {
          showAlert(showCatchError(error), 'error', undefined, TIMEOUT_ALERT)
        })

      return id
    },
    _resetDataStore() {
      this.data_balance_point_list = []
      this.data_balance_point_basic_data_form = null
      this.data_balance_point_mandate_form = null
      this.data_authorization_form = null
      this.balance_point_response = null
      this.characteristic_document_details = []
    },
  },
})
