/* eslint-disable @typescript-eslint/no-explicit-any */
import { executeApi } from '@/apis'
import { useAlert, useShowError } from '@/composables'
import {
  IGenericResource,
  ISelectorResources,
  ISettlementConceptByStructureAndType,
} from '@/interfaces/customs'
import { IErrors } from '@/interfaces/global'
import { ILabeledValue as LV, DocTypesApi } from '@/interfaces/customs/Filters'

import { defineStore } from 'pinia'

import { URL_PATH_ACCOUNTS_PAYABLE } from '@/constants/apis'
import {
  IDocumentTypeCode,
  IMovementManagementCodes,
  IOrpaAuthorizationResources,
  IPaymentAuthorizersResource,
  IPaymentConceptCodes,
  IPaymentRequest,
  IPaymentRequestConsecutiveCode,
  ISettlementConcept,
} from '@/interfaces/customs/resources/AccountsPayable'

const { showAlert } = useAlert()
const { showCatchError } = useShowError()

const initialState = () => ({
  version: 'v1',
  annual_payment_years: [] as ISelectorResources[],
  tax_types: [] as ISelectorResources[],
  tax_natures: [] as ISelectorResources[],
  revenue_beneficiary_entities: [] as ISelectorResources[],
  cancellation_reason_types: [] as ISelectorResources[],
  movement_management_code_name: [] as IGenericResource[],
  ica_activity_statuses: [] as IGenericResource[],
  payment_concept_codes: [] as ISelectorResources[],
  payment_concept_types: [] as ISelectorResources[],
  payment_concept_nature_types: [] as ISelectorResources[],
  payment_concept_activity_types: [] as ISelectorResources[],
  payment_concept_obligation_types: [] as ISelectorResources[],
  payment_concept_pension_types: [] as ISelectorResources[],
  ica_activity_types: [] as IGenericResource[],
  periodicity: [] as IGenericResource[],
  third_party_types: [] as IGenericResource[],
  document_types: [] as ISelectorResources[],
  document_type_statuses: [] as ISelectorResources[],
  document_type_code_name: [] as ISelectorResources[],
  document_types_operation_type: [] as ISelectorResources[],
  document_types_numbering_type: [] as ISelectorResources[],
  payment_concept_codes_payment_block: [] as IPaymentConceptCodes[],
  sources_destinations_modules: [] as ISelectorResources[],
  sources_destinations_processes: [] as ISelectorResources[],
  sources_destinations_code_movements: [] as ISelectorResources[],
  settlement_formula_person_types: [] as ISelectorResources[],
  settlement_formula_fiscal_responsibilities: [] as ISelectorResources[],
  payment_request_numbers: [] as ISelectorResources[],
  payment_request_statuses: [] as IGenericResource[],
  settlement_concept: [] as ISettlementConcept[],
  settlement_concepts_by_structure_and_type:
    [] as ISettlementConceptByStructureAndType[],
  settlement_concept_types: [] as ISelectorResources[],
  settlement_concept_classes: [] as ISelectorResources[],
  fiscal_charges: [] as IGenericResource[],
  ica_economic_activity_concepts: [] as IGenericResource[],
  payment_requests: [] as IPaymentRequest[],
  movement_management: [] as IMovementManagementCodes[],
  document_type_code_name_with_id: [] as IDocumentTypeCode[],
  support_document_numbering_resolution_statuses: [] as ISelectorResources[],
  payment_block_code_name: [] as IGenericResource[],
  notification_modules: [] as IGenericResource[],
  notification_processes: [] as IGenericResource[],
  notification_subprocesses: [] as IGenericResource[],
  notification_channels: [] as IGenericResource[],
  orpa_authorization_statuses: [] as ISelectorResources[],
  payment_request_businesses: [] as IGenericResource[],
  orpa_authorizations: [] as IOrpaAuthorizationResources[],
  first_authorization_tax_settlement_generation_statuses:
    [] as ISelectorResources[],
  orpa_payment_order_statuses: [] as ISelectorResources[],
  payment_autorizers: [] as IPaymentAuthorizersResource[],
  payment_request_consecutive_codes: [] as IPaymentRequestConsecutiveCode[],
  causation_resource_source: [] as ISelectorResources[],
  payment_request_businesses_value_code: [] as IGenericResource[],
  cancellation_rejection_reasons: [] as IGenericResource[],
  orpa_compliance_statuses: [] as IGenericResource[],
  tax_settlement_person_types: [] as ISelectorResources[],
  payment_request: [] as ISelectorResources[],
})

export const useAccountsPayableResourcesV1 = defineStore(
  'accounts-payable-resources-v1',
  {
    state: initialState,
    actions: {
      resetKeys(keys: (keyof ReturnType<typeof initialState>)[]) {
        const initial = initialState()
        const state = this.$state as unknown as Record<string, unknown>
        const initState = initial as Record<string, unknown>

        keys.forEach((key) => {
          state[key] = initState[key]
        })
      },

      assignAnnualPaymentYears(annual_payment_years: []) {
        this.annual_payment_years =
          annual_payment_years.map((item: ISelectorResources) => ({
            ...item,
            value: item.year ?? '',
            label: `${item.year}`,
          })) ?? []
      },

      assignTaxTypes(tax_types: []) {
        this.tax_types =
          tax_types.map((item: ISelectorResources) => ({
            ...item,
            value: item.id,
            label: `${item.abbreviation} - ${item.description}`,
          })) ?? []
      },

      assignTaxNatures(tax_natures: []) {
        this.tax_natures =
          tax_natures.map((item: ISelectorResources) => ({
            ...item,
            value: item.id,
            label: `${item.name}`,
          })) ?? []
      },

      assignRevenueBeneficiaryEntities(revenue_beneficiary_entities: []) {
        this.revenue_beneficiary_entities =
          revenue_beneficiary_entities.map((item: ISelectorResources) => ({
            ...item,
            value: item.id,
            label: `${item.name}`,
          })) ?? []
      },

      assignFiscalCharges(fiscal_charges: []) {
        this.fiscal_charges =
          fiscal_charges.map((item: IGenericResource) => ({
            ...item,
            value: item.id ?? '',
            label: `${item.code} - ${item.name}`,
          })) ?? []
      },

      assignCancellationReasonTypes(cancellation_reason_types: []) {
        this.cancellation_reason_types =
          cancellation_reason_types.map((item: ISelectorResources) => ({
            ...item,
            value: item.value,
            label: item.label,
          })) ?? []
      },

      assignMovementManagementCodeName(movement_management_code_name: []) {
        this.movement_management_code_name =
          movement_management_code_name.map((item: IGenericResource) => ({
            ...item,
            value: `${item.code} - ${item.name}`,
            label: `${item.code} - ${item.name}`,
          })) ?? []

        this.movement_management =
          movement_management_code_name.map(
            (item: IMovementManagementCodes) => ({
              ...item,
              value: item.id ?? '',
              label: `${item.code} - ${item.name}`,
            })
          ) ?? []
      },

      assignPaymentConceptCodes(payment_concept_codes: []) {
        this.payment_concept_codes =
          payment_concept_codes.map((item: ISelectorResources) => ({
            ...item,
            value: item.concept_code ?? '',
            label: item.concept_code ?? '',
          })) ?? []

        this.payment_concept_codes_payment_block =
          payment_concept_codes.map((item: IPaymentConceptCodes) => ({
            ...item,
            value: item.id ?? '',
            label: `${item.concept_code ?? ''} - ${item.concept_name ?? ''}`,
          })) ?? []
      },

      assignPaymentConceptTypes(payment_concept_types: []) {
        this.payment_concept_types =
          payment_concept_types.map((item: ISelectorResources) => ({
            ...item,
            value: item.value,
            label: item.label,
          })) ?? []
      },

      assignPaymentConceptNatureTypes(payment_concept_nature_types: []) {
        this.payment_concept_nature_types =
          payment_concept_nature_types.map((item: ISelectorResources) => ({
            ...item,
            value: item.value,
            label: item.label,
          })) ?? []
      },

      assignPaymentConceptActivityTypes(payment_concept_activity_types: []) {
        this.payment_concept_activity_types =
          payment_concept_activity_types.map((item: ISelectorResources) => ({
            ...item,
            value: item.value,
            label: item.label,
          })) ?? []
      },

      assignPaymentConceptObligationTypes(
        payment_concept_obligation_types: []
      ) {
        this.payment_concept_obligation_types =
          payment_concept_obligation_types.map((item: ISelectorResources) => ({
            ...item,
            value: item.value,
            label: item.label,
          })) ?? []
      },

      assignPaymentConceptPensionTypes(payment_concept_pension_types: []) {
        this.payment_concept_pension_types =
          payment_concept_pension_types.map((item: ISelectorResources) => ({
            ...item,
            value: item.value,
            label: item.label,
          })) ?? []
      },

      assignIcaActivityTypes(ica_activity_types: []) {
        this.ica_activity_types = ica_activity_types ?? []
      },

      assignIcaEconomicActivityConcepts(ica_economic_activity_concepts: []) {
        this.ica_economic_activity_concepts =
          ica_economic_activity_concepts.map((item: IGenericResource) => ({
            ...item,
            value: item.id ?? '',
            label: `${item.code ?? ''} - ${item.name ?? ''}`.trim(),
          })) ?? []
      },

      assignPeriodicity(periodicity: []) {
        this.periodicity = periodicity ?? []
      },

      assignThirdPartyTypes(third_party_types: []) {
        this.third_party_types = third_party_types ?? []
      },

      assignDocumentTypeStatuses(document_type_statuses: []) {
        this.document_type_statuses =
          document_type_statuses.map((item: ISelectorResources) => ({
            ...item,
            value: item.id ?? item.value ?? '',
            label: `${item.name ?? item.label ?? ''}`,
          })) ?? []
      },

      assignDocumentTypeCodeName(document_type_code_name: []) {
        this.document_type_code_name =
          document_type_code_name.map((item: ISelectorResources) => {
            const code = item.code ?? ''
            const name = item.name ?? ''
            const codeName = `${code} - ${name}`.trim()
            return {
              ...item,
              value: code,
              label: codeName,
            }
          }) ?? []
        this.document_type_code_name_with_id =
          document_type_code_name.map((item: IDocumentTypeCode) => {
            return {
              ...item,
              value: item.id ?? '',
              label: `${item.code} - ${item.name}`,
            }
          }) ?? []
      },

      assignDocumentTypesOperationType(document_types_operation_type: []) {
        this.document_types_operation_type =
          document_types_operation_type.map((item: ISelectorResources) => ({
            ...item,
            value: item.value ?? item.name ?? '',
            label: item.label ?? item.name ?? '',
          })) ?? []
      },

      assignDocumentTypesNumberingType(list: LV[] | unknown[]) {
        const mapped: ISelectorResources[] = (
          Array.isArray(list) ? list : []
        ).map((it) => {
          const o = it as LV
          const label = String(o.label ?? o.value ?? '')
          const value = String(o.value ?? o.label ?? '')
          return { label, value } as unknown as ISelectorResources
        })

        this.document_types_numbering_type = mapped
      },

      assignDocumentTypes(payload: DocTypesApi | LV[]) {
        const flat: (LV & { disable?: boolean; header?: boolean })[] = []

        if (Array.isArray(payload)) {
          flat.push(
            ...payload
              .map((it) => ({
                label: it.label ?? '',
                value: it.value ?? '',
              }))
              .filter((x) => (x.label ?? '') !== '')
          )
        } else if (payload && typeof payload === 'object') {
          Object.entries(payload).forEach(([groupName, arr]) => {
            if (Array.isArray(arr) && arr.length > 0) {
              flat.push({
                label: groupName,
                value: `__header__${groupName}__`,
                disable: true,
                header: true,
              })

              arr.forEach((it) => {
                flat.push({
                  label: it.label ?? '',
                  value: it.value ?? '',
                })
              })
            }
          })
        }

        this.document_types = flat as unknown as ISelectorResources[]
      },

      assignSettlementConcept(settlement_concept: []) {
        this.settlement_concept =
          settlement_concept.map((item: ISettlementConcept) => ({
            ...item,
            value: item.id ?? '',
            label: `${item.concept_code} - ${item.description}`,
          })) ?? []
      },
      assignIcaActivityStatuses(ica_activity_statuses: []) {
        this.ica_activity_statuses = ica_activity_statuses ?? []
      },

      assignSourcesDestinationsCodeMovements(
        sources_destinations_code_movements: ISelectorResources[]
      ) {
        this.sources_destinations_code_movements = (
          Array.isArray(sources_destinations_code_movements)
            ? sources_destinations_code_movements
            : []
        ).map((item: ISelectorResources) => ({
          ...item,
          value: item.id,
          label:
            item.name ||
            (item.code && item.description
              ? `${item.code} - ${item.description}`
              : item.code || item.description || ''),
        }))
      },

      assignSettlementConceptsByStructureAndType(
        settlement_concepts_by_structure_and_type: ISettlementConceptByStructureAndType[]
      ) {
        this.settlement_concepts_by_structure_and_type =
          settlement_concepts_by_structure_and_type.map(
            (item: ISettlementConceptByStructureAndType) => ({
              ...item,
              value: item.id ?? '',
              label: `${item.concept}`,
            })
          ) ?? []
      },

      assignSettlementConceptTypes(settlement_concept_types: []) {
        this.settlement_concept_types = settlement_concept_types ?? []
      },

      assignSettlementConceptClasses(settlement_concept_classes: []) {
        this.settlement_concept_classes =
          settlement_concept_classes.map((item: ISelectorResources) => ({
            ...item,
            value: item.value,
            label: `${item.value} - ${item.label}`,
          })) ?? []
      },

      assignPaymentBlockCodeName(payment_block_code_name: []) {
        this.payment_block_code_name =
          payment_block_code_name.map((item: ISelectorResources) => ({
            ...item,
            value: item.id,
            label: item.label,
          })) ?? []
      },

      assignPaymentRequestBusinesses(payment_request_businesses: []) {
        this.payment_request_businesses =
          payment_request_businesses.map((item: IGenericResource) => ({
            ...item,
            value: item.id ?? '',
            label: item.label,
          })) ?? []

        this.payment_request_businesses_value_code =
          payment_request_businesses.map((item: IGenericResource) => ({
            ...item,
            value: item.code ?? '',
            label: item.label,
          })) ?? []
      },

      assignPaymentRequestStatuses(payment_request_statuses: []) {
        const mapped =
          payment_request_statuses.map((item: ISelectorResources) => ({
            ...item,
            value: item.value ?? item.id ?? '',
            label: item.label ?? item.name ?? '',
          })) ?? []

        this.payment_request_statuses = [
          { label: 'Todos', value: '' } as ISelectorResources,
          ...mapped,
        ]
      },

      assignPaymentRequestNumbers(payment_request_numbers: []) {
        this.payment_request = payment_request_numbers
        this.payment_request_numbers = payment_request_numbers
      },

      assignPaymentRequests(payment_requests: []) {
        this.payment_requests =
          payment_requests.map((item: IPaymentRequest) => ({
            ...item,
            value: item.id ?? '',
            label: item.request_number,
          })) ?? []
      },
      assignOrpaAuthorizations(
        orpa_authorizations: IOrpaAuthorizationResources[]
      ) {
        this.orpa_authorizations =
          orpa_authorizations.map((item) => ({
            ...item,
            value: item.id ?? '',
            label: item.request_number,
          })) ?? []
      },

      assignPaymentRequestConsecutiveCodes(
        payment_request_consecutive_codes: []
      ) {
        this.payment_request_consecutive_codes =
          payment_request_consecutive_codes.map(
            (item: IPaymentRequestConsecutiveCode) => ({
              ...item,
              value: item.consecutive_code,
              label: item.consecutive_code,
            })
          ) ?? []
      },

      assignSettlementFormulaPersonTypes(settlement_formula_person_types: []) {
        const mapped =
          settlement_formula_person_types.map((item: ISelectorResources) => ({
            ...item,
            value: item.value ?? item.id ?? '',
            label: item.label ?? item.name ?? '',
          })) ?? []

        this.settlement_formula_person_types = [
          { label: 'Todos', value: 0 } as ISelectorResources,
          ...mapped,
        ]
      },

      assignTaxSettlementPersonTypes(tax_settlement_person_types: []) {
        const mapped =
          tax_settlement_person_types.map((item: ISelectorResources) => ({
            ...item,
            value: item.value ?? item.id ?? '',
            label: item.label ?? item.name ?? '',
          })) ?? []

        this.tax_settlement_person_types = [
          { label: 'Todos', value: 0 } as ISelectorResources,
          ...mapped,
        ]
      },

      assignCancellationRejectionReasons(cancellation_rejection_reasons: []) {
        this.cancellation_rejection_reasons =
          cancellation_rejection_reasons.map((item: IGenericResource) => ({
            ...item,
            value: item.id ?? '',
            label: item.description ?? '',
          })) ?? []
      },

      async getResources(params: string) {
        const customHandlers: Record<
          string,
          (value: any, key: string | undefined) => void
        > = {
          annual_payment_years: this.assignAnnualPaymentYears,
          tax_types: this.assignTaxTypes,
          tax_natures: this.assignTaxNatures,
          revenue_beneficiary_entities: this.assignRevenueBeneficiaryEntities,
          fiscal_charges: this.assignFiscalCharges,
          cancellation_reason_types: this.assignCancellationReasonTypes,
          ica_activity_statuses: this.assignIcaActivityStatuses,
          movement_management_code_name: this.assignMovementManagementCodeName,
          payment_concept_codes: this.assignPaymentConceptCodes,
          payment_concept_types: this.assignPaymentConceptTypes,
          payment_concept_nature_types: this.assignPaymentConceptNatureTypes,
          payment_concept_activity_types:
            this.assignPaymentConceptActivityTypes,
          payment_concept_obligation_types:
            this.assignPaymentConceptObligationTypes,
          payment_concept_pension_types: this.assignPaymentConceptPensionTypes,
          ica_activity_types: this.assignIcaActivityTypes,
          ica_economic_activity_concepts:
            this.assignIcaEconomicActivityConcepts,
          periodicity: this.assignPeriodicity,
          third_party_types: this.assignThirdPartyTypes,
          settlement_concept: this.assignSettlementConcept,
          settlement_concepts_by_structure_and_type:
            this.assignSettlementConceptsByStructureAndType,
          document_type_statuses: this.assignDocumentTypeStatuses,
          document_type_code_name: this.assignDocumentTypeCodeName,
          document_types_operation_type: this.assignDocumentTypesOperationType,
          document_types_numbering_type: this.assignDocumentTypesNumberingType,
          document_types: this.assignDocumentTypes,
          sources_destinations_used_sources:
            this.assignSourcesDestinationsCodeMovements,
          sources_destinations_code_movements:
            this.assignSourcesDestinationsCodeMovements,
          settlement_concept_types: this.assignSettlementConceptTypes,
          settlement_concept_classes: this.assignSettlementConceptClasses,
          settlement_formula_person_types:
            this.assignSettlementFormulaPersonTypes,
          payment_request_statuses: this.assignPaymentRequestStatuses,
          payment_request: this.assignPaymentRequestNumbers,
          payment_requests: this.assignPaymentRequests,
          payment_block_code_name: this.assignPaymentBlockCodeName,
          payment_request_businesses: this.assignPaymentRequestBusinesses,
          payment_request_numbers: this.assignPaymentRequestNumbers,
          orpa_authorizations: this.assignOrpaAuthorizations,
          payment_request_consecutive_codes:
            this.assignPaymentRequestConsecutiveCodes,
          cancellation_rejection_reasons:
            this.assignCancellationRejectionReasons,
          tax_settlement_person_types: this.assignTaxSettlementPersonTypes,
        }

        await executeApi()
          .get(`${URL_PATH_ACCOUNTS_PAYABLE}/select-tables${params}`)
          .then((response) => {
            if (!response.status) return
            Object.entries(response.data.data).forEach(([key, value]) => {
              if (
                !value ||
                typeof value === 'string' ||
                value instanceof String
              )
                return
              if (customHandlers[key]) {
                customHandlers[key](value, key)
              } else if (key in this.$state) {
                ;(this as any)[key] = value
              }
            })
          })
          .catch((e) => {
            const error = e as IErrors
            showAlert(showCatchError(error), 'error')
          })
      },
    },
  }
)
