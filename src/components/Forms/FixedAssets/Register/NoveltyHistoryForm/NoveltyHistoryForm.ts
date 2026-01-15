// vue - router
import { ref } from 'vue'
import { useRouter } from 'vue-router'

// interfaces
import { IBaseTableProps } from '@/interfaces/global'
import { QTableColumn } from 'quasar/dist/types/api/qtable'
import { INoveltyHistory } from '@/interfaces/customs/fixed-assets/v1/Register'

// composables
import { useUtils } from '@/composables/useUtils'

const useNoveltyHistoryForm = (props: { data: INoveltyHistory[] }) => {
  // imports
  const router = useRouter()
  const { defaultIconsLucide } = useUtils()

  // table
  const tableProps = ref<IBaseTableProps<INoveltyHistory>>({
    loading: false,
    columns: [
      {
        name: 'id',
        label: '#',
        field: (row) => row.id,
        align: 'left',
        sortable: true,
      },
      {
        name: 'novelty_code',
        label: 'Código de novedad',
        field: (row) => row.novelty_code,
        align: 'left',
        sortable: true,
      },
      {
        name: 'novelty_description',
        label: 'Descripción',
        field: (row) => row.novelty_description,
        align: 'left',
        sortable: true,
      },
      {
        name: 'novelty_associated',
        label: 'Activo asociado',
        field: (row) => row.novelty_associated,
        align: 'left',
        sortable: true,
      },
      {
        name: 'novelty_type',
        label: 'Tipo de novedad',
        field: (row) => row.novelty_type,
        align: 'left',
        sortable: true,
      },
      {
        name: 'novelty_date',
        label: 'Fecha de ejecución',
        field: (row) => row.novelty_date,
        align: 'left',
        sortable: true,
      },
      {
        name: 'novelty_value',
        label: 'Costo',
        field: (row) => row.novelty_value,
        align: 'left',
        sortable: true,
      },
      {
        name: 'novelty_status',
        label: 'Estado',
        field: (row) => row.novelty_status,
        align: 'left',
        sortable: true,
      },
      {
        name: 'actions',
        label: 'Acciones',
        field: 'actions',
        align: 'center',
        sortable: false,
      },
    ] as QTableColumn<INoveltyHistory>[],
    rows: (props.data as INoveltyHistory[]) ?? [],
    pages: {
      currentPage: 0,
      lastPage: 0,
    },
  })

  // actions
  const goToNovelty = (id: string | number) => {
    router.push({
      name: 'FixedAssetsNoveltyRead',
      params: { id: String(id) },
    })
  }

  return { tableProps, defaultIconsLucide, goToNovelty }
}

export default useNoveltyHistoryForm
