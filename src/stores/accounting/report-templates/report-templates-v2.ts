import { executeApi } from '@/apis'
import { useUtils } from '@/composables/useUtils'
import { URL_PATH_ACCOUNTING } from '@/constants/apis'
import { defineStore } from 'pinia'
import { TIMEOUT_ALERT } from '@/constants/alerts'
import { useShowError } from '@/composables/useShowError'
import { useAlert } from '@/composables/useAlert'
import {
  IReportTemplateListLogoItem,
  IReportTemplatePayload,
  IReportTemplatePayloadLogoAndSignature,
  IReportTemplateSignatureItem,
} from '@/interfaces/customs'

// Auxiliary functions
const { showAlert } = useAlert()
const { showCatchError } = useShowError()

export const useReportTemplateStoreV2 = defineStore(
  'report-template-store-v2',
  {
    state: () => ({
      headerPropsDefault: {
        title: 'Plantilla de Reportes',
        breadcrumbs: [
          {
            label: 'Inicio',
            route: 'HomeView',
          },
          {
            label: 'Contabilidad',
          },
          {
            label: 'Plantilla de reportes',
            route: 'ReportTemplateList',
          },
        ],
        btn: {
          label: 'Crear plantilla',
          icon: useUtils().defaultIconsLucide.plusCircle,
          color: 'orange',
          class: 'custom',
          textColor: 'black',
        },
      },
      report_template_logo_response: {} as IReportTemplateListLogoItem,
      report_template_signature_response: {} as IReportTemplateSignatureItem,
      report_template_response: {} as IReportTemplatePayload,
    }),
    actions: {
      //Logo actions v2
      async _getReportTemplateLogo() {
        return await executeApi()
          .get(
            `${URL_PATH_ACCOUNTING}/v2/report-templates/logo/list?paginate=1`
          )
          .then((response) => {
            const {
              data: { data = [], current_page = 0, last_page = 0 } = {},
              message,
              success,
            } = response.data
            if (success) {
              return {
                data,
                current_page,
                last_page,
              }
            }
            showAlert(
              message,
              success ? 'success' : 'error',
              undefined,
              TIMEOUT_ALERT
            )
            return null
          })
          .catch((error) => {
            showAlert(showCatchError(error), 'error', undefined, TIMEOUT_ALERT)
            return null
          })
      },
      async _getShowReportTemplateLogo(id: number | string) {
        await executeApi()
          .get(`${URL_PATH_ACCOUNTING}/v2/report-templates/logo/show/${id}`)
          .then((response) => {
            const { data, message, success } = response.data
            if (success) {
              this.report_template_response = data
            }
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
      },
      async _createReportTemplateLogo(
        payload: IReportTemplatePayloadLogoAndSignature
      ) {
        await executeApi()
          .post(
            `${URL_PATH_ACCOUNTING}/v2/report-templates/logo/store`,
            payload
          )
          .then((response) => {
            const { message, success } = response.data
            this.report_template_logo_response = response.data.data
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
      },
      async _updateReportTemplateLogo(id: number) {
        await executeApi()
          .put(
            `${URL_PATH_ACCOUNTING}/v2/report-templates/logo/change-status/${id}`
          )
          .then((response) => {
            const { message, success } = response.data

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
      },
      async _deleteReportTemplateLogo(id: number | string) {
        await executeApi()
          .delete(
            `${URL_PATH_ACCOUNTING}/v2/report-templates/logo/delete/${id}`
          )
          .then((response) => {
            const { message, success } = response.data
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
      },

      //Signature actions v2
      async _getReportTemplateSignature() {
        return await executeApi()
          .get(
            `${URL_PATH_ACCOUNTING}/v2/report-templates/signature/list?paginate=1`
          )
          .then((response) => {
            const {
              data: { data = [], current_page = 0, last_page = 0 } = {},
              message,
              success,
            } = response.data
            if (success) {
              return {
                data,
                current_page,
                last_page,
              }
            }
            showAlert(
              message,
              success ? 'success' : 'error',
              undefined,
              TIMEOUT_ALERT
            )
            return null
          })
          .catch((error) => {
            showAlert(showCatchError(error), 'error', undefined, TIMEOUT_ALERT)
            return null
          })
      },
      async _getShowReportTemplateSignature(id: number | string) {
        await executeApi()
          .get(
            `${URL_PATH_ACCOUNTING}/v2/report-templates/signature/show/${id}`
          )
          .then((response) => {
            const { data, message, success } = response.data
            if (success) {
              this.report_template_response = data
            }
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
      },
      async _createReportTemplateSignature(
        payload: IReportTemplatePayloadLogoAndSignature
      ) {
        await executeApi()
          .post(
            `${URL_PATH_ACCOUNTING}/v2/report-templates/signature/store`,
            payload
          )
          .then((response) => {
            const { message, success } = response.data
            this.report_template_signature_response = response.data.data
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
      },
      async _updateReportTemplateSignature(id: number | string) {
        await executeApi()
          .put(
            `${URL_PATH_ACCOUNTING}/v2/report-templates/signature/change-status/${id}`
          )
          .then((response) => {
            const { message, success } = response.data

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
      },
      async _deleteReportTemplateSignature(id: number) {
        await executeApi()
          .delete(
            `${URL_PATH_ACCOUNTING}/v2/report-templates/signature/delete/${id}`
          )
          .then((response) => {
            const { message, success } = response.data
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
      },

      // Template report generic v2
      async _getReportTemplate(params: Record<string, string | number>) {
        return await executeApi()
          .get(`${URL_PATH_ACCOUNTING}/v2/report-templates/list?paginate=1`, {
            ...params,
          })
          .then((response) => {
            const {
              data: { data = [], current_page = 0, last_page = 0 } = {},
              message,
              success,
            } = response.data
            if (success) {
              return {
                data,
                current_page,
                last_page,
              }
            }
            showAlert(
              message,
              success ? 'success' : 'error',
              undefined,
              TIMEOUT_ALERT
            )
            return null
          })
          .catch((error) => {
            showAlert(showCatchError(error), 'error', undefined, TIMEOUT_ALERT)
            return null
          })
      },
      async _getShowReportTemplate(id: number | string) {
        await executeApi()
          .get(`${URL_PATH_ACCOUNTING}/v2/report-templates/show/${id}`)
          .then((response) => {
            const { data, message, success } = response.data
            if (success) {
              this.report_template_response = data
            }
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
      },
      async _createReportTemplate(payload: IReportTemplatePayload) {
        let sucess = false
        await executeApi()
          .post(`${URL_PATH_ACCOUNTING}/v2/report-templates/store`, payload)
          .then((response) => {
            const { message, success } = response.data
            sucess = success
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
        return sucess
      },
      async _updateReportTemplate(id: number) {
        await executeApi()
          .put(`${URL_PATH_ACCOUNTING}/v2/report-templates/change-status/${id}`)
          .then((response) => {
            const { message, success } = response.data

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
      },
      async _updatePartialReportTemplate(
        id: number | string,
        payload: IReportTemplatePayload
      ) {
        let sucess = false
        await executeApi()
          .patch(
            `${URL_PATH_ACCOUNTING}/v2/report-templates/update/${id}`,
            payload
          )
          .then((response) => {
            const { message, success } = response.data
            sucess = success
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
        return sucess
      },

      //Signs actions v2
      async _deleteReportTemplateSigns(id: number | string) {
        await executeApi()
          .delete(
            `${URL_PATH_ACCOUNTING}/v2/report-templates/report-template-signatures/delete/${id}`
          )
          .then((response) => {
            const { message, success } = response.data
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
      },

      async _getShowReportTemplateSigns(id: number | string) {
        await executeApi()
          .get(
            `${URL_PATH_ACCOUNTING}/v2/report-templates/report-template-signatures/show/${id}`
          )
          .then((response) => {
            const { data, message, success } = response.data
            if (success) {
              this.report_template_response = data
            }
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
      },
    },
  }
)
