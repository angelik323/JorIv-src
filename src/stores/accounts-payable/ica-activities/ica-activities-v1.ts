// core
import { defineStore } from 'pinia'
import { executeApi } from '@/apis'

// interfaces
import { IErrors } from '@/interfaces/global'
import {
  IIcaActivitiesCreatePayload,
  IIcaActivitiesItem,
  IIcaActivitiesUpdatePayload,
  IIcaActivitiesForm,
  IAvalibleCities,
  IIcaRelationsItem,
  IIcaRelationsForm,
  IIcaRelationsPayload,
  IIcaActivitiesFileErrorJson,
  IIcaActivitiesFileErrorJsonRow,
} from '@/interfaces/customs/accounts-payable/IcaActivities'

// composables
import { useAlert, useShowError, useUtils } from '@/composables'

// constants
import { URL_PATH_ACCOUNTS_PAYABLE } from '@/constants/apis'
import { TIMEOUT_ALERT } from '@/constants/alerts'

// prepare composables
const { showAlert } = useAlert()
const { showCatchError } = useShowError()

export const useIcaActivitiesStoreV1 = defineStore('ica-activities-store-v1', {
  state: () => ({}),

  actions: {
    async _getActivityList(params: Record<string, string | number>) {
      const responseData = {
        pages: {
          currentPage: 1,
          lastPage: 1,
        },
        data: [] as IIcaActivitiesItem[],
      }

      await executeApi()
        .get(`${URL_PATH_ACCOUNTS_PAYABLE}/ica/activities`, {
          params: { ...params, paginate: 1 },
        })
        .then((response) => {
          const {
            data: { data: items = [], current_page = 0, last_page = 0 },
            message,
            success,
          } = response.data

          responseData.data = items

          responseData.pages = {
            currentPage: current_page,
            lastPage: last_page,
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
      return responseData
    },

    async _toggleStatusActivity(id: number) {
      let success = false
      await executeApi()
        .patch(
          `${URL_PATH_ACCOUNTS_PAYABLE}/ica/activities/${id}/toggle-status`
        )
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

    async _createActivity(payload: IIcaActivitiesCreatePayload) {
      let success = false
      await executeApi()
        .post(`${URL_PATH_ACCOUNTS_PAYABLE}/ica/activities`, payload)
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

    async _deleteActivity(id: number) {
      let success = false
      await executeApi()
        .delete(`${URL_PATH_ACCOUNTS_PAYABLE}/ica/activities/${id}`)
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

    async _getActivityById(id: number) {
      let responseData: IIcaActivitiesForm | null = null
      await executeApi()
        .get(`${URL_PATH_ACCOUNTS_PAYABLE}/ica/activities/${id}`)
        .then((response) => {
          const { data, message, success } = response.data
          if (success) {
            responseData = data
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
      return responseData
    },

    async _updateActivity(payload: IIcaActivitiesUpdatePayload, id: number) {
      let success = false
      await executeApi()
        .put(`${URL_PATH_ACCOUNTS_PAYABLE}/ica/activities/${id}`, payload)
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

    async _createBulkActivity(payload: IIcaActivitiesFileErrorJsonRow[]) {
      let success = false
      await executeApi()
        .post(`${URL_PATH_ACCOUNTS_PAYABLE}/ica/activities/import`, payload)
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

    async _downloadExcelActivitiesTemplate() {
      await executeApi()
        .get(`${URL_PATH_ACCOUNTS_PAYABLE}/ica/activities/download-template`, {
          responseType: 'blob',
        })
        .then((response) => {
          const blob = new Blob([response.data], {
            type: response.headers['content-type'],
          })

          const name = useUtils().getNameBlob(response)
          useUtils().downloadBlobXlxx(blob, name)
        })
        .catch((error) => {
          showAlert(showCatchError(error), 'error', undefined, TIMEOUT_ALERT)
        })
    },

    async _downloadExcelIcaActivitiesErrorsJson(file: File) {
      let responseData: IIcaActivitiesFileErrorJson = {
        filename: '',
        successful_records: 0,
        failed_records: 0,
        total_records: 0,
        status: {
          id: 0,
          name: '',
        },
        validated_rows: [],
      }

      const formData = new FormData()
      formData.append('file', file)

      await executeApi()
        .post(
          `${URL_PATH_ACCOUNTS_PAYABLE}/ica/activities/check-import`,
          formData,
          {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          }
        )
        .then((response) => {
          responseData = response.data.data
        })
        .catch((e) => {
          const error = e as IErrors
          const message = showCatchError(error)
          showAlert(message, 'error', undefined, TIMEOUT_ALERT)
        })
      return responseData
    },

    async _downloadExcelActivityErrors(file: File) {
      const formData = new FormData()
      formData.append('file', file)

      await executeApi()
        .post(
          `${URL_PATH_ACCOUNTS_PAYABLE}/ica/activities/check-import?download-errors=true`,
          formData,
          {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
            responseType: 'blob',
          }
        )
        .then((response) => {
          const blob = new Blob([response.data], {
            type: response.headers['content-type'],
          })

          const name = useUtils().getNameBlob(response)
          useUtils().downloadBlobXlxx(blob, name)
        })
        .catch((error) => {
          showAlert(showCatchError(error), 'error', undefined, TIMEOUT_ALERT)
        })
    },

    async _getRelationsList(params: Record<string, string | number>) {
      const responseData = {
        pages: {
          currentPage: 1,
          lastPage: 1,
        },
        data: [] as IIcaRelationsItem[],
      }

      await executeApi()
        .get(`${URL_PATH_ACCOUNTS_PAYABLE}/ica/relations`, {
          params: { ...params, paginate: 1 },
        })
        .then((response) => {
          const {
            data: { data: items = [], current_page = 0, last_page = 0 },
            message,
            success,
          } = response.data

          responseData.data = items

          responseData.pages = {
            currentPage: current_page,
            lastPage: last_page,
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
      return responseData
    },

    async _createRelation(payload: IIcaRelationsPayload) {
      let success = false
      await executeApi()
        .post(`${URL_PATH_ACCOUNTS_PAYABLE}/ica/relations`, payload)
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

    async _getRelationById(id: number) {
      let responseData: IIcaRelationsForm = {
        id: null,
        periodicity: '',
        city: {
          id: null,
          name: '',
          code: '',
        },
        third_party: {
          id: null,
          document: '',
          validator_digit: '',
          legal_person: {
            third_party_id: null,
            id: null,
            business_name: '',
          },
          natural_person: {
            third_party_id: null,
            id: null,
            full_name: '',
          },
        },
      }

      await executeApi()
        .get(`${URL_PATH_ACCOUNTS_PAYABLE}/ica/relations/${id}`)
        .then((response) => {
          const { data, message, success } = response.data
          if (success) {
            responseData = data
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
      return responseData
    },

    async _updateRelation(payload: IIcaRelationsPayload, id: number) {
      let success = false
      await executeApi()
        .put(`${URL_PATH_ACCOUNTS_PAYABLE}/ica/relations/${id}`, payload)
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

    async _deleteRelation(id: number) {
      let success = false
      await executeApi()
        .delete(`${URL_PATH_ACCOUNTS_PAYABLE}/ica/relations/${id}`)
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

    async _getAvalibleCities(
      params: Record<string, string | number | boolean>
    ) {
      let responseData: IAvalibleCities[] | null = null

      await executeApi()
        .get(`${URL_PATH_ACCOUNTS_PAYABLE}/ica/relations/available-cities`, {
          params,
        })
        .then((response) => {
          const { data } = response.data

          responseData = data.map((city: IAvalibleCities) => ({
            ...city,
            value: city.id,
            label: `${city.code} - ${city.name}`,
          }))
        })
        .catch(() => {
          // como es para un selector no se muestra alerta
        })

      return responseData
    },
  },
})
