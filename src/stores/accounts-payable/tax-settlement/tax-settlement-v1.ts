import { useAlert, useShowError, useUtils } from '@/composables'
import { TIMEOUT_ALERT } from '@/constants/alerts'
import { URL_PATH_ACCOUNTS_PAYABLE } from '@/constants/apis'
import { executeApi } from '@/apis'
import { defineStore } from 'pinia'
import {
  ITaxSettlement,
  IRejectionModal,
  ITaxSettlementDetail,
  ITaxSettlementUpdatePayload,
  IPaymentConcept,
  IReteica,
  ICreateReteicasPayload,
  IUpdateReteicaPayload,
  IDiscountPayment,
  IDiscountEntry,
  ICreateDiscountEntryPayload,
  IUpdateDiscountEntryPayload,
  IAccountingEntry,
  IUpdateAccountingPayload,
  ITaxSettlementLiquidationResponse,
  ITaxSettlementDiscountsResponse,
  ITaxSettlementAccountingResponse,
  ITaxSettlementConceptsResponse,
} from '@/interfaces/customs/accounts-payable/TaxSettlement'

const { showAlert } = useAlert()
const { showCatchError } = useShowError()

const URL_PATH = `${URL_PATH_ACCOUNTS_PAYABLE}/tax-settlements`

export const useTaxSettlementStoreV1 = defineStore('tax-settlement-v1', {
  state: () => ({
    version: 'v1',
    tax_settlement_list: [] as ITaxSettlement[],
    tax_settlement_pages: {
      currentPage: 1,
      lastPage: 1,
    },
    tax_settlement_response: null as ITaxSettlementDetail | null,
    payment_concepts: null as IPaymentConcept[] | null,
    reteicas: null as IReteica[] | null,
    discount_payments: null as IDiscountPayment[] | null,
    discount_entries: null as IDiscountEntry[] | null,
    accounting_entries: null as IAccountingEntry[] | null,
    liquidation_view_response: null as ITaxSettlementLiquidationResponse | null,
    concepts_view_response: null as ITaxSettlementConceptsResponse | null,
    discounts_view_response: null as ITaxSettlementDiscountsResponse | null,
    accounting_view_response: null as ITaxSettlementAccountingResponse | null,
  }),
  actions: {
    async _listAction(params: Record<string, string | number | boolean>) {
      this._clearData()

      await executeApi()
        .get(`${URL_PATH}`, { params: { ...params, paginate: true } })
        .then((response) => {
          const {
            data: { data: items = [], current_page = 0, last_page = 0 },
            message,
            success,
          } = response.data

          this.tax_settlement_list = items.map((item: ITaxSettlement) => ({
            ...item,
          }))
          this.tax_settlement_pages.currentPage = current_page
          this.tax_settlement_pages.lastPage = last_page

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

    async _exportExcelById(id: number | string) {
      const { showAlert } = useAlert()
      const { showCatchError } = useShowError()
      const utils = useUtils()

      await executeApi()
        .get(`${URL_PATH}/${id}/export/excel`, {
          responseType: 'blob',
        })
        .then((response) => {
          const blob = new Blob([response.data], {
            type: response.headers['content-type'],
          })
          const fileName = utils.getNameBlob(response)
          utils.downloadBlobXlxx(blob, fileName)

          return showAlert(
            'Descarga exitosa',
            'success',
            undefined,
            TIMEOUT_ALERT
          )
        })
        .catch((error) => {
          showAlert(showCatchError(error), 'error', undefined, TIMEOUT_ALERT)
        })
    },

    async _rejectAction(id: number, payload: IRejectionModal) {
      let success = false
      await executeApi()
        .post(`${URL_PATH}/${id}/reject`, payload)
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

    async _getTaxSettlementById(id: number) {
      await executeApi()
        .get(`${URL_PATH}/${id}`)
        .then((response) => {
          const { data, message, success } = response.data
          if (success) {
            if (Array.isArray(data)) {
              this.tax_settlement_response = {
                id,
                items: data,
              } as ITaxSettlementDetail
            } else {
              this.tax_settlement_response = {
                id,
                office_id: data.office_id ?? null,
                office_name: data.office_name ?? null,
                business_id: data.business_id ?? null,
                business_name: data.business_name ?? null,
                concept_id: data.concept_id ?? null,
                concept_name: data.concept_name ?? null,
                accounting_date: data.accounting_date ?? null,
                person_type: data.person_type ?? null,
                supplier: data.supplier ?? null,
                payment_request: data.payment_request ?? null,
                status: data.status ?? null,
                items: Array.isArray(data.items) ? data.items : [],
              } as ITaxSettlementDetail
            }
          }

          return showAlert(
            message ?? 'Registro obtenido exitosamente.',
            success ? 'success' : 'error',
            undefined,
            TIMEOUT_ALERT
          )
        })
        .catch((error) => {
          showAlert(showCatchError(error), 'error', undefined, TIMEOUT_ALERT)
        })
    },

    async _updateTaxSettlement(
      payload: ITaxSettlementUpdatePayload,
      id: number
    ) {
      let success = false
      await executeApi()
        .put(`${URL_PATH}/${id}`, payload)
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
        .catch((error) => {
          showAlert(showCatchError(error), 'error', undefined, TIMEOUT_ALERT)
        })

      return success
    },

    async _deleteTaxSettlementItem(itemId: number) {
      await executeApi()
        .delete(`${URL_PATH}/items/${itemId}`)
        .then((response) => {
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

    async _getPaymentConcepts(taxSettlementId: number) {
      await executeApi()
        .get(`${URL_PATH}/${taxSettlementId}/concepts`)
        .then((response) => {
          const { data, message, success } = response.data
          if (success) {
            this.payment_concepts = Array.isArray(data) ? data : []
          }

          return showAlert(
            message ?? 'Conceptos obtenidos exitosamente.',
            success ? 'success' : 'error',
            undefined,
            TIMEOUT_ALERT
          )
        })
        .catch((error) => {
          showAlert(showCatchError(error), 'error', undefined, TIMEOUT_ALERT)
        })
    },

    async _getReteicas(taxSettlementId: number, paymentConceptId: number) {
      await executeApi()
        .get(
          `${URL_PATH}/${taxSettlementId}/concepts/${paymentConceptId}/reteicas`
        )
        .then((response) => {
          const { data, message, success } = response.data
          if (success) {
            this.reteicas = Array.isArray(data) ? data : []
          }

          return showAlert(
            message ?? 'Reteicas obtenidas exitosamente.',
            success ? 'success' : 'error',
            undefined,
            TIMEOUT_ALERT
          )
        })
        .catch((error) => {
          showAlert(showCatchError(error), 'error', undefined, TIMEOUT_ALERT)
        })
    },

    async _createReteicas(
      taxSettlementId: number,
      paymentConceptId: number,
      payload: ICreateReteicasPayload
    ) {
      let success = false
      await executeApi()
        .post(
          `${URL_PATH}/${taxSettlementId}/concepts/${paymentConceptId}/reteicas`,
          payload
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
        .catch((error) => {
          showAlert(showCatchError(error), 'error', undefined, TIMEOUT_ALERT)
        })

      return success
    },

    async _updateReteica(reteicaId: number, payload: IUpdateReteicaPayload) {
      let success = false
      await executeApi()
        .put(`${URL_PATH}/concepts/reteicas/${reteicaId}`, payload)
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
        .catch((error) => {
          showAlert(showCatchError(error), 'error', undefined, TIMEOUT_ALERT)
        })

      return success
    },

    async _deleteReteica(reteicaId: number) {
      await executeApi()
        .delete(`${URL_PATH}/concepts/reteicas/${reteicaId}`)
        .then((response) => {
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

    async _getDiscountPayments(taxSettlementId: number) {
      await executeApi()
        .get(`${URL_PATH}/${taxSettlementId}/discounts`)
        .then((response) => {
          const { data, message, success } = response.data
          if (success) {
            this.discount_payments = Array.isArray(data) ? data : []
          }

          return showAlert(
            message ?? 'Descuentos/Pagos obtenidos exitosamente.',
            success ? 'success' : 'error',
            undefined,
            TIMEOUT_ALERT
          )
        })
        .catch((error) => {
          showAlert(showCatchError(error), 'error', undefined, TIMEOUT_ALERT)
        })
    },

    async _getDiscountEntries(
      taxSettlementId: number,
      discountPaymentId: number
    ) {
      await executeApi()
        .get(
          `${URL_PATH}/${taxSettlementId}/discounts/${discountPaymentId}/entries`
        )
        .then((response) => {
          const { data, message, success } = response.data
          if (success) {
            this.discount_entries = Array.isArray(data) ? data : []
          }

          return showAlert(
            message ?? 'Entries de descuento obtenidos exitosamente.',
            success ? 'success' : 'error',
            undefined,
            TIMEOUT_ALERT
          )
        })
        .catch((error) => {
          showAlert(showCatchError(error), 'error', undefined, TIMEOUT_ALERT)
        })
    },

    async _createDiscountEntry(
      taxSettlementId: number,
      discountPaymentId: number,
      payload: ICreateDiscountEntryPayload
    ) {
      let success = false
      await executeApi()
        .post(
          `${URL_PATH}/${taxSettlementId}/discounts/${discountPaymentId}/entries`,
          payload
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
        .catch((error) => {
          showAlert(showCatchError(error), 'error', undefined, TIMEOUT_ALERT)
        })

      return success
    },

    async _updateDiscountEntry(
      entryId: number,
      payload: IUpdateDiscountEntryPayload
    ) {
      let success = false
      await executeApi()
        .put(`${URL_PATH}/discounts/entries/${entryId}`, payload)
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
        .catch((error) => {
          showAlert(showCatchError(error), 'error', undefined, TIMEOUT_ALERT)
        })

      return success
    },

    async _deleteDiscountPayment(discountPaymentId: number) {
      await executeApi()
        .delete(`${URL_PATH}/discounts/${discountPaymentId}`)
        .then((response) => {
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

    async _getAccountingEntries(taxSettlementId: number) {
      await executeApi()
        .get(`${URL_PATH}/${taxSettlementId}/accounting`)
        .then((response) => {
          const { data, message, success } = response.data
          if (success) {
            this.accounting_entries = Array.isArray(data) ? data : []
          }

          return showAlert(
            message ?? 'Entries de contabilidad obtenidos exitosamente.',
            success ? 'success' : 'error',
            undefined,
            TIMEOUT_ALERT
          )
        })
        .catch((error) => {
          showAlert(showCatchError(error), 'error', undefined, TIMEOUT_ALERT)
        })
    },

    async _updateAccounting(
      taxSettlementId: number,
      payload: IUpdateAccountingPayload
    ) {
      let success = false
      await executeApi()
        .put(`${URL_PATH}/${taxSettlementId}/accounting`, payload)
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
        .catch((error) => {
          showAlert(showCatchError(error), 'error', undefined, TIMEOUT_ALERT)
        })

      return success
    },

    async _deleteAccountingEntry(accountingEntryId: number) {
      await executeApi()
        .delete(`${URL_PATH}/accounting/${accountingEntryId}`)
        .then((response) => {
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

    async _getTaxSettlementLiquidationView(id: number) {
      await executeApi()
        .get(`${URL_PATH}/${id}/show/liquidation`)
        .then((response) => {
          const { data, message, success } = response.data
          if (success) {
            this.liquidation_view_response =
              data as ITaxSettlementLiquidationResponse
          }

          return showAlert(
            message ?? 'Liquidación obtenida exitosamente.',
            success ? 'success' : 'error',
            undefined,
            TIMEOUT_ALERT
          )
        })
        .catch((error) => {
          showAlert(showCatchError(error), 'error', undefined, TIMEOUT_ALERT)
        })
    },

    async _getTaxSettlementConceptsView(id: number) {
      await executeApi()
        .get(`${URL_PATH}/${id}/show/concepts`)
        .then((response) => {
          const { data, message, success } = response.data
          if (success) {
            this.concepts_view_response = {
              header: this.liquidation_view_response?.header || {
                id: id,
                office_id: null,
                business_id: null,
                concept: null,
                accounting_date: null,
                person_type: null,
                supplier_id: null,
                supplier_name: null,
                payment_request_code: null,
                status: null,
                breadcrumb: id,
              },
              concepts: Array.isArray(data) ? data : [],
            } as ITaxSettlementConceptsResponse
          }

          return showAlert(
            message ?? 'Conceptos obtenidos exitosamente.',
            success ? 'success' : 'error',
            undefined,
            TIMEOUT_ALERT
          )
        })
        .catch((error) => {
          showAlert(showCatchError(error), 'error', undefined, TIMEOUT_ALERT)
        })
    },

    async _getTaxSettlementDiscountsView(id: number) {
      await executeApi()
        .get(`${URL_PATH}/${id}/show/discounts`)
        .then((response) => {
          const { data, message, success } = response.data
          if (success) {
            this.discounts_view_response =
              data as ITaxSettlementDiscountsResponse
          }

          return showAlert(
            message ?? 'Descuentos/Pagos obtenidos exitosamente.',
            success ? 'success' : 'error',
            undefined,
            TIMEOUT_ALERT
          )
        })
        .catch((error) => {
          showAlert(showCatchError(error), 'error', undefined, TIMEOUT_ALERT)
        })
    },

    async _getTaxSettlementAccountingPreview(id: number) {
      await executeApi()
        .get(`${URL_PATH}/${id}/preview/accounting`)
        .then((response) => {
          const { data, message, success } = response.data
          if (success) {
            this.accounting_view_response = {
              header: this.liquidation_view_response?.header || {
                id: id,
                office_id: null,
                business_id: null,
                concept: null,
                accounting_date: null,
                person_type: null,
                supplier_id: null,
                supplier_name: null,
                payment_request_code: null,
                status: null,
                breadcrumb: id,
              },
              items: this.accounting_entries || [],
              preview: Array.isArray(data) ? data : [],
            } as ITaxSettlementAccountingResponse
          }

          return showAlert(
            message ?? 'Vista previa obtenida exitosamente.',
            success ? 'success' : 'error',
            undefined,
            TIMEOUT_ALERT
          )
        })
        .catch((error) => {
          showAlert(showCatchError(error), 'error', undefined, TIMEOUT_ALERT)
        })
    },

    _clearData() {
      this.tax_settlement_list = []
      this.tax_settlement_pages = {
        currentPage: 1,
        lastPage: 1,
      }
      this.tax_settlement_response = null
      this.payment_concepts = null
      this.reteicas = null
      this.discount_payments = null
      this.discount_entries = null
      this.accounting_entries = null
      this.liquidation_view_response = null
      this.concepts_view_response = null
      this.discounts_view_response = null
      this.accounting_view_response = null
    },
  },
})
