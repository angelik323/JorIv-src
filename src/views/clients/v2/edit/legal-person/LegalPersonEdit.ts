/* eslint-disable @typescript-eslint/no-explicit-any */

// Vue - Pinia - Router - Quasar
import { ref, onBeforeMount, onBeforeUnmount } from 'vue'
import { storeToRefs } from 'pinia'
import { useRoute } from 'vue-router'

// Composables
import { useMainLoader, useGoToUrl, useUtils, useAlert } from '@/composables'

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
  ILegalClientManager,
  IBaseShareholdersForm,
  IBaseShareholdersRequest,
  ISettlementFormula,
  ILegalPerson,
} from '@/interfaces/customs/clients/Clients'
import {
  IClientIndirectBasicForm,
  IClientBasicRequest,
  IEconomicActivityCorporateForm,
  IEconomicActivityCorporateRequest,
  IIndirectEconomicActivityCorporateResponse,
  IBankAccountCorporateForm,
  IBankAccountCorporateRequest,
  IIndirectBankAccountCorporateResponse,
  IIndirectCorporateForm,
  IIndirectCorporateRequest,
  IIndirectCorporateResponse,
  IClientLegalPersonIndirectTributaryForm,
  IInvestorForm,
  IClientInversorRequest,
  IClientLegalPersonIndirectTributaryResponse,
  ICustomerRequest,
  IThirdPartyRequest,
  IAddressRequest,
  IContactRequest,
  IManagerIndirectResponse,
  ILegalRepresentationIndirectResponse,
  IDocumentIndirectForm,
  ILegalRepresentationIndirectRequest,
  IClientLegalPersonIndirectTributaryRequest,
} from '@/interfaces/customs/clients/ClientIndirectLegalPerson'
import {
  IClientDirectBasicForm,
  IClientBasicRequestDirect,
  IDirectCorporateForm,
  IDirectCorporateRequest,
} from '@/interfaces/customs/clients/ClientDirectLegalPerson'

// v1
import { IClientsContacts } from '@/interfaces/customs/Clients'

// Stores
import { useResourceManagerStore } from '@/stores/resources-manager'
import { useClientsStore } from '@/stores/clients'
import { useResourceStore } from '@/stores'

const useLegalPersonEdit = () => {
  const route = useRoute()
  const { openMainLoader } = useMainLoader()
  const { showAlert } = useAlert()
  const { defaultIconsLucide, cleanEmptyFields, boolToValue } = useUtils()
  const { goToURL } = useGoToUrl()
  const { getResources } = useResourceStore('v1')
  const { _getResources, _resetKeys } = useResourceManagerStore('v1')
  const { _getByIdAction, _updateAction, _clearDataManager } =
    useClientsStore('v2')
  const { client_person_type, isLegalPersonIndirect, data_manager_legal_form } =
    storeToRefs(useClientsStore('v2'))

  const legalClientId = +route.params.id

  const keysResourceV1 = ['countries']
  const keys = {
    assets: [
      'third_party_request_types',
      'document_types_third_legal',
      'third_party_natures',
      'ciius',
      'banks',
      'departments',
      'cities',
      'document_types_third_party_natural',
      'legal_people_company_classification',
      'legal_people_fund_sources',
      'fiscal_responsability',
    ],
    third_party: ['indirect_third_party_request_types'],
  }

  const headerProps = {
    title: 'Editar persona jurídica',
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
        label: 'Editar persona jurídica',
        route: 'LegalPersonEdit',
      },
      {
        label: `${legalClientId}`,
      },
    ],
  }

  const formBasicInformation = ref<{
    validateForm: () => Promise<boolean>
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

  const tabs = ref<ITabs[]>([
    {
      name: 'information',
      label: 'Información básica',
      icon: defaultIconsLucide.bulletList,
      outlined: true,
      disable: true,
      show: true,
      required: true,
    },
    {
      name: 'legal_representation',
      label: 'Representante legal',
      icon: defaultIconsLucide.representative,
      outlined: true,
      disable: true,
      show: true,
      required: true,
    },
    {
      name: 'corporate',
      label: 'Corporativos',
      icon: defaultIconsLucide.corporative,
      outlined: true,
      disable: true,
      show: true,
      required: true,
    },
    {
      name: 'tributary',
      label: 'Tributario',
      icon: defaultIconsLucide.squarePercentage,
      outlined: true,
      disable: true,
      show: true,
      required: true,
    },
    {
      name: 'shareholders',
      label: 'Accionistas',
      icon: defaultIconsLucide.bankNote,
      outlined: true,
      disable: true,
      show: true,
      required: false,
    },
    {
      name: 'manager',
      label: 'Directivos',
      icon: defaultIconsLucide.accountMultiple,
      outlined: true,
      disable: true,
      show: true,
      required: false,
    },
    {
      name: 'investor',
      label: 'Inversionistas',
      icon: defaultIconsLucide.badgeDollarSign,
      outlined: true,
      disable: true,
      show: true,
      required: false,
    },
    {
      name: 'documents',
      label: 'Documentos',
      icon: defaultIconsLucide.file,
      outlined: true,
      disable: true,
      show: true,
      required: true,
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
      constitution_country: legalPerson.country_id || null,
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

  // --- Request Investor Tab (v2) ---
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

    if (data.investor) {
      investorIndirectDataForm.value = setValueInvestor(data.investor)
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

    if (data.documents) {
      documentIndirectForm.value = {
        documents: data.documents,
      }
    }
  }

  // --- Basic Information Tab para enviar a actualizar(v2) ---
  const makeBasicInformationIndirectRequest = (
    form: IClientIndirectBasicForm
  ): IClientBasicRequest => {
    return {
      document_type_id: Number(form.document_type),
      document: form.document_number || '',
      validator_digit:
        form.check_digit !== null && form.check_digit !== ''
          ? String(form.check_digit)
          : null,
      status_id: Number(form.status_id),
      request_type: form.request_type || '',

      email: form.email || '',
      phone: form.phone || '',
      mobile: form.mobile || '',
      address: form.address || '',
      address_type: 'Principal',
      country_id: form.country,
      department_id: form.department !== 0 ? form.department : null,
      city_id: form.city !== 0 ? form.city : null,

      legal_person: {
        business_name: form.name || '',
        nature: String(form.nature_third_party || ''),
        constitution_date: form.date_incorporation || '',
        country_id: Number(form.constitution_country),
        classification_company: String(form.classification_company || ''),
        sending_correspondence: form.sending_correspondence || '',
      },
    }
  }

  const makeBasicInformationDirectRequest = (
    form: IClientDirectBasicForm,
    directCorpForm: IDirectCorporateForm
  ): IClientBasicRequestDirect => {
    return {
      document_type_id: Number(form.document_type),
      document: form.document_number || '',
      request_type: form.request_type || '',

      email: form.email || '',
      mobile: form.mobile || '',
      address: form.address || '',
      address_type: 'Principal',
      country_id: Number(form.country),
      department_id: Number(form.department),
      city_id: Number(form.city),
      sending_correspondence: form.sending_correspondence || '',

      legal_person: {
        business_name: form.name || '',
        nature: String(form.nature_third_party || ''),
        constitution_date: form.date_incorporation || '',
        country_id: Number(form.constitution_country),
        classification_company: directCorpForm.company_classification || '',
      },

      ciiu_id: directCorpForm.ciiu_code?.toString() ?? '',
    }
  }

  // --- Legal Representation Tab (v2) ---
  const makeLegalRepresentationRequest = (
    data: IBaseLegalRepresentationItem
  ): ILegalRepresentationIndirectRequest => {
    return {
      document_type_id: data.document_type_id,
      document: String(data.document ?? ''),
      third_party_category: PersonType.NATURAL,
      issue_date: data.natural_person?.issue_date ?? null,

      address: {
        address: data.address,
        country_id: data.country_id,
        department_id: data.department_id,
        city_id: data.city_id,
        postal_code: data.postal_code,
      },

      natural_person: {
        ...data.natural_person,
      },

      tax_info: {
        ...data.tax_info,
        has_different_nationality:
          data.tax_info?.has_different_nationality ?? false,
        foreign_responsibility: data.tax_info?.foreign_responsibility ?? false,
        address: {
          country_id: data.tax_info?.branch_country_id ?? null,
          address: data.tax_info?.branch_address ?? null,
        },
      },

      pep_info: {
        ...data.pep_info,
        is_pep: data.pep_info?.is_pep ?? false,
        is_politician: data.pep_info?.is_politician ?? false,
        is_international_pep: data.pep_info?.is_international_pep ?? false,
        is_pep_international: data.pep_info?.is_pep_international ?? false,
        has_pep_relatives: data.pep_info?.has_pep_relatives ?? false,
      },

      pep_info_relative: {
        full_name: data.pep_info?.relatives?.full_name ?? null,
        relationship: data.pep_info?.relatives?.relationship ?? null,
        position: data.pep_info?.relatives?.position ?? null,
        entity: data.pep_info?.relatives?.entity ?? null,
      },

      has_beneficiary_treatment: data.has_beneficiary_treatment ?? false,
      beneficiary_date: data.beneficiary_date ?? null,
    }
  }

  // --- Corporate Tab - Direct (v2) ---
  const makeDirectCorporateRequest = (
    data: IDirectCorporateForm
  ): IDirectCorporateRequest => {
    return {
      is_registered_in_national_emission_registery:
        data.is_registered_issuer_subject_to_disclosure,
      total_operational_income: data.total_monthly_operational_income || '',
      total_non_operational_income:
        data.total_monthly_non_operational_income || '',
      total_expenses: data.total_monthly_expenses || '',
      other_non_operational_income_concept:
        data.other_non_operational_income_concept || '',
      assets: data.total_assets || '',
      liabilities: data.total_liabilities || '',
      cutoff_date: data.financial_information_cutoff_date || '',
      bank_holder_id: Number(data.bank) || 0,
      account_type_holder: data.holder_account_type || '',
      bank_account_number_holder: data.holder_account_number || '',
      funding_source: data.source_of_funds || '',
      describe_funding_source: data.another_source_of_funds || '',
    }
  }

  // --- Corporate Tab - Indirect (v2) ---
  const makeEconomicActivitiesRequest = (
    activities: IEconomicActivityCorporateForm[]
  ): IEconomicActivityCorporateRequest[] => {
    if (!activities || activities.length === 0) return []

    return activities.map((activity) => ({
      ciiu_id: String(activity.economic_activity) || '',
      is_main: activity.is_ciiu_primary,
      status_id: Number(activity.status),
    }))
  }

  const makeBankAccountsRequest = (
    accounts: IBankAccountCorporateForm[]
  ): IBankAccountCorporateRequest[] => {
    if (!accounts || accounts.length === 0) return []

    return accounts.map((account) => {
      if (account.is_breb_key) {
        // Cuenta bre-b
        return {
          account_type: 'bre_b',
          email_bre_b: account.email || '',
          document_bre_b: account.identification_number || '',
          mobile_bre_b: account.mobile_number || '',
          key_bre_b: account.breb_key || '',
          password_bre_b: account.breb_keyword || '',
        }
      }

      return {
        bank_id: Number(account.bank) || 0,
        bank_branch_id: Number(account.branch) || 0,
        account_type: String(account.account_type) || '',
        account_number: account.bank_account_number || '',
        is_main: account.is_bank_account_primary,
      }
    })
  }

  const makeIndirectCorporateRequest = (
    data: IIndirectCorporateForm
  ): IIndirectCorporateRequest => {
    return {
      is_registered_in_national_emission_registery:
        data.is_registered_issuer_subject_to_disclosure,
      total_operational_income: data.total_monthly_operational_income || '',
      total_non_operational_income:
        data.total_monthly_non_operational_income || '',
      total_expenses: data.total_monthly_expenses || '',
      other_non_operational_income_concept:
        data.other_non_operational_income_concept || '',
      assets: data.total_assets || '',
      liabilities: data.total_liabilities || '',
      cutoff_date: data.financial_information_cutoff_date || '',
      funding_source: data.source_of_funds || '',
      describe_funding_source: data.another_source_of_funds || '',
      economic_activities: makeEconomicActivitiesRequest(
        data.economic_activities
      ),
      bank_accounts: makeBankAccountsRequest(data.bank_accounts),
    }
  }

  // --- Tributary Tab (v2) ---
  const makeTributaryRequest = (
    data: IClientLegalPersonIndirectTributaryForm
  ): IClientLegalPersonIndirectTributaryRequest => {
    return {
      files_tax_return: data.files_tax_return ?? false,
      files_foreign_taxes: data.files_foreign_taxes ?? false,
      giin_code: data.giin_code,
      is_branches: data.is_branches ?? false,
      description_economic_activity: data.description_economic_activity,
      branch_country_id: data.branch_country_id,
      country_id: data.country_id,
      branch_address: data.branch_address,

      settlement_formulas: (data.settlement_formulas || []).map((item) => ({
        is_main: item.is_main,
        settlement_formula_id: item.settlement_formula_id,
      })),
    }
  }

  // --- Shareholders Tab (v2) ---
  const makeShareholdersRequest = (
    data: IBaseShareholdersForm
  ): IBaseShareholdersRequest[] => {
    const { has_shareholders, shareholders } = data
    if (!has_shareholders) return []

    return shareholders.map((shareholder) => {
      const isNatural =
        shareholder.person_type?.toLowerCase() === PersonType.NATURAL

      // Base del request
      const request: IBaseShareholdersRequest = {
        document_type_id: shareholder.document_type_id || 0,
        document: shareholder.document_number || '',
        third_party_category: isNatural ? PersonType.NATURAL : PersonType.LEGAL,

        shareholder_info: cleanEmptyFields({
          shareholder_type_id: shareholder.shareholder_type,
          participating_percentage: shareholder.participation_percent,
          beneficiary_ownership: shareholder.beneficial_owner_by_ownership,
          beneficiary_benefits: shareholder.beneficial_owner_by_beneficiaries,
          control_over_legal_person: shareholder.has_control_over_legal_entity
            ? 'Si'
            : 'No',
          giin_code: 'N/A', // N/A
          nationality_id: shareholder.nationality,
          address: shareholder.address,
          country_id: shareholder.country,
          department_id: shareholder.department,
          city_id: shareholder.city,
          beneficiary_date: shareholder.beneficiary_date,
          different_nationality: shareholder.has_only_foreign_tax_responsibility
            ? 'Si'
            : 'No',
        }),

        contact_info: cleanEmptyFields({
          email: shareholder.email_contact || '',
          phone: shareholder.legal_phone_number || '',
          postal_code: shareholder.postal_code || '',
        }),
      }

      // Accionista persona natural / juridica
      if (isNatural) {
        request.natural_person = cleanEmptyFields({
          name: shareholder.first_name,
          middle_name: shareholder.second_name,
          last_name: shareholder.first_last_name,
          second_last_name: shareholder.second_last_name,
          birth_country_id: shareholder.birth_country,
          birth_date: shareholder.birth_date,
          issue_date: shareholder.expedition_date,
          document_issuance_country_id: shareholder.expedition_country,
        })

        request.tax_info = cleanEmptyFields({
          foreign_responsibility:
            shareholder.has_international_tax_responsibility ? 1 : 0, // ¿Tiene nacionalidad y responsabilidad tributaria internacional en un país diferente a Colombia?
          has_tax_responsibility_outside_colombia:
            shareholder.has_only_foreign_tax_responsibility ? 1 : 0, // ¿Tiene solo responsabilidad tributaria en un país diferente a Colombia?
          country_id: shareholder.tax_country,
          nationality_id: shareholder.nationality,
          tin: shareholder.taxpayer_document_number,
          branch_address: shareholder.tax_address,
        })

        request.pep_info = cleanEmptyFields({
          is_pep: shareholder.is_pep ? 1 : 0,
          is_politician: shareholder.political_decree_830_2021 ? 1 : 0,
          is_pep_international: shareholder.is_pep_international ? 1 : 0,
          has_pep_relatives: shareholder.has_pep_relative ? 1 : 0,
          is_international_pep: shareholder.is_representative_intl_org ? 1 : 0,
        })

        request.pep_info_relative = cleanEmptyFields({
          full_name: shareholder.related_pep_full_name,
          relationship: shareholder.pep_relationship,
          position: shareholder.position_held,
        })
      } else {
        request.legal_person = cleanEmptyFields({
          business_name: shareholder.social_reason,
          country_id: shareholder.incorporation_country,
        })

        // Tributario tab
        request.tax_info = cleanEmptyFields({
          foreign_responsibility:
            shareholder.tributary_has_control_over_legal_entity,
          country_id: shareholder.tributary_country,
          giin_code: shareholder.giin_code ?? 'N/A', // N/A en lugar de null
        })
      }

      return cleanEmptyFields(request)
    })
  }

  // --- Manager Tab (v2) ---
  const makeManagerRequest = (data: ILegalClientManager) => {
    const { board_directors, managers } = data
    if (!board_directors) return []

    return managers.map((manager) => {
      const isNatural =
        manager.person_type?.toLowerCase() === PersonType.NATURAL

      return cleanEmptyFields({
        document_type_id: manager.document_type_id,
        document: manager.document?.toString(),
        third_party_category: isNatural ? PersonType.NATURAL : PersonType.LEGAL,
        beneficiary_date: manager.beneficiary_date,

        pep_info: cleanEmptyFields({
          position: manager.position || null,
          date_exit: manager.date_exit || null,
          entity: manager.entity || null,
          date_entry: manager.date_entry || null,
          is_pep: boolToValue(manager.is_pep),
          is_politician: boolToValue(manager.is_politician),
          is_international_pep: boolToValue(manager.is_international_pep),
          is_pep_international: boolToValue(manager.is_pep_international),
          has_pep_relatives: boolToValue(manager?.has_pep_relatives),
        }),

        pep_info_relative: cleanEmptyFields({
          ...manager?.relatives,
        }),

        natural_person: isNatural
          ? cleanEmptyFields({ ...manager.natural_person })
          : undefined,

        legal_person: !isNatural
          ? cleanEmptyFields({ ...manager.legal_person })
          : undefined,

        contact_info: {
          email: manager.email,
          phone: manager.phone,
        },

        address: {
          address: manager.address,
          country_id: manager.country_id,
          department_id: manager.department_id,
          city_id: manager.city_id,
        },
      })
    })
  }

  // --- Investor Tab (v2) ---
  const makeInvestorIndirectRequest = (
    form: IInvestorForm | null
  ): IClientInversorRequest | null => {
    if (!form) {
      return null
    }

    return {
      investor_rating: form.investor_rating,
      quantitative_risk_rating: form.quantitative_risk_rating,
      qualitative_risk_rating: form.qualitative_risk_rating,
    }
  }

  // --- Documents Tab (v2) ---
  const makeDocumentIndirectRequest = (form: IDocumentIndirectForm) => {
    return form.documents.map((doc) => ({
      id: doc.id,
      document_type: doc.document_type,
      is_required: doc.is_required ?? true,
      is_validated: true,
    }))
  }

  // TODO: FALTA TIPADO
  const makeDataDirectRequest = () => {
    if (
      !legalRepresentationDataForm.value ||
      !basicInformationDataForm.value ||
      !directCorporateDataForm.value
    )
      return null

    const basicInformationRequest = makeBasicInformationDirectRequest(
      basicInformationDataForm.value as IClientDirectBasicForm,
      directCorporateDataForm.value
    )

    const apiRequestBody = {
      ...basicInformationRequest,
      legal_representatives: legalRepresentationDataForm.value
        ? makeLegalRepresentationRequest(legalRepresentationDataForm.value)
        : null,
      tax_info: tributaryDataForm.value
        ? makeTributaryRequest(tributaryDataForm.value)
        : null,
      board_members: managerDataForm.value
        ? makeManagerRequest(managerDataForm.value)
        : [],
      financial_info: directCorporateDataForm.value
        ? makeDirectCorporateRequest(directCorporateDataForm.value)
        : null,
      shareholders: shareholdersDataForm.value
        ? makeShareholdersRequest(shareholdersDataForm.value)
        : [],
    }

    return apiRequestBody
  }

  // TODO: FALTA TIPADO
  const makeDataIndirectRequest = () => {
    if (!legalRepresentationDataList.value || !basicInformationDataForm.value) {
      return null
    }

    const basicInformationRequest = makeBasicInformationIndirectRequest(
      basicInformationDataForm.value as IClientIndirectBasicForm
    )

    const investorRequest = makeInvestorIndirectRequest(
      investorIndirectDataForm.value
    )

    const apiRequestBody = {
      ...basicInformationRequest,
      vat_responsibility: tributaryDataForm.value?.vat_responsibility
        ? 'Si'
        : 'No',
      fiscal_responsibility: tributaryDataForm.value?.fiscal_responsibility,
      legal_representatives:
        legalRepresentationDataList.value?.length > 0
          ? legalRepresentationDataList.value.map(
              makeLegalRepresentationRequest
            )
          : null,
      financial_info: indirectCorporateDataForm.value
        ? makeIndirectCorporateRequest(indirectCorporateDataForm.value)
        : null,
      tax_info: tributaryDataForm.value
        ? makeTributaryRequest(tributaryDataForm.value)
        : null,
      shareholders: shareholdersDataForm.value
        ? makeShareholdersRequest(shareholdersDataForm.value)
        : [],
      investor: investorRequest,
      board_members: data_manager_legal_form.value
        ? makeManagerRequest(data_manager_legal_form.value)
        : [],
      files: documentIndirectForm.value
        ? makeDocumentIndirectRequest(documentIndirectForm.value)
        : [],
    }

    return apiRequestBody
  }

  const forms = [
    formBasicInformation,
    formLegalRepresentation,
    isLegalPersonIndirect.value ? formCorporateIndirect : formCorporateDirect,
    formTributary,
    formShareholders,
    formManager,
    formInvestor,
    formDocumentsIndirect,
  ]

  const validateFormDirect = async () => {
    let valid: boolean = false

    if (tabActiveIdx.value >= 0 && tabActiveIdx.value < forms.length) {
      try {
        if ([4].includes(tabActiveIdx.value)) {
          const { has_shareholders, shareholders } =
            shareholdersDataForm.value || {}

          if (has_shareholders && shareholders?.length === 0) {
            showAlert('Debes agregar al menos 1 accionista', 'error')
            return false
          }
        }

        if ([5].includes(tabActiveIdx.value)) {
          const { board_directors, managers } = managerDataForm.value || {}

          if (board_directors && managers?.length === 0) {
            showAlert('Debes agregar al menos 1 directivo', 'error')
            return false
          }
        }

        const isFormDocument =
          forms[tabActiveIdx.value] === formDocumentsIndirect
        valid =
          (await forms[tabActiveIdx.value]?.value?.validateForm()) ?? false

        if (!valid && isFormDocument) {
          showAlert(
            'Asegúrese de subir los documentos',
            'error',
            undefined,
            3000
          )
        }
      } catch {
        valid = false
      }
    }

    return true
  }

  const validateFormIndirect = async () => {
    let valid: boolean = false

    if (tabActiveIdx.value >= 0 && tabActiveIdx.value < forms.length) {
      try {
        if ([1].includes(tabActiveIdx.value)) {
          if (
            !legalRepresentationDataList.value ||
            legalRepresentationDataList.value.length === 0
          ) {
            showAlert('Debes agregar al menos 1 representante legal', 'error')
            return false
          }
        }

        if ([4].includes(tabActiveIdx.value)) {
          const { has_shareholders, shareholders } =
            shareholdersDataForm.value || {}

          if (has_shareholders && shareholders?.length === 0) {
            showAlert('Debes agregar al menos 1 accionista', 'error')
            return false
          }

          const validPercentShareholders =
            (await forms[tabActiveIdx.value]?.value?.itHasTotalPercent?.()) ??
            true

          if (
            !validPercentShareholders &&
            has_shareholders &&
            shareholders &&
            shareholders.length > 0
          ) {
            useAlert().showAlert(
              'El porcentaje de participación de los accionistas directos debe ser del 100%',
              'error',
              undefined,
              3000
            )
            return false
          }
        }

        if ([5].includes(tabActiveIdx.value)) {
          const { board_directors, managers } = managerDataForm.value || {}

          if (board_directors && managers?.length === 0) {
            showAlert('Debes agregar al menos 1 directivo', 'error')
            return false
          }
        }

        const isFormDocument =
          forms[tabActiveIdx.value] === formDocumentsIndirect
        const formValidation = await forms[
          tabActiveIdx.value
        ]?.value?.validateForm()
        valid = formValidation ?? false

        if (!valid && isFormDocument) {
          showAlert(
            'Asegúrese de subir los documentos',
            'error',
            undefined,
            3000
          )
          return false
        }
      } catch (error) {
        valid = false
      }
    }

    return valid
  }

  const submitMap = {
    [ClientPersonType.LEGAL_DIRECT]: {
      validate: validateFormDirect,
      build: makeDataDirectRequest,
      setValueData: setValueDataLegalPersonIndirectResponse,
      apiRoute: ClientApiRouteType.CUSTOMERS,
    },

    [ClientPersonType.LEGAL_INDIRECT]: {
      validate: validateFormIndirect,
      build: makeDataIndirectRequest,
      setValueData: setValueDataLegalPersonIndirectResponse,
      apiRoute: ClientApiRouteType.INDIRECT_CUSTOMERS,
    },
  } as const

  const nextTab = async () => {
    const isValid = await personType.value.validate()
    if (!isValid) return
    tabActiveIdx.value = tabActiveIdx.value + 1
    tabActive.value = tabs.value[tabActiveIdx.value].name
  }

  const backTab = () => {
    tabActiveIdx.value = tabActiveIdx.value - 1
    tabActive.value = tabs.value[tabActiveIdx.value].name
  }

  const onSubmit = async () => {
    if (!(await personType.value.validate())) return

    openMainLoader(true)

    const payload = personType.value.build()

    if (!payload) return

    const success = await _updateAction(
      payload,
      legalClientId,
      personType.value.apiRoute,
      PersonApiRouteType.LEGAL_PERSON
    )

    if (success) {
      goToURL('ClientsList')
    }

    openMainLoader(false)
  }

  onBeforeMount(async () => {
    openMainLoader(true)

    _clearDataManager()

    personType.value =
      submitMap[client_person_type.value as keyof typeof submitMap]

    await _getResources(keys)
    await getResources(`keys[]=${keysResourceV1.join('&keys[]=')}`)

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

export default useLegalPersonEdit
