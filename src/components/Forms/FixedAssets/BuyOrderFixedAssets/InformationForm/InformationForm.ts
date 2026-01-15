// vue - pinia
import { computed, onBeforeUnmount, onMounted, ref, watch, nextTick } from 'vue'
import { storeToRefs } from 'pinia'

// stores
import { useFixedAssetsResourceStore } from '@/stores/resources-manager/fixed-assets'
import {
  useResourceManagerStore,
  useThirdPartyResourceStore,
  useTrustBusinessResourceStore
} from '@/stores/resources-manager'

// interfaces
import { ActionType } from '@/interfaces/global'
import {
  IBuyOrderFixedAssetsItemForm,
  IBuyOrderFixedAssetsForm,
  IBuyOrderFixedAssetsList
} from '@/interfaces/customs/fixed-assets/BuyOrderFixedAssets'

// composables
import { useUtils } from '@/composables'
const { defaultIconsLucide, formatCurrency } = useUtils()

// constants
const MAX_ITEMS = 10
const MAX_VALUE_INTEGERS = 15
const MAX_VALUE_DECIMALS = 2
const MAX_DETAIL_LENGTH = 300
const MIN_DETAIL_LENGTH = 10

const useInformationForm = (
  props: {
    action: ActionType
    data?: IBuyOrderFixedAssetsList | null
  },
  emit: Function
) => {
  // resources stores
  const { _getResources, _resetKeys } = useResourceManagerStore('v1')
  const { configuration_type } = storeToRefs(useFixedAssetsResourceStore('v1'))
  const { third_parties } = storeToRefs(useThirdPartyResourceStore('v1'))
  const { business_trusts } = storeToRefs(useTrustBusinessResourceStore('v1'))

  // keys para consumir recursos
  const keysThirdParty = { third_party: ['third_parties'] }
  const keysFixedAssets = { fixed_assets: ['configuration_type'] }
  const keysTrustBusiness = { trust_business: ['business_trusts'] }

  // options selectors
  const businessTrustOptions = business_trusts
  const thirdPartyOptions = third_parties
  const configurationTypeOptions = configuration_type

  // filtered subtypes according to the selected type
  const filteredSubtypes = computed(() => {
    if (!currentItem.value.configuration_type_id) return []
    const types = configuration_type.value as Array<{
      value?: number | string
      id?: number
      subtypes?: Array<{ id: number; code: string; description: string }>
    }>
    const selectedType = types.find(
      (t) =>
        t.value === currentItem.value.configuration_type_id ||
        t.id === currentItem.value.configuration_type_id
    )
    if (!selectedType?.subtypes) return []
    return selectedType.subtypes.map((subtype) => ({
      ...subtype,
      label: `${subtype.code} - ${subtype.description}`,
      value: subtype.id
    }))
  })

  // form refs
  const information_form_ref = ref()
  const item_form_ref = ref()

  // model form
  const model = ref<IBuyOrderFixedAssetsForm | null>(null)
  const originalData = ref<IBuyOrderFixedAssetsForm | null>(null)

  const currentItem = ref<IBuyOrderFixedAssetsItemForm>({
    _uid: 0,
    business_trust_id: null,
    third_party_id: null,
    quantity: null,
    configuration_type_id: null,
    configuration_subtype_id: null,
    value: null,
    detail: null
  })

  const uidCounter = ref(1)

  // Computed
  const isEditable = computed(() => {
    return ['create', 'edit'].includes(props.action) || false
  })

  const items = computed(() => {
    return model.value?.items || []
  })

  const canAddMoreItems = computed(() => {
    return items.value.length < MAX_ITEMS
  })

  const totalValue = computed(() => {
    const total = items.value.reduce((sum, item) => {
      return sum + (item.value || 0)
    }, 0)
    return total.toFixed(2)
  })

  const hasChanges = computed(() => {
    if (!originalData.value || !model.value) return false

    if (model.value.items.length !== originalData.value.items.length) return true

    const createSignature = (items: IBuyOrderFixedAssetsItemForm[]) => {
      return items
        .map(
          (item) =>
            `${item.business_trust_id}-${item.third_party_id}-${item.quantity}-${item.configuration_type_id}-${item.configuration_subtype_id}-${item.value}-${item.detail}`
        )
        .sort()
        .join('|')
    }

    return createSignature(model.value.items) !== createSignature(originalData.value.items)
  })

  // table
  const itemsTableProps = ref({
    loading: false,
    columns: [
      {
        name: 'index',
        label: '#',
        field: 'index',
        align: 'center' as const,
        sortable: false,
        required: true
      },
      {
        name: 'business_trust',
        label: 'Negocio',
        field: 'business_trust_label',
        align: 'left' as const,
        sortable: false,
        required: true
      },
      {
        name: 'third_party',
        label: 'Tercero/Proveedor',
        field: 'third_party_label',
        align: 'left' as const,
        sortable: false,
        required: true
      },
      {
        name: 'quantity',
        label: 'Cantidad',
        field: 'quantity',
        align: 'center' as const,
        sortable: false,
        required: true
      },
      {
        name: 'configuration_type',
        label: 'Tipo activo fijo/bien',
        field: 'configuration_type_label',
        align: 'left' as const,
        sortable: false,
        required: true
      },
      {
        name: 'configuration_subtype',
        label: 'Subtipo activo fijo/bien',
        field: 'configuration_subtype_label',
        align: 'left' as const,
        sortable: false,
        required: true
      },
      {
        name: 'value',
        label: 'Valor',
        field: 'value',
        align: 'right' as const,
        sortable: false,
        required: true
      },
      {
        name: 'detail',
        label: 'Detalle',
        field: 'detail',
        align: 'left' as const,
        sortable: false,
        required: true
      },
      ...(props.action !== 'view'
        ? [
            {
              name: 'actions',
              label: 'Acciones',
              field: 'actions',
              align: 'center' as const,
              sortable: false,
              required: true
            }
          ]
        : [])
    ],
    rows: [] as IBuyOrderFixedAssetsItemForm[]
  })

  const updateItemsTable = () => {
    itemsTableProps.value.rows = [...items.value]
  }

  const getBusinessTrustLabel = (id: number | null): string => {
    if (!id) return ''
    const options = businessTrustOptions.value
    const option = options?.find((opt) => opt.id === id || opt.value === id)
    return option?.label || ''
  }

  const getThirdPartyLabel = (id: number | null): string => {
    if (!id) return ''
    const options = thirdPartyOptions.value
    const option = options?.find((opt) => opt.id === id || opt.value === id)
    return option?.label || ''
  }

  const getConfigurationTypeLabel = (id: number | null): string => {
    if (!id) return ''
    const options = configurationTypeOptions.value
    const option = options?.find((opt) => opt.id === id || opt.value === id)
    return option?.label || ''
  }

  const getConfigurationSubtypeLabel = (id: number | null): string => {
    if (!id) return ''
    const options = filteredSubtypes.value
    const option = options?.find((opt) => opt.id === id || opt.value === id)
    return option?.label || ''
  }

  const resetCurrentItem = () => {
    currentItem.value = {
      _uid: 0,
      business_trust_id: null,
      third_party_id: null,
      quantity: null,
      configuration_type_id: null,
      configuration_subtype_id: null,
      value: null,
      detail: null
    }
  }

  const addItem = async () => {
    const isValid = await item_form_ref.value?.validate()
    if (!isValid) return false

    if (!canAddMoreItems.value) {
      return false
    }

    const newItem: IBuyOrderFixedAssetsItemForm = {
      ...currentItem.value,
      _uid: uidCounter.value++,
      business_trust_label: getBusinessTrustLabel(currentItem.value.business_trust_id),
      third_party_label: getThirdPartyLabel(currentItem.value.third_party_id),
      configuration_type_label: getConfigurationTypeLabel(currentItem.value.configuration_type_id),
      configuration_subtype_label: getConfigurationSubtypeLabel(
        currentItem.value.configuration_subtype_id
      )
    }

    model.value?.items.push(newItem)
    updateItemsTable()
    resetCurrentItem()
    nextTick(() => {
      item_form_ref.value?.resetValidation()
    })
    return true
  }

  const deleteItem = (uid: number) => {
    if (!model.value) return
    const index = model.value.items.findIndex((item) => item._uid === uid)
    if (index !== -1) {
      model.value.items.splice(index, 1)
      updateItemsTable()
    }
  }

  // modal delete
  const deleteModalRef = ref()
  const itemToDelete = ref<IBuyOrderFixedAssetsItemForm | null>(null)

  const openDeleteItemModal = (item: IBuyOrderFixedAssetsItemForm) => {
    itemToDelete.value = item
    deleteModalRef.value?.openModal()
  }

  const confirmDeleteItem = () => {
    if (itemToDelete.value) {
      deleteItem(itemToDelete.value._uid)
      itemToDelete.value = null
    }
    deleteModalRef.value?.closeModal()
  }

  const validateForm = async (): Promise<boolean> => {
    if (items.value.length === 0) {
      return false
    }
    const isMainFormValid = await information_form_ref.value?.validate()
    return isMainFormValid ?? false
  }

  const getRequestData = () => {
    if (!model.value) return null

    return {
      items: model.value.items.map((item) => ({
        business_trust_id: item.business_trust_id!,
        third_party_id: item.third_party_id!,
        quantity: item.quantity!,
        configuration_type_id: item.configuration_type_id!,
        configuration_subtype_id: item.configuration_subtype_id!,
        value: item.value!,
        detail: item.detail || ''
      }))
    }
  }

  const initEmptyForm = () => {
    model.value = {
      items: []
    }
    resetCurrentItem()
    updateItemsTable()
  }

  const setDataFromProps = (data: IBuyOrderFixedAssetsList | null = props.data ?? null) => {
    if (!data) {
      initEmptyForm()
      return
    }

    const mappedItems = data.items.map((item) => ({
      _uid: uidCounter.value++,
      business_trust_id: item.business_trust_id,
      business_trust_label: item.business_trust
        ? `${item.business_trust.business_code} - ${item.business_trust.name}`
        : '',
      third_party_id: item.third_party_id,
      third_party_label: item.third_party?.document || '',
      quantity: item.quantity,
      configuration_type_id: item.configuration_type_id,
      configuration_type_label: item.configuration_type
        ? `${item.configuration_type.code} - ${item.configuration_type.description}`
        : '',
      configuration_subtype_id: item.configuration_subtype_id,
      configuration_subtype_label: item.configuration_subtype
        ? `${item.configuration_subtype.code} - ${item.configuration_subtype.description}`
        : '',
      value: Number(item.value),
      detail: item.detail
    }))

    model.value = {
      items: mappedItems
    }

    // Save original data for change detection in edit mode
    if (props.action === 'edit') {
      originalData.value = {
        items: JSON.parse(JSON.stringify(mappedItems))
      }
    }

    updateItemsTable()
  }

  const handleActionForm = (action: ActionType) => {
    const actionHandlers: Record<typeof action, () => void> = {
      create: initEmptyForm,
      edit: () => setDataFromProps(),
      view: () => setDataFromProps()
    }
    actionHandlers[action]?.()
  }

  // watchers
  watch(
    () => props.data,
    () => {
      handleActionForm(props.action)
    },
    { immediate: true }
  )

  watch(
    () => model.value,
    () => {
      emit('update:model', model.value)
    },
    { deep: true }
  )

  watch(
    () => currentItem.value.configuration_type_id,
    () => {
      currentItem.value.configuration_subtype_id = null
    }
  )

  // Lifecycles
  onMounted(async () => {
    await _getResources(
      keysThirdParty,
      'include=legalPerson,documentType,naturalPerson&keys[]=third_parties&fields[]=id,document,document_type_id&fields[natural_people]=third_party_id,id,name,middle_name,last_name,second_last_name&fields[legal_people]=third_party_id,id,business_name'
    )
    await _getResources(keysTrustBusiness, 'filter[effect]=true')
    await _getResources(keysFixedAssets)
  })

  onBeforeUnmount(() => {
    _resetKeys(keysThirdParty)
    _resetKeys(keysTrustBusiness)
    _resetKeys(keysFixedAssets)
  })

  return {
    // Refs
    information_form_ref,
    item_form_ref,
    model,
    currentItem,

    // Options
    businessTrustOptions,
    thirdPartyOptions,
    configurationTypeOptions,
    filteredSubtypes,

    // Computed
    isEditable,
    items,
    canAddMoreItems,
    totalValue,
    hasChanges,

    // Table
    itemsTableProps,

    // Modal
    deleteModalRef,

    // Utils
    defaultIconsLucide,
    formatCurrency,

    // Constants
    MAX_ITEMS,
    MAX_VALUE_INTEGERS,
    MAX_VALUE_DECIMALS,
    MAX_DETAIL_LENGTH,
    MIN_DETAIL_LENGTH,

    // Methods
    addItem,
    openDeleteItemModal,
    confirmDeleteItem,
    validateForm,
    getRequestData,
    updateItemsTable
  }
}

export default useInformationForm
