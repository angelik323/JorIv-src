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
  ClientType,
  PersonType,
  ClientRequestType,
  ClientResponseType,
  ClientPersonType,
  ClientApiRouteType,
  PersonApiRouteType,
} from '@/interfaces/global/Clients'

import {
  IClientList,
  IGeneratePresignedUrlClient,
  ILegalClientManager,
  IManagerBasicDataForm,
  IManagerPEPForm,
  ISaveClientDocumentRequest,
  ISaveClientDocumentResponse,
} from '@/interfaces/customs/clients/Clients'

// Constantes
import { URL_PATH_CLIENTS } from '@/constants/apis'
import { TIMEOUT_ALERT } from '@/constants/alerts'

const { showAlert } = useAlert()
const { showCatchError } = useShowError()

export const useClientsStoreV2 = defineStore('clients-store-v2', {
  state: () => ({
    version: 'v2',

    client_person_type: ClientPersonType.LEGAL_DIRECT as ClientPersonType,
    client_type: ClientType.DIRECT as ClientType,
    person_type: PersonType.NATURAL as PersonType,

    // --- Manager Tab (v2) --- // TODO: FAlTA REFACTORIZAR
    data_manager_legal_form: null as ILegalClientManager | null,
    data_manager_info_form: null as IManagerBasicDataForm | null,
    data_manager_pep_form: null as IManagerPEPForm | null,

    // TODO: FAlTA REFACTORIZAR
    // LISTADO
    clients_list: [] as IClientList,
    clients_pages: {
      currentPage: 0,
      lastPage: 0,
    },
  }),

  getters: {
    isLegalPersonIndirect: (state) =>
      state.client_person_type === ClientPersonType.LEGAL_INDIRECT,
  },

  actions: {
    // TODO: FAlTA REFACTORIZAR
    async _getListAction(params: string) {
      await executeApi()
        .get(
          `${URL_PATH_CLIENTS}/${ClientApiRouteType.CUSTOMERS}?paginate=1${params}`
        )
        .then((response) => {
          if (response.data.success) {
            this.clients_list = response.data?.data?.data ?? []
            this.clients_pages.currentPage =
              response.data?.data?.current_page ?? 0
            this.clients_pages.lastPage = response.data?.data?.last_page ?? 0
          }

          return showAlert(
            response.data.message,
            response.data.success ? 'success' : 'error',
            undefined,
            TIMEOUT_ALERT
          )
        })
        .catch((error) => {
          const message = showCatchError(error as IErrors)
          showAlert(message, 'error')
        })
    },

    async _getByIdAction(
      id: number,
      client_type: ClientApiRouteType,
      person_type: PersonApiRouteType
    ): Promise<ClientResponseType | null> {
      let responseData: ClientResponseType | null = null

      await executeApi()
        .get(`${URL_PATH_CLIENTS}/${client_type}/${person_type}/${id}`)
        .then((response) => {
          const { data, message, success } = response.data
          if (success) responseData = data

          showAlert(message, success ? 'success' : 'error')
        })
        .catch((error) => {
          const message = showCatchError(error as IErrors)
          showAlert(message, 'error')
        })

      return responseData
    },

    async _createAction(
      payload: ClientRequestType | unknown,
      client_type: ClientApiRouteType,
      person_type: PersonApiRouteType
    ): Promise<boolean> {
      let success = false

      await executeApi()
        .post(`${URL_PATH_CLIENTS}/${client_type}/${person_type}`, payload)
        .then((response) => {
          const { message } = response.data
          success = response.data?.success ?? false

          return showAlert(
            message,
            success ? 'success' : 'error',
            undefined,
            TIMEOUT_ALERT
          )
        })
        .catch((error) => {
          showAlert(showCatchError(error), 'error')
        })

      return success
    },

    async _updateAction(
      payload: ClientRequestType,
      id: number,
      client_type: ClientApiRouteType,
      person_type: PersonApiRouteType
    ): Promise<boolean> {
      let success = false

      await executeApi()
        .put(`${URL_PATH_CLIENTS}/${client_type}/${person_type}/${id}`, payload)
        .then((response) => {
          const { message } = response.data
          success = response.data?.success ?? false

          return showAlert(
            message,
            success ? 'success' : 'error',
            undefined,
            TIMEOUT_ALERT
          )
        })
        .catch((error) => {
          showAlert(showCatchError(error), 'error')
        })

      return success
    },

    async _changeStatusAction(
      id: number,
      params: { status_id: number; comment: string }
    ) {
      await executeApi()
        .put(
          `${URL_PATH_CLIENTS}/${ClientApiRouteType.CUSTOMERS}/change-status/${id}`,
          params
        )
        .then((response) => {
          this._getListAction('')

          return showAlert(
            response.data.message,
            response.data.success ? 'success' : 'error'
          )
        })
        .catch((error) => {
          showAlert(showCatchError(error), 'error')
        })
    },

    async _generatePresignedUrl(payload: IGeneratePresignedUrlClient) {
      return executeApi()
        .post(`${URL_PATH_CLIENTS}/customers/files`, payload)
        .then((response) => {
          if (response.data.success) return response.data.data

          showAlert(
            response.data.message,
            response.data.success ? 'success' : 'error'
          )
          return null
        })
        .catch((error) => {
          showAlert(showCatchError(error), 'error')
          return null
        })
    },

    async _saveDocumentAction(
      payload: ISaveClientDocumentRequest
    ): Promise<ISaveClientDocumentResponse | null> {
      let responseData: ISaveClientDocumentResponse | null = null

      await executeApi()
        .post(`${URL_PATH_CLIENTS}/third-parties/customers/files`, payload)
        .then((response) => {
          const { success, message, data } = response.data

          showAlert(message, success ? 'success' : 'error')

          if (success) {
            responseData = data as ISaveClientDocumentResponse
          }
        })
        .catch((error) => {
          showAlert(showCatchError(error), 'error')
        })

      return responseData
    },

    _setClientContext(data: {
      clientPersonType: ClientPersonType
      clientType: ClientType
      personType: PersonType
    }) {
      this.client_person_type = data.clientPersonType
      this.client_type = data.clientType
      this.person_type = data.personType
    },

    // --- Manager Tab (v2) --- // TODO: FAlTA REFACTORIZAR
    _setDataManagerInfoForm(data_to_set: IManagerBasicDataForm | null) {
      this.data_manager_info_form = data_to_set ? { ...data_to_set } : null
    },

    _setDataManagerPEPForm(data_to_set: IManagerPEPForm | null) {
      this.data_manager_pep_form = data_to_set ? { ...data_to_set } : null
    },

    _setDataLegalCLientsManager(data_to_set: ILegalClientManager | null) {
      this.data_manager_legal_form = data_to_set ? { ...data_to_set } : null
    },

    _clearDataManager() {
      this.data_manager_info_form = null
      this.data_manager_pep_form = null
      this.data_manager_legal_form = null
    },
  },

  persist: true,
})
