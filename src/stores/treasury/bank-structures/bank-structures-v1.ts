import { executeApi } from '@/apis'
import { defineStore } from 'pinia'
import { URL_PATH_TREASURIES } from '@/constants/apis'
import { TIMEOUT_ALERT } from '@/constants/alerts'
import { useAlert, useShowError } from '@/composables'
import {
  IFormatDefinitionForm,
  IFormatDefinitionList,
  IRecordColumnsForm,
  IRecordColumnsList,
  IRecordTypeForm,
  IRecordTypeList,
} from '@/interfaces/customs'

const URL_PATH_FORMAT_DEFINITION = `${URL_PATH_TREASURIES}/bank-structures`
const URL_PATH_RECORD_COLUMNS = `${URL_PATH_TREASURIES}/record-columns`
const URL_PATH_RECORD_TYPE = `${URL_PATH_TREASURIES}/record-types`

const { showAlert } = useAlert()
const { showCatchError } = useShowError()

export const useBankStructuresV1 = defineStore('bank-structures-v1', {
  state: () => ({
    data_format_definition_list: [] as IFormatDefinitionList[],
    data_record_type_list: [] as IRecordTypeList[],
    data_record_columns_list: [] as IRecordColumnsList[],
    selectIdFormatDefinition: null as number | null,
    selectIdRecordType: null as number | null,
    headerPropsDefault: {
      title: 'Estructuras bancarias',
      breadcrumbs: [
        {
          label: 'Inicio',
          route: 'HomeView',
        },
        {
          label: 'Tesorería',
        },
        {
          label: 'Estructuras bancarias',
          route: 'BankStructuresList',
        },
      ],
    },
    pages_format_definition: {
      currentPage: 1,
      lastPage: 1,
    },
    pages_record_type: {
      currentPage: 1,
      lastPage: 1,
    },
    pages_record_columns: {
      currentPage: 1,
      lastPage: 1,
    },
    filtersFormat: {} as Record<string, string | number | boolean>,
    data_format_definition_form: {} as IFormatDefinitionForm,
    data_record_type_form: {} as IRecordTypeForm,
    data_record_columns_form: {} as IRecordColumnsForm,
  }),
  actions: {
    _setFiltersFormat(filters: Record<string, string | number | boolean>) {
      this.filtersFormat = filters
      if (filters['clear']) {
        this.data_format_definition_list = []
        this.data_record_type_list = []
        this.data_record_columns_list = []
        this.selectIdFormatDefinition = null
        this.selectIdRecordType = null
      }
    },
    async _getListFormatDefinition(params: string) {
      await executeApi()
        .get(`${URL_PATH_FORMAT_DEFINITION}?paginate=1&${params}`)
        .then((response) => {
          if (response.data.success) {
            this.data_format_definition_list = response.data?.data?.data ?? []
            this.pages_format_definition.currentPage =
              response.data?.data?.current_page ?? 1
            this.pages_format_definition.lastPage =
              response.data?.data?.last_page ?? 1
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
    async _getListRecordType(params: string) {
      await executeApi()
        .get(`${URL_PATH_RECORD_TYPE}?paginate=1&${params}`)
        .then((response) => {
          if (response.data.success) {
            this.data_record_type_list = response.data?.data?.data ?? []
            this.pages_record_type.currentPage =
              response.data?.data?.current_page ?? 1
            this.pages_record_type.lastPage =
              response.data?.data?.last_page ?? 1
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
    async _getListRecordColumns(params: string) {
      await executeApi()
        .get(`${URL_PATH_RECORD_COLUMNS}?paginate=1&${params}`)
        .then((response) => {
          if (response.data.success) {
            this.data_record_columns_list = response.data?.data?.data ?? []
            this.pages_record_columns.currentPage =
              response.data?.data?.current_page ?? 1
            this.pages_record_columns.lastPage =
              response.data?.data?.last_page ?? 1
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
    _setSelectFormatDefinition(idFormat: number | null) {
      this.selectIdFormatDefinition = idFormat
      if (!idFormat) {
        this.data_record_type_list = []
        this.data_record_columns_list = []
        this.selectIdRecordType = null
      }
    },
    _setSelectIdRecordType(idRecordType: number | null) {
      this.selectIdRecordType = idRecordType
      if (!idRecordType) {
        this.data_record_columns_list = []
      }
    },
    _setDataFormatDefinitionForm(data: IFormatDefinitionForm) {
      this.data_format_definition_form = data
    },
    _setDataRecordTypeForm(data: IRecordTypeForm) {
      this.data_record_type_form = data
    },
    _setDataRecordColumnsForm(data: IRecordColumnsForm) {
      this.data_record_columns_form = data
    },
    async _createFormatDefinition(): Promise<boolean> {
      let success = false
      await executeApi()
        .post(`${URL_PATH_FORMAT_DEFINITION}`, this.data_format_definition_form)
        .then((response) => {
          success = response.data.success

          if (response.data.success) {
            this.data_format_definition_form = {} as IFormatDefinitionForm
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

      return success
    },
    async _createRecordType(): Promise<boolean> {
      let success = false
      await executeApi()
        .post(`${URL_PATH_RECORD_TYPE}`, this.data_record_type_form)
        .then((response) => {
          success = response.data.success

          if (response.data.success) {
            this.data_record_type_form = {} as IRecordTypeForm
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

      return success
    },
    async _createRecordColumns(): Promise<boolean> {
      let success = false
      await executeApi()
        .post(`${URL_PATH_RECORD_COLUMNS}`, this.data_record_columns_form)
        .then((response) => {
          success = response.data.success

          if (response.data.success) {
            this.data_record_columns_form = {} as IRecordColumnsForm
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

      return success
    },
    async _deleteFormatDefinition(id: number): Promise<boolean> {
      let success = false
      await executeApi()
        .delete(`${URL_PATH_FORMAT_DEFINITION}/${id}`)
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
    async _deleteRecordType(id: number): Promise<boolean> {
      let success = false
      await executeApi()
        .delete(`${URL_PATH_RECORD_TYPE}/${id}`)
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
    async _deleteRecordColumns(id: number): Promise<boolean> {
      let success = false
      await executeApi()
        .delete(`${URL_PATH_RECORD_COLUMNS}/${id}`)
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
    async _getFormatDefinitionById(id: number): Promise<IFormatDefinitionForm> {
      let data: IFormatDefinitionForm = {} as IFormatDefinitionForm
      await executeApi()
        .get(`${URL_PATH_FORMAT_DEFINITION}/${id}`)
        .then((response) => {
          if (response.data.success) {
            data = response.data.data ?? ({} as IFormatDefinitionForm)
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

      return data
    },
    async _updateFormatDefinition(id: number): Promise<boolean> {
      let success = false
      await executeApi()
        .put(
          `${URL_PATH_FORMAT_DEFINITION}/${id}`,
          this.data_format_definition_form
        )
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
    async _getRecordTypeById(id: number): Promise<IRecordTypeForm> {
      let data: IRecordTypeForm = {} as IRecordTypeForm
      await executeApi()
        .get(`${URL_PATH_RECORD_TYPE}/${id}`)
        .then((response) => {
          if (response.data.success) {
            data = response.data.data ?? ({} as IRecordTypeForm)
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

      return data
    },
    async _updateRecordType(id: number): Promise<boolean> {
      let success = false
      await executeApi()
        .put(`${URL_PATH_RECORD_TYPE}/${id}`, this.data_record_type_form)
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
    async _getRecordColumnsById(id: number): Promise<IRecordColumnsForm> {
      let data: IRecordColumnsForm = {} as IRecordColumnsForm
      await executeApi()
        .get(`${URL_PATH_RECORD_COLUMNS}/${id}`)
        .then((response) => {
          if (response.data.success) {
            data = response.data.data ?? ({} as IRecordColumnsForm)
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

      return data
    },
    async _updateRecordColumns(id: number): Promise<boolean> {
      let success = false
      await executeApi()
        .put(`${URL_PATH_RECORD_COLUMNS}/${id}`, this.data_record_columns_form)
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
    async _getRecordColumnsPurposeValue(): Promise<number> {
      let data: number = 0
      await executeApi()
        .get(
          `${URL_PATH_RECORD_COLUMNS}/purpose-value?record_type_id=${this.selectIdRecordType}`
        )
        .then((response) => {
          if (response.data.success) {
            data = response.data.data ?? 0
          }
        })
        .catch((error) => {
          showAlert(showCatchError(error), 'error', undefined, TIMEOUT_ALERT)
        })

      return data
    },
    _resetDataStore() {
      this.data_format_definition_list = []
      this.data_record_type_list = []
      this.data_record_columns_list = []
      this.selectIdFormatDefinition = null
      this.selectIdRecordType = null
      this.data_format_definition_form = {} as IFormatDefinitionForm
      this.data_record_type_form = {} as IRecordTypeForm
      this.data_record_columns_form = {} as IRecordColumnsForm
      this.pages_format_definition = {
        currentPage: 1,
        lastPage: 1,
      }
      this.pages_record_type = {
        currentPage: 1,
        lastPage: 1,
      }
      this.pages_record_columns = {
        currentPage: 1,
        lastPage: 1,
      }
      this.filtersFormat = {}
    },
  },
})
