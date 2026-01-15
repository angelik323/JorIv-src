import { useRouteValidator, useUtils } from '@/composables'
import {
  DropdownOption,
  IFieldFiltersV1,
  IGenericRegisterConstitutionRows,
} from '@/interfaces/customs'
import { useRegisterConstitutionFicStore } from '@/stores'
import { formatParamsCustom } from '@/utils'
import { storeToRefs } from 'pinia'
import { QTable } from 'quasar'
import { computed, onMounted, ref, watch } from 'vue'
import { useRouter } from 'vue-router'

export const useRegisterConstitutionList = () => {
  const {
    _getCurrencyForeignAndLocalConstitution,
    _setDataInformationConditions,
    _setDataInformationGeneric,
    _setDataInformationValues,
    _setReferenceTabs,
  } = useRegisterConstitutionFicStore('v1')
  const { data_constitution_list, data_constitution_pages } = storeToRefs(
    useRegisterConstitutionFicStore('v1')
  )
  const router = useRouter()
  const { validateRouter } = useRouteValidator()
  const filtersFormat = ref<Record<string, string | number>>({})
  const filterRef = ref()
  let perPage = 10
  const headerProps = {
    title: 'Constitución participación en FICs',
    breadcrumbs: [
      { label: 'Inicio', route: 'HomeView' },
      { label: 'Portafolio de inversiones', route: '' },
      {
        label: 'Constitución participación en FICs',
        route: 'RegisterConstitutionList',
      },
    ],
    btn: {
      label: 'Crear',
      icon: useUtils().defaultIconsLucide.plusCircleOutline,
      options: [
        {
          label: 'Crear moneda local',
          route: 'RegisterConstitutionCreate',
        },
        {
          label: 'Crear moneda extranjera',
          route: 'RegisterConstitutionForeignCreate',
        },
      ],
      color: 'primary',
      textColor: 'white',
      size: 'md',
      class: 'btn-header',
      outline: false,
      disable: false,
    },
  }
  const btnOptions = computed<DropdownOption[]>(() =>
    headerProps.btn.options.map((o) => ({
      label: o.label,
      routeName: o.route || undefined,
    }))
  )
  const tableProps = ref<{
    title: string
    loading: boolean
    columns: QTable['columns']
    rows: IGenericRegisterConstitutionRows[]
    pages: typeof data_constitution_pages
    rowsPerPage: number
  }>({
    title: "Listado de Constitución participación en FIC's",
    loading: false,
    columns: [
      {
        name: 'id',
        label: '#',
        field: 'id',
        align: 'left',
        sortable: true,
      },
      {
        name: 'portfolio',
        label: 'Portafolio',
        field: 'portfolio_code',
        align: 'left',
        sortable: true,
      },
      {
        name: 'description',
        label: 'Descripción',
        field: 'description',
        align: 'left',
        sortable: true,
      },
      {
        name: 'participation_type',
        label: 'Tipo de participación',
        field: 'participation_type',
        align: 'left',
        sortable: true,
      },
      {
        name: 'portfolio_class',
        label: 'Clase de cartera',
        field: 'portfolio_class',
        align: 'left',
        sortable: true,
      },
      {
        name: 'creationDate',
        label: 'Fecha de creación',
        field: () =>
          new Date().toLocaleDateString('es-ES', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
          }),
        align: 'left',
        sortable: true,
      },
    ],
    rows: [],
    pages: data_constitution_pages,
    rowsPerPage: 10,
  })

  const filters = ref<IFieldFiltersV1[]>([
    //TODO: Revisar funcionalidad con back
    // {
    //   name: 'class_money',
    //   label: 'Clase de cartera',
    //   type: 'q-select',
    //   value: 'Todas',
    //   clean_value: true,
    //   placeholder: 'Seleccione',
    //   disable: false,
    //   class: 'col-12 col-md-4',
    // },
    {
      name: 'search',
      label: 'Buscador',
      type: 'q-input',
      value: null,
      clean_value: true,
      prepend_icon: 'search',
      placeholder: 'Buscar por código o coincidencia',
      disable: false,
      class: 'col-12 col-md-12',
    },
  ])

  const listAction = async (filters: string = '') => {
    tableProps.value.loading = true
    tableProps.value.rows = []
    tableProps.value.loading = false
    filterRef.value = filters
    await _getCurrencyForeignAndLocalConstitution(filters)
  }

  const updatePage = (page: number) => {
    filtersFormat.value = {
      ...filtersFormat.value,
      page: page,
      rows: perPage,
    }
    const queryString = formatParamsCustom(filtersFormat.value)
    listAction(queryString ? '&' + queryString : '')
  }

  const updatePerPage = (rowsPerPage: number) => {
    perPage = rowsPerPage
    filtersFormat.value = {
      ...filtersFormat.value,
      rows: perPage,
    }
    const queryString = formatParamsCustom(filtersFormat.value)
    listAction(queryString ? '&' + queryString : '')
  }
  const handleFilter = async ($filter: {
    'filter[class_money]': string
    'filter[search]': string
  }) => {
    filtersFormat.value = {
      ...$filter,
    }
    const queryString = formatParamsCustom(filtersFormat.value)
    listAction(queryString ? '&' + queryString : '')
  }

  const handleBtnSelect = (option: { label: string; routeName?: string }) => {
    if (option?.routeName)
      router.push({ name: option.routeName, params: { label: option.label } })
  }

  const handleClear = () => {
    filtersFormat.value = {}
    tableProps.value.rows = []
  }

  onMounted(() => {
    _setDataInformationConditions(null)
    _setDataInformationGeneric(null)
    _setDataInformationValues(null)
    _setReferenceTabs({ valuePosition: 0 })
  })

  watch(
    () => data_constitution_list.value,
    () => {
      tableProps.value.rows = data_constitution_list.value
    }
  )

  return {
    headerProps,
    tableProps,
    filters,
    handleFilter,
    handleClear,
    updatePage,
    updatePerPage,
    handleBtnSelect,
    validateRouter,
    btnOptions,
  }
}
