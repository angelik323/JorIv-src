import {
  ref,
  onBeforeMount,
  computed,
  watch,
  ComponentPublicInstance,
  onBeforeUnmount,
} from 'vue'
import { storeToRefs } from 'pinia'
import { useRouter } from 'vue-router'
import { QExpansionItem, QTable } from 'quasar'

// Utils
import { defaultIconsLucide } from '@/utils'

// Composables
import { useMainLoader, useS3Documents } from '@/composables'

// Stores
import { useTrustBusinessStore } from '@/stores/trust-business/trust-businesses'
import { useResourceStore } from '@/stores/resources-selects'

// Interfaces
import {
  ITrustBusinessInformationForm,
  ITrustBusinessToCreate,
  IBusinessAccounting,
  IBusinessTreasury,
  ITrustBusinessRequest,
  IBusinessCxPTrustBusiness,
  IRegulationTrustBusiness,
  IBusinessDerivedContracting,
  IBusinessBudget,
} from '@/interfaces/customs/trust-business/TrustBusinesses'

import { ITabs, IFileField, IUploadedFile } from '@/interfaces/global'
import { useResourceManagerStore } from '@/stores/resources-manager'

const useTrustBusinessesCreate = () => {
  const {
    _createTrustBusiness,
    _addTrustBusinessFile,
    _updateTrustBusinessDocuments,
    _clearData,
  } = useTrustBusinessStore('v1')
  const {
    data_information_form,
    data_business_resources,
    data_documents_form,
  } = storeToRefs(useTrustBusinessStore('v1'))

  const router = useRouter()
  const { _getResources, _resetKeys } = useResourceManagerStore('v1')

  const { openMainLoader } = useMainLoader()
  const { _saveDocumentsS3, getExtensionFromMimeType } = useS3Documents()

  const { getResources } = useResourceStore('v1')

  const trust_business_keys = {
    trust_business: [
      'business_trust_register_types',
      'business_trust_fideico_types',
      'business_trust_society_types',
      'business_trust_subtypes',
      'business_trust_mode',
      'business_trust_classification',
      'business_trust_periodicity_accountability',
      'business_currency',
      'account_structures',
      'cost_centers_structures',
      'status_accounting',
      'close_treasurie',
      'cash_flow_structure',
      'collection_structure',

      // cxp
      'payment_concept_structure',
      'accounts_payable_closing',
    ],
  }

  const third_parties_keys = { trust_business: ['third_parties'] }

  const keys = ['countries', 'departments', 'cities', 'fiscal_responsability']

  const last_key = ['users']

  const headerProps = {
    title: 'Crear negocio fiduciario',
    breadcrumbs: [
      {
        label: 'Inicio',
        route: 'HomeView',
      },
      {
        label: 'Negocios Fiduciarios',
        route: 'TrustBusinessesList',
      },
      {
        label: 'Crear',
      },
    ],
  }

  const tabs = ref<ITabs[]>([
    {
      name: 'information',
      label: 'Datos básicos*',
      icon: defaultIconsLucide.bulletList,
      outlined: true,
      disable: true,
      show: true,
      required: false,
    },
    {
      name: 'documents',
      label: 'Documentos*',
      icon: defaultIconsLucide.file,
      outlined: true,
      disable: true,
      show: true,
      required: false,
    },
  ])

  const tabActive = ref(tabs.value[0].name)
  const tabActiveIdx = ref(
    tabs.value.findIndex((tab) => tab.name === tabActive.value)
  )

  const businessType = computed(
    () => data_information_form.value?.business_type ?? null
  )
  const consortium = computed(() => data_information_form.value?.consortium)

  // Sociedad Fiduciaria o Fondos de inversión Colectiva
  const isTypesInvestmentFundsOrTrustCompany = computed(() =>
    businessType.value !== null
      ? ![9, 10].includes(Number(businessType.value))
      : false
  )

  // Fiducia de Garantía (incluye solo 4)
  const isGuaranteeTrust = computed(
    () => businessType.value === 4 && businessType.value !== null
  )

  // Consorciado
  const isConsortium = computed(() => consortium.value === true)

  const dynamicResources = [
    {
      name: 'trustor',
      label: 'Fideicomitentes',
      showButton: isTypesInvestmentFundsOrTrustCompany,
      titleModal: 'Registro de Fideicomitentes',
      type_resource: 2,
    },
    {
      name: 'participation_beneficiaries',
      label: 'Beneficiarios de participación',
      showButton: isTypesInvestmentFundsOrTrustCompany,
      titleModal: 'Registro de Beneficiario de participación',
      type_resource: 3,
    },
    {
      name: 'obligation_beneficiaries',
      label: 'Beneficiarios de obligación',
      showButton: isGuaranteeTrust,
      titleModal: 'Registro de Beneficiario de obligación',
      type_resource: 1,
    },
    {
      name: 'consortium_members',
      label: 'Consorciados',
      showButton: isConsortium,
      titleModal: 'Registro de Consorciados',
      type_resource: 4,
    },
  ]

  const staticResources = [
    { name: 'accounting', label: 'Contabilidad' },
    { name: 'treasury', label: 'Tesorería' },
    { name: 'regulation', label: 'Normativa' },
    { name: 'cxp', label: 'Cuentas por pagar' },
    { name: 'derived_contracting', label: 'Contratación derivada' },
    { name: 'budget', label: 'Presupuesto' },
    { name: 'fiduciary_fee', label: 'Comisión fiduciaria' },
  ]

  const register_expansion = ref([
    ...dynamicResources,
    ...staticResources.map((item) => ({
      ...item,
      showButton: false,
      type_resource: undefined,
      titleModal: undefined,
    })),
  ])

  // table
  const tablePropsEntity = ref({
    loading: false,
    columns: [
      {
        name: 'name',
        required: true,
        field: (row) => row.third_party?.name,
        label: 'Cliente',
        align: 'center',
        sortable: true,
      },
      {
        name: 'percentage_participation',
        field: 'percentage_participation',
        required: true,
        label: '% de participación',
        align: 'center',
        sortable: true,
      },
      {
        name: 'actions',
        required: false,
        label: 'Acciones',
        align: 'center',
        field: 'actions',
      },
    ] as QTable['columns'],
    rows: [] as ITrustBusinessRequest[],
    pages: {
      currentPage: ref(1),
      lastPage: ref(1),
    },
  })

  const deleteRegister = (row: ITrustBusinessRequest) => {
    const index = data_business_resources.value?.findIndex(
      (item) => item === row
    )

    if (index !== -1 && index !== undefined) {
      data_business_resources.value?.splice(index, 1)
    }
  }

  const alertModalRef = ref()

  // Referencias a formularios
  const informationFormRef = ref()

  const registerSelected = ref<{
    name: string
    label: string
    showButton: boolean
    titleModal?: string
    type_resource?: number
  } | null>(null)

  const getAccountingModels = ref<IBusinessAccounting | null>(null)
  const getTreasuryModels = ref<IBusinessTreasury | null>(null)
  const getCxPModels = ref<IBusinessCxPTrustBusiness | null>(null)
  const getRegulationModels = ref<IRegulationTrustBusiness[] | null>(null)
  const getDerivedContractingModels = ref<IBusinessDerivedContracting | null>(
    null
  )
  const getBudgetModels = ref<IBusinessBudget | null>(null)

  const accountingRef = ref<ComponentPublicInstance<QExpansionItem> | null>(
    null
  )
  const treasuryRef = ref<ComponentPublicInstance<QExpansionItem> | null>(null)
  const cxpRef = ref<ComponentPublicInstance<QExpansionItem> | null>(null)
  const regulationRef = ref<ComponentPublicInstance<QExpansionItem> | null>(
    null
  )
  const derivateContratingRef =
    ref<ComponentPublicInstance<QExpansionItem> | null>(null)
  const bugetRef = ref<ComponentPublicInstance<QExpansionItem> | null>(null)

  const accounting_trust_business_form_ref = ref()
  const treasury_trust_business_form_ref = ref()
  const cxp_treasury_trust_business_form_ref = ref()
  const regulation_treasury_trust_business_form_ref = ref()
  const derived_contracting_trut_business_form_ref = ref()
  const budget_trust_business_form_ref = ref()

  const closeAlertModalRef = () => {
    alertModalRef.value?.closeModal()
  }

  // Limpia el objeto de valores null, undefined o vacios
  const removeEmpty = (obj: object) =>
    Object.fromEntries(
      Object.entries(obj).filter(
        ([_, v]) => v !== null && v !== undefined && v !== '' && v !== 0
      )
    )

  // Datos básicos form
  const makeBaseInfoRequest = (data: ITrustBusinessInformationForm) => {
    let request: Partial<ITrustBusinessToCreate> = {
      register_type: data.register_type ?? null,
      business_code: data.business_code ?? null,
      name: data.name ?? null,
      classification: data.classification ?? null,
      start_date: data.start_date ?? null,
      manage_budget: data.manage_budget,
      derivate_contracting: data.derivate_contracting,
      has_policy: data.has_policy,
      has_guarantee: data.has_guarantee,
      has_real_estate_project: data.has_real_estate_project,
      status_id: data.status_id ?? null,
      business_manager_id: data.business_manager
        ? Number(data.business_manager)
        : null,
      business_subtype_id: data.business_subtype
        ? Number(data.business_subtype)
        : null,
      business_type_id: data.business_type ? Number(data.business_type) : null,
    }

    if (data.register_type === 'Fideicomiso') {
      request = {
        ...request,
        business_mod: data.business_mod ?? null,
        filing_date_sfc: data.filing_date_sfc ?? null,
        end_date: data.end_date ?? null,
        start_date_commission: data.start_date_commission ?? null,
        has_extend: data.has_extend ?? null,
        extend_date: data.extend_date ?? null,
        accountability_period: data.accountability_period ?? null,
        consortium: data.consortium,
        observations: data.observations ?? null,
      }
    }

    return removeEmpty(request)
  }

  const makeDataRequest = () => {
    if (!data_information_form.value)
      throw new Error('El formulario de negocio fiduciario no está disponible.')

    const businessStructures = getAccountingModels.value
      ?.business_account_structures
      ? [...getAccountingModels.value.business_account_structures]
      : []

    if (
      !getAccountingModels.value?.has_tax_structure &&
      businessStructures.length > 2
    ) {
      businessStructures.splice(2, 1)
    }

    if (!getAccountingModels.value?.has_equivalent_structure) {
      businessStructures.splice(1, 1)
    }
    const accountingCopy = {
      ...getAccountingModels.value,
      business_account_structures: businessStructures ?? [],
    } as IBusinessAccounting

    const apiRequestBody: Partial<ITrustBusinessToCreate> = {
      ...makeBaseInfoRequest(data_information_form.value),
      business_accounting: accountingCopy,
      business_treasurie: getTreasuryModels.value,
      business_resources: data_business_resources.value?.length
        ? data_business_resources.value
        : null,
      business_account_payable: getCxPModels.value,
      business_normative: getRegulationModels.value,
      business_derivate_contrating: isDerivateEnabled.value
        ? getDerivedContractingModels.value
        : undefined,
      business_budget: getBudgetModels.value,
    }

    if (!getAccountingModels.value) {
      delete apiRequestBody.business_accounting
    }

    return apiRequestBody
  }

  const handleDocumentsUpload = async (
    businessId: number,
    files: IFileField[]
  ): Promise<void> => {
    const documentIds: string[] = []
    const uploadUrls: string[] = []
    const filesToUpload: IUploadedFile[] = []

    for (const fileField of files) {
      const file = fileField.file
      if (!file) continue

      const { success, documentId, uploadUrl } = await _addTrustBusinessFile(
        businessId,
        {
          name: file.name,
          document_type: getExtensionFromMimeType(file.type),
        }
      )

      if (!success || !documentId || !uploadUrl) continue

      documentIds.push(documentId.toString())
      uploadUrls.push(uploadUrl)
      filesToUpload.push(file)
    }

    if (!uploadUrls.length || !filesToUpload.length) return

    await _saveDocumentsS3(uploadUrls, filesToUpload)
    await _updateTrustBusinessDocuments(businessId, {
      documents: documentIds,
      is_validated: true,
    })
  }

  const openAlertModal = async (idx: number) => {
    registerSelected.value = register_expansion.value[idx]
    await alertModalRef.value?.openModal()
  }

  const validateForms = async () => {
    let valid: boolean = false
    const forms = [informationFormRef]

    if (tabActiveIdx.value >= 0 && tabActiveIdx.value < forms.length) {
      try {
        valid =
          (await forms[tabActiveIdx.value]?.value?.validateForm()) ?? false
      } catch {
        valid = false
      }
    }
    return valid
  }

  const expandAccounting = () => {
    accountingRef.value?.show()
  }

  const expandTreasury = () => {
    treasuryRef.value?.show()
  }
  const expandDerivateContracting = () => {
    derivateContratingRef.value?.show()
  }

  const expandCxp = () => {
    cxpRef.value?.show()
  }

  const expandRegulation = () => {
    regulationRef.value?.show()
  }
  const expandBuget = () => {
    bugetRef.value?.show()
  }

  const nextTab = async () => {
    if (await validateForms()) {
      const validFormAccounting =
        await accounting_trust_business_form_ref.value?.[0]?.validateForm()

      if (!validFormAccounting && getAccountingModels.value) {
        expandAccounting()
        return
      }

      const validFormTreasury =
        await treasury_trust_business_form_ref.value?.[0].validateForm()

      if (!validFormTreasury && getTreasuryModels.value) {
        expandTreasury()
        return
      }

      const validFormCxp =
        await cxp_treasury_trust_business_form_ref.value?.[0].validateForm()

      if (!validFormCxp && getCxPModels.value) {
        expandCxp()
        return
      }

      const validFormRegulation =
        await regulation_treasury_trust_business_form_ref.value?.[0].validateForm()

      if (!validFormRegulation && getRegulationModels.value) {
        expandRegulation()
      }

      const validDerivateContrating =
        await derived_contracting_trut_business_form_ref.value?.[0]?.validateForm()

      if (!validDerivateContrating && getDerivedContractingModels.value) {
        expandDerivateContracting()
        return
      }

      const validFormBudget =
        await budget_trust_business_form_ref.value?.[0].validateForm()

      if (!validFormBudget && getBudgetModels.value) {
        expandBuget()
        return
      }
    }
    tabActiveIdx.value = tabActiveIdx.value + 1
    tabActive.value = tabs.value[tabActiveIdx.value].name
  }

  const backTab = () => {
    tabActiveIdx.value = tabActiveIdx.value - 1
    tabActive.value = tabs.value[tabActiveIdx.value].name
  }

  const onSubmit = async () => {
    openMainLoader(true)
    const payload = makeDataRequest()

    const businessId = await _createTrustBusiness(payload)
    if (businessId) {
      // Subida de documentos
      const documentFiles = data_documents_form.value?.documentFiles
      if (documentFiles?.length)
        await handleDocumentsUpload(businessId, documentFiles)

      router.push({ name: 'TrustBusinessesList' })
    }
    openMainLoader(false)
  }
  const isDerivateEnabled = computed(() => {
    return data_information_form.value?.derivate_contracting ?? false
  })

  const isBudgetEnabled = computed(() => {
    return data_information_form.value?.manage_budget ?? false
  })

  onBeforeMount(async () => {
    _clearData()
    openMainLoader(true)
    getResources(`keys[]=${last_key.join('&keys[]=')}`)
    Promise.all([
      getResources(`keys[]=${keys.join('&keys[]=')}`),
      _getResources(trust_business_keys),
      _getResources(third_parties_keys),
    ])

    setTimeout(() => {
      openMainLoader(false)
    }, 5000)
  })

  onBeforeUnmount(async () => {
    await _resetKeys(trust_business_keys)
    await _resetKeys(third_parties_keys)
  })

  watch(
    () => data_business_resources.value,
    () => {
      tablePropsEntity.value.rows = data_business_resources.value ?? []
    }
  )

  return {
    headerProps,
    tabs,
    tabActive,
    tabActiveIdx,
    register_expansion,
    informationFormRef,
    alertModalRef,
    registerSelected,
    getAccountingModels,
    getTreasuryModels,
    data_business_resources,
    accounting_trust_business_form_ref,
    treasury_trust_business_form_ref,
    tablePropsEntity,
    accountingRef,
    treasuryRef,
    isDerivateEnabled,
    getCxPModels,
    cxp_treasury_trust_business_form_ref,
    cxpRef,
    getRegulationModels,
    regulation_treasury_trust_business_form_ref,
    regulationRef,

    derived_contracting_trut_business_form_ref,
    getDerivedContractingModels,
    isBudgetEnabled,
    getBudgetModels,
    budget_trust_business_form_ref,

    // Methods
    closeAlertModalRef,
    nextTab,
    backTab,
    onSubmit,
    openAlertModal,
    deleteRegister,
  }
}

export default useTrustBusinessesCreate
