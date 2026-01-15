/* eslint-disable @typescript-eslint/no-explicit-any */

import { executeApi } from '@/apis'
import { useAlert, useShowError } from '@/composables'
import {
  IBusinessSubTypeResource,
  IDocumentResource,
  IDocumentStructuresForCharacteristics,
  ISelectorResources,
  ITrustBusinessUserResource,
  IParticipantTransferStatusResource,
  IBusinessTrustRealEstateProjectResource,
  IProjectStageResource,
  IBusinessTrustPropertiesResource,
  ISaleRealStateResource,
  IGenericResource,
  IStatusResource,
  IBusinessTrustPropertySaleResource,
  IFiduciaryMandatesResource,
  IBusinessTrustExtended,
  IEquilibriumPointResource,
  IBusinessTrustMeansPayment,
  IBusinessTrustResource,
  IBusinessBudget,
  ITrustBusinessUsers,
} from '@/interfaces/customs'
import { IErrors, IResource } from '@/interfaces/global'
import { ITrustBusinessDerivativeContracting } from '@/interfaces/customs/resources/DerivativeContracting'
import {
  IAccountsPayables,
  IBusinessTrustParticipantResource,
  IBusinessTrustCurrencyOption,
  IBusinessTrustFixed,
  IBusinessTrustAccount,
} from '@/interfaces/customs/resources/BusinessTrust'

import { defineStore } from 'pinia'

import { TRUST_BUSINESS_API_URL } from '@/constants/apis'

const { showAlert } = useAlert()
const { showCatchError } = useShowError()

const initialState = () => ({
  version: 'v1',
  extend_business: [] as IResource[],
  business_trust_change_status: [] as IResource[],
  close_treasurie: [] as IResource[],
  cash_flow_structures: [] as IResource[],
  business_trust_third_parties: [] as ISaleRealStateResource[],
  nit_agents: [] as IResource[],
  nit_agents_v2: [] as IResource[],
  business_trust_statuses: [] as IResource[],
  business_trust_statuses_extend: [] as IResource[],
  business_trust_types: [] as IResource[],
  business_trust_register_types: [] as IResource[],
  business_trust_subtypes: [] as IBusinessSubTypeResource[],
  business_trust_mode: [] as IResource[],
  business_trust_periodicity_accountability: [] as IResource[],
  account_structures: [] as IResource[],
  cost_centers_structures: [] as IResource[],
  status_accounting_trust_business: [] as IResource[],
  business_trust_classification: [] as IResource[],
  business_trusts: [] as ISelectorResources[],
  business_trusts_participants_for_business:
    [] as IBusinessTrustParticipantResource[],
  business_trusts_participants_for_third_party:
    [] as IBusinessTrustParticipantResource[],
  users: [] as ITrustBusinessUserResource[] | IGenericResource[],
  users_with_document: [] as ITrustBusinessUserResource[] | IGenericResource[],
  users_with_document_and_abbreviation: [] as
    | ITrustBusinessUserResource[]
    | IGenericResource[],
  business_trusts_with_code: [] as IResource[],
  business_trusts_only_code_in_label: [] as ISelectorResources[],
  business_trusts_value_is_code: [] as ISelectorResources[],
  business_trust_fideico_types: [] as IResource[],
  business_trust_society_types: [] as IResource[],
  business_currency: [] as IResource[],
  movement_codes_natures: [] as IResource[],
  movement_codes_types: [] as IResource[],
  collection_shapes: [] as IResource[],
  funds_movements: [] as IResource[],
  movement_codes_cancellation_codes: [] as IResource[],
  document_structure_type: [] as IResource[],
  movement_codes_parameters: [] as IResource[],
  params_good_class: [] as IResource[],
  params_good_type: [] as IResource[],
  params_nature: [] as IResource[],
  params_auxiliary_type: [] as IResource[],
  params_accounting_account: [] as IResource[],
  sub_receipt_types: [] as IResource[],
  receipt_types: [] as IResource[],
  document_types: [] as IResource[],
  document_structures: [] as IResource[],
  participant_types: [] as IResource[],
  participant_transfer_status: [] as IResource[],
  project_type: [] as IResource[],
  development_type: [] as IResource[],
  base_calculation_property: [] as IResource[],
  associated_financing: [] as IResource[],
  banks: [] as IResource[],
  business_trust_guarantee: [] as IResource[],
  business_trust_policy: [] as IResource[],
  block_nomeclatures: [
    {
      label: 'Númerico',
      value: 'Númerico',
    },
    {
      label: 'Letras',
      value: 'Letras',
    },
  ] as IResource[],
  guarantees_types: [] as IResource[],
  guarantees_status: [] as IResource[],
  guarantees_record_status: [] as IResource[],
  guarantees_linkage_types: [] as IResource[],
  policy_types: [] as IResource[],
  policies_record_status: [] as IResource[],
  policies_status: [] as IResource[],
  policy_payment_methods: [] as IResource[],
  coins: [] as IResource[],
  policy_insurers: [] as IResource[],
  policy_insurers_with_id: [] as IResource[],
  business_trusts_with_id: [] as IResource[],
  project_status: [] as IResource[],
  equilibrium_point_statuses: [] as IResource[],
  equilibrium_points_business_trust: [] as IEquilibriumPointResource[],
  equilibrium_points_real_estate_project: [] as IEquilibriumPointResource[],
  characteristic_document: [] as IEquilibriumPointResource[],
  general_order: [] as IEquilibriumPointResource[],
  business_trust_real_estate_project:
    [] as IBusinessTrustRealEstateProjectResource[],
  project_stage: [] as IProjectStageResource[],
  business_trust_properties: [] as IBusinessTrustPropertiesResource[],
  fiduciary_mandates_statuses: [] as IGenericResource[],
  payment_plan_statuses: [] as IGenericResource[],
  business_trust_property_sale: [] as IBusinessTrustPropertySaleResource[],
  fiduciary_mandates: [] as IFiduciaryMandatesResource[],
  fiduciary_mandates_sale: [] as IFiduciaryMandatesResource[],
  business_trusts_property_withdrawals_states: [] as IResource[],
  property_transfer_statuses: [] as IResource[],
  means_of_payment: [] as IBusinessTrustMeansPayment[],
  business_inmobiliary: [] as IGenericResource[],
  collection_structure: [] as IGenericResource[],
  business_budget: [] as IBusinessBudget[],
  business_trusts_derivate_contracting:
    [] as ITrustBusinessDerivativeContracting[],
  payment_concept_structure: [] as IResource[],
  accounts_payable_closing: [] as IGenericResource[],
  business_offices: [] as IGenericResource[],
  budget_mhcp_codes: [] as IGenericResource[],
  banking_network_upload_business_trusts: [] as ISelectorResources[],
  accounts_payables: [] as IAccountsPayables[],
  business_trust_accounting: [] as IBusinessTrustResource[],
  business_trusts_uge_impairment: [] as ISelectorResources[],
  fiscal_responsibility: [] as IBusinessTrustResource[],
  business_trust_only_subtypes: [] as IResource[],
  business_trust_participants: [] as IBusinessTrustParticipantResource[],
  business_trust_account_structures: [] as IBusinessTrustAccount[],
  business_trust_account_structure_options: [] as IBusinessTrustAccount[],
  business_trusts_currency: [] as IBusinessTrustCurrencyOption[],
})

export const useTrustBusinessResourcesV1 = defineStore(
  'trust-business-resources-v1',
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
      assignMapIdName(resources: [], key: string | undefined) {
        if (!key) return
        ;(this as any)[key] =
          resources.map((item: ISelectorResources | IResource) => ({
            ...item,
            value: item.id,
            label: `${item.name}`,
          })) || []
      },
      assignBusinessTrusts(business_trusts: []) {
        this.extend_business = business_trusts.map((item: IResource) => ({
          ...item,
          label: `${item.business_code} - ${item.name}`,
          value: item.id ?? '',
        }))
        this.business_trusts = business_trusts.map(
          (item: ISelectorResources) => ({
            ...item,
            label: `${item.business_code} - ${item.name}`,
            value: item.id,
            code: item.business_code,
          })
        )
        this.business_trusts_with_id = business_trusts.map(
          (item: ISelectorResources) => ({
            label: `${item.id} - ${item.name}`,
            value: item.id ?? '',
            code: item.business_code ?? '',
            description: item.description ?? '',
            id: item.id,
          })
        )
        this.business_trusts_with_code = business_trusts.map(
          (item: ISelectorResources) => ({
            label: `${item.business_code} - ${item.name}`,
            value: item.id,
          })
        )

        this.business_trusts_only_code_in_label = business_trusts.map(
          (item: ISelectorResources) => ({
            ...item,
            label: `${item.business_code}`,
            value: item.id,
          })
        )

        this.business_trusts_value_is_code = business_trusts.map(
          (item: ISelectorResources) => ({
            ...item,
            label: `${item.business_code} - ${item.name}`,
            value: item.business_code,
            name: item.name,
          })
        )
        this.business_trusts_currency = business_trusts.map(
          (item: IBusinessTrustCurrencyOption) => ({
            ...item,
            value: item.id,
            label: item.account?.functional_business_currency || 'N/A',
          })
        )
      },
      assignUsers(users: []) {
        this.users =
          users.map((user: ITrustBusinessUserResource) => ({
            ...user,
            value: user.id ?? '',
            label: `${user.name ?? ''} ${user.last_name ?? ''}`,
            status_id: user.status_id,
          })) ?? []

        this.users_with_document =
          users.map((user: ITrustBusinessUsers) => ({
            ...user,
            value: user.id ?? '',
            label: `${user.document?.number ?? ''} - ${user.name ?? ''} ${
              user.last_name ?? ''
            }`,
            full_label: `${user.name ?? ''} ${user.last_name ?? ''}`,
            status_id: user.status_id,
          })) ?? []

        this.users_with_document_and_abbreviation =
          users.map((user: ITrustBusinessUsers) => ({
            ...user,
            value: user.id ?? '',
            label: `${user.document?.abbreviation ?? ''} - ${
              user.document?.number ?? ''
            } - ${user.name ?? ''} ${user.last_name ?? ''}`,
            full_label: `${user.name ?? ''} ${user.last_name ?? ''}`,
            status_id: user.status_id,
          })) ?? []
      },
      assignBusinessTrustChangeStatus(business_trust_change_status: []) {
        this.business_trust_change_status =
          business_trust_change_status.map((item: ISelectorResources) => ({
            value: item.id,
            label: item.status,
          })) ?? []
      },
      assignCashFlowStructure(cash_flow_structure: []) {
        this.cash_flow_structures = cash_flow_structure.map(
          (item: IResource) => {
            return {
              ...item,
              value: item.id ?? '',
              label: `${item.code} - ${item.purpose}`,
            }
          }
        )
      },
      assignCollectionStructure(collection_structure: []) {
        this.collection_structure = collection_structure.map(
          (item: IResource) => {
            return {
              ...item,
              value: item.id ?? '',
              label: `${item.code} - ${item.purpose}`,
            }
          }
        )
      },
      assignThirdParties(third_parties: []) {
        this.business_trust_third_parties =
          third_parties.map((item: ISaleRealStateResource) => {
            const docType = (item.document_type?.abbreviation ?? '').padEnd(
              3,
              ' '
            )
            const doc = (item.document ?? '').padEnd(15, ' ')
            const name = (item.name ?? '').toUpperCase()

            return {
              ...item,
              document_type: item.document_type
                ? {
                    id: item.document_type.id,
                    name: item.document_type.name,
                    abbreviation: item.document_type.abbreviation,
                  }
                : undefined,
              description: docType,
              value: item.id ?? '',
              label: `${docType} ${doc} ${name}`,
            }
          }) ?? []

        this.nit_agents =
          third_parties.map((item: IDocumentResource) => {
            const docType = (item.document_type?.abbreviation ?? '').padEnd(
              3,
              ' '
            )
            const doc = (item.document ?? '').padEnd(15, ' ')
            const name = (item.name ?? '').toUpperCase()

            return {
              ...item,
              value: item.document,
              label: `${docType} ${doc} ${name}`,
            }
          }) ?? []

        this.nit_agents_v2 =
          third_parties.map((item: IDocumentResource) => {
            const docType = (item.document_type?.abbreviation ?? '').padEnd(
              3,
              ' '
            )
            const doc = (item.document ?? '').padEnd(15, ' ')
            const name = (item.name ?? '').toUpperCase()

            return {
              ...item,
              value: item.id ?? '',
              label: `${docType} ${doc} ${name}`,
            }
          }) ?? []
      },
      assignBusinessTrustStatuses(business_trust_statuses: []) {
        this.business_trust_statuses =
          business_trust_statuses.map((item: ISelectorResources) => ({
            value: item.id,
            label: item.status,
          })) ?? []
      },
      assignBusinessTrustStatusesExtend(business_trust_statuses_extend: []) {
        this.business_trust_statuses_extend =
          business_trust_statuses_extend.map((item: ISelectorResources) => ({
            value: item.id,
            label: item.status,
          })) ?? []
      },
      assignBusinessTrustTypes(business_trust_types: []) {
        this.business_trust_types =
          business_trust_types.map((item: ISelectorResources) => ({
            label: `${item.indice} - ${item.name}`,
            value: item.id ?? null,
          })) ?? []
      },
      assignBusinessTrustRegisterTypes(business_trust_register_types: []) {
        this.business_trust_register_types = business_trust_register_types ?? []
      },
      assignBusinessTrustSubTypes(business_trust_subtypes: []) {
        this.business_trust_subtypes =
          business_trust_subtypes.map(
            (item: ISelectorResources): IBusinessSubTypeResource => ({
              label: `${item.indice} - ${item.name}`,
              value: item.id ?? null,
              business_type_id: item.business_type_id ?? null,
            })
          ) ?? []

        this.business_trust_only_subtypes =
          business_trust_subtypes.map(
            (item: ISelectorResources): IBusinessSubTypeResource => ({
              label: `${item.indice} - ${item.name}`,
              value: item.id ?? null,
              business_type_id: item.business_type_id ?? null,
            })
          ) ?? []
      },
      assignAccountStructures(account_structures: []) {
        this.account_structures =
          account_structures.map((item: ISelectorResources) => ({
            label: `${item.code} - ${item.purpose}`,
            value: item.id ?? null,
          })) ?? []
      },
      assignCostCenterStructures(cost_centers_structures: []) {
        this.cost_centers_structures =
          cost_centers_structures.map((item: ISelectorResources) => ({
            label: `${item.code} - ${item.purpose}`,
            value: item.id,
          })) ?? []
      },
      assignStatusAccounting(status_accounting: []) {
        this.status_accounting_trust_business =
          status_accounting.map((item: ISelectorResources) => ({
            label: item.status,
            value: item.id,
          })) ?? []
      },
      assignBusinessTrustFideicoType(business_trust_fideico_types: []) {
        this.business_trust_fideico_types =
          business_trust_fideico_types.map((item: ISelectorResources) => ({
            label: `${item.indice} - ${item.name}`,
            value: item.id,
          })) ?? []
      },
      assignBusinessTrustSocietyTypes(business_trust_society_types: []) {
        this.business_trust_society_types =
          business_trust_society_types.map((item: ISelectorResources) => ({
            label: `${item.indice} - ${item.name}`,
            value: item.id,
          })) ?? []
      },
      assignMovementCodesNatures(movement_codes_natures: []) {
        this.movement_codes_natures =
          movement_codes_natures?.map((item: IResource) => ({
            ...item,
            value: item.description ?? '',
            label: `${item.code} - ${item.description}`,
          })) ?? []
      },
      assignMovementCodesTypes(movement_codes_types: []) {
        this.movement_codes_types =
          movement_codes_types?.map((item: IResource) => ({
            ...item,
            value: item.description ?? '',
            label: `${item.code} - ${item.description}`,
          })) ?? []
      },
      assignFundMovements(funds_movements: []) {
        this.funds_movements =
          funds_movements?.map((item: IResource) => ({
            ...item,
            value: item.id ?? 0,
            label: `${item.code} - ${item.description}`,
          })) ?? []
      },
      assignMovementCodesCancellationCodes(movement_codes: []) {
        this.movement_codes_cancellation_codes =
          movement_codes?.map((item: IResource) => ({
            ...item,
            value: item.id ?? 0,
            label: `${item.description}`,
          })) ?? []

        this.movement_codes_parameters =
          movement_codes?.map((item: IResource) => ({
            ...item,
            value: item.id ?? '',
            label: `${item.code} - ${item.description}`,
          })) ?? []
      },
      assignGoodClassParameters(params_good_class: []) {
        this.params_good_class = params_good_class ?? []
      },
      assignGoodTypeParameters(params_good_type: []) {
        this.params_good_type = params_good_type ?? []
      },
      assignNatureParameters(params_nature: []) {
        this.params_nature = params_nature ?? []
      },
      assignAuxiliaryTypeParameters(params_auxiliary_type: []) {
        this.params_auxiliary_type =
          params_auxiliary_type?.map((item: IResource) => ({
            ...item,
            value: item.code ?? '',
            label: `${item.description ?? ''}`,
          })) ?? []
      },
      assignAccountingAccountParameters(params_accounting_account: []) {
        this.params_accounting_account =
          params_accounting_account?.map((item: IResource) => ({
            ...item,
            value: item.id ?? '',
            label: `${item.code} - ${item.name}`,
          })) ?? []
      },
      assignSubReceiptTypesParameters(sub_receipt_types: []) {
        this.sub_receipt_types =
          sub_receipt_types?.map((item: IResource) => ({
            ...item,
            value: item.id ?? '',
            label: `${item.code} - ${item.name}`,
          })) ?? []
      },
      assignReceiptTypesParameters(receipt_types: []) {
        this.receipt_types =
          receipt_types?.map((item: IResource) => ({
            ...item,
            value: item.id ?? '',
            label: `${item.code} - ${item.name}`,
          })) ?? []
      },
      assignDocumentTypes(document_types: []) {
        this.document_types =
          document_types?.map((item: IResource) => ({
            ...item,
            value: item.id ?? '',
            label: `${item.document_code} - ${item.document_description}`,
          })) ?? []
      },
      assignDocumentStructures(document_structures: []) {
        this.document_structures =
          document_structures?.map(
            (item: IDocumentStructuresForCharacteristics) => ({
              ...item,
              value: item.id ?? '',
              label: `${item.characteristic_code} - ${item.description}`,
            })
          ) ?? []
      },
      assignParticipantTypes(participant_types: []) {
        this.participant_types = participant_types ?? []
      },
      assignParticipantTransferStatus(participant_transfer_status: []) {
        if (!Array.isArray(participant_transfer_status)) return
        this.participant_transfer_status =
          participant_transfer_status.map(
            (item: IParticipantTransferStatusResource) => ({
              value: item.id ?? '',
              label: item.status,
            })
          ) ?? []
      },
      assignDocumentStructureType(document_structure_type: []) {
        this.document_structure_type = document_structure_type ?? []
      },
      assignProjectType(project_type: []) {
        this.project_type = project_type ?? []
      },
      assignDevelopmentType(development_type: []) {
        this.development_type = development_type ?? []
      },
      assignBaseCalculationProperty(base_calculation_property: []) {
        this.base_calculation_property = base_calculation_property ?? []
      },
      assignAssociatedFinancing(associated_financing: []) {
        this.associated_financing = associated_financing ?? []
      },
      assignBusinessTrustGuarantee(business_trust_guarantee: []) {
        this.business_trust_guarantee =
          business_trust_guarantee?.map((item: IResource) => ({
            ...item,
            value: item.id ?? '',
            label: `${item.guarantee_type} - ${item.description}`,
          })) ?? []
      },
      assignBusinessTrustPolicy(business_trust_policy: []) {
        this.business_trust_policy =
          business_trust_policy?.map((item: IResource) => ({
            ...item,
            value: item.id ?? '',
            label: `${item.policy_number} - ${item.policy_type}`,
          })) ?? []
      },

      assignPolicyTypes(policy_types: []) {
        this.policy_types = policy_types ?? []
      },
      assignPolicyRecordStatus(policies_record_status: []) {
        this.policies_record_status = policies_record_status.map(
          (item: IParticipantTransferStatusResource) => {
            return {
              ...item,
              value: item.id ?? '',
              label: `${item.status}`,
            }
          }
        )
      },
      assignPolicyStatus(policies_status: []) {
        this.policies_status = policies_status.map(
          (item: IParticipantTransferStatusResource) => {
            return {
              ...item,
              value: item.id ?? '',
              label: `${item.status}`,
            }
          }
        )
      },
      assignPolicyPaymentMehods(policy_payment_methods: []) {
        this.policy_payment_methods = policy_payment_methods ?? []
      },
      assignCoins(coins: []) {
        this.coins = coins ?? []
      },
      assignPolicyInsurers(policy_insurers: []) {
        this.policy_insurers =
          policy_insurers.map((item: IDocumentResource) => {
            const docType = (item.document_type?.abbreviation ?? '').padEnd(
              3,
              ' '
            )
            const doc = (item.document ?? '').padEnd(15, ' ')
            const name = (item.name ?? '').toUpperCase()
            return {
              ...item,
              description: docType,
              value: item.id ?? '',
              label: `${docType} ${doc} ${name}`,
            }
          }) ?? []

        this.policy_insurers_with_id = policy_insurers.map(
          (item: IDocumentResource) => {
            return {
              ...item,
              label: `${item.id} - ${item.name}`,
              value: item.id ?? '',
            }
          }
        )
      },
      assignGuaranteesStatus(guarantees_status: []) {
        this.guarantees_status = guarantees_status.map(
          (item: IParticipantTransferStatusResource) => {
            return {
              ...item,
              value: item.id ?? '',
              label: `${item.status}`,
            }
          }
        )
      },
      assignGuaranteesRecordStatus(guarantees_record_status: []) {
        this.guarantees_record_status = guarantees_record_status.map(
          (item: IParticipantTransferStatusResource) => {
            return {
              ...item,
              value: item.id ?? '',
              label: `${item.status}`,
            }
          }
        )
      },
      assignGuaranteesTypes(guarantees_types: []) {
        this.guarantees_types = guarantees_types ?? []
      },
      assignProjectStatus(project_status: []) {
        this.project_status =
          project_status.map((item: ISelectorResources) => ({
            label: item.status ?? null,
            value: item.id ?? null,
          })) ?? []
      },
      assignEquilibriumPointStatuses(equilibrium_point_statuses: []) {
        this.equilibrium_point_statuses =
          equilibrium_point_statuses.map((item: ISelectorResources) => ({
            label: item.status ?? null,
            value: item.id ?? null,
          })) ?? []
      },
      assignEquilibriumPointsBusinessTrust(
        equilibrium_points_business_trust: []
      ) {
        this.equilibrium_points_business_trust =
          equilibrium_points_business_trust.map((item: ISelectorResources) => ({
            ...item,
            label: item.name ?? null,
            value: item.id ?? null,
          })) ?? []
      },
      assignEquilibriumPointsRealEstateProject(
        equilibrium_points_real_estate_project: []
      ) {
        this.equilibrium_points_real_estate_project =
          equilibrium_points_real_estate_project.map(
            (item: IEquilibriumPointResource) => ({
              ...item,
              label: item.project_name ?? '',
              value: item.id ?? 2,
            })
          ) ?? []
      },
      assignCharacteristicDocument(characteristic_document: []) {
        this.characteristic_document =
          characteristic_document.map((item: IEquilibriumPointResource) => ({
            ...item,
            label: `${item.document_code} - ${item.document_description}`,
            value: item.id ?? '',
          })) ?? []
      },
      assignGeneralOrder(general_order: []) {
        this.general_order =
          general_order.map((item: IEquilibriumPointResource) => ({
            ...item,
            label: item.name ?? '',
            value: item.id ?? '',
          })) ?? []
      },
      assignBusinessTrustRealEstateProject(
        business_trust_real_estate_project: []
      ) {
        this.business_trust_real_estate_project =
          business_trust_real_estate_project?.map(
            (item: IBusinessTrustRealEstateProjectResource) => ({
              ...item,
              value: item.id ?? '',
              label: `${item.project_type} - ${item.project_name}`,
            })
          ) ?? []
      },
      assignProjectStage(project_stage: []) {
        this.project_stage =
          project_stage?.map((item: IProjectStageResource) => ({
            ...item,
            total_value: `${item.value}`,
            value: item.id ?? '',
            label: `${item.stage_number} - ${item.observations}`,
          })) ?? []
      },
      assignBusinessTrustProperties(business_trust_properties: []) {
        this.business_trust_properties =
          business_trust_properties?.map(
            (item: IBusinessTrustPropertiesResource) => ({
              ...item,
              total_value: `${item.value}`,
              value: item.id ?? '',
              label: `${item.nomenclature}`,
            })
          ) ?? []
      },
      assignBusinessTrustPropertyWithdrawlsStates(
        business_trusts_property_withdrawals_states: []
      ) {
        this.business_trusts_property_withdrawals_states =
          business_trusts_property_withdrawals_states?.map(
            (item: IBusinessTrustPropertiesResource) => ({
              ...item,
              value: item.id ?? '',
              label: `${item.status}`,
            })
          ) ?? []
      },
      assignBusinessTrustPropertyTransferStatuses(
        property_transfer_statuses: []
      ) {
        this.property_transfer_statuses =
          property_transfer_statuses?.map(
            (item: IBusinessTrustPropertiesResource) => ({
              ...item,
              value: item.id ?? '',
              label: `${item.status}`,
            })
          ) ?? []
      },
      assignMeansPayment(means_of_payment: []) {
        this.means_of_payment =
          means_of_payment.map((item: IBusinessTrustMeansPayment) => ({
            label: `${item.type_mean_of_payments} ${item.transaction_type} - ${item.description}`,
            value: item.id ?? '',
          })) ?? []
      },
      assignFiduciaryStatuses(fiduciary_mandates_statuses: []) {
        this.fiduciary_mandates_statuses =
          fiduciary_mandates_statuses.map((item: ISelectorResources) => ({
            value: item.id ?? '',
            label: item.status ?? '',
          })) ?? []
      },
      assignPaymentPlanStatuses(payment_plan_statuses: []) {
        this.payment_plan_statuses =
          payment_plan_statuses.map((item: IStatusResource) => ({
            value: item.id ?? '',
            label: item.status ?? '',
          })) ?? []
      },
      assignBusinessTrustPropertySale(business_trust_property_sale: []) {
        this.business_trust_property_sale =
          business_trust_property_sale?.map(
            (item: IBusinessTrustPropertySaleResource) => ({
              ...item,
              value: item.id ?? '',
              label: item.nomenclature?.nomenclature ?? '',
            })
          ) ?? []
      },
      assignFiduciaryMandates(fiduciary_mandates: []) {
        this.fiduciary_mandates =
          fiduciary_mandates?.map((item: IFiduciaryMandatesResource) => ({
            ...item,
            value: item.id ?? '',
            label: item.name ?? '',
          })) ?? []

        this.fiduciary_mandates_sale =
          fiduciary_mandates?.map((item: IFiduciaryMandatesResource) => ({
            ...item,
            value: item.id ?? '',
            label: item.mandate_code ?? '',
          })) ?? []
      },

      assignRealProyectStatus(project_status: []) {
        this.project_status = project_status.map(
          (item: IParticipantTransferStatusResource) => {
            return {
              ...item,
              value: item.id ?? '',
              label: item.status ?? '',
            }
          }
        )
      },

      assignBusinessInmobiliary(business_inmobiliary: []) {
        this.business_inmobiliary =
          business_inmobiliary.map((item: IBusinessTrustExtended) => ({
            ...item,
            label: `${item.business_code} - ${item.name}`,
            value: item.id ?? '',
          })) ?? []
      },

      assignBusinessBudget(business_budget: []) {
        this.business_budget =
          business_budget.map((item: IBusinessBudget) => ({
            ...item,
            label: `${item.validity}`,
            value: item.validity,
          })) ?? []
      },

      assignBusinessTrustsDerivateContracting(
        business_trusts_derivate_contracting: []
      ) {
        this.business_trusts_derivate_contracting =
          business_trusts_derivate_contracting.map(
            (item: ITrustBusinessDerivativeContracting) => ({
              ...item,
              label: `${item.business_code} - ${item.name}`,
              value: item.id ?? '',
            })
          ) ?? []
      },

      assignPaymentConceptStructure(payment_concept_structure: []) {
        this.payment_concept_structure =
          payment_concept_structure.map((item: IResource) => ({
            ...item,
            label: `${item.code} - ${item.purpose}`,
            value: item.id ?? '',
          })) ?? []
      },

      assignBusinessOffices(business_offices: []) {
        this.business_offices =
          business_offices.map((item: IResource) => ({
            ...item,
            label: `${item.name}`,
            value: item.id ?? '',
          })) ?? []
      },

      assignAccountsPayableClosing(accounts_payable_closing: []) {
        this.accounts_payable_closing = accounts_payable_closing ?? []
      },

      assignMhcpCodes(budget_mhcp_codes: []) {
        this.budget_mhcp_codes =
          budget_mhcp_codes.map((item: IGenericResource) => ({
            ...item,
            label: `${item.id} - ${item.name}`,
            value: item.id ?? '',
          })) ?? []
      },

      assignBussinessByType(banking_network_upload_business_trusts: never[]) {
        this.banking_network_upload_business_trusts =
          banking_network_upload_business_trusts.map(
            (item: ISelectorResources) => ({
              ...item,
              label: `${item.business_code} - ${item.name}`,
              value: item.id,
            })
          )
      },

      assignAccountsPayables(accounts_payables: []) {
        this.accounts_payables = accounts_payables.map(
          (item: IAccountsPayables) => ({
            ...item,
            label: `${item.accounting_structure.code} - ${item.accounting_structure.purpose}`,
            value: item.accounting_structure.id,
          })
        )
      },

      assignBussinessTrustAccounting(business_trust_accounting: []) {
        this.business_trust_accounting = business_trust_accounting.map(
          (item: IBusinessTrustResource) => ({
            ...item,
            label: item.cost_center_structure_direct
              ? `${item.cost_center_structure_direct?.code ?? ''} - ${
                  item.cost_center_structure_direct?.purpose ?? ''
                }`
              : String(item.id),
            value: item.id ?? '',
          })
        )
      },

      assingbusiness_trusts_uge_impairment(business_trusts_uge_impairment: []) {
        this.business_trusts_uge_impairment =
          business_trusts_uge_impairment.map((item: ISelectorResources) => ({
            ...item,
            value: item.id ?? '',
            label: item.label,
          })) ?? []
      },
      assignFiscalResponsability(fiscal_responsibility: []) {
        this.fiscal_responsibility = fiscal_responsibility.map(
          (item: IBusinessTrustResource) => ({
            ...item,
            value: item.description ?? '',
            label: item.description ?? '',
          })
        )
      },
      assignBusinessTrustParticipants(
        participants: IBusinessTrustParticipantResource[]
      ) {
        this.business_trust_participants = participants.map((item) => ({
          ...item,
          label: `${item.business_trust.business_code} - ${item.business_trust.name}`,
          value: item.business_trust.id,
          business_trust_id: item.business_trust.id,
          percentage: item.percentage_participation,
        }))
      },
      loadTrustessForBusiness() {
        this.business_trusts_participants_for_business =
          this.business_trust_participants.map((item) => ({
            ...item,
            label: `${item.business_trust.business_code} - ${item.business_trust.name}`,
            value: item.business_trust.id,
            business_trust_id: item.business_trust.id,
            percentage: item.percentage_participation,
          }))
      },
      loadTrustessForThirdParty() {
        this.business_trusts_participants_for_third_party =
          this.business_trust_participants.map((item) => ({
            ...item,
            label: `${item.third_party.document} - ${item.third_party.name}`,
            value: item.third_party.id,
            business_trust_id: item.business_trust.id,
            percentage: item.percentage_participation,
          }))
      },
      assignBusinessCenterCost(
        business_trust_account_structures: IBusinessTrustFixed[]
      ) {
        this.business_trust_account_structures =
          business_trust_account_structures.map((item) => {
            // Crear el label concatenando todos los centros de costo
            const costCentersLabel = item.cost_center_structure
              .map((center) => `${center.code} - ${center.name}`)
              .join(' | ')

            return {
              ...item,
              label: costCentersLabel || 'Sin centros de costo',
              value: item.id,
            }
          })
      },

      async getResources(params: string) {
        const customHandlers: Record<
          string,
          (value: any, key: string | undefined) => void
        > = {
          users: this.assignUsers,
          business_trusts: this.assignBusinessTrusts,
          business_trust_change_status: this.assignBusinessTrustChangeStatus,
          cash_flow_structure: this.assignCashFlowStructure,
          third_parties: this.assignThirdParties,
          business_trust_statuses: this.assignBusinessTrustStatuses,
          business_trust_statuses_extend:
            this.assignBusinessTrustStatusesExtend,
          business_trust_types: this.assignBusinessTrustTypes,
          business_trust_register_types: this.assignBusinessTrustRegisterTypes,
          business_trust_subtypes: this.assignBusinessTrustSubTypes,
          account_structures: this.assignAccountStructures,
          cost_centers_structures: this.assignCostCenterStructures,
          status_accounting: this.assignStatusAccounting,
          business_trust_fideico_types: this.assignBusinessTrustFideicoType,
          business_trust_society_types: this.assignBusinessTrustSocietyTypes,
          movement_codes_natures: this.assignMovementCodesNatures,
          movement_codes_types: this.assignMovementCodesTypes,
          funds_movements: this.assignFundMovements,
          movement_codes: this.assignMovementCodesCancellationCodes,
          movement_codes_parameters: this.assignMovementCodesCancellationCodes,
          params_good_class: this.assignGoodClassParameters,
          params_good_type: this.assignGoodTypeParameters,
          params_nature: this.assignNatureParameters,
          params_auxiliary_type: this.assignAuxiliaryTypeParameters,
          params_accounting_account: this.assignAccountingAccountParameters,
          sub_receipt_types: this.assignSubReceiptTypesParameters,
          receipt_types: this.assignReceiptTypesParameters,
          document_types: this.assignDocumentTypes,
          document_structures: this.assignDocumentStructures,
          participant_types: this.assignParticipantTypes,
          participant_transfer_status: this.assignParticipantTransferStatus,
          project_type: this.assignProjectType,
          development_type: this.assignDevelopmentType,
          base_calculation_property: this.assignBaseCalculationProperty,
          associated_financing: this.assignAssociatedFinancing,
          business_trust_guarantee: this.assignBusinessTrustGuarantee,
          business_trust_policy: this.assignBusinessTrustPolicy,
          policy_types: this.assignPolicyTypes,
          policies_record_status: this.assignPolicyRecordStatus,
          policies_status: this.assignPolicyStatus,
          policy_payment_methods: this.assignPolicyPaymentMehods,
          coins: this.assignCoins,
          policy_insurers: this.assignPolicyInsurers,
          guarantees_status: this.assignGuaranteesStatus,
          guarantees_types: this.assignGuaranteesTypes,
          guarantees_record_status: this.assignGuaranteesRecordStatus,
          equilibrium_point_statuses: this.assignEquilibriumPointStatuses,
          equilibrium_points_business_trust:
            this.assignEquilibriumPointsBusinessTrust,
          equilibrium_points_real_estate_project:
            this.assignEquilibriumPointsRealEstateProject,
          characteristic_document: this.assignCharacteristicDocument,
          general_order: this.assignGeneralOrder,
          business_trust_real_estate_project:
            this.assignBusinessTrustRealEstateProject,
          project_stage: this.assignProjectStage,
          business_trust_properties: this.assignBusinessTrustProperties,
          business_trusts_property_withdrawals_states:
            this.assignBusinessTrustPropertyWithdrawlsStates,
          means_of_payment: this.assignMeansPayment,
          fiduciary_mandates_statuses: this.assignFiduciaryStatuses,
          payment_plan_statuses: this.assignPaymentPlanStatuses,
          business_trust_property_sale: this.assignBusinessTrustPropertySale,
          fiduciary_mandates: this.assignFiduciaryMandates,
          project_status: this.assignRealProyectStatus,
          business_inmobiliary: this.assignBusinessInmobiliary,
          property_transfer_statuses:
            this.assignBusinessTrustPropertyTransferStatuses,
          collection_structure: this.assignCollectionStructure,
          business_budget: this.assignBusinessBudget,
          business_trusts_derivate_contracting:
            this.assignBusinessTrustsDerivateContracting,
          payment_concept_structure: this.assignPaymentConceptStructure,
          accounts_payable_closing: this.assignAccountsPayableClosing,
          business_offices: this.assignBusinessOffices,
          budget_mhcp_codes: this.assignMhcpCodes,
          banking_network_upload_business_trusts: this.assignBussinessByType,
          accounts_payables: this.assignAccountsPayables,
          business_trust_accounting: this.assignBussinessTrustAccounting,
          business_trusts_uge_impairment:
            this.assingbusiness_trusts_uge_impairment,
          fiscal_responsibility: this.assignFiscalResponsability,
          business_trust_only_subtypes: this.assignBusinessTrustSubTypes,
          business_trust_participants: this.assignBusinessTrustParticipants,
          business_trust_account_structures: this.assignBusinessCenterCost,
        }

        await executeApi()
          .get(`${TRUST_BUSINESS_API_URL}/utils/select-tables${params}`)
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
    persist: true,
  }
)
