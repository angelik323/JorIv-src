// Vue
import { computed, onBeforeMount, onMounted, ref } from 'vue'
import { storeToRefs } from 'pinia'

// Interfaces
import { ITabs } from '@/interfaces/global'
import { INaturalClientFinanceForm } from '@/interfaces/customs/Clients'
import {
  IClientsDocumentsWrapper,
  IClientsDocuments,
} from '@/interfaces/customs/clients/Clients'
import {
  IClientIndirectNaturalBasicForm,
  IClientIndirectNaturalPepForm,
  ITributaryForm,
  IClientIndirectNaturalInvestorForm,
  BankAccount,
} from '@/interfaces/customs/clients/ClientIndirectNaturalPerson'
import {
  ClientApiRouteType,
  PersonApiRouteType,
} from '@/interfaces/global/Clients'

// Composables
import { useMainLoader, useUtils, useGoToUrl, useAlert } from '@/composables'

// Stores
import { useClientsStore, useThirdPartiesModuleStore } from '@/stores'
import { useSettlementFormulasStore } from '@/stores/accounts-payable/settlement-formulas'

const useNaturalEntity = () => {
  const { openMainLoader } = useMainLoader()
  const { defaultIconsLucide } = useUtils()
  const { goToURL } = useGoToUrl()
  const { showAlert } = useAlert()

  const clientsV2 = useClientsStore('v2')
  const { _createAction } = clientsV2

  const { exist_client } = storeToRefs(useThirdPartiesModuleStore())
  const { _clearData: _clearThirdPartiesData } = useThirdPartiesModuleStore()

  const settlementStore = useSettlementFormulasStore('v1')
  const { _getSettlementFormulasList } = settlementStore
  const { settlement_formulas_list } = storeToRefs(settlementStore)

  const headerProps = {
    title: 'Vinculación de clientes',
    breadcrumbs: [
      { label: 'Inicio', route: 'HomeView' },
      { label: 'Clientes', route: 'ClientsList' },
      { label: 'Vinculación de clientes' },
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
      name: 'finance',
      label: 'Finanzas',
      icon: defaultIconsLucide.dollarSign,
      outlined: true,
      disable: true,
      show: true,
      required: true,
    },
    {
      name: 'pep',
      label: 'PEP',
      icon: defaultIconsLucide.user,
      outlined: true,
      disable: true,
      show: true,
      required: true,
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
      name: 'document',
      label: 'Documentos',
      icon: defaultIconsLucide.file,
      outlined: true,
      disable: true,
      show: true,
      required: true,
    },
  ])

  const clientFullName = computed(() => {
    const info = data_information_form.value
    if (!info) return ''

    const doc = info.document ?? ''

    const np = info.natural_person

    const parts = [
      np?.name ?? '',
      np?.middle_name ?? '',
      np?.last_name ?? '',
      np?.second_last_name ?? '',
    ]

    // Construcción del nombre propio
    const fullName = parts
      .filter((p) => p && p.trim())
      .join(' ')
      .trim()
      .toUpperCase()

    if (!doc && !fullName) return ''

    // FORMATO FINAL
    return `${doc} – ${fullName}` // EN DASH
  })

  const filteredTabs = computed(() => tabs.value.filter((tab) => tab.show))

  // ----------------------------
  //   PAYLOAD BUILDER
  // ----------------------------
  const makeDataRequest = () => {
    const info = data_information_form.value
    const tributary = data_tributary_form.value
    const finance = data_finance_form.value
    const pep = dataPepForm.value
    const investor = investorIndirectDataForm.value ?? undefined
    const filesMap = documentIndirectDataForm.value?.files
      .filter((element: IClientsDocuments) => element.file_url)
      .map((element: IClientsDocuments) => ({
        document_type: element.document_type,
        is_required: element.is_required,
        is_validated: element.is_validated,
        id: element.id,
      }))

    return {
      request_type: info?.request_type ?? '',
      document: info?.document,
      document_type_id: info?.document_type_id,
      vat_responsibility: tributary?.tax_info?.responsible_iva ? 'SI' : 'NO',
      fiscal_responsibility: 'Autorretenedor',

      natural_person: {
        name: info?.natural_person?.name,
        middle_name: info?.natural_person?.middle_name,
        last_name: info?.natural_person?.last_name,
        second_last_name: info?.natural_person?.second_last_name,
        birth_date: info?.natural_person?.birth_date,
        birth_country_id: info?.natural_person?.birth_country_id,
        location_country_id: info?.natural_person?.location_country_id,
        sending_correspondence: info?.sending_correspondence,
        issue_date: info?.natural_person?.expedition_date,
      },

      contacts: info?.contacts?.map((c) => ({
        contact_type: c.contact_type,
        contact_value: c.contact_value,
        is_main: !!c.is_main,
      })),

      addresses: [
        {
          country_id: info?.addresses.country_id,
          department_id:
            info?.addresses.department_id === 0
              ? null
              : info?.addresses.department_id,
          city_id:
            info?.addresses.city_id === 0 ? null : info?.addresses.city_id,
          address: info?.addresses.address,
          is_main: true,
          branch_address: info?.addresses.branch_address,
        },
      ],

      employment_info: {
        ...info?.employment_info,
        ciiu_id: info?.employment_info.ciiu_id,
        city_id:
          Number(info?.employment_info.city_id) === 0
            ? null
            : Number(info?.employment_info.city_id),
        department_id:
          Number(info?.employment_info.department_id) === 0
            ? null
            : Number(info?.employment_info.department_id),
      },

      tax_info: {
        files_tax_return: tributary?.tax_info.files_tax_return ?? false,
        has_different_nationality:
          !tributary?.nationality.has_different_nationality,
        nationality_id: tributary?.nationality.nationality ?? null,
        has_tax_responsibility_outside_colombia:
          tributary?.tax_info.has_tax_responsibility_outside_colombia ?? false,
        country_id: tributary?.address.country_id ?? null,
        postal_address: tributary?.address.postal_address ?? null,
        has_notarial_power: tributary?.address.has_notary_power_abroad ?? false,
        foreign_phone: tributary?.tax_info.foreign_phone ?? null,
        tin_option: tributary?.details.tin_status ?? null,
        tin: tributary?.details.tin ?? null,
        settlement_formulas:
          tributary?.settlement_formulas.map((f: unknown) => ({
            settlement_formula_id: (f as { id: number }).id,
            is_main: (f as { principal: boolean }).principal,
          })) ?? [],
        address: {
          address: tributary?.tax_info.address.address ?? null,
        },
      },

      financial_info: {
        total_operational_income: String(
          finance?.financial_info.total_operational_income
        ),
        total_non_operational_income: String(
          finance?.financial_info.total_non_operational_income
        ),
        total_expenses: String(finance?.financial_info.total_expenses),
        other_non_operational_income_concept: String(
          finance?.financial_info.other_non_operational_income_concept
        ),
        assets: String(finance?.financial_info.assets),
        cutoff_date: String(finance?.financial_info.cutoff_date),
        liabilities: String(finance?.financial_info.liabilities),
        is_registered_in_national_emission_registery: true,
        funding_source: String(
          finance?.financial_info.legal_people_found_source_id
        ),
        bank_accounts:
          finance?.financial_info.bank_accounts?.map((acc: BankAccount) => ({
            bank_id: acc.bank_id,
            bank_branch_id: acc.bank_branch_id,
            account_type: acc.account_type,
            account_number: acc.account_number,
            is_main: !!acc.is_main,
            status: Number(acc.status),
          })) || [],
      },

      pep_info: {
        ...pep?.pep_info,
      },

      pep_info_relative: pep?.pep_info_relative ?? undefined,
      ...investor,
      files: filesMap ?? undefined,
    }
  }

  const tabActive = ref(filteredTabs.value[0].name)
  const tabActiveIdx = ref(
    filteredTabs.value.findIndex((tab) => tab.name === tabActive.value)
  )

  const formInformation = ref()
  const formTributary = ref()
  const formFinance = ref()
  const formPep = ref()
  const formEstate = ref()
  const formInvestor = ref()
  const formDocument = ref()

  const validateForms = async () => {
    let valid = false
    const forms = [
      formInformation,
      formTributary,
      formFinance,
      formPep,
      formInvestor,
      formDocument,
    ]

    if (tabActiveIdx.value < 0 || tabActiveIdx.value >= forms.length) {
      return false
    }

    try {
      const isFormDocument = forms[tabActiveIdx.value] === formDocument
      valid = (await forms[tabActiveIdx.value]?.value?.validateForm()) ?? false

      if (!valid && isFormDocument) {
        showAlert(
          'Asegúrese de subir todos los documentos',
          'error',
          undefined,
          3000
        )
      }
      return valid
    } catch (error) {
      return valid
    }
  }

  const nextTab = async () => {
    if (await validateForms()) {
      tabActiveIdx.value = tabActiveIdx.value + 1
      tabActive.value = filteredTabs.value[tabActiveIdx.value].name
    }
  }

  const backTab = () => {
    tabActiveIdx.value = tabActiveIdx.value - 1
    tabActive.value = filteredTabs.value[tabActiveIdx.value].name
  }

  const onSubmit = async () => {
    if (!(await validateForms())) return

    openMainLoader(true)

    const payload = makeDataRequest()

    const success = await _createAction(
      payload,
      ClientApiRouteType.INDIRECT_CUSTOMERS,
      PersonApiRouteType.NATURAL_PERSON
    )

    if (success) goToURL('ClientsList')

    openMainLoader(false)
  }

  const onUpdateFinanceForm = (form: INaturalClientFinanceForm | null) => {
    data_finance_form.value = form
  }

  onBeforeMount(async () => {
    _clearThirdPartiesData()
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

    exist_client,

    data_information_form,

    onUpdateFinanceForm,
    data_tributary_form,
    data_finance_form,
    clientFullName,
    settlement_formulas_list,
    nextTab,
    backTab,
    dataPepForm,
    investorIndirectDataForm,
    documentIndirectDataForm,
    onSubmit,
  }
}

export default useNaturalEntity
