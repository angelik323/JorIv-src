// Pinia
import { defineStore } from 'pinia'

// APIs
import { executeApi } from '@/apis'

// Composables
import { useAlert } from '@/composables/useAlert'
import { useShowError } from '@/composables/useShowError'

// Interfaces
import { IErrors } from '@/interfaces/global/'
import {
  IProjectManagementRequest,
  IProjectManagementList,
  IProjectManagementBusinessChildrenList,
  IProjectManagementAssociatedBusinessList,
} from '@/interfaces/customs/derivative-contracting/ProjectManagement'

// Constantes
import { URL_PATH_DERIVATIVE_CONTRACTING } from '@/constants/apis'
import { TIMEOUT_ALERT } from '@/constants/alerts'

const URL_PATH = `${URL_PATH_DERIVATIVE_CONTRACTING}/project`

const { showAlert } = useAlert()
const { showCatchError } = useShowError()

export const useProjectManagementStoreV1 = defineStore(
  'project-management-store-v1',
  {
    state: () => ({
      project_management_list: [] as IProjectManagementList,
      project_management_pages: {
        currentPage: 0,
        lastPage: 0,
        total_items: 0,
        per_page: 0,
      },
      business_children_list: [] as IProjectManagementBusinessChildrenList,
      associated_business_list: [] as IProjectManagementAssociatedBusinessList,
    }),

    actions: {
      async _getListAction(params: string) {
        this._clearData()
        await executeApi()
          .get(`${URL_PATH}?paginate=1${params}`)
          .then((response) => {
            const {
              data: {
                data: items = [],
                current_page = 0,
                last_page = 0,
                total = 0,
                per_page = 0,
              },
            } = response.data

            this.project_management_list = items
            this.project_management_pages.currentPage = current_page
            this.project_management_pages.lastPage = last_page
            this.project_management_pages.total_items = total
            this.project_management_pages.per_page = per_page

            return showAlert(
              response.data.message,
              response.data.success ? 'success' : 'error',
              undefined,
              TIMEOUT_ALERT
            )
          })
          .catch((e) => {
            const error = e as IErrors
            const message = showCatchError(error)
            showAlert(message, 'error', undefined, TIMEOUT_ALERT)
          })
      },

      async _getListAssociatedAction(
        projectId: string = '',
        params: string = ''
      ) {
        await executeApi()
          .get(`${URL_PATH}/listAssociated${projectId}${params}`)
          .then((response) => {
            this.business_children_list = response.data.data ?? []

            return showAlert(
              response.data.message,
              response.data.success ? 'success' : 'error',
              undefined,
              TIMEOUT_ALERT
            )
          })
          .catch((e) => {
            const error = e as IErrors
            const message = showCatchError(error)
            showAlert(message, 'error', undefined, TIMEOUT_ALERT)
          })
      },

      async _getListChildrensAction(
        businessId: string = '',
        params: string = ''
      ) {
        await executeApi()
          .get(`${URL_PATH}/listChildrens${businessId}${params}`)
          .then((response) => {
            this.associated_business_list = response.data?.data ?? []

            return showAlert(
              response.data.message,
              response.data.success ? 'success' : 'error',
              undefined,
              TIMEOUT_ALERT
            )
          })
          .catch((e) => {
            const error = e as IErrors
            const message = showCatchError(error)
            showAlert(message, 'error', undefined, TIMEOUT_ALERT)
          })
      },

      async _getListBusinessChildrenAction(
        projectId: string = '',
        params: string = ''
      ) {
        await executeApi()
          .get(`${URL_PATH}/business-children${projectId}${params}`)
          .then((response) => {
            this.associated_business_list = response.data?.data ?? []

            return showAlert(
              response.data.message,
              response.data.success ? 'success' : 'error',
              undefined,
              TIMEOUT_ALERT
            )
          })
          .catch((e) => {
            const error = e as IErrors
            let message = showCatchError(error)
            const messageEmptyChildrens =
              'No se encontraron negocios hijos vinculados para el negocio asociado'
            if (error?.response?.status === 404) {
              message = `${message} ${messageEmptyChildrens}`
            }
            showAlert(message, 'error', undefined, TIMEOUT_ALERT)
          })
      },

      async _getByIdAction(id: number) {
        return await executeApi()
          .get(`${URL_PATH}/${id}`)
          .then((response) => {
            const { data: responseData, message, success } = response.data

            if (success && responseData) {
              return responseData
            }

            showAlert(
              message,
              success ? 'success' : 'error',
              undefined,
              TIMEOUT_ALERT
            )
            return null
          })
          .catch((e) => {
            const error = e as IErrors
            const message = showCatchError(error)
            showAlert(message, 'error', undefined, TIMEOUT_ALERT)
            return null
          })
      },

      async _createAction(data: IProjectManagementRequest) {
        let success = false

        await executeApi()
          .post(`${URL_PATH}`, data)
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

      async _updateAction(data: IProjectManagementRequest, id: number) {
        let success = false

        await executeApi()
          .put(`${URL_PATH}/${id}`, data)
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

      async _deleteAction(id: number) {
        let success = false

        await executeApi()
          .delete(`${URL_PATH}/${id}`)
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

      _clearData() {
        this.project_management_list = []
        this.project_management_pages = {
          currentPage: 0,
          lastPage: 0,
          total_items: 0,
          per_page: 0,
        }
        this.business_children_list = []
        this.associated_business_list = []
      },
    },
  }
)
