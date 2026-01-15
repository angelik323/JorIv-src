// vue - quasar
import { computed, ref, watch } from 'vue'
import { QTableColumn } from 'quasar'

// interfaces
import { ActionType, IBaseTableProps } from '@/interfaces/global'
import {
  IConsolidationInformationForm,
  IConsolidationListProcess,
} from '@/interfaces/customs/fixed-assets/v1/Consolidation'

// composables
import { useUtils } from '@/composables/useUtils'

// stores
import { storeToRefs } from 'pinia'
import { useFixedAssetsResourceStore } from '@/stores/resources-manager/fixed-assets'
import { useTrustBusinessResourceStore } from '@/stores/resources-manager/trust-business'
import { useResourceManagerStore } from '@/stores/resources-manager'
import { useConsolidationStore } from '@/stores/fixed-assets/consolidation'

const useConsolidationForm = (
  props: {
    action: ActionType
    data?: IConsolidationInformationForm | null
  },
  emit: Function
) => {
  const { formatDate } = useUtils()
  const { _getResources } = useResourceManagerStore('v1')

  // stores
  const {
    consolidation_sources,
    fixed_assets_types,
    fixed_assets_subtypes,
    fixed_assets_types_new,
    fixed_assets_subtypes_new,
    responsibles_by_fixed_assets,
    responsibles_by_fixed_assets_options,
  } = storeToRefs(useFixedAssetsResourceStore('v1'))
  const {
    business_trusts,
    business_currency,
    business_trust_account_structures,
    business_trusts_currency,
  } = storeToRefs(useTrustBusinessResourceStore('v1'))

  const { _getConsolidationAsset } = useConsolidationStore('v1')

  //keys
  const fixed_assets_types_keys = { fixed_assets: ['fixed_assets_types'] }
  const fixed_assets_subtypes_keys = { fixed_assets: ['fixed_assets_subtypes'] }
  const cost_center_keys = {
    trust_business: ['business_trust_account_structures'],
  }

  const models = ref<IConsolidationInformationForm>({
    id: null,
    type_source: null,
    business_trust_id: null,
    fixed_assets_type_id: null,
    fixed_assets_subtype_id: null,
    new_fixed_assets_type_id: null,
    new_fixed_assets_subtype_id: null,
    value_consolidation: null,
    cost_center_id: null,
    license_plate: null,
    responsible_id: null,
    has_valuation: null,
    has_depreciation: null,
    has_visit: null,
    description: null,
    fixed_assets_list: [],
    attached_documents: [],
    currency: null,
    created_at: null,
    status: null,
    created_by: null,
    updated_by: null,
    updated_at: null,
    business_trust: null,
    fixed_assets_type: null,
    fixed_assets_subtype: null,
    responsible: null,
  })

  const consolidationRef = ref()
  const showDetailEnglobe = ref(false)

  const tableProps = ref<IBaseTableProps<IConsolidationListProcess>>({
    title: 'Listado activos/bienes a englobar',
    loading: false,

    columns: [
      ...(props.action !== 'view'
        ? ([
            {
              name: 'asset',
              required: true,
              label: '',
              align: 'center',
              field: 'asset',
            },
          ] as unknown as QTableColumn<IConsolidationListProcess>[])
        : []),
      {
        name: 'configuration_type',
        required: true,
        label: 'Tipo activo fijo o bien',
        align: 'center',
        field: (row) => row.configuration_type?.description,
        sortable: true,
      },
      {
        name: 'configuration_subtype',
        required: true,
        label: 'Subtipo activo fijo o bien',
        align: 'center',
        field: (row) => row.configuration_subtype?.description,
        sortable: true,
      },
      {
        name: 'description',
        required: true,
        label: 'Descripción',
        align: 'center',
        field: (row) => row.reference,
        sortable: true,
      },
      {
        name: 'account_value',
        required: true,
        label: 'Valor contable',
        align: 'center',
        field: (row) => row.transaction?.transaction_value,
        sortable: true,
        format: (val: number) => `$${val.toLocaleString('es-CO')}`,
      },
      {
        name: 'status_id',
        required: true,
        label: 'Estado',
        align: 'center',
        field: (row) => row.status?.name,
        sortable: true,
      },
    ],
    rows: [],
    pages: { currentPage: 0, lastPage: 0 },
  })

  const defaultDateValue = computed(() => {
    if (props.action === 'edit' && models.value.created_at) {
      return models.value.created_at
    }
    return formatDate(new Date().toLocaleString('sv-SE'), 'YYYY-MM-DD HH:mm')
  })

  const isSourceSelected = computed(() => {
    return !!models.value.type_source
  })

  const handleProcess = async () => {
    showDetailEnglobe.value = false
    const params = `filter[business_trust_id]=${models.value.business_trust_id}&filter[configuration_type_id]=${models.value.fixed_assets_type_id}&filter[configuration_subtype_id]=${models.value.fixed_assets_subtype_id}&filter[type_source]=${models.value.type_source}`

    const payload = await _getConsolidationAsset(params)

    if (payload && payload.process_list) {
      tableProps.value.rows = payload.process_list.map(
        (item: IConsolidationListProcess) => ({
          ...item,
          selected: false,
        })
      )
      tableProps.value.pages = payload.consolidation_pages

      showDetailEnglobe.value = true
    }

    return payload
  }

  const consolidationValue = computed<number>(() => {
    const rows = tableProps.value?.rows ?? []

    return rows.reduce((sum, row) => {
      if (!row.selected) return sum

      const value = Number(row.transaction?.transaction_value ?? 0)
      return sum + value
    }, 0)
  })

  const handleCheckboxChange = (
    row: IConsolidationListProcess,
    value: boolean
  ): void => {
    row.selected = value
    updateSelectedAssets()
  }

  const updateSelectedAssets = () => {
    const selectedIds = tableProps.value.rows
      .filter((row) => row.selected)
      .map((row) => row.transaction?.id)
      .filter((id): id is number => id !== undefined)

    models.value.fixed_assets_list = selectedIds
  }

  const validateForm = (): boolean => {
    const isValid =
      !!models.value.type_source &&
      !!models.value.business_trust_id &&
      !!models.value.fixed_assets_type_id &&
      !!models.value.fixed_assets_subtype_id &&
      !!models.value.cost_center_id &&
      !!models.value.responsible_id &&
      !!models.value.description &&
      models.value.fixed_assets_list.length > 0

    return isValid
  }

  // Watch para actualizar el valor de consolidación
  watch(
    consolidationValue,
    (newValue) => {
      models.value.value_consolidation = newValue
    },
    { immediate: true }
  )

  // Watch para cambios en la tabla y actualizar fixed_assets_list
  watch(
    () => tableProps.value.rows,
    () => {
      updateSelectedAssets()
    },
    { deep: true }
  )

  watch(
    () => models.value,
    (val) => {
      if (JSON.stringify(val) === JSON.stringify(props.data)) return

      emit('update:models', val)
    },
    { deep: true, immediate: true }
  )

  watch(
    () => props.data,
    (val) => {
      if (val && props.data) {
        models.value = {
          ...props.data,
        }
      }
    },
    { immediate: true }
  )

  watch(
    () => ({
      typeSource: models.value.type_source,
      businessId: models.value.business_trust_id,
    }),
    async (newVal, oldVal) => {
      if (!newVal.typeSource || !newVal.businessId) return

      if (
        newVal.typeSource !== oldVal?.typeSource ||
        newVal.businessId !== oldVal?.businessId
      ) {
        models.value.fixed_assets_type_id = null
      }

      await _getResources(
        fixed_assets_types_keys,
        `fixed_assets_types&filter[type_source]=${newVal.typeSource}&filter[business_trust_id]=${newVal.businessId}`
      )
    },
    { immediate: true, deep: true }
  )

  watch(
    () => ({
      assetId: models.value.fixed_assets_type_id,
      businessId: models.value.business_trust_id,
    }),
    async (newVal) => {
      await _getResources(
        fixed_assets_subtypes_keys,
        `fixed_assets_subtypes&filter[configuration_type_id]=${newVal.assetId}&filter[business_trust_id]=${newVal.businessId}`
      )
    },
    { immediate: true, deep: true }
  )

  watch(
    () => models.value.business_trust_id,
    async (newVal) => {
      await _getResources(
        cost_center_keys,
        `business_trust_account_structures&filter[business_trust_id]=${newVal}`
      )
    },
    { immediate: true, deep: true }
  )

  watch(
    () => models.value.business_trust_id,
    (newBusinessId) => {
      if (!newBusinessId) {
        models.value.currency = null
        return
      }

      const selectedBusiness = business_trusts_currency.value.find(
        (business) => business.id === newBusinessId
      )

      models.value.currency =
        selectedBusiness?.account?.functional_business_currency ?? null
    },
    { immediate: true }
  )

  return {
    models,
    defaultDateValue,
    consolidationRef,
    tableProps,
    isSourceSelected,
    handleProcess,
    showDetailEnglobe,
    handleCheckboxChange,
    validateForm,

    // Resources
    business_trusts,
    consolidation_sources,
    fixed_assets_types,
    fixed_assets_subtypes,
    business_currency,
    fixed_assets_types_new,
    fixed_assets_subtypes_new,
    business_trust_account_structures,
    business_trusts_currency,
    responsibles_by_fixed_assets,
    responsibles_by_fixed_assets_options,
  }
}

export default useConsolidationForm
