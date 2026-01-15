import { defineStore } from 'pinia'
import { executeApi } from '@/apis'
import { useAlert, useShowError } from '@/composables'
import {
  IStructureType,
  IStructureTypeCreatePayload,
  IStructureTypeDetailResponse,
  IStructureTypeModel,
} from '@/interfaces/customs'
import { URL_PATH_ACCOUNTING } from '@/constants/apis'
import { TIMEOUT_ALERT } from '@/constants/alerts'

const { showAlert } = useAlert()
const { showCatchError } = useShowError()

export const useStructureTypesStoreV1 = defineStore('structure-types-v1', {
  state: () => ({
    version: 'v1',
    structure_types_list: [] as IStructureType[],
    structure_types_pages: {
      currentPage: 0,
      lastPage: 0,
    },
    selected_structure_type: null as IStructureType | null,
  }),

  actions: {
    async _getListAction(params = '') {
      this._cleanStructureTypesData()
      await executeApi()
        .get(
          `${URL_PATH_ACCOUNTING}/structure-types?paginate=1${
            params ? '&' + params : ''
          }`
        )
        .then((response) => {
          if (response.data.success) {
            this.structure_types_list = response.data?.data?.data ?? []

            this.structure_types_pages = {
              currentPage: response.data?.data?.current_page ?? 1,
              lastPage: response.data?.data?.last_page ?? 1,
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

    _cleanStructureTypesData() {
      this.structure_types_list = []
      this.structure_types_pages = {
        currentPage: 0,
        lastPage: 0,
      }
    },

    async _createStructureType(payload: IStructureTypeCreatePayload) {
      let success = false
      await executeApi()
        .post(`${URL_PATH_ACCOUNTING}/structure-types`, payload)
        .then((response) => {
          success = response.data.success
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

    async _updateStructureType(
      id: number | string,
      payload: Partial<IStructureTypeModel>
    ) {
      let success = false
      await executeApi()
        .put(`${URL_PATH_ACCOUNTING}/structure-types/${id}`, payload)
        .then((response) => {
          success = response.data.success
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

    async _getStructureType(
      id: number | string
    ): Promise<IStructureTypeDetailResponse | null> {
      let structure_type: IStructureTypeDetailResponse | null = null
      await executeApi()
        .get(`${URL_PATH_ACCOUNTING}/structure-types/${id}`)
        .then((response) => {
          if (response.data.success) {
            structure_type = response.data.data
          }
          showAlert(
            response.data.message,
            response.data.success ? 'success' : 'error',
            undefined,
            TIMEOUT_ALERT
          )
        })
        .catch((error) => {
          showAlert(showCatchError(error), 'error', undefined, TIMEOUT_ALERT)
        })

      return structure_type
    },
    async _toggleStructureTypeStatus() {
      if (!this.selected_structure_type) return false

      const {
        id,
        status: { id: status_id },
      } = this.selected_structure_type

      if (!id || status_id === undefined) return false

      const newStatusId = status_id === 1 ? 2 : 1
      let success = false

      await executeApi()
        .patch(`${URL_PATH_ACCOUNTING}/structure-types/${id}/status`, {
          status_id: newStatusId,
        })
        .then((response) => {
          success = response.data.success
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

    _selectStructureType(structureType: IStructureType) {
      this.selected_structure_type = structureType
    },
  },
})
