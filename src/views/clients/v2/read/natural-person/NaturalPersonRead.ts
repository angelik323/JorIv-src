// Vue - Pinia - Router - Quasar
import { ref, computed, onBeforeUnmount, onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import { useRoute } from 'vue-router'

// Composables
import { useMainLoader, useUtils, useGoToUrl } from '@/composables'

// Interfaces
import { ITabs } from '@/interfaces/customs/Tab'
import {
  IClientIndirectNaturalBasicForm,
  ITributaryForm,
  IClientIndirectNaturalPepForm,
  ClientIndirectNaturalData,
  IClientIndirectNaturalInvestorForm,
  ThirdPartyShow,
  ILiquidationParamRow,
  FormulaTaxBase,
  TaxesUIMap,
  IFormulaTax,
  BankAccount,
} from '@/interfaces/customs/clients/ClientIndirectNaturalPerson'
import {
  TAX_TYPE_TO_FIELD_MAP,
  EMPTY_TAXES_UI,
} from '@/constants/clients/indirect/tributary'
import {
  IClientsDocuments,
  INaturalClientFinanceForm,
} from '@/interfaces/customs/Clients'

import {
  ClientPersonType,
  ClientApiRouteType,
  PersonApiRouteType,
} from '@/interfaces/global/Clients'

// Stores
import { useClientsStore } from '@/stores/clients'
import { useThirdPartiesModuleStore } from '@/stores'
import { useSettlementFormulasStore } from '@/stores/accounts-payable/settlement-formulas'
import { IClientsDocumentsWrapper } from '@/interfaces/customs/clients/Clients'

const useNaturalPersonRead = () => {
  const route = useRoute()
  const { openMainLoader } = useMainLoader()
  const { defaultIconsLucide } = useUtils()
  const { goToURL } = useGoToUrl()

  const clientsV2 = useClientsStore('v2')
  const { _getByIdAction } = clientsV2
  const { client_person_type } = storeToRefs(clientsV2)

  const thirdPartiesModule = useThirdPartiesModuleStore()
  const { _clearData: _clearThirdPartyData } = thirdPartiesModule

  const settlementStore = useSettlementFormulasStore('v1')
  const { _getSettlementFormulasList } = settlementStore
  const { settlement_formulas_list } = storeToRefs(settlementStore)

  const thirdPartyCache = ref<ThirdPartyShow | null>(null)

  const naturalClientId = +route.params.id

  const headerProps = {
    title: 'Editar persona natural',
    breadcrumbs: [
      { label: 'Inicio', route: 'HomeView' },
      { label: 'Clientes', route: 'ClientsList' },
      { label: 'Editar persona natural' },
    ],
  }

  const data_information_form = ref<IClientIndirectNaturalBasicForm | null>(
    null
  )
  const data_tributary_form = ref<ITributaryForm | null>(null)
  const data_finance_form = ref<INaturalClientFinanceForm | null>(null)
  const dataPepForm = ref<IClientIndirectNaturalPepForm | null>(null)
  const investorIndirectDataForm =
    ref<IClientIndirectNaturalInvestorForm | null>(null)
  const documentIndirectDataForm = ref<IClientsDocumentsWrapper | null>(null)

  const tabs = ref<ITabs[]>([
    {
      name: 'information',
      label: 'Información básica',
      icon: defaultIconsLucide.bulletList,
      outlined: true,
      disable: false,
      show: true,
      required: true,
    },
    {
      name: 'tributary',
      label: 'Tributario',
      icon: defaultIconsLucide.squarePercentage,
      outlined: true,
      disable: false,
      show: true,
      required: true,
    },
    {
      name: 'finance',
      label: 'Finanzas',
      icon: defaultIconsLucide.dollarSign,
      outlined: true,
      disable: false,
      show: true,
      required: true,
    },
    {
      name: 'pep',
      label: 'PEP',
      icon: defaultIconsLucide.user,
      outlined: true,
      disable: false,
      show: true,
      required: true,
    },
    {
      name: 'estate',
      label: 'Bienes',
      icon: defaultIconsLucide.piggy,
      outlined: true,
      disable: false,
      show: false,
      required: false,
    },
    {
      name: 'investor',
      label: 'Inversionistas',
      icon: defaultIconsLucide.badgeDollarSign,
      outlined: true,
      disable: false,
      show: true,
      required: false,
    },
    {
      name: 'document',
      label: 'Documentos',
      icon: defaultIconsLucide.file,
      outlined: true,
      disable: false,
      show: true,
      required: true,
    },
  ])

  const filteredTabs = computed(() => tabs.value.filter((t) => t.show))

  const tabActive = ref(filteredTabs.value[0].name)
  const tabActiveIdx = ref(0)

  const formInformation = ref()
  const formTributary = ref()
  const formFinance = ref()
  const formPep = ref()
  const formEstate = ref()
  const formInvestor = ref()
  const formDocument = ref()

  const forms = [
    formInformation,
    formTributary,
    formFinance,
    formPep,
    formEstate,
    formInvestor,
    formDocument,
  ]

  const validateCurrentForm = async () => {
    const form = forms[tabActiveIdx.value]
    if (!form?.value?.validateForm) return true
    return await form.value.validateForm()
  }

  const nextTab = async () => {
    if (!(await validateCurrentForm())) return
    tabActiveIdx.value++
    tabActive.value = filteredTabs.value[tabActiveIdx.value].name
  }

  const backTab = () => {
    tabActiveIdx.value--
    tabActive.value = filteredTabs.value[tabActiveIdx.value].name
  }

  const mapTaxesToUI = (taxes?: FormulaTaxBase[]): TaxesUIMap => {
    if (!taxes?.length) return { ...EMPTY_TAXES_UI }

    const result: TaxesUIMap = { ...EMPTY_TAXES_UI }

    for (const tax of taxes) {
      const field =
        TAX_TYPE_TO_FIELD_MAP[tax.tax_type as IFormulaTax['tax_type']]
      if (field) {
        result[field] = tax.is_applicable ? 1 : 0
      }
    }

    return result
  }

  const getSettlementRows = (tp: ThirdPartyShow): ILiquidationParamRow[] => {
    if (!tp.settlement_formulas?.length) return []

    return tp.settlement_formulas
      .map((sf) => {
        const catalog = settlement_formulas_list.value.find(
          (c) => c.id === sf.settlement_formula_id
        )

        if (!catalog) return null

        return {
          id: catalog.id,
          tributary_param: catalog.code,
          liquidation_param_name: catalog.name,
          ...mapTaxesToUI(catalog.taxes),
          principal: sf.is_main,
          selected_ui: true,
        }
      })
      .filter(Boolean) as ILiquidationParamRow[]
  }

  const setValueDataNaturalIndirectResponse = (
    data: ClientIndirectNaturalData
  ) => {
    const tp = data.third_party
    thirdPartyCache.value = tp

    const np = tp.natural_person
    const emp = tp.employment_info
    const tax = tp.tax_info
    const fin = tp.financial_info
    const pep = tp.pep_info
    const investor = tp.investor
    const files = tp.documents
      .filter((element: IClientsDocuments) => element.file_url)
      .map((element: IClientsDocuments) => ({
        id: typeof element.id === 'number' ? element.id : null,
        document_type: element.document_type ?? '',
        file_url: element.file_url ?? '',
        is_required: element.is_required ?? false,
        is_validated: element.is_validated ?? false,
      }))

    const has_colombian_nationality = !tax?.has_different_nationality

    data_information_form.value = {
      request_type: data.request_type ?? '',
      application_type: data.request_type ?? '',
      document: tp.document,
      document_type_id: tp.document_type_id,
      document_type: tp.document_type?.name ?? null,
      fiscal_responsibility: tp.fiscal_responsibility,
      nacionality: tp.document_type_id ? String(tp.document_type_id) : null,
      creation_date: tp.created_at,

      natural_person: {
        name: np?.name ?? null,
        middle_name: np?.middle_name ?? null,
        last_name: np?.last_name ?? null,
        second_last_name: np?.second_last_name ?? null,
        birth_date: np?.birth_date ?? null,
        issue_date: np?.issue_date ?? null,
        applicat_type: null,
        occupation_id: np?.occupation_id ? String(np.occupation_id) : null,
        birth_country_id:
          np?.birth_country_id != null ? Number(np.birth_country_id) : null,
        document_issuance_country: np?.document_issuance_country_id
          ? String(np.document_issuance_country_id)
          : null,
        location_country: np?.location_country_id
          ? String(np.location_country_id)
          : null,
        expedition_date: np?.issue_date ?? null,
      },

      sending_correspondence: np?.sending_correspondence ?? '',

      contacts: tp.contacts.map((c) => ({
        contact_type: c.contact_type ?? null,
        contact_value: c.contact_value ?? null,
        is_main: c.is_main ? '1' : '0',
      })),

      addresses: {
        country_id: tp.addresses[0]?.country_id ?? null,
        department_id: tp.addresses[0]?.department_id ?? null,
        city_id: tp.addresses[0]?.city_id ?? null,
        address: tp.addresses[0]?.address ?? '',
        postal_address: tp.addresses[0]?.postal_address ?? '',
        postal_code: tp.addresses[0]?.postal_code ?? null,
      },

      employment_info: {
        occupation_id: emp?.occupation_id ?? null,
        profession_id: emp?.profession_id ?? null,
        ciiu_code: emp?.ciiu_code ?? null,
        ciiu_id: emp?.ciiu_id ?? null,
        company: emp?.company ?? '',
        address: emp?.address ?? '',
        phone: emp?.phone ?? '',
        country_id: emp?.country_id ?? null,
        department_id: emp?.department_id ?? null,
        city_id: emp?.city_id ?? null,
      },
    }

    data_tributary_form.value = {
      tax_info: {
        tax_obligations: null,
        declares_tax: false,
        responsible_iva: false,
        vat_responsibility: tp?.vat_responsibility ?? null,
        files_tax_return: Boolean(tax?.files_tax_return),
        has_tax_responsibility_outside_colombia: Boolean(
          tax?.has_tax_responsibility_outside_colombia
        ),
        foreign_phone: tax?.foreign_phone ?? null,
        address: {
          address: tax?.address?.address ?? null,
        },
      },
      nationality: {
        has_different_nationality: has_colombian_nationality,
        nationality: tax?.nationality_id ?? null,
      },
      address: {
        country: null,
        department: null,
        city: null,
        taxable_country: tax?.country_id ? String(tax.country_id) : null,
        postal_address: tax?.postal_address ?? '',
        has_notary_power_abroad: Boolean(tax?.has_notarial_power),
        country_id: tax?.country_id ?? null,
        branch_address: tax?.branch_address ?? null,
        address: tax?.address?.address ?? null,
      },
      details: {
        phone_code: '',
        tin_status: tax?.tin_option ?? null,
        tin: tax?.tin ?? null,
      },
      liquidation_params: {
        thirdparty: '',
        iva_percentage: null,
        iva_name_concept: null,
        reteiva_percentage: null,
        reteiva_name_concept: null,
        tax_obligations: null,
        iva_responsible: null,
      },
      settlement_formulas: getSettlementRows(tp),
    }

    data_finance_form.value = {
      financial_info: {
        total_operational_income: fin?.total_operational_income ?? null,
        total_non_operational_income: fin?.total_non_operational_income ?? null,
        total_expenses: fin?.total_expenses ?? null,
        other_non_operational_income_concept:
          fin?.other_non_operational_income_concept ?? null,
        assets: fin?.assets ?? null,
        cutoff_date: fin?.cutoff_date ?? null,
        liabilities: fin?.liabilities ?? null,
        bank_holder_id: fin?.bank_holder_id ?? null,
        bank_account_number_holder: fin?.bank_account_number_holder ?? null,
        account_type_holder_id: null,
        beneficiary_name: fin?.beneficiary_name ?? null,
        beneficiary_document_number: fin?.beneficiary_document_number ?? null,
        bank_beneficiary_id: fin?.bank_beneficiary_id ?? null,
        bank_account_number_beneficiary:
          fin?.bank_account_number_beneficiary ?? null,
        account_type_beneficiary_id: null,
        report_income: fin?.declares_income ?? false,
        funding_source: fin?.funding_source ?? null,
        bank_accounts:
          (fin?.bank_accounts || []).map((acc: BankAccount) => {
            return {
              bank_id: acc.bank_id ?? 0,
              bank_branch_id: acc.bank_branch_id ?? null,
              account_type: acc.account_type ?? '',
              account_number: acc.account_number ?? '',
              is_main: !!acc.is_main,
              status: acc.status,
            } as NonNullable<
              INaturalClientFinanceForm['financial_info']['bank_accounts']
            >[number]
          }) || [],
      },
    }
    ;(dataPepForm.value = {
      pep_info: {
        is_pep: pep?.is_pep ?? false,
        is_politician: pep?.is_politician ?? false,
        legal_representative: false,
        is_pep_international: pep?.is_pep_international ?? false,
        position: pep?.position ?? null,
        entity: pep?.entity ?? null,
        date_entry: pep?.date_entry ?? null,
        date_exit: pep?.date_exit ?? null,
        has_pep_relatives: pep?.has_pep_relatives ?? false,
      },

      pep_info_relative:
        pep?.has_pep_relatives === true && pep?.relatives
          ? {
              familiar_politician: true,
              full_name: pep.relatives?.full_name ?? null,
              relationship: pep.relatives?.relationship ?? null,
              position: pep.relatives?.position ?? null,
              entity: pep.relatives?.entity ?? null,
            }
          : null,
    }),
      (investorIndirectDataForm.value = {
        investor: {
          investor_rating: investor?.investor_rating ?? null,
          quantitative_risk_rating: investor?.quantitative_risk_rating ?? null,
          qualitative_risk_rating: investor?.qualitative_risk_rating ?? null,
        },
      })

    documentIndirectDataForm.value = {
      files: files,
    }
  }

  const submitMap = {
    [ClientPersonType.NATURAL_INDIRECT]: {
      validate: validateCurrentForm,
      setValueData: setValueDataNaturalIndirectResponse,
      apiRoute: ClientApiRouteType.CUSTOMERS,
    },
  } as const

  const type = ref(submitMap[ClientPersonType.NATURAL_INDIRECT])

  const onSubmit = async () => {
    goToURL('ClientsList')
  }

  const fetchData = async () => {
    openMainLoader(true)

    const data = await _getByIdAction(
      naturalClientId,
      ClientApiRouteType.INDIRECT_CUSTOMERS,
      PersonApiRouteType.NATURAL_PERSON
    )

    if (data) {
      type.value.setValueData(data as unknown as ClientIndirectNaturalData)
    }

    openMainLoader(false)
  }

  onBeforeUnmount(async () => {
    _clearThirdPartyData()
  })

  onMounted(() => {
    fetchData()
  })

  onMounted(async () => {
    await _getSettlementFormulasList({})
  })

  return {
    headerProps,
    filteredTabs,
    tabActive,
    tabActiveIdx,
    defaultIconsLucide,

    formInformation,
    formTributary,
    formFinance,
    formPep,
    formEstate,
    formInvestor,
    formDocument,

    data_information_form,
    data_tributary_form,
    data_finance_form,
    dataPepForm,
    investorIndirectDataForm,
    documentIndirectDataForm,

    settlement_formulas_list,

    client_person_type,

    nextTab,
    backTab,
    onSubmit,
  }
}

export default useNaturalPersonRead
