import imageAlert from '@/assets/images/alert-confirmation.jpg'

import FiltersComponent from '@/components/common/Filters/v2/FiltersComponent.vue'
import ContentComponent from '@/components/common/ViewContainter/ContentComponent.vue'
import TableList from '@/components/table-list/TableList.vue'
import ShowStatus from '@/components/showStatus/ShowStatus.vue'
import Icon from '@/components/common/Icon/Icon.vue'
import AlertModalComponent from '@/components/common/AlertModal/AlertModalComponent.vue'
import Button from '@/components/common/Button/Button.vue'

import { IShowAlertInformation, IThirdPartiesList } from '@/interfaces/global'
import { PersonType } from '@/interfaces/global/Clients'

import {
  useMainLoader,
  useRules,
  useAlertModal,
  useRouteValidator,
} from '@/composables'

// Utils
import { formatParamsCustom, defaultIconsLucide } from '@/utils'

import {
  useFiltersStore,
  useResourceStore,
  useThirdPartiesStore,
} from '@/stores'
import { storeToRefs } from 'pinia'

import { defineComponent, onMounted, reactive, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { QTable } from 'quasar'
import moment from 'moment'

export default defineComponent({
  name: 'ThirdPartiesList',
  components: {
    ContentComponent,
    FiltersComponent,
    TableList,
    ShowStatus,
    Icon,
    AlertModalComponent,
    Button,
  },
  setup() {
    const { showAlertInformation } = useAlertModal()

    const router = useRouter()

    const { openMainLoader } = useMainLoader()
    const { validateRouter } = useRouteValidator()

    const { _setTypePerson, getResources } = useResourceStore('v1')
    const { _getListAction, _deleteThirdParty, _changeStatus } =
      useThirdPartiesStore()
    const { _cleanThirdPartiesData } = useThirdPartiesStore()
    const { setFilterState } = useFiltersStore()
    const { thirdparties_list, thirdparties_pages } = storeToRefs(
      useThirdPartiesStore()
    )
    const {
      status,
      person_types,
      document_types_third_party_natural,
      document_types_third_legal,
    } = storeToRefs(useResourceStore('v1'))

    const { date_before_or_equal_to_the_specific_date } = useRules()

    const { filterState } = storeToRefs(useFiltersStore())

    const customColumns = ['status_id', 'actions']

    const headerProperties = {
      title: 'Vinculación de terceros',
      breadcrumbs: [
        {
          label: 'Administración',
        },
        {
          label: 'Terceros',
          route: '',
        },
        {
          label: 'Vinculación de terceros',
          route: 'ThirdPartiesList',
        },
      ],
      btn: {
        label: 'Crear',
        icon: 'mdi-plus',
      },
    }

    const tableProperties = reactive({
      title: 'Listado de terceros',
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
          name: 'name',
          required: true,
          label: 'Nombre o razón social',
          align: 'left',
          field: 'name',
          sortable: true,
          style: {
            'max-width': '140px',
            'min-width': '100px',
            'word-wrap': 'break-word',
            'white-space': 'break-spaces',
          },
        },
        {
          name: 'type',
          label: 'Tipo de documento',
          align: 'left',
          field: 'document_type',
          sortable: true,
          style: {
            'max-width': '140px',
            'min-width': '100px',
            'word-wrap': 'break-word',
            'white-space': 'break-spaces',
          },
        },
        {
          name: 'document',
          required: true,
          label: 'Número de documento',
          align: 'left',
          field: 'document',
          sortable: true,
          style: {
            'max-width': '140px',
            'min-width': '100px',
            'word-wrap': 'break-word',
            'white-space': 'break-spaces',
          },
        },
        {
          name: 'person_type',
          required: true,
          label: 'Tipo de persona',
          align: 'left',
          field: 'person_type',
          sortable: true,
          style: {
            'max-width': '140px',
            'min-width': '100px',
            'word-wrap': 'break-word',
            'white-space': 'break-spaces',
          },
        },
        {
          name: 'third_party_type',
          required: true,
          label: 'Tipo de tercero',
          align: 'left',
          field: 'third_party_type',
          sortable: true,
          style: {
            'max-width': '140px',
            'min-width': '100px',
            'word-wrap': 'break-word',
            'white-space': 'break-spaces',
          },
        },
        {
          name: 'status_id',
          required: true,
          label: 'Estado',
          align: 'center',
          field: (row) => row.status.id,
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
      rows: [] as IThirdPartiesList[],
      pages: thirdparties_pages,
    })

    const optionsCalendar = (date: string) =>
      date <= moment().format('YYYY/MM/DD')

    const filterConfig = ref([
      {
        name: 'status_id',
        label: 'Estado',
        type: 'q-select',
        value: 0,
        class: 'col-xs-12 col-sm-6 col-md-3 col-lg-3',
        options: status.value,
        disable: false,
        clean_value: true,
        placeholder: 'Todos',
      },
      {
        name: 'person_type',
        label: 'Tipo persona',
        type: 'q-select',
        value: null,
        class: 'col-xs-12 col-sm-6 col-md-3 col-lg-3',
        options: person_types.value,
        disable: false,
        clean_value: true,
      },
      {
        name: 'document_type_id',
        label: 'Tipo de documento',
        type: 'q-select',
        value: null,
        class: 'col-xs-12 col-sm-12 col-md-3 col-lg-3',
        options: [
          ...document_types_third_party_natural.value,
          ...document_types_third_legal.value,
        ],
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
        prepend_icon: 'mdi-magnify',
        clean_value: true,
        placeholder: 'Buscar por nombre / razón social o documento',
      },
      {
        name: 'start_date',
        label: 'Creación desde',
        type: 'q-date',
        value: '',
        class: 'col-xs-12 col-sm-12 col-md-6 col-lg-6',
        disable: false,
        clean_value: true,
        option_calendar: optionsCalendar,
      },
      {
        name: 'end_date',
        label: 'Creación hasta',
        type: 'q-date',
        value: '',
        class: 'col-xs-12 col-sm-12 col-md-6 col-lg-6',
        disable: false,
        clean_value: true,
        option_calendar: optionsCalendar,
      },
    ])

    const optionsThird = ref([
      {
        label: 'Crear persona natural',
        icon: 'SquareUser',
        type: PersonType.NATURAL,
      },
      {
        label: 'Crear persona jurídica',
        icon: 'Briefcase',
        type: PersonType.LEGAL,
      },
    ])

    const keys = [
      'document_types_third_party_natural',
      'document_types_third_legal',
    ]

    const filtersFormat = ref<Record<string, string | number>>({})

    const alertModalRef = ref()

    const alertModalConfig = ref({
      title: 'Advertencia',
      description: '',
      entityId: null as number | null,
    })

    const setAlertModalDescription = (status: string) => {
      return `¿Está seguro que desea ${status} el tercero?`
    }

    const openAlertModal = async (status: string, entityId: number) => {
      alertModalConfig.value.entityId = entityId
      alertModalConfig.value.description = setAlertModalDescription(status)
      await alertModalRef.value.openModal()
    }

    const changeStatus = async () => {
      openMainLoader(true)
      if (alertModalConfig.value.entityId) {
        await alertModalRef.value.closeModal()
        openMainLoader(true)
        await _changeStatus(alertModalConfig.value.entityId)

        setTimeout(() => {
          openMainLoader(false)
        }, 2000)
      }

      setTimeout(() => {
        openMainLoader(false)
      }, 500)
    }

    const gotoCreate = (type: string) => {
      _setTypePerson(type)
      router.push({ name: 'ThirdPartiesCreate' })
    }

    const handlerGoTo = (goURL: string) => {
      router.push({ name: goURL })
    }

    const listAction = async (filters: string = '') => {
      tableProperties.rows = []
      tableProperties.loading = true
      await _getListAction(filters)
      tableProperties.loading = false
    }

    const handleFilter = ($filters: {
      'filter[status_id]': string
      'filter[person_type]': string
      'filter[third_party_type]': string
      'filter[created_until]': string
      'filter[search]': string
      'filter[start_date]': string
      'filter[end_date]': string
    }) => {
      filtersFormat.value = {
        ...$filters,
      }
      const queryString = formatParamsCustom(filtersFormat.value)

      listAction(queryString ? '&' + queryString : '')
    }

    const handleClearFilters = () => {
      tableProperties.rows = []
    }

    const updatePage = (page: number) => {
      filtersFormat.value = {
        ...filtersFormat.value,
        page,
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

    const handleOptions = async (option: string, id: number) => {
      const alertParams: IShowAlertInformation = {
        title: 'Confirmación',
        image_url: imageAlert,
        confirm_button_text: 'Aceptar',
        cancel_button_text: 'Cancelar',
      }

      switch (option) {
        case 'view':
          router.push({ name: 'ThirdPartiesView', params: { id } })
          break
        case 'edit':
          router.push({ name: 'ThirdPartiesEdit', params: { id } })
          break
        case 'delete':
          if (id) {
            alertParams.params_html = `¿Desea eliminar el tercero?`
            const deleteThirdParty = await showAlertInformation(alertParams)
            if (deleteThirdParty) {
              await _deleteThirdParty(id)
              await listAction()
            }
          }
          break
        case 'Active':
          if (id) {
            alertParams.params_html = `¿Desea activar el tercero?`
            const changeStatus = await showAlertInformation(alertParams)
            if (changeStatus) {
              await _changeStatus(id)
              await listAction()
            }
          }
          break
        case 'Inactive':
          if (id) {
            alertParams.params_html = `¿Desea inactivar el tercero?`
            const changeStatus = await showAlertInformation(alertParams)
            if (changeStatus) {
              await _changeStatus(id)
              await listAction()
            }
          }
          break
        default:
          break
      }
    }

    onMounted(async () => {
      getResources(`keys[]=${keys.join('&keys[]=')}`)
      _cleanThirdPartiesData()
    })

    watch(
      () => thirdparties_list.value,
      () => {
        tableProperties.rows = thirdparties_list.value
      }
    )

    watch(
      () => thirdparties_pages.value,
      () => {
        tableProperties.pages = thirdparties_pages.value
      }
    )

    watch(
      [document_types_third_party_natural, document_types_third_legal],
      () => {
        setFilterState(filterConfig.value, '2', [
          ...document_types_third_party_natural.value,
          ...document_types_third_legal.value,
        ])
      }
    )

    watch(
      () => [filterState.value?.[4]?.value, filterState.value?.[5]?.value],
      () => {
        if (filterState.value?.[4]?.value) {
          filterState.value[5].rules = [
            (v: string) =>
              date_before_or_equal_to_the_specific_date(
                v,
                filterState.value?.[0]?.value ?? ''
              ),
          ]
        }
      }
    )

    return {
      headerProperties,
      tableProperties,
      customColumns,
      optionsThird,
      alertModalRef,
      alertModalConfig,
      defaultIconsLucide,
      filterConfig,

      changeStatus,
      handleFilter,
      handlerGoTo,
      handleClearFilters,
      updatePage,
      openAlertModal,
      handleOptions,
      gotoCreate,
      updateRows,
      validateRouter,
    }
  },
})
