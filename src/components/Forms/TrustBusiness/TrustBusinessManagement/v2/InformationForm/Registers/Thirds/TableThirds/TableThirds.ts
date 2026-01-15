// vue - pinia - quasar
import { computed, onMounted, onUnmounted, ref, watch } from 'vue'
import { QTable } from 'quasar'

// interfaces
import { ITrustBusinessRegisterThird } from '@/interfaces/customs/trust-business/v2/TrustBusinessManagement'

// composables
import { useBigNumbers, useUtils } from '@/composables'
const { defaultIconsLucide } = useUtils()
const { createBigNumber } = useBigNumbers()

const useTableThirds = (
  props: {
    data?: ITrustBusinessRegisterThird[]
  },
  emit: Function
) => {
  // models
  const models = ref({
    data_rows: [] as ITrustBusinessRegisterThird[],
  })

  const _setValueModel = () => {
    if (props.data) {
      models.value.data_rows = [...props.data]
    }
  }

  const total_percentaje = computed(() => {
    const sum = models.value.data_rows.reduce((total, row) => {
      const value = createBigNumber(row.percentage_participation || 0)
      return total.plus(value)
    }, createBigNumber(0))

    return sum.toFixed(10).replace(/\.?0+$/, '')
  })

  // table
  const tableProps = ref({
    loading: false,
    columns: [
      {
        name: 'type',
        required: true,
        field: (row) =>
          row.third_party?.document_type?.name ?? row.third_party?.type,
        label: 'Tipo de documento',
        align: 'center',
        sortable: true,
      },
      {
        name: 'document_number',
        required: true,
        field: (row) =>
          row.third_party?.document_number ?? row.third_party?.document,
        label: 'No. de documento',
        align: 'center',
        sortable: true,
      },
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
    ] as QTable['columns'],
    rows: [] as ITrustBusinessRegisterThird[],
    pages: {
      currentPage: 1,
      lastPage: 1,
    },
  })

  const pageSize = ref(20)

  const paginated = computed(() => {
    const start = (tableProps.value.pages.currentPage - 1) * pageSize.value
    const end = start + pageSize.value

    // Calcular el número total de páginas
    tableProps.value.pages.lastPage =
      Math.ceil(tableProps.value.rows.length / pageSize.value) || 1

    return tableProps.value.rows.slice(start, end)
  })

  const update_rows_per_page = (val: number) => {
    pageSize.value = val
    tableProps.value.pages.currentPage = 1
  }

  // lifecycle
  onMounted(async () => {
    await _setValueModel()
  })

  onUnmounted(() => {
    models.value.data_rows = []
  })

  // watchs
  watch(
    () => models.value.data_rows,
    (val) => {
      tableProps.value.rows = val
      emit('update:models', val)
    },
    {
      deep: true,
    }
  )

  watch(
    () => props.data,
    async () => {
      await _setValueModel()
    },
    { deep: true }
  )

  return {
    tableProps,
    defaultIconsLucide,
    pageSize,
    paginated,
    total_percentaje,

    update_rows_per_page,
  }
}

export default useTableThirds
