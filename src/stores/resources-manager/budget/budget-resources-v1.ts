/* eslint-disable @typescript-eslint/no-explicit-any */

// Core - Pinia - API
import { executeApi } from '@/apis'
import {
  IMovementCodeResource,
  IOperationLogsAuthorized,
} from '@/interfaces/customs/resources'

import { defineStore } from 'pinia'
import { URL_PATH_BUDGET } from '@/constants/apis'
// Composables
import { useAlert, useShowError } from '@/composables'
// Interfaces & types
import {
  IGenericResource,
  ISelectorResources,
  IStatusResource,
} from '@/interfaces/customs'
import { IErrors, IResource } from '@/interfaces/global'
import {
  IBudgetBusinessTrustResource,
  IBudgetLevelResource,
  IThirdPartyDocumentResource,
  IBudgeNfiResource,
  IAccountingBudgetMappingParameters,
  IBudgeTransferDetail,
  IBudgetDocumentNumber,
  IBudgetDocumentTypeResource,
  IBudgetDocumentTypeByBusinessResource,
  IBudgetClosuresResource,
} from '@/interfaces/customs/resources/Budget'

const { showAlert } = useAlert()
const { showCatchError } = useShowError()

const initialState = () => ({
  version: 'v1',
  budget_classes: [] as IGenericResource[],
  budget_document_types_selector: [] as IGenericResource[],
  budget_document_transfer_type: [] as IGenericResource[],
  budget_transfer_document_type_selector: [] as IGenericResource[],
  code_movement_validities: [] as IGenericResource[],
  code_movements: [] as IMovementCodeResource[],
  code_movements_source_destination_modules: [] as IGenericResource[],
  code_movements_types_contracting: [] as IMovementCodeResource[],
  movement_codes_source_destination: [] as IMovementCodeResource[],
  budget_items_statuses: [] as IStatusResource[],
  budget_item_types: [] as IGenericResource[],
  budget_item_nature: [] as IGenericResource[],
  budget_item_codes: [] as IGenericResource[],
  cities: [] as IGenericResource[],
  banks: [] as IGenericResource[],
  branches: [] as IGenericResource[],
  account_structures: [] as IGenericResource[],
  type_accounts: [] as IGenericResource[],
  budget_resources_types: [] as IGenericResource[],
  areas_resposabilities_types: [] as IGenericResource[],
  budget_document_types_code_description: [] as IGenericResource[],
  budget_item_codes_source_destination: [] as IGenericResource[],
  budget_levels: [] as IBudgetLevelResource[],
  areas_responsabilities_applicant: [] as IGenericResource[],
  cities_required_document_type: [] as IGenericResource[],
  operation_logs_authorized: [] as IOperationLogsAuthorized[],
  third_parties: [] as IGenericResource[],
  business_trusts: [] as IBudgetBusinessTrustResource[],
  business_trust_from_to: [] as IBudgetBusinessTrustResource[],
  areas_resposabilities_codes: [] as IGenericResource[],
  areas_responsabilities_selector: [] as IGenericResource[],
  budget_resource_codes: [] as IGenericResource[],
  budget_mapping_parameters: [] as IBudgeNfiResource[],
  budget_mhcp_codes: [] as IGenericResource[],
  accounting_budget_mapping_parameters:
    [] as IAccountingBudgetMappingParameters[],
  budget_item_codes_payment_block: [] as IGenericResource[],
  business_trusts_with_budget_documents: [] as IGenericResource[],
  budget_document_validities: [] as IGenericResource[],
  budget_level_for_documents: [] as IGenericResource[],
  budget_document_expiration_periodicities: [] as IGenericResource[],
  budget_document_numbering_types: [] as IGenericResource[],
  code_movements_for_document_types: [] as IMovementCodeResource[],
  budget_transfer_details_responsibility_area: [] as IGenericResource[],
  budget_transfer_details_budget_item: [] as IGenericResource[],
  budget_transfer_details_resource: [] as IGenericResource[],
  budget_document_validities_by_business: [] as IGenericResource[],
  budget_document_number: [] as IBudgetDocumentNumber[],
  budget_document_number_unique_value: [] as IBudgetDocumentNumber[],
  budget_document_number_business_range: [] as IBudgetDocumentNumber[],
  budget_documents_by_level: [] as IGenericResource[],
  budget_document_types: [] as IGenericResource[],
  areas_responsability_operation_details: [] as IGenericResource[],
  budget_resource_operation_details: [] as IGenericResource[],
  budget_item_operation_details: [] as IGenericResource[],
  business_trusts_with_documents: [] as IBudgetBusinessTrustResource[],
  accounting_budget_mapping_parameters_code:
    [] as IAccountingBudgetMappingParameters[],
  budget_resource_selector: [] as IGenericResource[],
  budget_document_types_by_business:
    [] as IBudgetDocumentTypeByBusinessResource[],
  budget_closures: [] as IBudgetClosuresResource[],
})

export const useBudgetResourcesV1 = defineStore('budget-resources-v1', {
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
    assignMapIdName(resources: never[], key: string | undefined) {
      if (!key) return
      ;(this as any)[key] =
        resources.map((item: IResource) => ({
          ...item,
          value: item.id,
          label: `${item.name}`,
        })) || []
    },
    assignMapIndex(resources: [], key: string | undefined) {
      if (!key) return
      ;(this as any)[key] =
        resources.map((item: IResource, index: number) => ({
          ...item,
          value: index + 1,
        })) || []
    },
    assignMapIdCodeDescription(resources: never[], key: string | undefined) {
      if (!key) return
      ;(this as any)[key] =
        resources.map((item: IResource) => ({
          ...item,
          value: item.id,
          label: `${item.code} - ${item.description}`,
        })) || []
      this.budget_resource_selector =
        resources.map((item: IGenericResource) => ({
          ...item,
          value: item.id ?? 0,
          label: item.code ?? '',
        })) || []
    },
    assignMapLabel(resources: never[], key: string | undefined) {
      if (!key) return
      ;(this as any)[key] =
        resources.map((item: IResource) => ({
          ...item,
          value: item.label,
          label: item.label,
        })) || []
    },

    assignBudgetAreasResposabilitiesTypes(
      areas_resposabilities_types: never[]
    ) {
      this.areas_resposabilities_types =
        areas_resposabilities_types.map((item: IGenericResource) => ({
          ...item,
          value: `${item.label}`,
          label: `${item.label}`,
        })) ?? []
    },

    assignBudgetDocumentTypesSelector(
      budget_document_types_selector: IBudgetDocumentTypeResource[]
    ) {
      this.budget_document_types_selector =
        budget_document_types_selector.map((item) => ({
          ...item,
          value: item.id,
          label: `${item.description ?? ''}`,
          formatted_label: `${item.code} - ${item.description}`,
          description: item.description,
        })) ?? []
      this.budget_document_transfer_type = budget_document_types_selector.map(
        (item: IGenericResource) => ({
          ...item,
          value: item.id ?? 0,
          label: `${item.code ?? ''} - ${item?.description}`,
          description: item?.description,
        })
      )

      this.budget_document_transfer_type = budget_document_types_selector.map(
        (item: IGenericResource) => ({
          ...item,
          value: item.id ?? 0,
          label: `${item.code ?? ''} - ${item?.description}`,
          description: item?.description,
        })
      )
    },
    assignBudgetLevels(budget_levels: IBudgetLevelResource[]) {
      this.budget_levels =
        budget_levels.map((item: IBudgetLevelResource) => ({
          ...item,
          value: item.level ?? 0,
          label: `${item.level ?? ''} - ${item.description ?? ''}`,
          description: item?.description,
          class: item?.class || '',
        })) ?? []

      this.budget_level_for_documents =
        budget_levels.map((item: IBudgetLevelResource) => ({
          ...item,
          value: item.id || 0,
          label: `${item.level || ''} - ${item.description || ''}`,
        })) ?? []
    },

    assignCodesMovement(codes: IMovementCodeResource[]) {
      this.code_movements = codes.map((item) => ({
        ...item,
        label: `${item.movement_code} - ${item.movement_description}`,
        value: item.movement_code ?? '',
      }))
      this.movement_codes_source_destination =
        codes.map((item) => ({
          ...item,
          label: `${item.movement_code} - ${item.movement_description}`,
          value: item.id ?? '',
          code: item.movement_code ?? '',
        })) ?? []

      this.code_movements_types_contracting =
        codes
          .map((item) => ({
            ...item,
            label: `${item.movement_code} - ${item.movement_description}`,
            value: item.id ?? '',
          }))
          .sort(
            (a, b) => Number(a.movement_code!) - Number(b.movement_code!)
          ) ?? []
      this.code_movements_for_document_types =
        codes.map((item) => ({
          ...item,
          label: `${item.movement_code}`,
          label_description: `${item.movement_code} - ${item.movement_description}`,
          value: item.id ?? '',
          description: item.movement_description ?? '',
        })) ?? []
    },
    assignCodeMovementValidities(validities: string[]) {
      this.code_movement_validities =
        validities.map((item: string) => ({
          label: item,
          value: item,
        })) ?? []
    },

    assignBudgetDocumentValidities(budget_document_validities: string[]) {
      this.budget_document_validities = budget_document_validities.map(
        (item) => ({
          label: item,
          value: item,
        })
      )
    },

    assignCodeMovementSourceDestinationModules(modules: string[]) {
      this.code_movements_source_destination_modules =
        modules.map((item: string) => ({
          label: item,
          value: item,
        })) ?? []
    },

    assignBudgetItemsStatuses(budget_items_statuses: never[]) {
      this.budget_items_statuses =
        budget_items_statuses.map((item: IStatusResource) => ({
          ...item,
          value: item.id ?? 0,
          label: `${item.status ?? ''}`,
        })) ?? []
    },

    assignBudgetItemsCodes(budget_item_codes: never[]) {
      this.budget_item_codes =
        budget_item_codes.map((item: IGenericResource) => ({
          ...item,
          value: item.code ?? 0,
          label: item.label,
          description: item.label,
          label_code: item.code,
          input_description: item.description,
        })) ?? []

      this.budget_item_codes_source_destination =
        budget_item_codes.map((item: IGenericResource) => ({
          ...item,
          value: item.id ?? 0,
          label: `${item.label ?? ''}`,
        })) ?? []
      this.budget_item_codes_payment_block =
        budget_item_codes
          .map((item: IGenericResource) => ({
            ...item,
            value: item.id ?? 0,
            label: `${item.label ?? ''}`,
          }))
          .sort((a, b) => Number(a.code!) - Number(b.code!)) ?? []
    },
    assignAccountStructures(account_structures: never[]) {
      this.account_structures =
        account_structures?.map((item: IResource) => {
          return {
            ...item,
            value: `${item.code}`,
            label: `${item.code} - ${item.purpose}`,
          }
        }) ?? []
    },
    assignAccountingBudgetMappingParameters(
      accounting_budget_mapping_parameters: never[]
    ) {
      this.budget_mapping_parameters =
        accounting_budget_mapping_parameters.map((item: IBudgeNfiResource) => ({
          ...item,
          value: item.id ?? 0,
          label: `${item.code ?? ''}-${item.budgetResourceType?.code ?? ''}-${
            item.budgetItem?.code ?? ''
          }(RPP),${item.budgetResourceType?.code ?? ''}(RCS),${
            item.responsabilityArea?.code ?? ''
          }(ARE)`,
        })) ?? []

      this.accounting_budget_mapping_parameters =
        accounting_budget_mapping_parameters.map(
          (item: IAccountingBudgetMappingParameters) => ({
            ...item,
            value: item.id ?? 0,
            label: `${item.code ?? ''}-${item.budgetResourceType?.code ?? ''}-${
              item.budgetItem?.code ?? ''
            }(RPP),${item.budgetResourceType?.code ?? ''}(RCS),${
              item.responsabilityArea?.code ?? ''
            }(ARE)`,
          })
        ) ?? []

      this.accounting_budget_mapping_parameters_code =
        accounting_budget_mapping_parameters.map(
          (item: IAccountingBudgetMappingParameters) => ({
            ...item,
            value: item.id ?? '',
            label: `${item.code ?? ''}`,
          })
        ) ?? []
    },

    assignBudgetDocumentTypes(budget_document_types: never[]) {
      this.budget_document_types =
        budget_document_types
          .map((item: IResource) => ({
            ...item,
            value: item.id ?? 0,
            label: `${item.label ?? '-'}`,
            description: item.description ?? '',
          }))
          .sort((a, b) => Number(a.code!) - Number(b.code!)) ?? []
      this.budget_transfer_document_type_selector =
        budget_document_types.map((item: IGenericResource) => ({
          ...item,
          value: item.id ?? 0,
          label: `${item.code} - ${item.description}`,
          label_code: item.code,
          description: item.description,
        })) ?? []

      this.budget_document_types_code_description =
        budget_document_types.map((item: IGenericResource) => ({
          ...item,
          value: item.id ?? 0,
          label: `${item.code ?? ''} - ${item.description ?? ''}`,
          description: item.label,
        })) ?? []
    },

    assignBusinessTrusts(business_trusts: IBudgetBusinessTrustResource[]) {
      this.business_trusts =
        business_trusts.map((item: IBudgetBusinessTrustResource) => ({
          ...item,
          value: item.id,
          label: `${item.business_code} - ${item.name}`,
          description: item.name,
        })) ?? []
      this.business_trust_from_to =
        business_trusts.map((item: IBudgetBusinessTrustResource) => ({
          ...item,
          value: item.id,
          label: item.business_code,
          label_description: `${item.business_code} - ${item.name}`,
          description: item.name,
        })) ?? []
    },
    assignBusinessTrustsWithBudgetDocuments(
      business_trusts: IBudgetBusinessTrustResource[]
    ) {
      this.business_trusts_with_budget_documents =
        business_trusts.map((item: IBudgetBusinessTrustResource) => ({
          ...item,
          value: item.id,
          label: `${item.business_code} - ${item.name}`,
        })) ?? []
    },

    assignAreasResponsabilitiesCodes(areas: never[]) {
      this.areas_resposabilities_codes =
        areas
          .map((item: IResource) => ({
            ...item,
            value: item.id ?? 0,
            label: `${item.code ?? ''} - ${item.description ?? ''}`,
            description: item.description ?? '',
          }))
          .sort((a, b) => Number(a.code!) - Number(b.code!)) ?? []
      areas.map((item: IResource) => ({
        ...item,
        value: item.id ?? 0,
        label: `${item.code ?? ''} - ${item.description ?? ''}`,
        description: item.description ?? '',
      })) ?? []
      this.areas_responsabilities_selector =
        areas.map((item: IGenericResource) => ({
          ...item,
          value: item.id ?? 0,
          label: item.code ?? '',
          label_description: `${item.code} - ${item.description}`,
          description: item.description ?? '',
        })) ?? []
    },

    assignBudgetResourceCodes(budget_resource_codes: never[]) {
      this.budget_resource_codes =
        budget_resource_codes.map((item: IGenericResource) => ({
          ...item,
          value: item.id ?? 0,
          label: `${item.code ?? ''} - ${item.description ?? ''}`,
          label_code: item.code,
          description: item.description,
        })) ?? []
    },

    assignThirdParties(third_parties: never[]) {
      this.third_parties =
        third_parties.map((item: IThirdPartyDocumentResource) => ({
          ...item,
          value: item.id ?? 0,
          label: `${item.document ?? ''}`,
          label_description: `${item.document ?? ''} - ${
            item?.natural_person?.full_name ||
            item?.legal_person?.business_name ||
            ''
          }`,
        })) ?? []
    },

    assignBudgetMcpSeccion(budget_mhcp_codes: never[]) {
      this.budget_mhcp_codes =
        budget_mhcp_codes.map((item: IGenericResource) => ({
          ...item,
          value: item.id ?? 0,
          label: `${item.code ?? ''} - ${item.name ?? ''}`,
        })) ?? []
    },

    assignBudgetTransferDetails(
      budget_transfer_details: IBudgeTransferDetail[]
    ) {
      const seenResponsibility = new Set()
      this.budget_transfer_details_responsibility_area = budget_transfer_details
        .filter((item) => item.responsibility_area || item.area_resposability)
        .map((item) => {
          const area = item.responsibility_area ?? item.area_resposability

          return {
            value: area.id,
            label: `${area.code} - ${area.description}`,
          }
        })
        .filter((item) => {
          const key = `${item.value}-${item.label}`
          if (seenResponsibility.has(key)) return false
          seenResponsibility.add(key)
          return true
        })

      const seenBudgetItem = new Set()
      this.budget_transfer_details_budget_item = budget_transfer_details
        .filter((item) => item?.budget_item)
        .map((item) => ({
          value: item.budget_item.id,
          label: `${item.budget_item.code} - ${item.budget_item.description}`,
        }))
        .filter((item) => {
          const key = `${item.value}-${item.label}`
          if (seenBudgetItem.has(key)) return false
          seenBudgetItem.add(key)
          return true
        })

      const seenResource = new Set()
      this.budget_transfer_details_resource = budget_transfer_details
        .filter((item) => item.resource || item.budget_resource)
        .map((item) => {
          const r = item.resource ?? item.budget_resource

          return {
            value: r.id,
            label: `${r.code} - ${r.description}`,
          }
        })
        .filter((item) => {
          const key = `${item.value}-${item.label}`
          if (seenResource.has(key)) return false
          seenResource.add(key)
          return true
        })
    },

    assignBudgetDocumentValiditiesByBusiness(
      budget_document_validities_by_business: never[]
    ) {
      this.budget_document_validities_by_business =
        budget_document_validities_by_business
    },

    assignAreasResponsabilitiesAplicant(
      areas_responsabilities_applicant: never[]
    ) {
      this.areas_responsabilities_applicant =
        areas_responsabilities_applicant.map((item: IGenericResource) => ({
          ...item,
          label: item.label,
          value: item.code ?? '',
        })) ?? []
    },

    assignCitiesRequiredDocumentType(cities_required_document_type: never[]) {
      this.cities_required_document_type =
        cities_required_document_type.map((item: IGenericResource) => ({
          ...item,
          label: `${item.name ?? ''}`,
          value: item.id ?? '',
        })) ?? []
    },

    assignOperationLogsAuthorized(
      operation_logs_authorized: IOperationLogsAuthorized[]
    ) {
      this.operation_logs_authorized =
        operation_logs_authorized.map((item: IOperationLogsAuthorized) => ({
          ...item,
          label: `${item.id ?? ''}`,
          label_contracts: `${item.id ?? ''} - ${item.operation_label ?? ''}`,
          value: item.id ?? '',
        })) ?? []
    },

    assignBudgetDocumentNumber(
      budget_document_numbers: IBudgetDocumentNumber[]
    ) {
      this.budget_document_number =
        budget_document_numbers.map((item) => ({
          ...item,
          value: item.id,
          label: item.label,
        })) ?? []

      this.budget_document_number_unique_value = budget_document_numbers.map(
        (item) => ({
          ...item,
          value: `${item.id}-${item.operation_type}`,
          label: item.label,
        })
      )
    },

    assignBudgetDocumentNumberBusinessRange(
      budget_document_numbers: IBudgetDocumentNumber[]
    ) {
      this.budget_document_number_business_range =
        budget_document_numbers.map((item) => ({
          ...item,
          value: item.id,
          label: item.label,
        })) ?? []
    },

    assignAreasResponsabilityOperationDetails(
      areas_responsability_operation_details: IGenericResource[]
    ) {
      this.areas_responsability_operation_details =
        areas_responsability_operation_details.map(
          (item: IGenericResource) => ({
            ...item,
            value: item.id ?? 0,
            label: `${item.code ?? ''} - ${item.description ?? ''}`,
            description: item?.description,
          })
        ) ?? []
    },
    assignBudgetResourceOperationDetails(
      budget_resource_operation_details: IGenericResource[]
    ) {
      this.budget_resource_operation_details =
        budget_resource_operation_details.map((item: IGenericResource) => ({
          ...item,
          value: item.id ?? 0,
          label: `${item.code ?? ''} - ${item.description ?? ''}`,
          description: item?.description,
        })) ?? []
    },
    assignBudgetItemOperationDetails(
      budget_item_operation_details: IGenericResource[]
    ) {
      this.budget_item_operation_details =
        budget_item_operation_details.map((item: IGenericResource) => ({
          ...item,
          value: item.id ?? 0,
          label: `${item.code ?? ''} - ${item.description ?? ''}`,
          description: item?.description,
        })) ?? []
    },
    assignBudgetBusinessTrustDocuments(
      business_trusts_with_documents: IBudgetBusinessTrustResource[]
    ) {
      this.business_trusts_with_documents =
        business_trusts_with_documents.map((item) => ({
          ...item,
          value: item.id,
          label: `${item.business_code ?? ''} - ${item.name ?? ''}`,
        })) ?? []
    },

    assignBudgetResourcesTypes(data: ISelectorResources[]) {
      this.budget_resources_types = data.map((item) => ({
        label: `${item.code} - ${item.description}`,
        value: item.id,
      }))
      this.budget_resources_types =
        data.map((item) => ({
          ...item,
          value: item.id,
          label: item?.description,
        })) ?? []
    },

    assignDocumentTypesBudget(data: ISelectorResources[]) {
      this.budget_document_types = data.map((item) => ({
        label: `${item.code} - ${item.description}`,
        value: item.id,
      }))
    },

    assignOperationLogs(data: IOperationLogsAuthorized[]) {
      this.operation_logs_authorized = data.map((item) => ({
        ...item,
        label: `${item.id}`,
        value: item.id ?? 0,
      }))
    },

    assignAreasResposabilitiesCodes(data: ISelectorResources[]) {
      this.areas_resposabilities_codes = data.map((item) => ({
        label: item.label,
        value: item.id,
      }))
    },

    assignBudgetDocumentTypesByBusiness(
      documentTypes: IBudgetDocumentTypeByBusinessResource[]
    ) {
      this.budget_document_types_by_business =
        documentTypes.map((item) => ({
          ...item,
          value: item.id,
          label: item.description,
          formatted_label: `${item.code} - ${item.description}`,
        })) ?? []
    },

    assignBudgetDocumentsByLevel(budget_documents_by_level: never[]) {
      this.budget_documents_by_level =
        budget_documents_by_level.map((item: any) => ({
          ...item,
          value: item.id ?? 0,
          label: item.operation_label ?? `${item.id ?? ''}`,
        })) ?? []
    },

    assignBudgetClosures(budget_closures: IBudgetClosuresResource[]) {
      this.budget_closures = budget_closures.map((item) => ({
        ...item,
        value: item.id,
        label: item.label,
      }))
    },

    async getResources(params: string) {
      const customHandlers: Record<
        string,
        (values: never[], key: string | undefined) => void
      > = {
        areas_resposabilities_types: this.assignBudgetAreasResposabilitiesTypes,
        budget_document_types_selector: this.assignBudgetDocumentTypesSelector,
        budget_document_transfer_type: this.assignBudgetDocumentTypesSelector,
        code_movements_validities: this.assignCodeMovementValidities,
        code_movements: this.assignCodesMovement,
        movement_codes_source_destination: this.assignCodesMovement,
        code_movements_source_destination_modules:
          this.assignCodeMovementSourceDestinationModules,
        budget_items_statuses: this.assignBudgetItemsStatuses,
        budget_item_codes: this.assignBudgetItemsCodes,
        budget_item_types: this.assignMapLabel,
        budget_item_nature: this.assignMapLabel,
        budget_resources_types: this.assignMapIdCodeDescription,
        account_structures: this.assignAccountStructures,
        banks: this.assignMapIdCodeDescription,
        cities: this.assignMapIdName,
        branches: this.assignMapIdName,
        budget_document_types: this.assignBudgetDocumentTypes,
        budget_levels: this.assignBudgetLevels,
        areas_responsabilities_applicant:
          this.assignAreasResponsabilitiesAplicant,
        cities_required_document_type: this.assignCitiesRequiredDocumentType,
        operation_logs_authorized: this.assignOperationLogsAuthorized,
        areas_resposabilities_codes: this.assignAreasResponsabilitiesCodes,
        areas_responsabilities_selector: this.assignAreasResponsabilitiesCodes,
        budget_mhcp_codes: this.assignBudgetMcpSeccion,
        budget_document_validities: this.assignBudgetDocumentValidities,
        business_trusts: this.assignBusinessTrusts,
        budget_resource_codes: this.assignBudgetResourceCodes,
        business_trust_from_to: this.assignBusinessTrusts,
        third_parties: this.assignThirdParties,
        accounting_budget_mapping_parameters:
          this.assignAccountingBudgetMappingParameters,
        business_trusts_with_budget_documents:
          this.assignBusinessTrustsWithBudgetDocuments,
        budget_document_number: this.assignBudgetDocumentNumber,
        budget_document_number_business_range:
          this.assignBudgetDocumentNumberBusinessRange,
        budget_transfer_details: this.assignBudgetTransferDetails,
        budget_document_validities_by_business:
          this.assignBudgetDocumentValiditiesByBusiness,
        operation_log_details: this.assignBudgetTransferDetails,
        budget_transfer_document_type_selector: this.assignBudgetDocumentTypes,
        areas_responsability_operation_details:
          this.assignAreasResponsabilityOperationDetails,
        budget_resource_operation_details:
          this.assignBudgetResourceOperationDetails,
        budget_item_operation_details: this.assignBudgetItemOperationDetails,
        business_trusts_with_documents: this.assignBudgetBusinessTrustDocuments,
        budget_resource_selector: this.assignMapIdCodeDescription,
        budget_document_types_by_business:
          this.assignBudgetDocumentTypesByBusiness,
        budget_documents_by_level: this.assignBudgetDocumentsByLevel,
        budget_closures: this.assignBudgetClosures,
      }

      await executeApi()
        .get(`${URL_PATH_BUDGET}/select-tables${params}`)
        .then((response) => {
          if (!response.status) return
          Object.entries(response.data.data).forEach(([key, value]) => {
            if (!value || typeof value === 'string' || value instanceof String)
              return
            if (customHandlers[key]) {
              const arrValue = Array.isArray(value) ? (value as never[]) : []
              customHandlers[key](arrValue, key)
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
})
