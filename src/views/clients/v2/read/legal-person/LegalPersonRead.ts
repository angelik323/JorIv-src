/* eslint-disable @typescript-eslint/no-explicit-any */

// Vue - Pinia - Router - Quasar
import { ref, onBeforeMount, onBeforeUnmount } from 'vue'
import { storeToRefs } from 'pinia'
import { useRoute } from 'vue-router'

// Composables
import { useMainLoader, useGoToUrl, useUtils } from '@/composables'

// Interfaces
import { ITabs } from '@/interfaces/customs/Tab'
import {
  ClientPersonType,
  ClientApiRouteType,
  PersonApiRouteType,
  PersonType,
} from '@/interfaces/global/Clients'
import {
  IBaseLegalRepresentationItem,
  // IBaseLegalRepresentationItemResponse,
  ISettlementFormula,
  IBaseShareholdersForm,
  ILegalClientManager,
  ILegalPerson,
} from '@/interfaces/customs/clients/Clients'
import {
  IClientIndirectBasicForm,
  IClientLegalPersonIndirectTributaryForm,
  IInvestorForm,
  IClientLegalPersonIndirectTributaryResponse,
  ICustomerRequest,
  IThirdPartyRequest,
  IAddressRequest,
  IContactRequest,
  IClientInversorRequest,
  IManagerIndirectResponse,
  IEconomicActivityCorporateForm,
  IBankAccountCorporateForm,
  IIndirectCorporateForm,
  IIndirectEconomicActivityCorporateResponse,
  IIndirectBankAccountCorporateResponse,
  IIndirectCorporateResponse,
  IDocumentIndirectForm,
  ILegalRepresentationIndirectResponse,
} from '@/interfaces/customs/clients/ClientIndirectLegalPerson'
import { IDirectCorporateForm } from '@/interfaces/customs/clients/ClientDirectLegalPerson'

// v1
import { IClientsContacts } from '@/interfaces/customs/Clients'

// Stores
import { useResourceManagerStore } from '@/stores/resources-manager'
import { useClientsStore } from '@/stores/clients'

const useLegalPersonRead = () => {
  const route = useRoute()
  const { openMainLoader } = useMainLoader()
  const { defaultIconsLucide } = useUtils()
  const { goToURL } = useGoToUrl()

  const { _getByIdAction, _clearDataManager } = useClientsStore('v2')
  const { client_person_type } = storeToRefs(useClientsStore('v2'))

  const { _getResources, _resetKeys } = useResourceManagerStore('v1')

  const legalClientId = +route.params.id

  const keys = {
    assets: [
      'third_party_request_types',
      'cities',
      'document_types_third_legal',
      'departments',
      'document_types_third_party_natural',
    ],
  }

  const formBasicInformation = ref<{
    validateForm: () => Promise<boolean> | null
  } | null>(null)
  const formLegalRepresentation = ref()
  const formTributary = ref()
  const formCorporateDirect = ref()
  const formCorporateIndirect = ref()
  const formShareholders = ref()
  const formManager = ref()
  const formInvestor = ref()
  const formDocumentsIndirect = ref()
  const personType = ref()

  const basicInformationDataForm = ref<IClientIndirectBasicForm | null>(null)
  const legalRepresentationDataForm = ref<IBaseLegalRepresentationItem | null>(
    null
  )
  const legalRepresentationDataList = ref<
    IBaseLegalRepresentationItem[] | null
  >(null)
  const tributaryDataForm = ref<IClientLegalPersonIndirectTributaryForm | null>(
    null
  )
  const directCorporateDataForm = ref<IDirectCorporateForm | null>(null)
  const indirectCorporateDataForm = ref<IIndirectCorporateForm | null>(null)
  const shareholdersDataForm = ref<IBaseShareholdersForm | null>(null)
  const managerDataForm = ref<ILegalClientManager | null>({
    board_directors: false,
    managers: [],
  })
  const investorIndirectDataForm = ref<IInvestorForm | null>(null)
  const documentIndirectForm = ref<IDocumentIndirectForm | null>(null)

  const headerProps = {
    title: 'Ver persona jurídica',
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
        label: 'Ver persona jurídica',
      },
      {
        label: `${legalClientId}`,
      },
    ],
    showBackBtn: true,
  }

  const tabs = ref<ITabs[]>([
    {
      name: 'information',
      label: 'Información básica',
      icon: defaultIconsLucide.bulletList,
      outlined: true,
      disable: false,
      show: true,
      required: false,
    },
    {
      name: 'legal_representation',
      label: 'Representante legal',
      icon: defaultIconsLucide.bulletList,
      outlined: true,
      disable: false,
      show: true,
      required: false,
    },
    {
      name: 'corporate',
      label: 'Corporativos',
      icon: defaultIconsLucide.corporative,
      outlined: true,
      disable: false,
      show: true,
      required: false,
    },
    {
      name: 'tributary',
      label: 'Tributario',
      icon: defaultIconsLucide.bulletList,
      outlined: true,
      disable: false,
      show: true,
      required: false,
    },
    {
      name: 'shareholders',
      label: 'Accionistas',
      icon: defaultIconsLucide.bankNote,
      outlined: true,
      disable: false,
      show: true,
      required: false,
    },
    {
      name: 'manager',
      label: 'Directivos',
      icon: defaultIconsLucide.bulletList,
      outlined: true,
      disable: false,
      show: true,
      required: false,
    },
    {
      name: 'investor',
      label: 'Inversionistas',
      icon: defaultIconsLucide.bulletList,
      outlined: true,
      disable: false,
      show: true,
      required: false,
    },
    {
      name: 'documents',
      label: 'Documentos',
      icon: defaultIconsLucide.bulletList,
      outlined: true,
      disable: false,
      show: true,
      required: false,
    },
  ])

  const tabActive = ref(tabs.value[0].name)

  const tabActiveIdx = ref(
    tabs.value.findIndex((tab) => tab.name === tabActive.value)
  )

  // --- Request Basic Information Tab (v2) ---
  const setValueBasicInformation = (
    customer: ICustomerRequest,
    thirdParty: IThirdPartyRequest,
    addresses: IAddressRequest[],
    contacts: IContactRequest[],
    legalPerson: ILegalPerson
  ): IClientIndirectBasicForm => {
    return {
      creation_date: customer.created_at,
      created_by: customer.created_by
        ? `${customer.created_by.name || ''} ${
            customer.created_by.last_name || ''
          }`.trim()
        : null,
      updated_date: customer.updated_at,
      updated_by: customer.updated_by
        ? `${customer.updated_by.name || ''} ${
            customer.updated_by.last_name || ''
          }`.trim()
        : null,
      type_client: thirdParty.third_party_category,
      request_type: customer.request_type || null,
      document_type: thirdParty.document_type_id || null,
      check_digit: thirdParty.validator_digit || null,
      document_number: thirdParty.document || null,
      classification_company: legalPerson.classification_company || null,
      name: legalPerson.business_name || null,
      nature_third_party: legalPerson.nature || null,
      constitution_country: legalPerson.country || null,
      date_incorporation: legalPerson.constitution_date || null,
      country: addresses[0]?.country_id || null,
      department: addresses[0]?.department_id || null,
      city: addresses[0]?.city_id || null,
      address: addresses[0]?.address || null,
      email:
        contacts.find((c) => c.contact_type === 'email')?.contact_value || null,
      phone:
        contacts.find((c) => c.contact_type === 'phone')?.contact_value || null,
      mobile:
        contacts.find((c) => c.contact_type === 'mobile')?.contact_value ||
        null,
      sending_correspondence: legalPerson.sending_correspondence || null,
      status_id: customer.status_id || null,
    }
  }

  // --- Legal representation Tab (v2) ---
  const setValueLegalRepresentation = (
    representatives: ILegalRepresentationIndirectResponse[]
  ): IBaseLegalRepresentationItem[] => {
    return representatives.map((rep) => ({
      id: rep.id ?? null,
      third_party_id: rep.third_party_id ?? null,
      third_party_category: rep.third_party_category ?? null,
      document_type_id: rep.document_type?.id ?? null,
      document: rep.document ?? null,
      natural_person: {
        name: rep.natural_person?.name ?? null,
        middle_name: rep.natural_person?.middle_name ?? null,
        last_name: rep.natural_person?.last_name ?? null,
        second_last_name: rep.natural_person?.second_last_name ?? null,
        birth_date: rep.natural_person?.birth_date ?? null,
        issue_date: rep.natural_person?.issue_date ?? null,
      },
      address: rep.address?.address ?? null,
      country_id: rep.address?.country_id ?? null,
      department_id: rep.address?.department_id ?? null,
      city_id: rep.address?.city_id ?? null,
      postal_code: rep.address?.postal_code ?? null,
      tax_info: {
        has_different_nationality:
          rep.tax_info?.has_different_nationality ?? false,
        country_id: rep.tax_info?.country_id ?? null,
        nationality_id: rep.tax_info?.nationality_id ?? null,
        foreign_responsibility: rep.tax_info?.foreign_responsibility ?? false,
        branch_address: rep.tax_info?.address?.address ?? null,
        branch_country_id: rep.tax_info?.address?.country_id ?? null,
        tin: rep.tax_info?.tin ?? null,
      },
      pep_info: {
        is_pep: rep.pep_info?.is_pep ?? false,
        is_politician: rep.pep_info?.is_politician ?? false,
        is_pep_international: rep.pep_info?.is_pep_international ?? false,
        has_pep_relatives: rep.pep_info?.has_pep_relatives ?? false,
        position: rep.pep_info?.position ?? null,
        entity: rep.pep_info?.entity ?? null,
        date_entry: rep.pep_info?.date_entry ?? null,
        date_exit: rep.pep_info?.date_exit ?? null,
        pep_type_id: rep.pep_info?.pep_type_id ?? null,

        relatives: {
          full_name: rep.pep_info_relative?.full_name ?? null,
          relationship: rep.pep_info_relative?.relationship ?? null,
          position: rep.pep_info_relative?.position ?? null,
          entity: rep.pep_info_relative?.entity ?? null,
        },
      },
      has_beneficiary_treatment: rep.has_beneficiary_treatment ?? false,
      beneficiary_date: rep.beneficiary_date ?? null,
      status_id: rep.status_id ?? null,
    }))
  }

  // --- Corporate Tab - Indirect (v2) ---
  const mapIndirectEconomicActivitiesCorporate = (
    activities: IIndirectEconomicActivityCorporateResponse[]
  ): IEconomicActivityCorporateForm[] => {
    if (!activities || activities.length === 0) return []

    return activities.map((activity) => ({
      id: activity.id || null,
      economic_activity: Number(activity.ciiu_id) || null,
      economic_activity_code: activity.ciiu?.code || null,
      economic_activity_desc: activity.ciiu?.description || null,
      status: activity.status?.id || null,
      is_ciiu_primary: activity.is_main ?? false,
    }))
  }

  const mapIndirectBankAccountsCorporate = (
    accounts: IIndirectBankAccountCorporateResponse[]
  ): IBankAccountCorporateForm[] => {
    if (!accounts || accounts.length === 0) return []

    return accounts.map((account) => {
      const isBREB = account.account_type === 'bre_b'

      return {
        id: account.id || null,
        is_breb_key: isBREB,
        email: account.email_bre_b || null,
        identification_number: account.document_bre_b || null,
        mobile_number: account.mobile_bre_b || null,
        breb_key: account.key_bre_b || null,
        breb_keyword: account.password_bre_b || null,
        bank: account.bank_id || null,
        bank_name: account.bank || null,
        account_type: account.account_type || null,
        bank_account_number: account.account_number || null,
        branch: account.bank_branch_id || null,
        branch_name: account.bank_branch || null,
        status: account.status?.id || null,
        is_bank_account_primary: account.is_main ?? false,
      }
    })
  }

  const setValueIndirectCorporate = (
    data: IIndirectCorporateResponse
  ): IIndirectCorporateForm => {
    return {
      total_monthly_operational_income: data.total_operational_income || null,
      total_monthly_non_operational_income:
        data.total_non_operational_income || null,
      other_non_operational_income_concept:
        data.other_non_operational_income_concept || null,
      total_monthly_expenses: data.total_expenses || null,
      total_assets: data.assets || null,
      total_liabilities: data.liabilities || null,
      financial_information_cutoff_date: data.cutoff_date || null,
      source_of_funds: data.funding_source || null,
      another_source_of_funds: data.describe_funding_source || null,
      is_registered_issuer_subject_to_disclosure:
        data.is_registered_in_national_emission_registery ?? false,
      economic_activities: mapIndirectEconomicActivitiesCorporate(
        data.economic_activities || []
      ),
      bank_accounts: mapIndirectBankAccountsCorporate(data.bank_accounts || []),
    }
  }

  // --- Tributary Tab (v2) ---
  const setValueTributary = (
    taxInfo: IClientLegalPersonIndirectTributaryResponse
  ): IClientLegalPersonIndirectTributaryForm => ({
    files_tax_return: taxInfo.files_tax_return || false,
    files_foreign_taxes: taxInfo.files_foreign_taxes || false,
    giin_code: taxInfo.giin_code || '',
    is_branches: taxInfo.is_branches || false,
    description_economic_activity: taxInfo.description_economic_activity || '',
    country_id: taxInfo.country?.id || null,
    branch_country_id: taxInfo.branch_country?.id || null,
    branch_address: taxInfo.branch_address || '',
    settlement_formulas:
      taxInfo.settlement_formulas?.map((sf: ISettlementFormula) => ({
        id: sf.id,
        settlement_formula_id: sf.settlement_formula_id,
        is_main: sf.is_main,
      })) || [],
  })

  // --- Shareholders Tab (v2) ---
  // TODO: FALTA TIPADO RESPONSE
  const setValueShareholders = (data: any): IBaseShareholdersForm => {
    if (!data || data.length === 0) {
      return {
        has_shareholders: false,
        shareholders: [],
      }
    }

    return {
      has_shareholders: !!data?.shareholders?.length,
      shareholders:
        data?.shareholders?.map((it: any) => {
          const {
            shareholder_info,
            natural_person,
            legal_person,
            pep_info,
            tax_info,
          } = it

          const shareholder = {
            id: it.id,
            person_type: it.third_party_category ?? null,

            // InfoForm
            shareholder_type: shareholder_info?.shareholder_type_id ?? null,
            beneficial_owner_by_ownership:
              shareholder_info?.beneficiary_ownership ?? null,
            beneficial_owner_by_beneficiaries:
              shareholder_info?.beneficiary_benefits ?? null,
            participation_percent:
              shareholder_info?.participating_percentage ?? null,
            has_control_over_legal_entity:
              shareholder_info?.control_over_legal_person === 'Si',

            // ProfileForm
            document_type_id: it.document_type_id ?? null,
            document_number: it.document ?? null,
            social_reason: legal_person?.business_name ?? null,
            first_name: natural_person?.name ?? null,
            second_name: natural_person?.middle_name ?? null,
            first_last_name: natural_person?.last_name ?? null,
            second_last_name: natural_person?.second_last_name ?? null,
            expedition_date: natural_person?.issue_date ?? null,
            birth_country: natural_person?.birth_country_id ?? null,
            incorporation_country: legal_person?.country_id ?? null,
            expedition_country:
              natural_person?.document_issuance_country_id ?? null,
            birth_date: natural_person?.birth_date ?? null,
            postal_code: it.addresses?.[0]?.postal_code ?? null,
            country: shareholder_info?.country_id ?? null,
            department: shareholder_info?.department_id ?? null,
            city: shareholder_info.city_id ?? null,
            address: shareholder_info?.address ?? null,
            email_contact:
              it.contacts?.find(
                (it: IClientsContacts) => it.contact_type === 'email'
              )?.contact_value ?? null,
            beneficiary_date: shareholder_info?.beneficiary_date ?? null,
            tax_country: tax_info?.country_id ?? null,
            nationality: tax_info?.nationality_id ?? null,
            taxpayer_document_number: tax_info?.tin ?? null,
            tax_address: tax_info?.branch_address ?? null,
            legal_phone_number:
              it.contacts?.find(
                (it: IClientsContacts) => it.contact_type === 'phone'
              )?.contact_value ?? null,
            has_international_tax_responsibility:
              tax_info?.foreign_responsibility ?? null,
            has_only_foreign_tax_responsibility:
              tax_info?.has_tax_responsibility_outside_colombia ?? null,

            // PEPForm
            is_pep: pep_info?.is_pep ?? null,
            political_decree_830_2021: pep_info?.is_politician ?? null,
            is_representative_intl_org: pep_info?.is_international_pep ?? null,
            is_pep_international: pep_info?.is_pep_international ?? null,
            has_pep_relative: pep_info?.has_pep_relatives ?? null,
            related_pep_full_name: pep_info?.relatives?.[0]?.full_name ?? null,
            pep_relationship: pep_info?.relatives?.[0]?.relationship ?? null,
            position_held: pep_info?.relatives?.[0]?.position ?? null,

            // TributaryForm
            tributary_has_control_over_legal_entity:
              tax_info?.foreign_responsibility ?? null,
            tributary_country: tax_info?.country_id ?? null,
            giin_code: tax_info?.giin_code ?? null,
          }
          return shareholder
        }) ?? [],
    }
  }

  // --- Manager Tab (v2) ---
  const setValueManager = (
    data: IManagerIndirectResponse[]
  ): ILegalClientManager => {
    if (!data || data.length === 0) {
      return {
        board_directors: false,
        managers: [],
      }
    }

    return {
      board_directors: true,
      managers: data.map((m: IManagerIndirectResponse) => ({
        id: m.id,
        person_type: m.person_type ?? null,
        third_party_category: m.third_party_category ?? null,
        document_type_id: m.document_type?.id
          ? Number(m.document_type.id)
          : null,
        document: m.document ?? null,
        position: m.position ?? null,
        date_exit: m.pep_info?.date_exit ?? null,
        country_id: m.address?.country_id ?? null,
        department_id: m.address?.department_id ?? null,
        city_id: m.address?.city_id ?? null,
        address: m.address?.address ?? null,
        email: m.contact_info?.email ?? null,
        phone: m.contact_info?.phone ?? null,
        beneficiary_date: m.beneficiary_date ?? null,
        status_id: m.status_id ?? null,

        pep_info: { ...(m.pep_info || {}) },

        natural_person:
          m.third_party_category === PersonType.NATURAL
            ? {
                name: m.natural_person?.name ?? null,
                middle_name: m.natural_person?.middle_name ?? null,
                last_name: m.natural_person?.last_name ?? null,
                second_last_name: m.natural_person?.second_last_name ?? null,
                birth_country_id: m.natural_person?.birth_country_id ?? null,
                issue_date: m.natural_person?.issue_date ?? null,
              }
            : null,
        legal_person:
          m.third_party_category === PersonType.LEGAL
            ? {
                business_name: m.legal_person?.business_name ?? null,
                constitution_date: m.legal_person?.constitution_date ?? null,
              }
            : null,
      })),
    }
  }

  // --- Response Investor Tab (v2) ---
  const setValueInvestor = (data: IClientInversorRequest): IInvestorForm => {
    return {
      investor_rating: data?.investor_rating || '',
      quantitative_risk_rating: data?.quantitative_risk_rating || '',
      qualitative_risk_rating: data?.qualitative_risk_rating || '',
    }
  }

  // TODO: FALTA TIPADO
  const setValueDataLegalPersonIndirectResponse = (data: any) => {
    if (!data) return

    if (
      data.customer &&
      data.third_party &&
      data.addresses &&
      data.contacts &&
      data.legal_person
    ) {
      basicInformationDataForm.value = setValueBasicInformation(
        data.customer,
        data.third_party,
        data.addresses,
        data.contacts,
        data.legal_person
      )
    }

    if (data.legal_representatives?.length) {
      legalRepresentationDataList.value = setValueLegalRepresentation(
        data.legal_representatives
      )
    }

    if (data.financial_info) {
      indirectCorporateDataForm.value = setValueIndirectCorporate(
        data.financial_info
      )
    }

    if (data.tax_info) {
      tributaryDataForm.value = setValueTributary(data.tax_info)
      tributaryDataForm.value.fiscal_responsibility =
        data.third_party?.fiscal_responsibility || null
      tributaryDataForm.value.vat_responsibility =
        data.third_party?.vat_responsibility.toLowerCase() === 'Si'
          ? true
          : false
    }

    if (data.shareholders?.length) {
      shareholdersDataForm.value = setValueShareholders(data.shareholders)
    }

    if (data.board_members?.length) {
      managerDataForm.value = setValueManager(data.board_members)
    }

    if (data.investor) {
      investorIndirectDataForm.value = setValueInvestor(data.investor)
    }
    if (data.documents) {
      documentIndirectForm.value = {
        documents: data.documents,
      }
    }
  }

  const submitMap = {
    [ClientPersonType.LEGAL_DIRECT]: {
      apiRoute: ClientApiRouteType.CUSTOMERS,
      setValueData: setValueDataLegalPersonIndirectResponse,
    },

    [ClientPersonType.LEGAL_INDIRECT]: {
      apiRoute: ClientApiRouteType.INDIRECT_CUSTOMERS,
      setValueData: setValueDataLegalPersonIndirectResponse,
    },
  } as const

  const nextTab = async () => {
    tabActiveIdx.value = tabActiveIdx.value + 1
    tabActive.value = tabs.value[tabActiveIdx.value].name
  }

  const backTab = () => {
    tabActiveIdx.value = tabActiveIdx.value - 1
    tabActive.value = tabs.value[tabActiveIdx.value].name
  }

  const onSubmit = async () => {
    goToURL('ClientsList')
  }

  onBeforeMount(async () => {
    openMainLoader(true)

    _clearDataManager()

    personType.value =
      submitMap[client_person_type.value as keyof typeof submitMap]

    await _getResources(keys)

    const data = await _getByIdAction(
      legalClientId,
      personType.value.apiRoute,
      PersonApiRouteType.LEGAL_PERSON
    )
    personType.value.setValueData(data)

    openMainLoader(false)
  })

  onBeforeUnmount(() => {
    _resetKeys(keys)
  })

  return {
    headerProps,
    tabs,
    tabActive,
    tabActiveIdx,
    ClientPersonType,
    client_person_type,
    defaultIconsLucide,

    formBasicInformation,
    formLegalRepresentation,
    formCorporateDirect,
    formCorporateIndirect,
    formTributary,
    formShareholders,
    formManager,
    formInvestor,
    formDocumentsIndirect,

    basicInformationDataForm,
    legalRepresentationDataForm,
    legalRepresentationDataList,
    directCorporateDataForm,
    indirectCorporateDataForm,
    tributaryDataForm,
    shareholdersDataForm,
    managerDataForm,
    investorIndirectDataForm,
    documentIndirectForm,

    goToURL,
    nextTab,
    backTab,
    onSubmit,
  }
}

export default useLegalPersonRead
