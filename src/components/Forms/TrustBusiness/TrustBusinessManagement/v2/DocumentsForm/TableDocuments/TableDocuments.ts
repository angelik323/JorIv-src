// vue - pinia - quasar
import { computed, onMounted, ref, watch } from 'vue'
import { QTable } from 'quasar'

// interfaces
import { IDocumentsTrustBusiness } from '@/interfaces/customs/trust-business/v2/TrustBusinessManagement'

// composables
import { useUtils } from '@/composables'
const { defaultIconsLucide } = useUtils()

const useTableThirds = (
  props: {
    data?: IDocumentsTrustBusiness[]
    hide_header: boolean
    hide_actions?: boolean
  },
  emit: Function
) => {
  // models
  const models = ref({
    data_rows: [] as IDocumentsTrustBusiness[],
  })

  const isLoading = ref(true)

  const _setValueModel = () => {
    if (props.data) {
      models.value.data_rows = [...props.data]
      tableProps.value.rows = [...props.data]
    }
  }

  // table
  const tableProps = ref({
    loading: false,
    columns: [
      {
        name: 'document type',
        required: true,
        field: (row) => row.field_name,
        label: 'Tipo de documento',
        align: 'center',
        sortable: true,
      },
      {
        name: 'name',
        required: true,
        field: (row) => row.name ?? row.original_name,
        label: 'Nombre del archivo',
        align: 'center',
        sortable: true,
      },
      {
        name: 'upload_date',
        field: (row) => row.upload_date,
        required: true,
        label: 'Fecha de carga',
        align: 'center',
        sortable: true,
      },

      {
        name: 'actions',
        field: 'actions',
        label: 'Acciones',
        align: 'center',
        sortable: true,
      },
    ] as QTable['columns'],
    rows: [] as IDocumentsTrustBusiness[],
    pages: {
      currentPage: ref(1),
      lastPage: ref(1),
    },
  })

  const pageSize = ref(20)

  const paginated = computed(() => {
    const start = (tableProps.value.pages.currentPage - 1) * pageSize.value
    return tableProps.value.rows.slice(start, start + pageSize.value)
  })

  const update_rows_per_page = (val: number) => {
    pageSize.value = val
    tableProps.value.pages.currentPage = 1
  }

  // actions
  const deleteRow = (row: IDocumentsTrustBusiness) => {
    emit('update:delete', row)
  }

  const downloadFile = (row: IDocumentsTrustBusiness) => {
    emit('update:download', row)
  }

  // lifecycle
  onMounted(async () => {
    isLoading.value = true
    await _setValueModel()
    isLoading.value = false
  })

  // watchs
  watch(
    () => props.data,
    async () => {
      isLoading.value = true
      await _setValueModel()
      isLoading.value = false
    },
    { deep: true }
  )

  return {
    tableProps,
    defaultIconsLucide,
    pageSize,
    paginated,
    isLoading,

    deleteRow,
    downloadFile,
    update_rows_per_page,
  }
}

export default useTableThirds
