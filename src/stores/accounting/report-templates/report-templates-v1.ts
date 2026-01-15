import { useAlert, useShowError } from '@/composables'
import { URL_PATH_ACCOUNTING } from '@/constants/apis'
import { TIMEOUT_ALERT } from '@/constants/alerts'
import { defineStore } from 'pinia'
import { executeApi } from '@/apis'

import {
  IGeneratePresignedUrl,
  IReportTemplatesRequest,
  IReportTemplatesResponse,
  IUpdateImage,
} from '@/interfaces/customs'

const { showAlert } = useAlert()
const { showCatchError } = useShowError()

const URL_PATH = `${URL_PATH_ACCOUNTING}/report-templates`

export const useReportTemplatesStoreV1 = defineStore(
  'report-templates-store-v1',
  {
    state: () => ({
      version: 'v1',
      report_templates_list: [] as IReportTemplatesResponse[],
      report_templates_pages: {
        currentPage: 1,
        lastPage: 1,
      },
    }),

    actions: {
      async _listAction(params: Record<string, string | number>) {
        this._clearData()

        await executeApi()
          .get(`${URL_PATH}/index`, { params: { ...params, paginate: 1 } })
          .then((response) => {
            const {
              data: { data: items = [], current_page = 0, last_page = 0 },
              message,
              success,
            } = response.data

            this.report_templates_list = items.map(
              (item: IReportTemplatesResponse) => ({
                ...item,
              })
            )
            this.report_templates_pages.currentPage = current_page
            this.report_templates_pages.lastPage = last_page

            return showAlert(
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

      async _createAction(data: IReportTemplatesRequest) {
        let success = false

        await executeApi()
          .post(`${URL_PATH}/store`, data)
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

      async _updateAction(data: IReportTemplatesRequest) {
        let success = false

        await executeApi()
          .put(`${URL_PATH}/update/${data.report_template_id}`, data)
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

      async _updateLogoAction(data: IUpdateImage) {
        let success = false

        await executeApi()
          .put(`${URL_PATH}/update-logo/`, data)
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

      async _updateSignatureAction(data: IUpdateImage) {
        let success = false

        await executeApi()
          .put(`${URL_PATH}/update-signature/`, data)
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

      async _getByIdAction(id: string) {
        return await executeApi()
          .get(`${URL_PATH}/show/${id}`)
          .then((response) => {
            if (response.data.success) return response.data.data

            showAlert(
              response.data.message,
              response.data.success ? 'success' : 'error',
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

      async _generateCodeAction(code: string) {
        return await executeApi()
          .get(`${URL_PATH}/generate-code/${code}`)
          .then((response) => {
            if (response.data.success) return response.data.data

            showAlert(
              response.data.message,
              response.data.success ? 'success' : 'error',
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

      async _generatePresignedUrl(payload: IGeneratePresignedUrl) {
        return executeApi()
          .post(`${URL_PATH}/generate-presigned-url`, payload)
          .then((response) => {
            if (response.data.success) return response.data.data

            showAlert(
              response.data.message,
              response.data.success ? 'success' : 'error',
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

      async _deleteLogoAction(id: number) {
        await executeApi()
          .delete(`${URL_PATH}/delete-logo/${id}`)
          .then((response) => {
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

      async _deleteSignatureAction(id: number) {
        await executeApi()
          .delete(`${URL_PATH}/delete-signature/${id}`)
          .then((response) => {
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

      _clearData() {
        this.report_templates_list = []
        this.report_templates_pages = {
          currentPage: 1,
          lastPage: 1,
        }
      },
    },
  }
)
