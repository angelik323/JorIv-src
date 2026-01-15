// Pinia
import { defineStore } from 'pinia'

//APIs
import { executeApi } from '@/apis'

// Interfaces
import {
  IOwnList,
  IOwnListDetail,
  IOwnListImportThirdPartyPayload,
  IOwnListImportThirdPartyResponse,
  IOwnListUpdatePayload,
} from '@/interfaces/customs/sarlaft/OwnList'

// Utils
import { URL_PATH_SARLAFT } from '@/constants/apis'
import { TIMEOUT_ALERT } from '@/constants/alerts'

// Composables
import { useAlert, useShowError, useUtils } from '@/composables'

const { showAlert } = useAlert()
const { showCatchError } = useShowError()

const useOwnListStoreV1 = defineStore('own-list-store-v1', {
  state: () => ({
    version: 'v1',
  }),
  actions: {
    async _getOwnList(queryParamsFilters: string) {
      return executeApi()
        .get(`${URL_PATH_SARLAFT}/own-list?${queryParamsFilters}`)
        .then((response) => {
          const data = (response?.data?.data?.data ?? []) as IOwnList[]
          const pages = {
            currentPage: response?.data?.data?.current_page ?? 1,
            lastPage: response?.data?.data?.last_page ?? 1,
          }
          showAlert(
            'Registro obtenido exitosamente',
            'success',
            undefined,
            TIMEOUT_ALERT
          )
          return { data, pages }
        })
        .catch((error) => {
          showAlert(showCatchError(error), 'error', undefined, TIMEOUT_ALERT)
          return null
        })
    },
    async _importOwnList(
      payload: IOwnListImportThirdPartyPayload
    ): Promise<IOwnListImportThirdPartyResponse> {
      const formData = new FormData()
      let keyFileId: string | null = null
      formData.append('file', payload.file)
      formData.append('list_name', payload.listName)
      return executeApi()
        .post(`${URL_PATH_SARLAFT}/own-list/import`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        })
        .then((response) => {
          keyFileId = response?.data?.data?.key_data
          if (response?.data?.data?.errors?.length) {
            throw new Error('Error al importar los registros')
          }
          showAlert(
            'Registro importado exitosamente',
            'success',
            undefined,
            TIMEOUT_ALERT
          )
          return { ...response?.data?.data, errors: false }
        })
        .catch((error) => {
          showAlert(showCatchError(error), 'error', undefined, TIMEOUT_ALERT)
          return {
            key_data: keyFileId,
            errors: true,
          }
        })
    },
    async _confirmImport(keyData: string) {
      return executeApi()
        .get(`${URL_PATH_SARLAFT}/own-list/import/${keyData}`)
        .then((response) => {
          showAlert(
            'Registro creado exitosamente',
            'success',
            undefined,
            TIMEOUT_ALERT
          )
          return response?.data?.data
        })
        .catch((error) => {
          showAlert(showCatchError(error), 'error', undefined, TIMEOUT_ALERT)
          throw error
        })
    },
    async _getOwnListDetail(id: string): Promise<IOwnListDetail> {
      return executeApi()
        .get(`${URL_PATH_SARLAFT}/own-list/show/${id}`)
        .then((response) => {
          showAlert(
            'Registro obtenido exitosamente',
            'success',
            undefined,
            TIMEOUT_ALERT
          )
          return response?.data?.data
        })
        .catch((error) => {
          showAlert(showCatchError(error), 'error', undefined, TIMEOUT_ALERT)
          return null
        })
    },
    async _updateOwnList(
      id: string,
      payload: IOwnListUpdatePayload
    ): Promise<boolean> {
      return executeApi()
        .put(`${URL_PATH_SARLAFT}/own-list/update/${id}`, payload)
        .then((response) => {
          const data = response?.data
          showAlert(
            data?.message ?? 'Registro actualizado exitosamente',
            'success',
            undefined,
            TIMEOUT_ALERT
          )
          return true
        })
        .catch((error) => {
          showAlert(showCatchError(error), 'error', undefined, TIMEOUT_ALERT)
          return false
        })
    },
    async _toggleOwnListStatus(id: string): Promise<void> {
      return executeApi()
        .patch(`${URL_PATH_SARLAFT}/own-list/${id}/toggle-status`)
        .then(() => {
          showAlert(
            'Registro actualizado correctamente',
            'success',
            undefined,
            TIMEOUT_ALERT
          )
        })
        .catch((error) => {
          showAlert(showCatchError(error), 'error', undefined, TIMEOUT_ALERT)
          throw error
        })
    },
    async _nameExist(name: string): Promise<boolean> {
      return executeApi()
        .get(`${URL_PATH_SARLAFT}/own-list/exists-name?name=${name}`)
        .then((response) => {
          return response?.data?.data?.exists ?? false
        })
        .catch((error) => {
          showAlert(showCatchError(error), 'error', undefined, TIMEOUT_ALERT)
          return false
        })
    },

    async _downloadTemplate() {
      const { getNameBlob, downloadBlobXlxx } = useUtils()

      await executeApi()
        .get(`${URL_PATH_SARLAFT}/own-list/download-template-own-list`, {
          responseType: 'blob',
        })
        .then((response) => {
          const blob = new Blob([response.data], {
            type: response.headers['content-type'],
          })

          const fileName = getNameBlob(response)
          downloadBlobXlxx(blob, fileName)
        })
        .catch((error) => {
          showAlert(showCatchError(error), 'error', undefined, TIMEOUT_ALERT)
        })
    },

    async _downloadErrors(keyData: string) {
      const { getNameBlob, downloadBlobXlxx } = useUtils()

      await executeApi()
        .get(`${URL_PATH_SARLAFT}/own-list/download-errors/${keyData}`, {
          responseType: 'blob',
        })
        .then((response) => {
          const blob = new Blob([response.data], {
            type: response.headers['content-type'],
          })

          const fileName = getNameBlob(response)
          downloadBlobXlxx(blob, fileName)
        })
        .catch((error) => {
          showAlert(showCatchError(error), 'error', undefined, TIMEOUT_ALERT)
        })
    },
  },
})

export default useOwnListStoreV1
