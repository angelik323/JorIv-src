import { useMainLoader, useRouteValidator } from '@/composables'
import { ICancellationCodes, IFieldFilters } from '@/interfaces/customs'
import { useResourceStore, useCancellationCodesStore } from '@/stores'
import { defaultIcons, formatParamsCustom } from '@/utils'
import { storeToRefs } from 'pinia'
import { QTable } from 'quasar'
import { onMounted, ref, watch } from 'vue'
import { useRouter } from 'vue-router'

const useCancellationCodesList = () => {
  const router = useRouter()

  const { _getListAction, _changeStatusAction } =
    useCancellationCodesStore('v1')
  const { cancellation_codes_list, cancellation_codes_pages } = storeToRefs(
    useCancellationCodesStore('v1')
  )
  const { cancellation_codes_options, treasury_cancellation_code_type } =
    storeToRefs(useResourceStore('v1'))

  const { _getResourcesTreasuries } = useResourceStore('v1')

  const keys = ['treasury_cancellation_code_type']

  const { openMainLoader } = useMainLoader()
  const { validateRouter } = useRouteValidator()

  const headerProps = {
    title: 'Código de anulación de tesorería',
    breadcrumbs: [
      {
        label: 'Inicio',
        route: 'HomeView',
      },
      {
        label: 'Tesorería',
        route: '',
      },
      {
        label: 'Código de anulación tesorería',
        route: 'CancellationCodesList',
      },
    ],
  }

  const tableProps = ref({
    title: 'Listado código de anulación tesorería',
    loading: false,
    columns: [
      {
        name: 'id',
        required: false,
        label: '#',
        align: 'left',
        field: 'id',
        sortable: true,
      },
      {
        name: 'code',
        required: false,
        label: 'Código',
        align: 'left',
        field: 'code',
        sortable: true,
      },
      {
        name: 'description',
        required: false,
        label: 'Descripción',
        align: 'left',
        field: 'description',
        sortable: true,
        style: {
          'max-width': '400px',
          'min-width': '400px',
          'word-wrap': 'break-word',
          'white-space': 'break-spaces',
        },
      },
      {
        name: 'type',
        required: false,
        label: 'Tipo',
        align: 'left',
        field: 'type',
        sortable: true,
      },
      {
        name: 'reverses_conciliation',
        required: false,
        label: 'Revierte conciliación',
        align: 'center',
        field: 'reverses_conciliation',
        sortable: true,
      },
      {
        name: 'retains_consecutive_check',
        required: false,
        label: 'Conserva consecutivo cheque',
        align: 'center',
        field: 'retains_consecutive_check',
        sortable: true,
      },
      {
        name: 'actions',
        required: true,
        label: 'Acciones',
        align: 'center',
        field: 'actions',
      },
    ] as QTable['columns'],
    rows: [] as ICancellationCodes[],
    pages: cancellation_codes_pages,
  })

  const filterConfig = ref<IFieldFilters[]>([
    {
      name: 'type',
      label: 'Tipo',
      type: 'q-select',
      value: null,
      class: 'col-xs-12 col-sm-12 col-md-3 col-lg-3',
      options: treasury_cancellation_code_type,
      disable: false,
      clean_value: true,
      placeholder: 'Todos',
    },
    {
      name: 'reverse_conciliation',
      label: 'Revierte conciliación',
      type: 'q-select',
      value: null,
      class: 'col-xs-12 col-sm-12 col-md-3 col-lg-3',
      options: cancellation_codes_options,
      disable: false,
      clean_value: true,
      placeholder: 'Todos',
    },
    {
      name: 'preserve_consecutive_check',
      label: 'Conserva consecutivo cheque',
      type: 'q-select',
      value: null,
      class: 'col-xs-12 col-sm-12 col-md-3 col-lg-3',
      options: cancellation_codes_options,
      disable: false,
      clean_value: true,
      placeholder: 'Todos',
    },
    {
      name: 'search',
      label: 'Buscador',
      type: 'q-input',
      value: null,
      class: 'col-xs-12 col-sm-12 col-md-3 col-lg-3',
      disable: false,
      prepend_icon: defaultIcons.magnify,
      clean_value: true,
      placeholder: 'Buscar por descripción',
    },
  ])

  const filtersFormat = ref<Record<string, string | number>>({})

  const handleFilter = ($filters: {
    'filter[tyoe]': string
    'filter[reverse_conciliation]': string
    'filter[preserve_consecutive_check]': string
    'filter[search]': string
  }) => {
    filtersFormat.value = {
      ...$filters,
    }
    const queryString = formatParamsCustom(filtersFormat.value)

    listAction(queryString ? '&' + queryString : '')
  }

  const listAction = async (filters: string = '') => {
    tableProps.value.rows = []
    tableProps.value.loading = true
    await _getListAction(filters)
    tableProps.value.loading = false
  }

  const updatePage = (page: number) => {
    filtersFormat.value = {
      ...filtersFormat.value,
      page: page,
    }
    const queryString = formatParamsCustom(filtersFormat.value)

    listAction(queryString ? '&' + queryString : '')
  }

  const updateRows = (rows: number) => {
    filtersFormat.value = {
      ...filtersFormat.value,
      rows: rows,
    }
    const queryString = formatParamsCustom(filtersFormat.value)

    listAction(queryString ? '&' + queryString : '')
  }

  const handlerGoTo = (goURL: string) => {
    router.push({ name: goURL })
  }

  const clearRows = () => {
    tableProps.value.rows = []
  }

  onMounted(async () => {
    await _getResourcesTreasuries(`keys[]=${keys.join('&keys[]=')}`)
  })

  watch(
    () => cancellation_codes_list.value,
    () => {
      tableProps.value.rows = cancellation_codes_list.value
      tableProps.value.pages = cancellation_codes_pages.value
    }
  )
  const alertModalRef = ref()

  const alertModalConfig = ref({
    title: 'Advertencia',
    description: '',
    entityId: null as number | null,
  })

  const openAlertModal = async (status: string, entityId: number) => {
    alertModalConfig.value.entityId = entityId
    alertModalConfig.value.description = setAlertModalDescription(status)
    await alertModalRef.value.openModal()
  }

  const setAlertModalDescription = (status: string) => {
    return `¿Está seguro que desea ${status} el código de cancelación?`
  }

  const changeStatusAction = async () => {
    await alertModalRef.value.closeModal()
    openMainLoader(true)
    await _changeStatusAction(alertModalConfig.value.entityId as number)
    openMainLoader(false)
  }

  return {
    headerProps,
    tableProps,
    filterConfig,
    alertModalRef,

    //
    handleFilter,
    handlerGoTo,
    openAlertModal,
    changeStatusAction,
    updatePage,
    updateRows,
    clearRows,
    validateRouter,
  }
}

export default useCancellationCodesList
