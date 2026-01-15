// Pinia
import { defineStore } from 'pinia'

// Utils
import { useAlert } from '@/composables/useAlert'
import { useShowError } from '@/composables/useShowError'
import { executeApi } from '@/apis'

// Interfaces
import { URL_PATH_FICS } from '@/constants/apis'
import { TIMEOUT_ALERT } from '@/constants/alerts'
import { IBulkUploadTemplatesList } from '@/interfaces/customs/fics/BulkUploadTemplates'

const URL_PATH = `${URL_PATH_FICS}/monetary-operation-templates`

export const useBulkUploadTemplatesStoreV1 = defineStore(
  'bulk-upload-templates-store-v1',
  {
    state: () => ({
      data_bulk_upload_templates_list: [] as IBulkUploadTemplatesList[],
      data_bulk_upload_templates_pages: {
        currentPage: 0,
        lastPage: 0,
      },
      data_information_form: null as IBulkUploadTemplatesList | null,
    }),

    actions: {
      async _getApiBulkUploadTemplates(params: string) {
        const { showAlert } = useAlert()
        const { showCatchError } = useShowError()
        await executeApi()
          .get(`${URL_PATH}?paginate=1${params}`)
          .then((response) => {
            const {
              data: { data: items = [], current_page = 0, last_page = 0 },
              message,
              success,
            } = response.data

            this.data_bulk_upload_templates_list = items.map(
              (item: IBulkUploadTemplatesList) => ({
                ...item,
              })
            )
            this.data_bulk_upload_templates_pages.currentPage = current_page
            this.data_bulk_upload_templates_pages.lastPage = last_page

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

      async _getByIdBulkUploadTemplates(id: number) {
        const { showAlert } = useAlert()
        const { showCatchError } = useShowError()
        await executeApi()
          .get(`${URL_PATH}/${id}`)
          .then((response) => {
            if (response.data.success) {
              const res = response.data.data
              if (res) {
                this.data_information_form = res
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

      async _updateBulkUploadTemplates(
        data: IBulkUploadTemplatesList,
        id: number
      ) {
        const { showAlert } = useAlert()
        const { showCatchError } = useShowError()
        let success = false

        await executeApi()
          .patch(`${URL_PATH}/${id}`, data)
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

      async _createBulkUploadTemplates(data: IBulkUploadTemplatesList) {
        const { showAlert } = useAlert()
        const { showCatchError } = useShowError()
        let success = false

        await executeApi()
          .post(`${URL_PATH}`, data)
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

      async _downloadExcelBulkUploadTemplates(id: string) {
        const { showAlert } = useAlert()
        await executeApi()
          .get(`${URL_PATH}/${id}/export/excel`, {
            responseType: 'blob',
          })
          .then((response) => {
            const blob = new Blob([response.data], {
              type: response.headers['content-type'],
            })

            const today = new Date()
            const year = today.getFullYear()
            const month = String(today.getMonth() + 1).padStart(2, '0')
            const day = String(today.getDate()).padStart(2, '0')
            const dateString = `${year}-${month}-${day}`

            const fileName = `Listado_de_plantillas_de_cargues_masivos_${dateString}.xlsx`

            const link = document.createElement('a')
            const url = URL.createObjectURL(blob)
            link.href = url
            link.setAttribute('download', fileName)
            document.body.appendChild(link)
            link.click()
            link.remove()
            URL.revokeObjectURL(url)

            showAlert('Descarga exitosa', 'success', undefined, TIMEOUT_ALERT)
          })
          .catch(async (error) => {
            let errorMessage = 'Error al descargar el archivo Excel'

            if (error.response) {
              if (error.response.data instanceof Blob) {
                try {
                  const text = await error.response.data.text()

                  if (
                    error.response.headers['content-type']?.includes(
                      'application/json'
                    )
                  ) {
                    const jsonError = JSON.parse(text)
                    errorMessage = jsonError.message || errorMessage
                  }
                } catch (parseError) {}
              } else if (error.response.data?.message) {
                errorMessage = error.response.data.message
              }
            } else if (error.message) {
              errorMessage = error.message
            }

            showAlert(errorMessage, 'error', undefined, TIMEOUT_ALERT)
          })
      },

      _setDataInformationForm(data_to_set: IBulkUploadTemplatesList | null) {
        this.data_information_form = data_to_set ? { ...data_to_set } : null
      },

      _clearData() {
        this.data_bulk_upload_templates_list = []
        this.data_bulk_upload_templates_pages = {
          currentPage: 0,
          lastPage: 0,
        }
      },
    },
  }
)
