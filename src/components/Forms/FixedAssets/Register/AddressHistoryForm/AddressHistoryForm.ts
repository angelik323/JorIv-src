// vue
import { ref } from 'vue'

// interfaces
import { IBaseTableProps } from '@/interfaces/global'
import { QTableColumn } from 'quasar/dist/types/api/qtable'
import { IAddressHistory } from '@/interfaces/customs/fixed-assets/v1/Register'

const useAddressHistoryForm = (props: { data: IAddressHistory[] }) => {
  // table
  const tableProps = ref<IBaseTableProps<IAddressHistory>>({
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
        name: 'responsible',
        label: 'Responsable',
        field: (row) => row.third_party_name,
        align: 'left',
        sortable: true,
      },
      {
        name: 'new_responsible',
        label: 'Nuevo responsable',
        field: (row) => row.new_third_party_name,
        align: 'left',
        sortable: true,
      },
      {
        name: 'created_by',
        label: 'Solicitado por',
        field: (row) => row.created_by,
        align: 'left',
        sortable: true,
      },
      {
        name: 'history_value',
        label: 'Valor',
        field: (row) => row.history_value,
        align: 'left',
        sortable: true,
      },
      {
        name: 'first_address',
        label: 'Ubicación',
        field: (row) => row.first_address,
        align: 'left',
        sortable: true,
      },
      {
        name: 'address',
        label: 'Ubicación actual',
        field: (row) => row.address,
        align: 'left',
        sortable: true,
      },
    ] as QTableColumn<IAddressHistory>[],
    rows: (props.data as IAddressHistory[]) ?? [],
    pages: {
      currentPage: 0,
      lastPage: 0,
    },
  })

  return { tableProps }
}

export default useAddressHistoryForm
