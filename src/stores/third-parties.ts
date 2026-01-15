import { executeApi } from '@/apis'
import { useMainLoader } from '@/components/loader/composable/useMainLoader'
import { useAlert, useShowError } from '@/composables'
import {
  IBankAccountTable,
  IDataTable,
  IGenericResource,
  IThirdPartiesTable,
} from '@/interfaces/customs'
import { IErrors } from '@/interfaces/global/errorMessage'
import {
  ICreateUpdateThirdParty,
  IEditThirdParty,
  IThirdParties,
} from '@/interfaces/global/ThirdParties'
import {
  IGeneralDataForm,
  IBasicDataForm,
  IEconActivityForm,
  IAddressLocationForm,
  IPhoneNumberForm,
  IEmailForm,
  IBankForm2,
  IBankForm,
  IThirdPartiesList,
  IThirdParty,
} from '@/interfaces/global'
import { createAndDownloadBlobByArrayBuffer } from '@/utils'
import { defineStore } from 'pinia'

// Constants
import {
  URL_PATH_THIRD_PARTIES_V1,
  URL_PATH_THIRD_PARTIES_V2,
  URL_PATH_INSPEKTOR,
} from '@/constants/apis'

import { TIMEOUT_ALERT } from '@/constants/alerts'

const { openMainLoader } = useMainLoader()
const { showAlert } = useAlert()
const { showCatchError } = useShowError()

export const useThirdPartiesStore = defineStore('third-parties', {
  state: () => ({
    thirdPartiesList: [] as IThirdParties[] | [],
    pages: {
      currentPage: 1,
      lastPage: 1,
    },
    thirdPartiesData: null as IEditThirdParty | null,
    generalDataForm: null as IGeneralDataForm | null,
    basicDataState: null as IBasicDataForm | null,
    econActivityState: null as IEconActivityForm | null,
    addressLocationForm: null as IAddressLocationForm | null,
    phoneNumberState: null as IPhoneNumberForm | null,
    emailState: null as IEmailForm | null,
    bankState: null as IBankForm2 | null,
    bankForm: null as IBankForm | null,
    retentions: [] as (number | string)[] | null,
    urlExportXlsx: null as string | null,
    indirect_third_party_request_types: [] as IGenericResource[],

    classificationsData: [
      { value: 'Proveedor', label: 'Proveedor' },
      { value: 'Empleado', label: 'Empleado' },
      { value: 'Contratista', label: 'Contratista' },
      { value: 'Entidad/Gobierno', label: 'Entidad/Gobierno' },
      { value: 'Cliente/Proveedor', label: 'Cliente/Proveedor' },
      { value: 'Administradora', label: 'Administradora' },
      { value: 'Prospecto', label: 'Prospecto' },
      { value: 'Socio', label: 'Socio' },
      { value: 'Contacto', label: 'Contacto' },
      { value: 'Sede', label: 'Sede' },
    ],
    naturesData: [
      { value: 'Natural', label: 'Natural' },
      { value: 'Jurídico', label: 'Jurídica' },
    ],
    regimensData: [
      { value: 'Responsable', label: 'Responsable' },
      { value: 'No responsable', label: 'No responsable' },
    ],
    responsableData: [
      { value: 'No aplica - Otros', label: 'No aplica - Otros' },
      { value: 'Agente de retención IVA', label: 'Agente de retención IVA' },
      { value: 'Autorretenedor', label: 'Autorretenedor' },
      { value: 'Gran contribuyente', label: 'Gran contribuyente' },
      {
        value: 'Régimen simple de tributación',
        label: 'Régimen simple de tributación',
      },
    ],
    accountTypesData: [
      {
        value: 'Ahorros',
        label: 'Ahorros',
      },
      {
        value: 'Corriente',
        label: 'Corriente',
      },
    ],
    thirdPartyClassificationData: [
      { label: 'Proveedor', value: 'Proveedor' },
      { label: 'Contratista', value: 'Contratista' },
      { label: 'Cliente', value: 'Cliente' },
      { label: 'Empleado', value: 'Empleado' },
      { label: 'Órgano Judicial', value: 'Órgano Judicial' },
    ],
    organData: [
      {
        label: 'Corte Suprema de Justicia',
        value: 'Corte Suprema de Justicia',
      },
      {
        label: 'Tribunales Superiores de Distrito Judicial',
        value: 'Tribunales Superiores de Distrito Judicial',
      },
      { label: 'Juzgados del Circuito', value: 'Juzgados del Circuito' },
      { label: 'Juzgados Municipales', value: 'Juzgados Municipales' },
      { label: 'Corte Constitucional', value: 'Corte Constitucional' },
      { label: 'Consejo de Estado', value: 'Consejo de Estado' },
      {
        label: 'Tribunales Administrativos',
        value: 'Tribunales Administrativos',
      },
      { label: 'Juzgados Administrativos', value: 'Juzgados Administrativos' },
      {
        label: 'Comisión Nacional de Disciplina Judicial',
        value: 'Comisión Nacional de Disciplina Judicial',
      },
      { label: 'Tribunal para la Paz', value: 'Tribunal para la Paz' },
      { label: 'Salas de Justicia', value: 'Salas de Justicia' },
      {
        label: 'Consejo Superior de la Judicatura',
        value: 'Consejo Superior de la Judicatura',
      },
      {
        label: 'Fiscalía General de la Nación',
        value: 'Fiscalía General de la Nación',
      },
      { label: 'Autoridades indígenas', value: 'Autoridades indígenas' },
      {
        label: 'Jueces de Paz y Reconsideración',
        value: 'Jueces de Paz y Reconsideración',
      },
      { label: 'Tribunales Militares', value: 'Tribunales Militares' },
    ],
    jurisdictionData: [
      { label: 'Ordinaria', value: 'Ordinaria' },
      { label: 'Constitucional', value: 'Constitucional' },
      { label: 'Contencioso', value: 'Contencioso' },
      { label: 'Administrativo', value: 'Administrativo' },
      {
        label: 'Contencioso Disciplinario',
        value: 'Contencioso Disciplinario',
      },
      {
        label: 'Justicia Especial para la Paz',
        value: 'Justicia Especial para la Paz',
      },
      { label: 'Órganos Especiales', value: 'Órganos Especiales' },
      { label: 'Especial Indígena de Paz', value: 'Especial Indígena de Paz' },
      { label: 'Justicia Penal Militar', value: 'Justicia Penal Militar' },
    ],

    data_table_activities_ciius: [] as IThirdPartiesTable[] | [],
    data_table_bank_account: [] as IBankAccountTable[] | [],
    thirdparties_list: [] as IThirdPartiesList[] | [],
    thirdparties_pages: {
      currentPage: 0,
      lastPage: 0,
    },

    thirdpartie_request: null as IThirdParty | null,
    isValidPerson: undefined as boolean | undefined,
  }),
  actions: {
    async getThirdParties(
      state: {
        'filter[status_id]': number | string | null
        search: string | null
        page: number
        paginate: number | null
        'filter[classification]': number | string | null
        'filter[nature]': number | string | null
      } | null = null
    ) {
      this.thirdPartiesList = []
      openMainLoader(true)

      try {
        const { data } = await executeApi().get(
          `${URL_PATH_THIRD_PARTIES_V2}`,
          {
            params: state,
          }
        )

        this.thirdPartiesList = data?.data?.data ?? []
        this.pages.currentPage = data?.data?.current_page ?? 0
        this.pages.lastPage = data?.data?.last_page ?? 0
        this.urlExportXlsx = data?.data?.route_export ?? null

        const responseMessage: string = data.message
        showAlert(responseMessage, 'success')
      } catch (e) {
        const error = e as IErrors
        showAlert(showCatchError(error), 'error')
      }

      openMainLoader(false)
    },

    async getThirdPartyById(id: number) {
      openMainLoader(true)
      try {
        const { data } = await executeApi().get(
          `${URL_PATH_THIRD_PARTIES_V2}/${id}`
        )
        this.thirdPartiesData = data.data

        openMainLoader(false)
      } catch (e) {
        const error = e as IErrors
        showAlert(showCatchError(error), 'error')
      } finally {
        openMainLoader(false)
      }
    },

    async editThirdParty(id: number, bodyRequest: ICreateUpdateThirdParty) {
      try {
        const { data } = await executeApi().put(
          `${URL_PATH_THIRD_PARTIES_V2}/${id}`,
          bodyRequest
        )
        const { success, message } = data
        return { success, message }
      } catch (e) {
        const error = e as IErrors
        showAlert(showCatchError(error), 'error')
        return { success: false, message: showCatchError(error) }
      }
    },

    async _createAction(payload: object): Promise<boolean> {
      let success = false
      await executeApi()
        .post(`${URL_PATH_THIRD_PARTIES_V1}/third-party-store`, payload)
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
    async _getByIdAction(id: number) {
      this.thirdpartie_request = null
      await executeApi()
        .get(`${URL_PATH_THIRD_PARTIES_V1}/third-party-show/${id}`)
        .then((response) => {
          if (response.data.success) {
            this.thirdpartie_request = response.data?.data ?? null
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
      this.thirdparties_list = []
      await executeApi()
        .get(`${URL_PATH_THIRD_PARTIES_V1}/third-parties?paginate=1${params}`)
        .then((response) => {
          if (response.data.success) {
            this.thirdparties_list = response.data?.data?.data ?? []
            this.thirdparties_pages.currentPage =
              response.data?.data?.current_page ?? 0
            this.thirdparties_pages.lastPage =
              response.data?.data?.last_page ?? 0
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
    async _updateAction(payload: object, id: number): Promise<boolean> {
      let success = false
      await executeApi()
        .put(`${URL_PATH_THIRD_PARTIES_V1}/third-party-update/${id}`, payload)
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
    async _exportXLS(url: string) {
      const nameFile = `Listado_de_terceros`

      try {
        openMainLoader(true)
        const response = await executeApi().get(
          `${URL_PATH_THIRD_PARTIES_V2}/export?${url}`,
          {
            responseType: 'arraybuffer',
          }
        )

        createAndDownloadBlobByArrayBuffer(response.data, nameFile)
      } catch (e) {
        const error = e as IErrors
        showAlert(showCatchError(error), 'error')
      } finally {
        openMainLoader(false)
      }
    },

    async _deleteThirdParty(id: number) {
      openMainLoader(true)
      try {
        const response = await executeApi().delete(
          `${URL_PATH_THIRD_PARTIES_V2}/${id}`
        )
        showAlert(response.data.message, 'success')
      } catch (e) {
        const error = e as IErrors
        showAlert(showCatchError(error), 'error')
      } finally {
        openMainLoader(false)
      }
    },

    async _changeStatus(id: number) {
      await executeApi()
        .put(`${URL_PATH_THIRD_PARTIES_V1}/third-party/${id}/status`)
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

    async _searchInCautionList(
      personName: string,
      personIdNumber: string,
      alert: boolean = true
    ): Promise<boolean> {
      let incluidedCautelarList = false
      await executeApi()
        .post(`${URL_PATH_INSPEKTOR}/validate`, {
          nombre: personName,
          identificacion: personIdNumber,
          tienePrioridad_4: true,
          cantidadPalabras: '1',
        })
        .then((_) => {
          // const msgSuccess = response.data.message

          // if (alert && msgSuccess) {
          //   showAlert(msgSuccess, 'success', undefined, 3000)
          // }

          incluidedCautelarList = false
          this.isValidPerson = true
        })
        .catch((error) => {
          const msgError = error?.response?.data?.message ?? null

          if (alert && msgError) {
            showAlert(msgError, 'error', undefined, 3000)
          }

          incluidedCautelarList = true
          this.isValidPerson = false
        })

      return incluidedCautelarList
    },

    async _getIndirectThirdPartyRequestTypes() {
      try {
        const { data } = await executeApi().get(
          `${URL_PATH_THIRD_PARTIES_V1}/select-tables?keys[]=indirect_third_party_request_types`
        )

        const list = data?.data?.indirect_third_party_request_types ?? []
        this.indirect_third_party_request_types = list

        return list
      } catch (error) {
        showAlert(
          showCatchError(error as IErrors),
          'error',
          undefined,
          TIMEOUT_ALERT
        )
        return []
      }
    },

    _setGeneralDataForm(state: IGeneralDataForm | null) {
      this.generalDataForm = null
      if (state) {
        this.generalDataForm = state
      }
    },

    _setBasicDataState(state: IBasicDataForm | null) {
      this.basicDataState = null
      if (state) {
        this.basicDataState = { ...state }
      }
    },

    _setActivitiesCIIUSTable(data: IDataTable<IThirdPartiesTable> | null) {
      this.data_table_activities_ciius = data?.data ?? []
    },

    _setBankAccounTable(data: IDataTable<IBankAccountTable> | null) {
      this.data_table_bank_account = data?.data ?? []
    },

    _clearRequestThirdparty() {
      this.thirdpartie_request = null
    },

    _clearIsValidPerson() {
      this.isValidPerson = false
    },

    _setAddressLocationForm(state: IAddressLocationForm | null) {
      this.addressLocationForm = null
      if (state) {
        this.addressLocationForm = { ...state }
      }
    },

    _setPhoneNumberState(state: IPhoneNumberForm | null) {
      this.phoneNumberState = null
      if (state) {
        this.phoneNumberState = { ...state }
      }
    },

    _setEmailState(state: IEmailForm | null) {
      this.emailState = null
      if (state) {
        this.emailState = { ...state }
      }
    },

    _setBankState(state: IBankForm2 | null) {
      this.bankState = null
      if (state) {
        this.bankState = { ...state }
      }
    },

    _setBankForm(state: IBankForm | null) {
      this.bankForm = null
      if (state) {
        this.bankForm = state
      }
    },

    _setRetentions(state: (number | string)[] | null) {
      this.retentions = null
      if (state) {
        this.retentions = state
      }
    },

    _cleanThirdPartiesData() {
      this.generalDataForm = null
      this.basicDataState = null
      this.econActivityState = null
      this.addressLocationForm = null
      this.phoneNumberState = null
      this.emailState = null
      this.bankState = null
      this.bankForm = null
      this.retentions = null
      this.thirdPartiesData = null
    },
  },
})
