import { executeApi } from '@/apis'
import { useAlert, useShowError } from '@/composables'
import { defineStore } from 'pinia'

import {
  IClientList,
  IClientNaturalPersonRequest,
  ILegalClientCorporative,
  ILegalClientInformation,
  ILegalClientInvestor,
  ILegalClientDocument,
  ILegalClientManager,
  ILegalClientShareholder,
  ILegalClientTributary,
  ILegalRepresentationClient,
  IManagerInfoForm,
  IManagerPEPForm,
  INaturalClientDocument,
  INaturalClientFinanceForm,
  INaturalClientInformationForm,
  INaturalClientInvestor,
  INaturalClientPepForm,
  INaturalClientTributaryForm,
  IShareholderInfoForm,
  IShareholderPEPForm,
  IShareholderProfileForm,
  IShareholderTributaryForm,
  ITrustorClientFinance,
  ITrustorClientForm,
  ITrustorClientInternational,
  ITrustorResponse,
  INaturalClientEstate,
  IGeneratePresignedUrlClient,
} from '@/interfaces/customs'

const URL_PATH_CLIENTS = 'clients/api/clients/third-parties/customers'
const URL_PATH_TRUSTOR_CLIENTS = `${URL_PATH_CLIENTS}/fideicomiso-persons`

const CONFIG = {
  headers: {
    'Content-Type': 'multipart/form-data',
  },
}
const TIMEOUT_ALERT = 3000

const { showAlert } = useAlert()
const { showCatchError } = useShowError()

export const useClientsStoreV1 = defineStore('clients-store-v1', {
  state: () => ({
    version: 'v1',
    // Natural person
    clients_list: [] as IClientList[] | [],
    client_pages: {
      currentPage: 0,
      lastPage: 0,
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    natural_clients_list: [] as any[],
    natural_client_request: null as IClientNaturalPersonRequest | null,
    data_information_form: null as INaturalClientInformationForm | null,
    data_tributary_form: null as INaturalClientTributaryForm | null,
    data_finance_form: null as INaturalClientFinanceForm | null,
    data_pep_form: null as INaturalClientPepForm | null,
    data_investor_form: null as INaturalClientInvestor | null,
    data_document_form: null as INaturalClientDocument | null,
    data_estate_form: null as INaturalClientEstate | null,

    natural_clients_pages: {
      currentPage: 0,
      lastPage: 0,
    },
    headerPropsDefault: {
      title: 'Crear persona natural',
      breadcrumbs: [
        {
          label: 'Inicio',
          route: 'HomeView',
        },
        {
          label: 'Clientes',
        },
        {
          label: 'Vinculación de clientes',
          route: 'ClientsList',
        },
        {
          label: 'Crear persona natural',
          route: 'LegalEntity',
        },
      ],
    },

    // Legal person
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    legal_clients_list: [] as any[],
    legal_client_request: null as null,
    data_legal_information_form: null as ILegalClientInformation | null,
    data_representative_legal_form: null as ILegalRepresentationClient | null,
    data_corporative_legal_form: null as ILegalClientCorporative | null,
    data_tributary_legal_form: null as ILegalClientTributary | null,
    data_shareholder_legal_form: null as ILegalClientShareholder | null,
    data_manager_legal_form: null as ILegalClientManager | null,
    data_investor_legal_form: null as ILegalClientInvestor | null,
    data_document_legal_form: null as ILegalClientDocument | null,
    legal_clients_pages: {
      currentPage: 0,
      lastPage: 0,
    },
    headerPropsLegalDefault: {
      title: 'Crear persona jurídica',
      breadcrumbs: [
        {
          label: 'Inicio',
          route: 'HomeView',
        },
        {
          label: 'Clientes',
        },
        {
          label: 'Vinculación de clientes',
          route: 'ClientsList',
        },
        {
          label: 'Crear persona jurídica',
          route: 'LegalEntity',
        },
      ],
      showBackBtn: true,
    },

    // Legal person - Shareholders
    data_shareholder_info_form: null as IShareholderInfoForm | null,
    data_shareholder_profile_form: null as IShareholderProfileForm | null,
    data_shareholder_pep_form: null as IShareholderPEPForm | null,
    data_shareholder_tributary_form: null as IShareholderTributaryForm | null,

    // Legal person - Managerial
    data_manager_info_form: null as IManagerInfoForm | null,
    data_manager_pep_form: null as IManagerPEPForm | null,

    // Trustor person
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    trustor_clients_lists: [] as any[],
    trustor_client_request: null as ITrustorResponse | null,
    data_trustor_information_form: null as ITrustorClientForm | null,
    data_trustor_finance_form: null as ITrustorClientFinance | null,
    data_trustor_international_form: null as ITrustorClientInternational | null,
    trustor_clients_pages: {
      currentPage: 0,
      lastPage: 0,
    },
    headerPropsTrustorDefault: {
      title: 'Crear persona fideicomiso',
      breadcrumbs: [
        {
          label: 'Inicio',
          route: 'HomeView',
        },
        {
          label: 'Clientes',
          route: '',
        },
        {
          label: 'Vinculación de clientes',
          route: 'ClientsList',
        },
        {
          label: 'Crear persona fideicomiso',
          route: 'TrustorPerson',
        },
      ],
      showBackBtn: true,
    },
  }),
  actions: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    async _createNaturalClient(payload: any): Promise<boolean> {
      let success = false

      await executeApi()
        .post(`${URL_PATH_CLIENTS}/natural-person`, payload, CONFIG)
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

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    async _updateNaturalClient(payload: any, id: number) {
      let success = false
      await executeApi()
        .post(`${URL_PATH_CLIENTS}/natural-person/${id}`, payload, CONFIG)
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

    async _getByIdNaturalClient(id: number) {
      this.natural_client_request = null
      await executeApi()
        .get(`${URL_PATH_CLIENTS}/natural-person/${id}`)
        .then((response) => {
          if (response.data.success) {
            this.natural_client_request = response.data?.data ?? null
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

    async _getListAction(params: string) {
      this.clients_list = []
      await executeApi()
        .get(`${URL_PATH_CLIENTS}?paginate=1${params}`)
        .then((response) => {
          if (response.data.success) {
            this.clients_list = response.data?.data?.data ?? []
            this.client_pages.currentPage =
              response.data?.data?.current_page ?? 0
            this.client_pages.lastPage = response.data?.data?.last_page ?? 0
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

    async _changeStatusAction(
      id: number,
      params: { status_id: number; comment: string }
    ) {
      await executeApi()
        .put(`${URL_PATH_CLIENTS}/change-status/${id}`, params)
        .then((response) => {
          this._getListAction('')
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

    async _getTrustorClients(params: string) {
      this.trustor_clients_lists = []
      await executeApi()
        .get(`${URL_PATH_CLIENTS}/legal-person?paginate=1${params}`)
        .then((response) => {
          if (response.data.status) {
            this.trustor_clients_lists = response.data.data ?? []
            this.trustor_clients_pages.currentPage =
              response.data.current_page ?? 0
            this.trustor_clients_pages.lastPage = response.data.last_page ?? 0
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

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    async _createTrustorClient(payload: any): Promise<boolean> {
      let success = false
      await executeApi()
        .post(`${URL_PATH_TRUSTOR_CLIENTS}`, payload)
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

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    async _updateTrustorClient(payload: any, id: number): Promise<boolean> {
      let success = false
      await executeApi()
        .put(`${URL_PATH_TRUSTOR_CLIENTS}/${id}`, payload)
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

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    async _getByIdTrustorClient(id: any) {
      this.trustor_client_request = null
      await executeApi()
        .get(`${URL_PATH_TRUSTOR_CLIENTS}/${id}`)
        .then((response) => {
          if (response.data.success) {
            this.trustor_client_request = response.data?.data ?? null
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

    async _changeStatusTrustorClient(id: number) {
      await executeApi()
        .put(`${URL_PATH_TRUSTOR_CLIENTS}/${id}/toggle-status`)
        .then((response) => {
          this._getTrustorClients('')
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

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    async _createLegalClient(payload: any): Promise<boolean> {
      let success = false
      await executeApi()
        .post(`${URL_PATH_CLIENTS}/legal-person`, payload, CONFIG)
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

    async _getByIdLegalClient(id: number) {
      this.legal_client_request = null
      await executeApi()
        .get(`${URL_PATH_CLIENTS}/legal-person/${id}`)
        .then((response) => {
          if (response.data.success) {
            this.legal_client_request = response.data?.data ?? null
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

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    async _updateLegalClient(payload: any, id: number) {
      let success = false
      await executeApi()
        .post(`${URL_PATH_CLIENTS}/legal-person/update/${id}`, payload, CONFIG)
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

    async _generatePresignedUrl(payload: IGeneratePresignedUrlClient) {
      return executeApi()
        .post(`${URL_PATH_CLIENTS}/files`, payload)
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

    // PERSONA NATURAL
    _setDataNaturalCLientsInformation(
      data_to_set: INaturalClientInformationForm | null
    ) {
      this.data_information_form = data_to_set ? { ...data_to_set } : null
    },

    _setDataNaturalClientsTributary(
      data_to_set: INaturalClientTributaryForm | null
    ) {
      this.data_tributary_form = data_to_set ? { ...data_to_set } : null
    },

    _setDataNaturalClientsFinance(
      data_to_set: INaturalClientFinanceForm | null
    ) {
      this.data_finance_form = data_to_set ? { ...data_to_set } : null
    },

    _setDataNaturalClientsPep(data_to_set: INaturalClientPepForm | null) {
      this.data_pep_form = data_to_set ? { ...data_to_set } : null
    },

    _setDataNaturalClientsInvestor(data_to_set: INaturalClientInvestor | null) {
      this.data_investor_form = data_to_set ? { ...data_to_set } : null
    },

    _setDataNaturalClientsDocument(data_to_set: INaturalClientDocument | null) {
      this.data_document_form = data_to_set ? { ...data_to_set } : null
    },

    _setDataNaturalClientsEstate(data_to_set: INaturalClientEstate | null) {
      this.data_estate_form = data_to_set ? { ...data_to_set } : null
    },

    _clearDataNatural() {
      this.natural_clients_list = []
      this.natural_clients_pages.currentPage = 0
      this.natural_clients_pages.lastPage = 0
      this.natural_client_request = null

      this._setDataNaturalCLientsInformation(null)
      this._setDataNaturalClientsTributary(null)
      this._setDataNaturalClientsFinance(null)
      this._setDataNaturalClientsPep(null)
      this._setDataNaturalClientsInvestor(null)
      this._setDataNaturalClientsDocument(null)
      this._setDataNaturalClientsEstate(null)
    },

    // PERSONA JURIDICA
    _setDataLegalCLientsInformation(
      data_to_set: ILegalClientInformation | null
    ) {
      this.data_legal_information_form = data_to_set ? { ...data_to_set } : null
    },

    _setDataLegalCLientsRepresentativeLegal(
      data_to_set: ILegalRepresentationClient | null
    ) {
      this.data_representative_legal_form = data_to_set
        ? { ...data_to_set }
        : null
    },

    _setDataLegalCLientsCorporative(
      data_to_set: ILegalClientCorporative | null
    ) {
      this.data_corporative_legal_form = data_to_set ? { ...data_to_set } : null
    },

    _setDataLegalCLientsTributary(data_to_set: ILegalClientTributary | null) {
      this.data_tributary_legal_form = data_to_set ? { ...data_to_set } : null
    },

    // Accionistas
    _setDataLegalCLientsShareholder(
      data_to_set: ILegalClientShareholder | null
    ) {
      this.data_shareholder_legal_form = data_to_set ? { ...data_to_set } : null
    },

    _setDataShareholderInfoForm(data_to_set: IShareholderInfoForm | null) {
      this.data_shareholder_info_form = data_to_set ? { ...data_to_set } : null
    },

    _setDataShareholderProfileForm(
      data_to_set: IShareholderProfileForm | null
    ) {
      this.data_shareholder_profile_form = data_to_set
        ? { ...data_to_set }
        : null
    },

    _setDataShareholderPEPForm(data_to_set: IShareholderPEPForm | null) {
      this.data_shareholder_pep_form = data_to_set ? { ...data_to_set } : null
    },

    _setDataShareholderTributaryForm(
      data_to_set: IShareholderTributaryForm | null
    ) {
      this.data_shareholder_tributary_form = data_to_set
        ? { ...data_to_set }
        : null
    },

    _clearDataShareholder() {
      this.data_shareholder_info_form = null
      this.data_shareholder_profile_form = null
      this.data_shareholder_pep_form = null
      this.data_shareholder_tributary_form = null
    },

    // Directos
    _setDataLegalCLientsManager(data_to_set: ILegalClientManager | null) {
      this.data_manager_legal_form = data_to_set ? { ...data_to_set } : null
    },

    _setDataManagerInfoForm(data_to_set: IManagerInfoForm | null) {
      this.data_manager_info_form = data_to_set ? { ...data_to_set } : null
    },

    _setDataManagerPEPForm(data_to_set: IManagerPEPForm | null) {
      this.data_manager_pep_form = data_to_set ? { ...data_to_set } : null
    },

    _clearDataManager() {
      this.data_manager_info_form = null
      this.data_manager_pep_form = null
    },

    _setDataLegalCLientsInvestor(data_to_set: ILegalClientInvestor | null) {
      this.data_investor_legal_form = data_to_set ? { ...data_to_set } : null
    },

    _setDataLegalCLientsDocument(data_to_set: ILegalClientDocument | null) {
      this.data_document_legal_form = data_to_set ? { ...data_to_set } : null
    },

    _clearDataLegal() {
      this.legal_clients_list = []
      this.legal_clients_pages.currentPage = 0
      this.legal_clients_pages.lastPage = 0
      this.legal_client_request = null

      this._setDataLegalCLientsInformation(null)
      this._setDataLegalCLientsRepresentativeLegal(null)
      this._setDataLegalCLientsCorporative(null)
      this._setDataLegalCLientsTributary(null)
      this._setDataLegalCLientsShareholder(null)
      this._setDataLegalCLientsManager(null)
      this._setDataLegalCLientsInvestor(null)
      this._setDataLegalCLientsDocument(null)

      // Formularios accionistas y directivos
      this._clearDataShareholder()
      this._clearDataManager()
    },

    // FIDEICOMISO
    _setDataTrustorCLientsInformation(data_to_set: ITrustorClientForm | null) {
      this.data_trustor_information_form = data_to_set
        ? { ...data_to_set }
        : null
    },

    _setDataTrustorCLientsFinance(data_to_set: ITrustorClientFinance | null) {
      this.data_trustor_finance_form = data_to_set ? { ...data_to_set } : null
    },

    _setDataTrustorCLientsInternational(
      data_to_set: ITrustorClientInternational | null
    ) {
      this.data_trustor_international_form = data_to_set
        ? { ...data_to_set }
        : null
    },

    _clearDataTrustor() {
      this.trustor_clients_lists = []
      this.trustor_clients_pages.currentPage = 0
      this.trustor_clients_pages.lastPage = 0
      this.trustor_client_request = null

      this._setDataTrustorCLientsInformation(null)
      this._setDataTrustorCLientsFinance(null)
      this._setDataTrustorCLientsInternational(null)
    },

    // GENERAL
    _cleanClientsData() {
      this._clearDataNatural()
      this._clearDataLegal()
      this._clearDataTrustor()
    },
  },
})
