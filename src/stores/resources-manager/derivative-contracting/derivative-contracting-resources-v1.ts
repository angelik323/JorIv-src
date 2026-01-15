/* eslint-disable @typescript-eslint/no-explicit-any */

import { executeApi } from '@/apis'
import { useAlert, useShowError } from '@/composables'
import { IErrors, IResource } from '@/interfaces/global'

import { defineStore } from 'pinia'

import { URL_PATH_DERIVATIVE_CONTRACTING } from '@/constants/apis'
import {
  ISelectorResources,
  IGenericResource,
  IContractTypeStatusStatusesSubstatusesResource,
} from '@/interfaces/customs'
import {
  IAvailableDocumentTypes,
  IDerivatedContractingNfi,
  IBasicInfoContract,
  IContractPaymentMilestones,
  IContractDocumentStructure,
  IContractTypeIdName,
  IContractClausesCode,
  IContractAttachments,
  IContractorAddition,
} from '@/interfaces/customs/resources/DerivativeContracting'

const { showAlert } = useAlert()
const { showCatchError } = useShowError()

const initialState = () => ({
  version: 'v1',
  definition_documentation_type: [] as IResource[],
  definition_documentation_module: [] as IResource[],
  definition_documentation_process: [] as IResource[],
  definition_documentation_support: [] as IResource[],
  definition_documentation_mandatory: [] as IResource[],
  definition_documentation_file_retention: [] as IResource[],
  definition_documentation_final_provision: [] as IResource[],
  definition_documentation_structure_codes: [] as IResource[],
  definition_documentation_codes: [] as IResource[],
  contract_clauses_codes: [] as IResource[],
  contract_clauses_names: [] as IResource[],
  clause_types: [] as IResource[],
  contract_addition_business_trust: [] as IResource[],
  contract_addition_contractors: [] as IResource[],
  contract_addition_numbers: [] as IResource[],
  contract_modification_type: [] as IResource[],
  contract_periodicity: [] as IResource[],
  contract_type_for_addition: [] as IResource[],
  payment_type: [] as IResource[],
  budget_item_codes: [] as IResource[],
  policies: [] as IResource[],
  policy_status: [] as IResource[],
  type_contract_status_enum: [] as IGenericResource[],
  type_contract_status: [] as IGenericResource[],
  payment_type_label: [] as IResource[],
  contract_type: [] as IGenericResource[],
  contract_type_category: [] as IGenericResource[],
  contract_type_modality: [] as IGenericResource[],
  contract_type_valuein: [] as IGenericResource[],
  contract_type_max_amount_allowed: [] as IGenericResource[],
  contract_type_numbering_type: [] as IGenericResource[],
  contract_type_business_numbering_type: [] as IGenericResource[],
  contract_type_status_flow_type: [] as IGenericResource[],
  contract_type_status_budget_validy: [] as IGenericResource[],
  contract_type_status_statuses_substatuses:
    [] as IContractTypeStatusStatusesSubstatusesResource[],
  substatuses_contract_type_status_statuses_substatuses:
    [] as IContractTypeStatusStatusesSubstatusesResource[],
  risk_nature: [] as IGenericResource[],
  policy_stage: [] as IGenericResource[],
  risk_list: [] as IResource[],
  contract_type_id_name: [] as IContractTypeIdName[],
  contract_type_id_name_with_code: [] as IContractTypeIdName[],
  contract_document_structure_taxable_base_unit: [] as IGenericResource[],
  contract_document_structure_stage: [] as IGenericResource[],
  available_document_types: [] as IAvailableDocumentTypes[],
  contract_stages: [] as IResource[],
  contract_status_grouped: [] as IResource[],
  work_plan: [] as IDerivatedContractingNfi[],
  business_trust_derivative_contracting_statuses: [] as IGenericResource[],
  basic_info_contract: [] as IBasicInfoContract[],
  contract_payment_milestones: [] as IContractPaymentMilestones[],
  contract_document_structure: [] as IContractDocumentStructure[],
  project: [] as IResource[],
  contract_attachments: [] as IContractAttachments[],
})

export const useDerivativeContractingResourcesV1 = defineStore(
  'derivative-contracting-resources-v1',
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

      assignDocumentationType(data: ISelectorResources[]) {
        this.definition_documentation_type = data.map((item) => ({
          label: item.label,
          value: item.value,
        }))
      },

      assignDocumentationModule(data: ISelectorResources[]) {
        this.definition_documentation_module = data.map((item) => ({
          label: item.label,
          value: item.value,
        }))
      },

      assignDocumentationProcess(data: ISelectorResources[]) {
        this.definition_documentation_process = data.map((item) => ({
          label: item.label,
          value: item.value,
        }))
      },

      assignDocumentationSupport(data: ISelectorResources[]) {
        this.definition_documentation_support = data.map((item) => ({
          label: item.label,
          value: item.value,
        }))
      },

      assignDocumentationMandatory(data: ISelectorResources[]) {
        this.definition_documentation_mandatory = data.map((item) => ({
          label: item.label,
          value: item.value,
        }))
      },

      assignDocumentationFileRetention(data: ISelectorResources[]) {
        this.definition_documentation_file_retention = data.map((item) => ({
          label: item.label,
          value: item.value,
        }))
      },

      assignDocumentationFinalProvision(data: ISelectorResources[]) {
        this.definition_documentation_final_provision = data.map((item) => ({
          label: item.label,
          value: item.value,
        }))
      },

      assignDocumentationStructureCodes(data: ISelectorResources[]) {
        this.definition_documentation_structure_codes = data.map((item) => ({
          label: `${item.document_code} - ${item.name}`,
          value: item.structure_id ?? 0,
        }))
      },

      assignDocumentationCodes(data: ISelectorResources[]) {
        this.definition_documentation_codes = data.map((item) => ({
          label: `${item.document_code} - ${item.name}`,
          value: item.document_code ?? 0,
        }))
      },

      assignContractClausesTypes(data: ISelectorResources[]) {
        this.clause_types = data.map((item) => ({
          label: item.name,
          value: item.id,
        }))
      },

      assignContractClausesCodes(data: []) {
        this.contract_clauses_codes = data.map(
          (item: IContractClausesCode) => ({
            ...item,
            label: item.code ?? 'Sin información',
            label_name: (item.code ?? '') + ' - ' + (item.name ?? ''),
            value: item.code ?? '',
            value_id: item.id ?? 0,
          })
        )

        this.contract_clauses_names = data.map(
          (item: IContractClausesCode) => ({
            ...item,
            label: item.name ?? 'Sin información',
            value: item.code ?? 0,
            clausule: item.clausule,
          })
        )
      },

      assignBusinessTrust(data: ISelectorResources[]) {
        this.contract_addition_business_trust = data.map((item) => ({
          label: `${item.business_code} - ${item.name}`,
          value: item.id,
        }))
      },

      assignAdditionContractors(data: IContractorAddition[]) {
        this.contract_addition_contractors = data.map((item) => {
          const person = item.natural_person
          return {
            ...item,
            label: `${item.document} - ${
              person ? person?.full_name : 'Sin definir'
            }`,
            value: item.id ?? '',
          }
        })
      },

      assignAdditionContracts(data: ISelectorResources[]) {
        this.contract_addition_numbers = data.map((e) => ({
          label: e.additional_number ?? '',
          value: e.id,
        }))
      },

      assignModificationType(data: ISelectorResources[]) {
        this.contract_modification_type = data.map(({ label, value }) => ({
          label,
          value,
        }))
      },

      assignPeriodicity(data: ISelectorResources[]) {
        this.contract_periodicity = data.map(({ label, value }) => ({
          label,
          value,
        }))
      },

      assignContractTypeForAddition(data: ISelectorResources[]) {
        this.contract_type_for_addition = data.map((item) => ({
          label: `${item.document_code} - ${item.document_name}`,
          value: item.id,
        }))
      },

      assignPaymentType(data: ISelectorResources[]) {
        this.payment_type = data.map((item) => ({
          label: `${item.code} - ${item.name}`,
          value: item.id,
        }))
      },

      assignBudgetItemCodes(data: ISelectorResources[]) {
        this.budget_item_codes = data.map((item) => ({
          label: `${item.code} - ${item.name}`,
          value: item.id,
        }))
      },

      assignPolicies(data: ISelectorResources[]) {
        this.policies = data.map((item) => ({
          label: item.name,
          value: item.id,
        }))
      },

      assignPolicyStatus(data: ISelectorResources[]) {
        this.policy_status = data.map(({ label, value }) => ({ label, value }))
      },

      assignRiskList(data: ISelectorResources[]) {
        this.risk_list = data.map((item) => ({
          label: item.name,
          value: item.id,
          minimum_percentage: item.minimum_percentage,
          maximum_percentage: item.maximum_percentage,
        }))
      },

      assignAvailableDocumentType(available_document_types: []) {
        this.available_document_types =
          available_document_types.map((item: IAvailableDocumentTypes) => ({
            ...item,
            value: item.id ?? null,
            label: `${item.code ?? ''} - ${item.name ?? ''}`,
          })) ?? []
      },

      assignContractTypeStatusBudgetValidity(data: ISelectorResources[]) {
        this.contract_type_status_budget_validy =
          data.map((item) => ({
            ...item,
            value: item.value ?? null,
            label: `${item.label ?? ''}`,
          })) ?? []
      },

      assignContractTypeStatusStatusesSubstatuses(data: ISelectorResources[]) {
        this.contract_type_status_statuses_substatuses =
          data.map((item) => ({
            ...item,
            value: item.value ?? null,
            label: `${item.label ?? ''}`,
          })) ?? []

        this.substatuses_contract_type_status_statuses_substatuses =
          data.flatMap((item: IContractTypeStatusStatusesSubstatusesResource) =>
            (item.sons ?? []).map((son) => ({
              ...son,
              value: son.value ?? null,
              label: `${son.label ?? ''}`,
            }))
          ) ?? []
      },

      assignContractTypeIdName(contract_type_id_name: []) {
        this.contract_type_id_name =
          contract_type_id_name.map((item: IContractTypeIdName) => ({
            ...item,
            value: item.id ?? null,
            label: `${item.document_name ?? ''}`,
          })) ?? []

        this.contract_type_id_name_with_code =
          contract_type_id_name.map((item: IContractTypeIdName) => ({
            ...item,
            value: item.id ?? null,
            label: `${item.document_code ?? ''} - ${item.document_name ?? ''}`,
          })) ?? []
      },

      assignAvailableDocumentTypes(available_document_types: []) {
        this.available_document_types =
          available_document_types.map((item: IAvailableDocumentTypes) => ({
            ...item,
            value: item.id ?? null,
            label: `${item.code ?? ''} - ${item.name ?? ''}`,
          })) ?? []
      },

      assignDerivateContracting(work_plan: []) {
        this.work_plan =
          work_plan.map((item: IDerivatedContractingNfi) => ({
            ...item,
            label: `${item.code} - ${item.name}`,
            value: item.id ?? '',
            purpose: item?.structure?.[0]?.purpose ?? '',
            label_code_purpose: `${item?.structure?.[0]?.code ?? ''} - ${
              item?.structure?.[0]?.purpose ?? ''
            }`,
          })) ?? []
      },

      assignBasicInfoContract(basic_info_contract: []) {
        this.basic_info_contract =
          basic_info_contract.map((item: IBasicInfoContract) => ({
            ...item,
            value: item.id ?? '',
            label: item.contract_number,
          })) ?? []
      },

      assignContractStatusGrouped(contract_status_grouped: IResource[]) {
        this.contract_status_grouped =
          contract_status_grouped.map((item: IResource) => ({
            ...item,
            value: item.id ?? item.value ?? 0,
            label: `${item.name ?? item.label ?? ''}`,
          })) ?? []
      },

      assignPaymentTypeLabel(payment_type_label: IResource[]) {
        this.payment_type_label =
          payment_type_label.map((item: IResource) => ({
            ...item,
            value: item.id ?? item.value ?? 0,
            label: `${item.name ?? item.label ?? ''}`,
          })) ?? []
      },

      assignContractPaymentMilestones(contract_payment_milestones: []) {
        this.contract_payment_milestones =
          contract_payment_milestones.map(
            (item: IContractPaymentMilestones) => ({
              ...item,
              value: item.id ?? '',
              label: item.display_label,
            })
          ) ?? []
      },

      assignContractTypeDocuments(data: []) {
        this.contract_type_id_name = data.map((item: IContractTypeIdName) => ({
          ...item,
          label: `${item.document_code} - ${item.document_name}`,
          value: item.id,
          category_name: item.category_name ?? null,
          numbering_type_name: item.numbering_type_name ?? null,
        }))
      },

      assignContractDocumentStructure(data: []) {
        this.contract_document_structure =
          data.map((item: IContractDocumentStructure) => ({
            ...item,
            value: item.id ?? 0,
            label: `${item.contract_document_code ?? ''} - ${
              item.contract_document_name ?? ''
            }`,
          })) ?? []
      },

      assignProject(data: []) {
        this.project =
          data.map((item: IContractDocumentStructure) => ({
            ...item,
            value: item.id ?? 0,
            label: `${item.code ?? ''} - ${item.name ?? ''}`,
          })) ?? []
      },

      assignContractAttachments(data: []) {
        this.contract_attachments =
          data.map((item: IContractAttachments) => ({
            ...item,
            value: item.id ?? 0,
            label: item.type_attached_document?.name ?? '',
          })) ?? []
      },

      async getResources(params: string) {
        const customHandlers: Record<
          string,
          (value: any, key: string | undefined) => void
        > = {
          definition_documentation_type: this.assignDocumentationType,
          definition_documentation_module: this.assignDocumentationModule,
          definition_documentation_process: this.assignDocumentationProcess,
          definition_documentation_support: this.assignDocumentationSupport,
          definition_documentation_mandatory: this.assignDocumentationMandatory,
          definition_documentation_file_retention:
            this.assignDocumentationFileRetention,
          definition_documentation_final_provision:
            this.assignDocumentationFinalProvision,
          definition_documentation_structure_codes:
            this.assignDocumentationStructureCodes,
          definition_documentation_codes: this.assignDocumentationCodes,
          clause_types: this.assignContractClausesTypes,
          contract_clauses_codes: this.assignContractClausesCodes,
          contract_type_status_budget_validity:
            this.assignContractTypeStatusBudgetValidity,
          contract_type_status_statuses_substatuses:
            this.assignContractTypeStatusStatusesSubstatuses,
          contract_status_grouped: this.assignContractStatusGrouped,
          payment_type_label: this.assignPaymentTypeLabel,
          contract_addition_business_trust: this.assignBusinessTrust,
          contract_addition_contractors: this.assignAdditionContractors,
          contract_addition_numbers: this.assignAdditionContracts,
          contract_modification_type: this.assignModificationType,
          contract_periodicity: this.assignPeriodicity,
          contract_type_for_addition: this.assignContractTypeForAddition,
          payment_type: this.assignPaymentType,
          policies: this.assignPolicies,
          policy_status: this.assignPolicyStatus,
          available_document_types: this.assignAvailableDocumentType,
          risk_list: this.assignRiskList,
          work_plan: this.assignDerivateContracting,
          basic_info_contract: this.assignBasicInfoContract,
          contract_payment_milestones: this.assignContractPaymentMilestones,
          contract_type_id_name: this.assignContractTypeDocuments,
          contract_document_structure: this.assignContractDocumentStructure,
          project: this.assignProject,
          contract_attachments: this.assignContractAttachments,
        }

        await executeApi()
          .get(`${URL_PATH_DERIVATIVE_CONTRACTING}/select-tables${params}`)
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
