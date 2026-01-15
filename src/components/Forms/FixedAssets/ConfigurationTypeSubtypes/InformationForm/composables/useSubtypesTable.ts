// vue
import { ref } from 'vue'

// interfaces
import type { QTable } from 'quasar'
import type { IAssetSubtypeForm } from '@/interfaces/customs/fixed-assets/ConfigurationTypeSubtypes'
import type { ActionType } from '@/interfaces/global'

export const useSubtypesTable = (
  action: ActionType,
  paginatedItems: () => IAssetSubtypeForm[],
  lastPage: () => number,
  currentPage: () => number
) => {
  const subtypesTableProps = ref({
    title: 'Subtipos activos y bienes',
    loading: false,
    rowsPerPageOptions: [20, 50, 100],
    columns: [
      {
        name: 'index',
        required: false,
        label: '#',
        align: 'center',
        field: 'index',
        sortable: false,
        style: { width: '60px' },
      },
      {
        name: 'code',
        required: false,
        label: 'Código activo / bien',
        align: 'center',
        field: 'code',
        sortable: true,
      },
      {
        name: 'description',
        required: false,
        label: 'Descripción',
        align: 'center',
        field: 'description',
        sortable: true,
      },
      {
        name: 'life_span',
        required: false,
        label: 'Vida útil (meses)',
        align: 'center',
        field: 'life_span',
        sortable: true,
      },
      {
        name: 'depreciation',
        required: false,
        label: 'Depreciación (%)',
        align: 'center',
        field: 'depreciation',
        sortable: true,
      },
      ...(action !== 'view' ? [{
        name: 'actions',
        required: true,
        label: 'Acciones',
        align: 'center',
        field: 'actions',
      }] : []),
    ] as QTable['columns'],
    rows: [] as IAssetSubtypeForm[],
    pages: {
      currentPage: currentPage,
      lastPage: ref(1),
    },
  })

  const updateSubtypesTable = () => {
    subtypesTableProps.value.rows = [...paginatedItems()]
    subtypesTableProps.value.pages.lastPage = lastPage()
  }

  return {
    subtypesTableProps,
    updateSubtypesTable,
  }
}
