// vue - quasar
import { computed, ref, watch } from 'vue'
import { storeToRefs } from 'pinia'

// interfaces
import { QTableColumn } from 'quasar/dist/types/api/qtable'
import { ActionType, IBaseTableProps } from '@/interfaces/global'
import { IAssetContributor } from '@/interfaces/customs/fixed-assets/v1/Register'

// composables
import { useUtils } from '@/composables/useUtils'
import { useRules } from '@/composables/useRules'

// stores
import { useFixedAssetsResourceStore } from '@/stores/resources-manager/fixed-assets/'

const useAssetContributors = (
  props: {
    modelValue: IAssetContributor[]
    action: ActionType
  },
  emit: Function
) => {
  // imports
  const { defaultIconsLucide, getOptionLabel } = useUtils()
  const { is_required, min_length, max_length, max_integer_decimal } =
    useRules()

  // refs
  const assetsContributorsRef = ref()

  // keys
  const { fixed_asset_distribution_type } = storeToRefs(
    useFixedAssetsResourceStore('v1')
  )

  // table
  const createEmptyRow = (): IAssetContributor => ({
    nit: null,
    description: null,
    guarantee_percentage: null,
    distribution_type: null,
  })

  const tableProps = ref<IBaseTableProps<IAssetContributor>>({
    loading: false,
    columns: [
      {
        name: 'id',
        field: 'id',
        label: '#',
        align: 'left',
        style: 'max-width: 40px; min-width: 40px;',
        headerStyle: 'white-space: normal; max-width: 40px; min-width: 40px;',
      },
      {
        name: 'nit',
        field: 'nit',
        label: 'NIT',
        align: 'left',
        style: 'max-width: 160px; min-width: 160px;',
        headerStyle: 'white-space: normal; max-width: 160px; min-width: 160px;',
      },
      {
        name: 'description',
        field: 'description',
        label: 'Descripción',
        align: 'left',
        style: 'max-width: 390px; min-width: 390px;',
        headerStyle: 'white-space: normal; max-width: 390px; min-width: 390px;',
      },
      {
        name: 'guarantee_percentage',
        field: 'guarantee_percentage',
        label: 'Porcentaje',
        align: 'left',
        style: 'max-width: 120px; min-width: 120px;',
        headerStyle: 'white-space: normal; max-width: 120px; min-width: 120px;',
      },
      {
        name: 'distribution_type',
        field: 'distribution_type',
        label: 'Tipo de distribución',
        align: 'left',
        style: 'max-width: 160px; min-width: 160px;',
        headerStyle: 'white-space: normal; max-width: 160px; min-width: 160px;',
      },
      ...(props.action !== 'view'
        ? [
            {
              name: 'actions',
              field: '',
              label: 'Acciones',
              align: 'left',
              style: 'max-width: 100px; min-width: 100px;',
            },
          ]
        : []),
    ] as QTableColumn<IAssetContributor>[],
    rows: props.modelValue ?? [],
    pages: {
      currentPage: 0,
      lastPage: 0,
    },
  })

  const visibleColumns = computed(() => {
    const hasIds = tableProps.value.rows.some((row) => row.id)

    const baseColumns = [
      'nit',
      'description',
      'guarantee_percentage',
      'distribution_type',
      'actions',
    ]

    return hasIds ? ['id', ...baseColumns] : baseColumns
  })

  const updateRow = (
    index: number,
    field: keyof IAssetContributor,
    value: string
  ): void => {
    tableProps.value.rows[index] = {
      ...tableProps.value.rows[index],
      [field]: value,
    }
    emit('update:modelValue', tableProps.value.rows)
  }

  const addNewRow = (): void => {
    tableProps.value.rows.push(createEmptyRow())
    emit('update:modelValue', tableProps.value.rows)
  }

  const removeRow = (index: number): void => {
    tableProps.value.rows.splice(index, 1)
    emit('update:modelValue', tableProps.value.rows)
  }

  const validateAndAddRow = async () => {
    const isValid = await assetsContributorsRef.value?.validate(true)

    if (isValid) {
      addNewRow()
    }
  }
  const validateForm = async (): Promise<boolean> => {
    if (tableProps.value.rows.length === 0) {
      return true
    }

    return (await assetsContributorsRef.value?.validate(true)) ?? false
  }

  // watch
  watch(
    () => props.modelValue,
    (newmodelValue) => {
      if (newmodelValue && newmodelValue.length > 0) {
        tableProps.value.rows = [...newmodelValue]
      }
    },
    { deep: true }
  )
  return {
    assetsContributorsRef,
    defaultIconsLucide,

    fixed_asset_distribution_type,
    tableProps,
    visibleColumns,

    validateAndAddRow,
    updateRow,
    removeRow,
    validateForm,

    getOptionLabel,

    is_required,
    min_length,
    max_length,
    max_integer_decimal,
  }
}

export default useAssetContributors
