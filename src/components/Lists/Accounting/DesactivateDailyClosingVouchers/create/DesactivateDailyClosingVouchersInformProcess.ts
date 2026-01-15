// vue
import { onMounted, ref } from 'vue'

// interfaces
import { IBaseTableProps } from '@/interfaces/global'
import {
  IInformProcessPendingListItem,
  ISuccessProcessListItem,
} from '@/interfaces/customs/accounting/DesactivateDailyClosingVouchersV2'

// composables
import { useUtils } from '@/composables/useUtils'

// stores
import { useDesactivateDailyClousingVouchersStore } from '@/stores/accounting/desactivate-daily-clousing-vouchers'

const useDesactivateDailyClosingVouchersInformProcess = (
  revert_vouchers_id: number | string
) => {
  const { _getListInformProcessPending, _getListSuccessProcess, _exportXlsx } =
    useDesactivateDailyClousingVouchersStore('v2')
  const { formatParamsCustom } = useUtils()

  const tableInformProcessPendingProps = ref<
    IBaseTableProps<IInformProcessPendingListItem>
  >({
    title: 'Informe de procesos pendientes',
    loading: false,
    columns: [
      {
        name: 'id',
        required: true,
        label: '#',
        align: 'left',
        field: 'id',
        sortable: true,
      },
      {
        name: 'business_code',
        required: true,
        label: 'Código de negocio',
        align: 'left',
        field: 'business_code',
        sortable: true,
      },
      {
        name: 'business_name',
        required: true,
        label: 'Nombre del negocio',
        align: 'left',
        field: 'business_name',
        sortable: true,
      },
      {
        name: 'detail',
        required: true,
        label: 'Detalle',
        align: 'left',
        field: 'detail',
        sortable: true,
      },
    ],
    rows: [],
    pages: { currentPage: 0, lastPage: 0 },
  })

  const filtersFormatInformProcessPending = ref<
    Record<string, string | number | boolean>
  >({
    sort: 'business_code_numeric',
    'filter[news]': true,
  })

  const listActionInformProcessPending = async (filters: string = '') => {
    tableInformProcessPendingProps.value.rows = []
    tableInformProcessPendingProps.value.loading = true
    const { data_list_inform_process_pending, pages } =
      await _getListInformProcessPending(filters)
    tableInformProcessPendingProps.value.rows = data_list_inform_process_pending
    tableInformProcessPendingProps.value.pages = pages
    tableInformProcessPendingProps.value.loading = false
  }

  const updatePageInformProcessPending = async (page: number) => {
    filtersFormatInformProcessPending.value = {
      ...filtersFormatInformProcessPending.value,
      page: page,
    }
    const queryString = formatParamsCustom(
      filtersFormatInformProcessPending.value
    )

    listActionInformProcessPending(queryString ? '&' + queryString : '')
  }

  const updateRowsInformProcessPending = (rows: number) => {
    filtersFormatInformProcessPending.value = {
      ...filtersFormatInformProcessPending.value,
      rows: rows,
      page: 1,
    }
    const queryString = formatParamsCustom(
      filtersFormatInformProcessPending.value
    )

    listActionInformProcessPending(queryString ? '&' + queryString : '')
  }

  const tableSuccessProcessProps = ref<
    IBaseTableProps<ISuccessProcessListItem>
  >({
    title: 'Listado de negocios desactualizados',
    loading: false,
    columns: [
      {
        name: 'id',
        required: true,
        label: '#',
        align: 'left',
        field: 'id',
        sortable: true,
      },
      {
        name: 'business_code',
        required: true,
        label: 'Código de negocio',
        align: 'left',
        field: 'business_code',
        sortable: true,
      },
      {
        name: 'business_name',
        required: true,
        label: 'Nombre del negocio',
        align: 'left',
        field: 'business_name',
        sortable: true,
      },
      {
        name: 'start_date',
        required: true,
        label: 'Fecha inicial',
        align: 'left',
        field: 'start_date',
        sortable: true,
      },
      {
        name: 'last_update_date',
        required: true,
        label: 'Fecha actual de última actualización',
        align: 'left',
        field: 'last_update_date',
        sortable: true,
      },
      {
        name: 'affects_consolidation',
        required: true,
        label: 'Afecta consolidación',
        align: 'left',
        field: 'affects_consolidation',
        sortable: true,
      },
    ],
    rows: [],
    pages: { currentPage: 0, lastPage: 0 },
  })

  const filtersFormatSuccessProcess = ref<
    Record<string, string | number | boolean>
  >({
    sort: 'business_code_numeric',
    'filter[status_id]': 107,
  })

  const listActionSuccessProcess = async (filters: string = '') => {
    tableSuccessProcessProps.value.rows = []
    tableSuccessProcessProps.value.loading = true
    const { data_list_success_process, pages } = await _getListSuccessProcess(
      filters
    )
    tableSuccessProcessProps.value.rows = data_list_success_process
    tableSuccessProcessProps.value.pages = pages
    tableSuccessProcessProps.value.loading = false
  }

  const updatePageSuccessProcess = async (page: number) => {
    filtersFormatSuccessProcess.value = {
      ...filtersFormatSuccessProcess.value,
      page: page,
    }
    const queryString = formatParamsCustom(filtersFormatSuccessProcess.value)

    listActionSuccessProcess(queryString ? '&' + queryString : '')
  }

  const updateRowsSuccessProcess = (rows: number) => {
    filtersFormatSuccessProcess.value = {
      ...filtersFormatSuccessProcess.value,
      rows: rows,
      page: 1,
    }
    const queryString = formatParamsCustom(filtersFormatSuccessProcess.value)
    listActionSuccessProcess(queryString ? '&' + queryString : '')
  }

  const exportExcelFile = async () => {
    await _exportXlsx(`${revert_vouchers_id}`)
  }

  onMounted(() => {
    filtersFormatInformProcessPending.value = {
      ...filtersFormatInformProcessPending.value,
      'filter[revert_vouchers_id]': revert_vouchers_id,
    }
    const queryStringInformProcessPending = formatParamsCustom(
      filtersFormatInformProcessPending.value
    )
    listActionInformProcessPending(
      queryStringInformProcessPending
        ? '&' + queryStringInformProcessPending
        : ''
    )

    filtersFormatSuccessProcess.value = {
      ...filtersFormatSuccessProcess.value,
      'filter[revert_vouchers_id]': revert_vouchers_id,
    }
    const queryStringSuccessProcess = formatParamsCustom(
      filtersFormatSuccessProcess.value
    )
    listActionSuccessProcess(
      queryStringSuccessProcess ? '&' + queryStringSuccessProcess : ''
    )
  })

  return {
    tableInformProcessPendingProps,
    tableSuccessProcessProps,
    updatePageInformProcessPending,
    updateRowsInformProcessPending,
    updatePageSuccessProcess,
    updateRowsSuccessProcess,
    exportExcelFile,
  }
}

export default useDesactivateDailyClosingVouchersInformProcess
