// Vue
import { ref, computed, watch } from 'vue'

// Quasar
import { QForm } from 'quasar'

// Pinia
import { storeToRefs } from 'pinia'

// Interfaces
import {
  IBankContact,
  ISeizuresCreateForm,
  ISeizedAssetsList,
} from '@/interfaces/customs/seizures/Seizures'
import { ActionType, IBaseTableProps } from '@/interfaces/global'
import { TYPE_OF_ASSET_OPTIONS } from '@/constants/resources/seizures'

// Composables
import { useUtils } from '@/composables/useUtils'

// Stores
import { useThirdPartyResourceStore } from '@/stores/resources-manager/third-party'
import { useTrustBusinessResourceStore } from '@/stores/resources-manager/trust-business'
import { useAssetResourceStore } from '@/stores/resources-manager/assets'
import { useFicResourceStore } from '@/stores/resources-manager/fics'
import { useTreasuryResourceStore } from '@/stores/resources-manager/treasury'
import { useFixedAssetsResourceStore } from '@/stores/resources-manager/fixed-assets'
import { useSeizuresResourcesStore } from '@/stores/resources-manager/seizures'

// Stores resource manager
import { useResourceManagerStore } from '@/stores/resources-manager'
import { IBankAccountWithContactsResource } from '@/interfaces/customs'

const useSeizuresCreateForm = (
  props: {
    action: ActionType
    data?: ISeizuresCreateForm
  },
  emit?: (e: 'update:data', value: ISeizuresCreateForm) => void
) => {
  const SeizuresFormRef = ref<QForm | null>(null)
  const modalFormRef = ref<QForm | null>(null)
  const hasInitialized = ref(false)
  const { getMaxId, formatCurrency, formatDate, defaultIconsLucide } =
    useUtils()

  const { third_parties } = storeToRefs(useThirdPartyResourceStore('v1'))
  const {
    business_trusts,
    business_trust_participants,
    business_trusts_participants_for_business,
    business_trusts_participants_for_third_party,
  } = storeToRefs(useTrustBusinessResourceStore('v1'))
  const { cities } = storeToRefs(useAssetResourceStore('v1'))
  const { fiduciary_investment_plans } = storeToRefs(useFicResourceStore('v1'))
  const { bank_accounts_with_name } = storeToRefs(
    useTreasuryResourceStore('v1')
  )
  const { fixed_assets } = storeToRefs(useFixedAssetsResourceStore('v1'))
  const {
    seizure_assets_products_types,
    management_areas,
    courst,
    process_types,
    type_defendants,
    seizure_status,
  } = storeToRefs(useSeizuresResourcesStore('v1'))
  const { _getResources } = useResourceManagerStore('v1')

  const isViewMode = computed(() => props.action === 'view')
  const isEditMode = computed(() => props.action === 'edit')

  const formData = ref<ISeizuresCreateForm>({
    process_number: '',
    order_number: '',
    court_id: null,
    claimant_id: null,
    type_defendant_id: null,
    defendant_id: null,
    business_trusts_id: null,
    order_date: formatDate(new Date().toString(), 'YYYY-MM-DD'),
    awareness_date: formatDate(new Date().toString(), 'YYYY-MM-DD'),
    seizure_date: formatDate(new Date().toString(), 'YYYY-MM-DD'),
    value_seizure: 0,
    active_seizure_total: 0,
    city_id: null,
    management_area_id: null,
    process_type_id: null,
    observations: '',
    value_paid: 0,
    assets: [],
    claimant_object: null,
    defendant_object: null,
    business_trusts_object: null,
    city_object: null,
    status_id: null,
    has_assigned_business: null,
    document: null,
  })

  const typeOfAssetOptions = TYPE_OF_ASSET_OPTIONS

  const tableAssets = ref<IBaseTableProps<ISeizedAssetsList>>({
    title: 'Bienes embargados',
    loading: false,
    columns: [
      {
        name: 'asset_type',
        label: 'Tipo de bien',
        field: (row) =>
          typeOfAssetOptions.find((t) => t.value === row.asset_type)?.label,
        sortable: true,
        align: 'left',
      },
      {
        name: 'description',
        label: 'Descripción',
        field: 'description',
        sortable: true,
        align: 'left',
      },
      {
        name: 'value',
        label: 'Valor / saldo',
        field: (row) => {
          if (
            row.seizure_assets_products_type_id === 4 &&
            row.percentage !== null
          ) {
            return `${row.percentage}%`
          }

          return formatCurrency(row.value)
        },
        sortable: true,
        align: 'left',
      },

      {
        name: 'actions',
        label: 'Acciones',
        field: 'id',
        sortable: true,
        align: 'center',
      },
    ],
    rows: formData.value.assets,
    pages: { currentPage: 1, lastPage: 1 },
  })

  const assetsPagination = ref({
    currentPage: 1,
    lastPage: 1,
    rowsPerPage: 20,
    rowsNumber: 0,
  })

  const updatePagination = () => {
    const total = formData.value.assets.length
    assetsPagination.value.rowsNumber = total
    assetsPagination.value.lastPage = Math.max(
      1,
      Math.ceil(total / assetsPagination.value.rowsPerPage)
    )
  }

  const updateAssetsPage = (page: number) => {
    assetsPagination.value.currentPage = page
  }

  const updateAssetsRows = (rows: number) => {
    assetsPagination.value.rowsPerPage = rows
    updatePagination()
  }

  const isModalOpen = ref(false)

  const modalForm = ref({
    type_of_asset: 0,
    seizure_assets_products_type_id: null,
    active_fixed_id: null as number | null,
    folio: '',
    product_id: null as number | null,
    trustee_id: null as number | null,
    description: '',
    asset_value: 0,
    percentage: 0,
  })
  const documentFile = ref<File | null>(null)

  const isBankContactsModalOpen = ref(false)
  const ficProducts = ref<{ id: number; name: string; balance: number }[]>([])
  const bankAccounts = ref<{ id: number; label: string; balance: number }[]>([])
  const trustees = ref<{ id: number; name: string; percentage: number }[]>([])

  const isRealProperty = computed(() => modalForm.value.type_of_asset === 1)
  const isMovable = computed(() => modalForm.value.type_of_asset === 2)
  const isInvestmentFund = computed(
    () => modalForm.value.seizure_assets_products_type_id === 2
  )
  const isAccountsBank = computed(
    () => modalForm.value.seizure_assets_products_type_id === 3
  )
  const isFiduciaryRights = computed(
    () => modalForm.value.seizure_assets_products_type_id === 4
  )

  const isBusinessDisabled = computed(() => {
    if (isViewMode.value || isEditMode.value) return true
    if (!formData.value.type_defendant_id) return true
    if (isDefendantBusiness.value) return true

    return false
  })

  const defendantOptions = computed(() => {
    return isDefendantBusiness.value
      ? business_trusts.value
      : third_parties.value
  })

  const seizureAssetsProductsTypesFiltered = computed(() =>
    seizure_assets_products_types.value.filter((item) => item.id !== 1)
  )

  const isDefendantDisabled = computed(() => {
    if (isViewMode.value || isEditMode.value) return true
    return !formData.value.type_defendant_id
  })

  const isDefendantBusiness = computed(() => {
    return formData.value.type_defendant_id === 2
  })

  const isSociedadFiduciaria = computed(
    () => formData.value.type_defendant_id === 3
  )

  const hasBusinessAssigned = computed<boolean>({
    get: () => !!formData.value.has_assigned_business,
    set: (val) => {
      formData.value.has_assigned_business = val
    },
  })

  const showBusinessField = computed(
    () => hasBusinessAssigned.value && !isSociedadFiduciaria.value
  )

  const showAssetsSection = computed(() => hasBusinessAssigned.value === false)

  const hasDownloadableAttachment = computed(() => {
    if (!isViewMode.value) return false

    const doc = formData.value.document

    return (
      !!doc &&
      typeof doc === 'object' &&
      !(doc instanceof File) &&
      's3_url_path' in doc
    )
  })

  const openAssetModal = async () => {
    if (isViewMode.value) return
    isModalOpen.value = true

    modalForm.value = {
      type_of_asset: 0,
      seizure_assets_products_type_id: null,
      active_fixed_id: null,
      folio: '',
      product_id: null,
      trustee_id: null,
      description: '',
      asset_value: 0,
      percentage: 0,
    }

    const trustId =
      formData.value?.business_trusts_id ??
      formData.value.business_trusts_object?.value
    if (trustId) {
      await _getResources(
        { trust_business: ['business_trust_participants'] },
        `filter[business_trust_id]=${trustId}&filter[type_resource]=2`
      )
      useTrustBusinessResourceStore('v1').loadTrustessForThirdParty()
    }
  }

  const closeAssetModal = () => {
    isModalOpen.value = false
  }

  const handleConfirmAsset = async () => {
    const isValid = await modalFormRef.value?.validate()
    if (!isValid) return

    saveAsset()
  }

  const saveAsset = () => {
    const assetClass =
      modalForm.value.type_of_asset === 1 ? 'Inmueble (INM)' : 'Mueble (MUB)'

    const productType = seizure_assets_products_types.value.find(
      (t) =>
        t.id ===
        (modalForm.value.type_of_asset === 1
          ? 1
          : modalForm.value.seizure_assets_products_type_id)
    )

    const assetableType = productType?.repository ?? ''

    const assetableId =
      modalForm.value.type_of_asset === 1
        ? Number(modalForm.value.active_fixed_id ?? 0)
        : Number(modalForm.value.product_id ?? 0)

    let description = ''

    if (modalForm.value.type_of_asset === 1) {
      description = 'Activo fijo'
    } else {
      if (modalForm.value.seizure_assets_products_type_id === 2)
        description = 'Fondo de inversión'
      if (modalForm.value.seizure_assets_products_type_id === 3)
        description = 'Cuenta bancaria'
      if (modalForm.value.seizure_assets_products_type_id === 4)
        description = 'Derechos fiduciarios'
    }

    const resolvedAssetValue =
      modalForm.value.seizure_assets_products_type_id === 4
        ? Number(modalForm.value.percentage ?? 0)
        : Number(modalForm.value.asset_value ?? 0)

    const item: ISeizedAssetsList = {
      id: getMaxId(formData.value.assets, 'id'),
      backend_id: undefined,
      asset_type: modalForm.value.type_of_asset,
      description,

      value: resolvedAssetValue,
      asset_value: resolvedAssetValue,

      seizure_assets_products_type_id:
        modalForm.value.type_of_asset === 1
          ? 1
          : modalForm.value.seizure_assets_products_type_id,

      asset_class: assetClass,
      assetable_type: assetableType,
      assetable_id: assetableId,

      percentage:
        modalForm.value.seizure_assets_products_type_id === 4
          ? modalForm.value.percentage
          : null,
    }

    formData.value.assets.push(item)
    tableAssets.value.rows = [...formData.value.assets]
    updatePagination()
    isModalOpen.value = false
  }

  const removeAsset = (index: number) => {
    formData.value.assets.splice(index, 1)
    tableAssets.value.rows = [...formData.value.assets]
    updatePagination()
  }

  const getPayload = () => ({
    ...formData.value,
    assets: [...formData.value.assets],
  })

  const openBankContactsModal = (asset: ISeizedAssetsList) => {
    const accountId = asset.assetable_id
    if (!accountId) return

    const account = bank_accounts_with_name.value.find(
      (acc) => acc.id === accountId
    ) as IBankAccountWithContactsResource | undefined

    if (!account || !account.bank?.contacts) {
      bankContactsTable.value.rows = []
      isBankContactsModalOpen.value = true
      return
    }

    bankContactsTable.value.rows = account.bank.contacts.map((contact) => ({
      id: contact.id,
      name: contact.full_name,
      role: contact.job_title,
      phone: contact.mobile_phone || contact.landline_phone || '—',
      email: contact.email || '—',
      bank: account.bank?.description ?? '—',
    }))

    isBankContactsModalOpen.value = true
  }

  const bankContactsTable = ref<IBaseTableProps<IBankContact>>({
    title: 'Contactos bancarios',
    loading: false,
    columns: [
      { name: 'name', label: 'Nombre', field: 'name', align: 'left' },
      { name: 'role', label: 'Cargo', field: 'role', align: 'left' },
      { name: 'phone', label: 'Teléfono', field: 'phone', align: 'left' },
      {
        name: 'email',
        label: 'Correo electrónico',
        field: 'email',
        align: 'left',
      },
      { name: 'bank', label: 'Entidad bancaria', field: 'bank', align: 'left' },
    ],
    rows: [],
    pages: { currentPage: 1, lastPage: 1 },
  })

  const resetForm = () => {
    formData.value = {
      process_number: '',
      order_number: '',
      court_id: 0,
      claimant_id: 0,
      type_defendant_id: 0,
      defendant_id: 0,
      business_trusts_id: 0,
      order_date: formatDate(new Date().toString(), 'YYYY-MM-DD'),
      awareness_date: formatDate(new Date().toString(), 'YYYY-MM-DD'),
      seizure_date: formatDate(new Date().toString(), 'YYYY-MM-DD'),
      value_seizure: 0,
      active_seizure_total: 0,
      city_id: null,
      management_area_id: null,
      process_type_id: null,
      observations: '',
      value_paid: 0,
      assets: [],
      claimant_object: null,
      defendant_object: null,
      business_trusts_object: null,
      city_object: null,
      has_assigned_business: null,
      document: null,
    }

    tableAssets.value.rows = []
    updatePagination()
  }

  watch(
    () => props.data,
    (newVal) => {
      if (!newVal) return

      hasInitialized.value = true

      const normalizedData = {
        ...newVal,
        court_id: Number(newVal.court_id ?? 0),
        type_defendant_id: Number(newVal.type_defendant_id ?? 0),
        process_type_id: Number(newVal.process_type_id ?? 0),
        claimant_id: Number(newVal.claimant_id ?? 0),
        defendant_id: Number(newVal.defendant_id ?? 0),
        business_trusts_id: Number(newVal.business_trusts_id ?? 0),
        city_id: Number(newVal.city_id ?? 0),
        management_area_id: Number(newVal.management_area_id ?? 0),
        value_seizure: Number(newVal.value_seizure ?? 0),
        active_seizure_total: Number(newVal.active_seizure_total ?? 0),
        value_paid: Number(newVal.value_paid ?? 0),
        status_id: newVal.status_id ?? null,
      }

      Object.assign(formData.value, normalizedData)

      if (props.action === 'create' && newVal.assets) {
        const normalized = newVal.assets.map((item, index) => ({
          id: index + 1,
          backend_id: item.backend_id,
          asset_type: item.asset_type,
          description: item.description,
          value: item.asset_value,
          seizure_assets_products_type_id: item.seizure_assets_products_type_id,
          asset_value: item.asset_value,
          asset_class: item.asset_class,
          assetable_type: item.assetable_type,
          assetable_id: item.assetable_id,
          percentage:
            item.seizure_assets_products_type_id === 4
              ? Number(item.asset_value ?? 0)
              : null,
        }))

        formData.value.assets = normalized
      }

      if (props.action === 'edit') {
        formData.value.assets = [...(newVal.assets ?? [])]
      }

      tableAssets.value.rows = [...formData.value.assets]
      updatePagination()

      queueMicrotask(() => {
        hasInitialized.value = false
      })
    },
    { immediate: true, deep: true }
  )

  watch(
    () => modalForm.value.product_id,
    (newId) => {
      modalForm.value.asset_value = 0
      if (!newId) return
      if (modalForm.value.seizure_assets_products_type_id === 2) {
        const fic = fiduciary_investment_plans.value.find((p) => p.id === newId)
        if (!fic) return

        const planBalance = Number(fic?.fip_parameters?.plan_balance ?? 0)
        modalForm.value.asset_value = isNaN(planBalance) ? 0 : planBalance
      }
      if (modalForm.value.seizure_assets_products_type_id === 3) {
        const account = bank_accounts_with_name.value.find(
          (acc) => acc.id === newId
        )
        if (!account) return

        const balance =
          typeof account.last_balance === 'object' &&
          account.last_balance !== null &&
          'final_balance_local' in account.last_balance
            ? (account.last_balance as { final_balance_local?: number })
                .final_balance_local ?? 0
            : 0

        modalForm.value.asset_value = isNaN(balance) ? 0 : balance
      }
    }
  )

  watch(
    business_trust_participants,
    (newList) => {
      trustees.value = newList.map((item) => ({
        id: item.id,
        name: item.name,
        percentage: item.percentage_participation,
      }))
    },
    { immediate: true }
  )

  watch(
    () => modalForm.value.active_fixed_id,
    (newId) => {
      modalForm.value.folio = ''
      modalForm.value.asset_value = 0
      if (!newId) return
      const asset = fixed_assets.value.find((a) => a.id === newId)
      if (!asset) return
      modalForm.value.folio = asset.folio_number ?? ''
      const transactionValue = Number(
        asset.asset_transaction?.transaction_value ?? 0
      )
      modalForm.value.asset_value = isNaN(transactionValue)
        ? 0
        : transactionValue
    }
  )

  watch(courst, (newList) => {
    if (!newList || newList.length === 0) return

    if (formData.value.court_id) {
    }
  })

  watch(type_defendants, (list) => {
    if (!list || list.length === 0) return
    if (formData.value.type_defendant_id) {
    }
  })

  watch(
    () => modalForm.value.type_of_asset,
    () => {
      modalForm.value.seizure_assets_products_type_id = null
      modalForm.value.active_fixed_id = null
      modalForm.value.product_id = null
      modalForm.value.trustee_id = null

      modalForm.value.folio = ''
      modalForm.value.asset_value = 0
      modalForm.value.percentage = 0
    }
  )

  watch(
    () => modalForm.value.seizure_assets_products_type_id,
    () => {
      modalForm.value.product_id = null
      modalForm.value.trustee_id = null

      modalForm.value.asset_value = 0
      modalForm.value.percentage = 0
    }
  )

  watch(
    formData,
    (val) => {
      if (hasInitialized.value) return
      if (JSON.stringify(val) === JSON.stringify(props.data)) return
      emit?.('update:data', { ...val })
    },
    { deep: true }
  )

  watch(
    () => formData.value.type_defendant_id,
    (newVal, oldVal) => {
      if (props.action !== 'create') return

      if (!newVal || newVal !== oldVal) {
        formData.value.defendant_object = null
        formData.value.defendant_id = null
      }
    }
  )

  watch(
    () => formData.value.defendant_object,
    async (defendant) => {
      if (props.action !== 'create') return
      if (!defendant) return
      if (isDefendantBusiness.value) return

      const defendantId = defendant.value ?? defendant.id
      if (!defendantId) return

      formData.value.business_trusts_object = null
      formData.value.business_trusts_id = null

      await _getResources(
        { trust_business: ['business_trust_participants'] },
        `filter[type_resource]=2&filter[third_party_id]=${defendantId}`
      )
      useTrustBusinessResourceStore('v1').loadTrustessForBusiness()
    }
  )

  watch(
    () => formData.value.defendant_object,
    (defendant) => {
      if (!defendant || !isDefendantBusiness.value) return

      formData.value.business_trusts_object = {
        id: defendant.id ?? defendant.value,
        value: defendant.id ?? defendant.value,
        label: defendant.name ?? defendant.label,
      }
      updateBankAccountByBussinesId()
    }
  )
  watch(
    () => formData.value.type_defendant_id,
    async (newVal) => {
      if (props.action !== 'create') return

      formData.value.defendant_object = null
      formData.value.defendant_id = null
      formData.value.business_trusts_object = null
      formData.value.business_trusts_id = null

      if (newVal === 2) {
        await _getResources({
          trust_business: ['business_trusts'],
        })
      }
    }
  )

  watch(
    () => formData.value.type_defendant_id,
    (newVal) => {
      if (newVal === 3) {
        formData.value.has_assigned_business = false
        formData.value.business_trusts_object = null
        formData.value.business_trusts_id = null
      } else if (formData.value.has_assigned_business === null) {
        formData.value.has_assigned_business = true
      }
    }
  )

  const updateBankAccountByBussinesId = async () => {
    const businessId =
      formData.value?.business_trusts_object?.value ??
      formData.value?.business_trusts_object?.id

    if (!businessId) return

    const params = `include=lastBalance&filter[business_id]=${businessId}`
    await _getResources({ treasury: ['bank_account'] }, params)
  }

  const handleDocumentChange = (file: File | File[] | null) => {
    const selectedFile = Array.isArray(file) ? file[0] : file

    if (selectedFile instanceof File) {
      documentFile.value = selectedFile
      formData.value.document = selectedFile
    } else {
      documentFile.value = null
      formData.value.document = null
    }
  }

  return {
    SeizuresFormRef,
    formData,
    tableAssets,
    isViewMode,
    isEditMode,
    third_parties,
    business_trusts,
    cities,
    fixed_assets,
    ficProducts,
    bankAccounts,
    trustees,
    typeOfAssetOptions,
    isModalOpen,
    modalForm,
    assetsPagination,
    isRealProperty,
    isMovable,
    isInvestmentFund,
    isAccountsBank,
    isFiduciaryRights,
    fiduciary_investment_plans,
    bank_accounts_with_name,
    business_trusts_participants_for_third_party,
    business_trusts_participants_for_business,
    seizure_assets_products_types,
    management_areas,
    courst,
    process_types,
    type_defendants,
    seizure_status,
    seizureAssetsProductsTypesFiltered,
    bankContactsTable,
    isBankContactsModalOpen,
    modalFormRef,
    defaultIconsLucide,
    isDefendantDisabled,
    isDefendantBusiness,
    defendantOptions,
    isBusinessDisabled,
    showBusinessField,
    showAssetsSection,
    documentFile,
    hasDownloadableAttachment,
    handleDocumentChange,
    formatCurrency,
    handleConfirmAsset,
    openBankContactsModal,
    openAssetModal,
    closeAssetModal,
    saveAsset,
    updateAssetsPage,
    updateAssetsRows,
    resetForm,
    removeAsset,
    getPayload,
    updateBankAccountByBussinesId,
  }
}

export default useSeizuresCreateForm
