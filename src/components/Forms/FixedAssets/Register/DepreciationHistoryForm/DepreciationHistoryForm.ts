// vue
import { ref } from 'vue'

// interfaces
import { IBaseTableProps } from '@/interfaces/global'
import { QTableColumn } from 'quasar/dist/types/api/qtable'
import { IDepreciationHistory } from '@/interfaces/customs/fixed-assets/v1/Register'

const useDepreciationHistoryForm = (props: {
  data: IDepreciationHistory[]
}) => {
  // table
  const tableProps = ref<IBaseTableProps<IDepreciationHistory>>({
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
        name: 'asset_type',
        label: 'Tipo activo fijo o bien',
        field: (row) => row.asset_type,
        align: 'left',
        sortable: true,
      },
      {
        name: 'asset_subtype',
        label: 'Subtipo activo fijo o bien',
        field: (row) => row.asset_subtype,
        align: 'left',
        sortable: true,
      },
      {
        name: 'business_trust',
        label: 'Entidad',
        field: (row) => row.business_depreciation,
        align: 'left',
        sortable: true,
      },
      {
        name: 'period',
        label: 'Periodo',
        field: (row) => row.period,
        align: 'left',
        sortable: true,
      },
      {
        name: 'depreciation_amount',
        label: 'Valor de depreciación',
        field: (row) => row.depreciation_value,
        align: 'left',
        sortable: true,
      },
    ] as QTableColumn<IDepreciationHistory>[],
    rows: (props.data as IDepreciationHistory[]) ?? [],
    pages: {
      currentPage: 0,
      lastPage: 0,
    },
  })
  return { tableProps }
}

export default useDepreciationHistoryForm
