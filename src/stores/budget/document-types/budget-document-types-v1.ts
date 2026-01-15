// Core
import { defineStore } from 'pinia'
import { executeApi } from '@/apis'

// Composables
import { useAlert, useShowError, useUtils } from '@/composables'

// Interfaces
import {
  IBalanceUpdate,
  IBalanceValidationItemResponse,
  IBudgetDocumentTypeItem,
  IBugdetDocumentTypeResponse,
  IDocumentTypeStoreModel,
} from '@/interfaces/customs/budget/BudgetDocumentTypes'

// Constants
import { URL_PATH_BUDGET } from '@/constants/apis'
import { TIMEOUT_ALERT } from '@/constants/alerts'

const URL_PATH = `${URL_PATH_BUDGET}/budget-document-type`

const { showAlert } = useAlert()
const { showCatchError } = useShowError()

export const useBudgetDocumentTypesStoreV1 = defineStore(
  'budget-document-types-store-v1',
  {
    state: () => ({
      version: 'v1',
      budget_document_types_list: [] as IBudgetDocumentTypeItem[],
      budget_document_types_pages: {
        currentPage: 1,
        lastPage: 1,
      },
      balance_validations_list: [] as IBalanceValidationItemResponse[],
      balance_validations_pages: {
        currentPage: 1,
        lastPage: 1,
      },
      edit_balance_validation: [] as IBalanceValidationItemResponse[],
    }),

    actions: {
      _clearData() {
        this.budget_document_types_list = []
        this.budget_document_types_pages = {
          currentPage: 1,
          lastPage: 1,
        }
        this.balance_validations_list = []
        this.balance_validations_pages = {
          currentPage: 1,
          lastPage: 1,
        }
      },

      async _getDocumentTypes(params: Record<string, string | number>) {
        this._clearData()
        await executeApi()
          .get(`${URL_PATH}`, { params: { ...params, paginate: 1 } })
          .then((response) => {
            const {
              data: { data = [], current_page = 0, last_page = 0 },
              message,
              success,
            } = response.data

            this.budget_document_types_list = data
            this.budget_document_types_pages.currentPage = current_page || 1
            this.budget_document_types_pages.lastPage = last_page || 1

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
      async _getDocumentTypesBalanceValidations(
        documentTypeId: number,
        params: Record<string, string | number>
      ) {
        await executeApi()
          .get(`${URL_PATH}/balance-validation/${documentTypeId}`, {
            params: { ...params, paginate: 1 },
          })
          .then((response) => {
            const {
              data: { data = [], current_page = 0, last_page = 0 },
              message,
              success,
            } = response.data

            this.balance_validations_list = data
            this.balance_validations_pages.currentPage = current_page || 1
            this.balance_validations_pages.lastPage = last_page || 1

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

      async _createAction(payload: IDocumentTypeStoreModel) {
        let success = false
        await executeApi()
          .post(`${URL_PATH}`, payload)
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

      async _updateAction(payload: IDocumentTypeStoreModel) {
        let success = false
        await executeApi()
          .put(`${URL_PATH}/${payload.id}`, payload)
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

      async _updateActionBalance(id: number, payload: IBalanceUpdate) {
        let success = false
        await executeApi()
          .put(`${URL_PATH}/balance-validation/${id}`, payload)
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

      async _deleteAction(id: number): Promise<boolean> {
        let success = false
        await executeApi()
          .delete(`${URL_PATH}/${id}`)
          .then((response) => {
            success = response.data.success
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
        return success
      },
      async _deleteBalanceValidation(id: number): Promise<boolean> {
        let success = false
        await executeApi()
          .delete(`${URL_PATH}/balance-validation/${id}`)
          .then((response) => {
            success = response.data.success
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
        return success
      },

      async _downloadDocumentTypes(params: Record<string, string | number>) {
        await executeApi()
          .post(`${URL_PATH}/export`, params, {
            responseType: 'blob',
          })
          .then((response) => {
            const blob = new Blob([response.data], {
              type: response.headers['content-type'],
            })
            const fileName = `Listado_tipos_de_documentos_presupuestales_${useUtils().formatDate(
              '',
              'YYYY-MM-DD'
            )}`
            useUtils().downloadBlobXlxx(blob, fileName)

            return showAlert(
              response.data.message,
              'success',
              undefined,
              TIMEOUT_ALERT
            )
          })
          .catch((error) => {
            showAlert(showCatchError(error), 'error', undefined, TIMEOUT_ALERT)
          })
      },

      _setEditBalanceValidation(data: IBalanceValidationItemResponse) {
        this.edit_balance_validation = [data]
      },

      async _getDocumentTypeById(id: number) {
        let responseData: null | IBugdetDocumentTypeResponse = null
        await executeApi()
          .get(`${URL_PATH}/${id}`)
          .then((response) => {
            if (response.data.success) {
              const documentTypeData = response.data.data
              responseData = {
                budget_level_id: documentTypeData.level.id,
                code: documentTypeData.code,
                description: documentTypeData.description,
                validity: documentTypeData.validity,
                requires_authorization: documentTypeData.requires_authorization,
                allows_adjustments: documentTypeData.allows_adjustments,
                validity_closure: documentTypeData.validity_closure,
                creates_new_document: documentTypeData.creates_new_document,
                allows_additions: documentTypeData.allows_additions,
                allows_deductions: documentTypeData.allows_deductions,
                validates_area: documentTypeData.validates_area,
                requires_city: documentTypeData.requires_city,
                requires_balance_validation_by_document_type:
                  documentTypeData.requires_balance_validation_by_document_type,
                has_expiration_date: documentTypeData.has_expiration_date,
                expiration_periodicity: documentTypeData.expiration_periodicity,
                numbering_type: documentTypeData.numbering_type,
                budget_document_type_balance_validations:
                  documentTypeData.budget_document_type_balance_validations.map(
                    (item: IBalanceValidationItemResponse) => ({
                      id: item.id,
                      accounting_budget_mapping_parameter_id:
                        item.budget_structure_id,
                      budget_item_structure: `${item.budget_item_structure.code} - ${item.budget_item_structure.description}`,
                      resource_structure: `${item.resource_structure.code} - ${item.resource_structure.description}`,
                      area_structure: `${item.area_structure.code} - ${item.area_structure.description}`,
                      code_movement_id: item.movement_code.id,
                      movement_code_description: item.movement_code.description,
                      balance_validation_level_id:
                        item.balance_validation_level.id,
                      balance_validation_level_description:
                        item.balance_validation_level.description,
                      validates_document_type:
                        item.validates_document_type.validates_document_type,
                      validated_document_type_id:
                        item.validates_document_type.id,
                      validated_document_type_description:
                        item.validates_document_type.description,
                    })
                  ),
              }
            }
            showAlert(
              response.data.message,
              response.data.success ? 'success' : 'error',
              undefined,
              TIMEOUT_ALERT
            )

            return responseData
          })
          .catch((error) => {
            showAlert(showCatchError(error), 'error', undefined, TIMEOUT_ALERT)
          })
        return responseData
      },
    },
  }
)
