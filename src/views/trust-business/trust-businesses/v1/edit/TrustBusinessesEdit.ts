// vue - quasar - pinia
import {
  ref,
  onBeforeMount,
  computed,
  watch,
  ComponentPublicInstance,
  onBeforeUnmount,
} from 'vue'
import { storeToRefs } from 'pinia'
import { useRoute, useRouter } from 'vue-router'
import { QExpansionItem, QTable } from 'quasar'

// Utils
import { defaultIconsLucide } from '@/utils'

// Composables
import { useMainLoader, useS3Documents } from '@/composables'

// Stores
import { useResourceStore } from '@/stores/resources-selects'
import { useTrustBusinessStore } from '@/stores/trust-business/trust-businesses'

// Interfaces
import {
  ITrustBusinessInformationForm,
  ITrustBusinessToEdit,
  IBusinessAccounting,
  IBusinessTreasury,
  ITrustBusinessRequest,
  IBusinessCxPTrustBusiness,
  IRegulationTrustBusiness,
  IBillingCollect,
  IBusinessDerivedContracting,
  IBusinessBudget,
} from '@/interfaces/customs/trust-business/TrustBusinesses'

import { ITabs, IFileField, IUploadedFile } from '@/interfaces/global'
import { useResourceManagerStore } from '@/stores/resources-manager'

const useTrustBusinessesEdit = () => {
  const {
    _updateTrustBusiness,
    _getByIdTrustBusiness,
    _addTrustBusinessFile,
    _updateTrustBusinessDocuments,
    _deleteTrustBusinessDocuments,
    _clearData,
  } = useTrustBusinessStore('v1')
  const {
    data_information_form,
    data_documents_form,
    trust_business_response,
    data_business_resources,
  } = storeToRefs(useTrustBusinessStore('v1'))

  const router = useRouter()
  const route = useRoute()
  const searchId = +route.params.id

  const { _getResources, _resetKeys } = useResourceManagerStore('v1')
  const { getResources } = useResourceStore('v1')
  const { openMainLoader } = useMainLoader()
  const { _saveDocumentsS3, getExtensionFromMimeType } = useS3Documents()

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
    title: 'Editar negocio fiduciario',
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
        label: 'Editar',
      },
      {
        label: `${searchId}`,
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

  // Preoperativa
  const is_pre_operational_status = computed(() => {
    return data_information_form.value?.status_id === 56
  })

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
      label: 'Fideicomitente',
      showButton:
        is_pre_operational_status && isTypesInvestmentFundsOrTrustCompany,
      titleModal: 'Registro de Fideicomitentes',
      type_resource: 2,
    },
    {
      name: 'participation_beneficiaries',
      label: 'Beneficiarios de participación',
      showButton:
        is_pre_operational_status && isTypesInvestmentFundsOrTrustCompany,
      titleModal: 'Registro de Beneficiario de participación',
      type_resource: 3,
    },
    {
      name: 'obligation_beneficiaries',
      label: 'Beneficiarios de obligación',
      showButton: is_pre_operational_status && isGuaranteeTrust,
      titleModal: 'Registro de Beneficiario de obligación',
      type_resource: 1,
    },
    {
      name: 'consortium_members',
      label: 'Consorciados',
      showButton: is_pre_operational_status && isConsortium,
      titleModal: 'Registro de Consorciados',
      type_resource: 4,
    },
  ]

  const staticResources = [
    { name: 'accounting', label: 'Contabilidad' },
    { name: 'treasury', label: 'Tesoreria' },
    { name: 'regulation', label: 'Normativa' },
    { name: 'cxp', label: 'Cuentas por pagar' },
    { name: 'derived_contracting', label: 'Contratación derivada' },
    { name: 'budget', label: 'Presupuesto' },
    { name: 'fiduciary_fee', label: 'Comisión fiduciaria' },
    { name: 'billing', label: 'Facturación' },
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
  const getBillingModels = ref<IBillingCollect[]>([])
  const getRegulationModels = ref<IRegulationTrustBusiness[]>([])
  const getDerivedContractingModels = ref<IBusinessDerivedContracting | null>(
    null
  )
  const getBudgetModels = ref<IBusinessBudget | null>(null)

  const accounting_trust_business_form_ref = ref()
  const treasury_trust_business_form_ref = ref()
  const cxp_treasury_trust_business_form_ref = ref()
  const billing_trust_business_form_ref = ref()
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
    let request: Partial<ITrustBusinessToEdit> = {
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

    const apiRequestBody: Partial<ITrustBusinessToEdit> = {
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
      business_budget: isBudgetEnabled.value
        ? getBudgetModels.value
        : undefined,
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

  const accountingRef = ref<ComponentPublicInstance<QExpansionItem> | null>(
    null
  )
  const treasuryRef = ref<ComponentPublicInstance<QExpansionItem> | null>(null)
  const cxpRef = ref<ComponentPublicInstance<QExpansionItem> | null>(null)
  const billingRef = ref<ComponentPublicInstance<QExpansionItem> | null>(null)
  const regulationRef = ref<ComponentPublicInstance<QExpansionItem> | null>(
    null
  )
  const derivateContratingRef =
    ref<ComponentPublicInstance<QExpansionItem> | null>(null)

  const budgeRef = ref<ComponentPublicInstance<QExpansionItem> | null>(null)

  const expandAccounting = () => {
    accountingRef.value?.show()
  }

  const expandTreasury = () => {
    treasuryRef.value?.show()
  }

  const expandCxp = () => {
    cxpRef.value?.show()
  }

  const expandBilling = () => {
    billingRef.value?.show()
  }

  const expandRegulation = () => {
    regulationRef.value?.show()
  }
  const expandDerivateContracting = () => {
    derivateContratingRef.value?.show()
  }

  const expandBuget = () => {
    budgeRef.value?.show()
  }

  const nextTab = async () => {
    if (await validateForms()) {
      // validacion contabilidad
      const validFormAccounting =
        await accounting_trust_business_form_ref.value?.[0]?.validateForm()

      if (!validFormAccounting && getAccountingModels.value)
        return expandAccounting()

      // validacion tesoreria
      const validFormTreasury =
        await treasury_trust_business_form_ref.value?.[0].validateForm()

      if (!validFormTreasury && getTreasuryModels.value) return expandTreasury()

      // validacion cuentas por pagar
      const validFormCxp =
        await cxp_treasury_trust_business_form_ref.value?.[0].validateForm()

      if (!validFormCxp && getCxPModels.value) return expandCxp()

      // validacion
      const validFormBilling =
        await billing_trust_business_form_ref.value?.[0].validateForm()

      if (!validFormBilling && getBillingModels.value) return expandBilling()

      // validacion de normativo
      const validFormRegulation =
        await regulation_treasury_trust_business_form_ref.value?.[0].validateForm()

      if (!validFormRegulation && getRegulationModels.value)
        return expandRegulation()

      // validacion contracion derivada
      if (isDerivateEnabled.value) {
        const validDerivateContrating =
          await derived_contracting_trut_business_form_ref.value?.[0]?.validateForm()

        if (!validDerivateContrating && getDerivedContractingModels.value) {
          expandDerivateContracting()
          return
        }
      }
      // validacion presupuesto
      if (isBudgetEnabled.value) {
        const validFormBudget =
          await budget_trust_business_form_ref.value?.[0]?.validateForm()

        if (!validFormBudget && getBudgetModels.value) {
          expandBuget()
          return
        }
      }

      tabActiveIdx.value = tabActiveIdx.value + 1
      tabActive.value = tabs.value[tabActiveIdx.value].name
    }
  }

  const backTab = () => {
    tabActiveIdx.value = tabActiveIdx.value - 1
    tabActive.value = tabs.value[tabActiveIdx.value].name
  }

  const onSubmit = async () => {
    openMainLoader(true)
    const payload = makeDataRequest()

    const success = await _updateTrustBusiness(payload, searchId)

    if (success) {
      // Eliminación de documentos
      const documentIdsToDelete = data_documents_form.value?.documentIdsToDelete
      if (documentIdsToDelete?.length)
        await _deleteTrustBusinessDocuments(searchId, {
          documents: documentIdsToDelete,
        })

      // Subida de nuevos documentos
      const documentFilesToUpload = data_documents_form.value?.documentFiles
      if (documentFilesToUpload?.length)
        await handleDocumentsUpload(searchId, documentFilesToUpload)

      router.push({ name: 'TrustBusinessesList' })
    }
    openMainLoader(false)
  }

  const computedParticipation = computed(() => {
    return (register_expansion: { type_resource: number }): number => {
      if (!tablePropsEntity.value.rows) return 0

      return tablePropsEntity.value.rows
        .filter(
          (item: ITrustBusinessRequest) =>
            item.type_resource === register_expansion.type_resource
        )
        .reduce((sum: number, item: ITrustBusinessRequest) => {
          const participation = parseFloat(item.percentage_participation || '0')
          return sum + (isNaN(participation) ? 0 : participation)
        }, 0)
    }
  })

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
      _getByIdTrustBusiness(searchId),
      _getResources(trust_business_keys),
      _getResources(third_parties_keys),
    ])

    openMainLoader(false)
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

  watch(
    () => trust_business_response.value,
    () => {
      const data = trust_business_response.value?.accounting ?? null

      if (data) {
        getAccountingModels.value = {
          address: data.address ?? null,
          country_id: data.contry?.id ?? null,
          department_id: data.departament?.id ?? null,
          city_id: data.city?.id ?? null,
          retaining_agent_id: data.retaining_agent?.id ?? null,
          status_id: data.status?.id ?? null,
          accounting_structure_id: data.accounting_structure?.id ?? null,
          has_fiscal_responsibility: data.has_fiscal_responsibility ?? null,
          has_responsibility_iva: data.has_responsibility_iva ?? null,
          cost_center_structure_id: data.cost_center_structure?.id ?? null,
          auxiliary_nit: data.nit_auxiliary?.document_number ?? null,
          identification_tax: data.tax_identification?.document_number ?? null,
          has_cost_center:
            typeof data.has_cost_center === 'boolean'
              ? data.has_cost_center
              : null,
          functional_business_currency:
            data.functional_business_currency ?? null,
          has_consolidator: data.has_consolidator ?? null,
          can_foreign_currency: data.can_foreign_currency ?? null,
          can_retains_ica: data.can_retains_ica ?? null,
          retains_differential_ica: data.retains_differential_ica ?? null,
          startup_period: data.startup_period ?? null,
          current_period: data.current_period ?? null,
          last_closing: data.last_closing ?? null,
          last_closing_daily: data.last_closing_daily ?? null,
          last_closing_day: data.last_closing_day ?? null,
          daily_closing: data.daily_closing ?? null,
          last_restatement_foreign_currency:
            data.last_restatement_foreign_currency ?? null,
          business_account_structures:
            data.business_account_structures?.map((item) => ({
              ...item,
              account_structure_id: item.account_structure?.id,
            })) ?? [],
          has_tax_structure: data.has_tax_structure,
          has_equivalent_structure: data.has_equivalent_structure,
        }
      }

      const dataTreasury = { ...trust_business_response.value?.treasurie }
      if (dataTreasury) {
        getTreasuryModels.value = {
          closing: dataTreasury.closing ?? null,
          last_close_date: dataTreasury.last_close_date ?? null,
          has_cash_flow: dataTreasury.has_cash_flow ?? null,
          can_bank_reconciliation: dataTreasury.can_bank_reconciliation ?? null,
          last_conciliation_date: dataTreasury.last_conciliation_date ?? null,
          cash_flow_structure:
            dataTreasury.cash_flow_structure?.purpose ?? null,
          cash_flow_structure_id: dataTreasury.cash_flow_structure?.id ?? null,
          has_collection_structure:
            dataTreasury.has_collection_structure ?? null,
          has_box_structure: dataTreasury.has_box_structure ?? null,
          collection_structure_id:
            dataTreasury.collection_structure?.id ?? null,
          box_structure_id: dataTreasury.box_structure?.id ?? null,
        }
      }

      const dataCxP = {
        ...trust_business_response.value?.accounts_payable,
      }

      getCxPModels.value = dataCxP
        ? {
            closing: dataCxP.closing ?? null,
            last_closing_date: dataCxP.last_closing_date ?? null,
            validity: dataCxP.validity ?? null,
            account_structure_id: dataCxP.account_structure?.id ?? null,
          }
        : null

      if (trust_business_response.value?.normative) {
        getRegulationModels.value =
          trust_business_response.value?.normative ?? []
      }

      if (trust_business_response.value?.billing_collect) {
        getBillingModels.value =
          trust_business_response.value?.billing_collect ?? []
      }
      const dataDerivateContranting = {
        ...trust_business_response.value?.derivate_contrating,
      }
      if (dataDerivateContranting) {
        getDerivedContractingModels.value = {
          has_budget: dataDerivateContranting.has_budget ?? false,
          has_project: dataDerivateContranting.has_project ?? false,
          has_structure_work:
            dataDerivateContranting.has_structure_work ?? false,
          derivate_works_plan:
            dataDerivateContranting.works_plan?.map((item) => ({
              work_plan_id: item.id ?? null,
              id: item.id,
            })) ?? [],
        }
      }

      if (trust_business_response.value?.billing_collect) {
        getBillingModels.value =
          trust_business_response.value?.billing_collect ?? []
      }

      const dataBudget = {
        ...trust_business_response.value?.budget,
      }

      if (dataBudget) {
        getBudgetModels.value = {
          validity: dataBudget.validity ?? null,
          current_month: dataBudget.current_month ?? null,
          current_month_id: dataBudget.current_month_id ?? null,
          last_closing_date: dataBudget.last_closing_date ?? null,
          closing_type: dataBudget.closing_type ?? null,
          mhcp_section_code: Number(dataBudget.mhcp_section_code ?? null),
          mhcp_section_description: dataBudget.mhcp_section_description ?? null,
          budget_structure_id: dataBudget.budget_structure_id ?? null,
          generic_area_id: dataBudget.generic_area_id ?? null,
          expense_authorizer_id: dataBudget.expense_authorizer_id ?? null,
          id: dataBudget.id ?? null,
          budget_structure_code: dataBudget.budget_structure_code ?? null,
        }
      }
    },
    { immediate: true, deep: true }
  )

  return {
    trust_business_response,
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
    getBillingModels,
    billing_trust_business_form_ref,
    billingRef,
    getRegulationModels,
    regulation_treasury_trust_business_form_ref,
    regulationRef,
    derived_contracting_trut_business_form_ref,
    getDerivedContractingModels,
    derivateContratingRef,
    getBudgetModels,
    isBudgetEnabled,
    budget_trust_business_form_ref,
    budgeRef,

    // Methods
    closeAlertModalRef,
    nextTab,
    backTab,
    onSubmit,
    openAlertModal,
    deleteRegister,
    computedParticipation,
  }
}

export default useTrustBusinessesEdit
