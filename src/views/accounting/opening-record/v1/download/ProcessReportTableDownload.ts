// Vue | Router
import { ref } from 'vue'
import { useRouter } from 'vue-router'

// Store
import { useOpeningRecordStore } from '@/stores/accounting/opening-record'

// Composables
import { useMainLoader } from '@/components/loader/composable/useMainLoader'

// Interfaces
import type {
  IOpeningRecordProcessReportData,
  ISuccessRow,
  IPendingRow,
} from '@/interfaces/customs/accounting/OpeningRecord'
import type { IBaseTableProps } from '@/interfaces/global'

const useProcessReportTableDownload = (
  data: IOpeningRecordProcessReportData | null
) => {
  const router = useRouter()
  const { openMainLoader } = useMainLoader()
  const { _getDataExcel } = useOpeningRecordStore('v1')

  const tableSuccessProps = ref<IBaseTableProps<ISuccessRow>>({
    title: 'Listado de negocios aperturados',
    loading: false,
    columns: [
      {
        name: 'index',
        required: true,
        label: '#',
        align: 'left',
        field: 'index',
        sortable: false,
      },
      {
        name: 'business_code',
        required: true,
        label: 'Código del negocio',
        align: 'left',
        field: (row) => row.business_code,
        sortable: true,
      },
      {
        name: 'business_name',
        required: true,
        label: 'Nombre del negocio',
        align: 'left',
        field: (row) => row.business_name,
        sortable: true,
      },
      {
        name: 'affects_consolidation',
        required: true,
        label: 'Afecta consolidación',
        align: 'left',
        field: (row) =>
          row.affects_consolidation || row.afecta_consolidacion ? 'Sí' : 'No',
        sortable: true,
      },
      {
        name: 'initial_period',
        required: true,
        label: 'Nuevo período actual',
        align: 'left',
        field: (row) => row.initial_period,
        sortable: true,
      },
      {
        name: 'final_period',
        required: true,
        label: 'Período anterior',
        align: 'left',
        field: (row) => row.final_period,
        sortable: true,
      },
    ],
    rows: [],
    pages: {
      currentPage: 1,
      lastPage: 1,
    },
  })

  const tablePendingProps = ref<IBaseTableProps<IPendingRow>>({
    title: 'Informe de procesos pendientes',
    loading: false,
    columns: [
      {
        name: 'index',
        required: true,
        label: '#',
        align: 'left',
        field: 'index',
        sortable: false,
      },
      {
        name: 'business_code',
        required: true,
        label: 'Código del negocio',
        align: 'left',
        field: (row) => row.business_code,
        sortable: true,
      },
      {
        name: 'business_name',
        required: true,
        label: 'Nombre del negocio',
        align: 'left',
        field: (row) => row.business_name,
        sortable: true,
      },
      {
        name: 'detail',
        required: true,
        label: 'Detalle',
        align: 'left',
        field: (row) =>
          Array.isArray(row.detail) ? row.detail.join(' • ') : row.detail,
        sortable: false,
      },
    ],
    rows: [],
    pages: {
      currentPage: 1,
      lastPage: 1,
    },
  })

  if (data) {
    tableSuccessProps.value.rows = data.successful ?? []
    tablePendingProps.value.rows = data.pending ?? []
  }

  const exportExcel = async () => {
    openMainLoader(true)
    await _getDataExcel()
    openMainLoader(false)
  }

  const handlerGoTo = (goURL: string) => {
    router.push({ name: goURL })
  }

  return {
    handlerGoTo,
    exportExcel,
    tableSuccessProps,
    tablePendingProps,
  }
}

export default useProcessReportTableDownload
