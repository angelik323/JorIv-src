// Vue - Pinia
import { ref, onMounted, watch, onBeforeUnmount } from 'vue'
import { QTableColumn } from 'quasar'
import { storeToRefs } from 'pinia'

// Interfaces
import { IParticipationTypeRegistration } from '@/interfaces/customs/fics/ParticipationTypeRegistration'
import { IFieldFilters } from '@/interfaces/customs/Filters'
import { WriteActionType } from '@/interfaces/global'

// Composables
import { useUtils, useRouteValidator } from '@/composables'

// Stores
import { useParticipationTypeRegistration } from '@/stores/fics/participation-type-registration'
import { useFicResourceStore } from '@/stores/resources-manager/fics'
import { useResourceManagerStore } from '@/stores/resources-manager'

const useParticipationTypeRegistrationList = () => {
  const { defaultIconsLucide, formatParamsCustom } = useUtils()

  const {
    participation_type_registration_list,
    participation_type_registration_pages,
  } = storeToRefs(useParticipationTypeRegistration('v1'))

  const { participation_types_codes } = storeToRefs(useFicResourceStore('v1'))
  const { _getResources, _resetKeys } = useResourceManagerStore('v1')
  const { _cleanData } = useParticipationTypeRegistration('v1')

  const { _getListAction, _create, _update } =
    useParticipationTypeRegistration('v1')

  const filtersFormat = ref<Record<string, string | number>>({})
  const formAction = ref<WriteActionType>('create')
  const { validateRouter } = useRouteValidator()
  const isParticipationTypeEmpty = ref(true)
  const openFormModal = ref(false)
  const showState = ref(0)
  const formRef = ref()

  const keys = { fics: ['participation_types_codes'] }

  const formData = ref<IParticipationTypeRegistration>({
    id: undefined,
    code: 0,
    description: '',
  })

  const headerProps = {
    title: 'Códigos de registro tipo de participación',
    breadcrumbs: [
      {
        label: 'Inicio',
        route: 'HomeView',
      },
      {
        label: 'Fics',
      },
      {
        label: 'Códigos de registro tipo de participación',
        route: 'ParticipationTypeRegistrationList',
      },
    ],
  }

  const filters = ref<IFieldFilters[]>([
    {
      name: 'search',
      label: 'Código de registro',
      type: 'q-select',
      value: null,
      class: 'col-xs-12 col-sm-12 q-py-md',
      prepend_icon: 'mdi-shape-outline',
      disable: false,
      clean_value: true,
      placeholder: 'Seleccione',
      options: participation_types_codes,
    },
  ])

  const tableProps = ref<{
    title: string
    loading: boolean
    columns: QTableColumn<IParticipationTypeRegistration>[]
    rows: IParticipationTypeRegistration[]
    pages: { currentPage: number; lastPage: number }
  }>({
    title: 'Listado de códigos de registro',
    loading: false,
    columns: [
      { name: 'id', label: '#', align: 'left', field: 'id', sortable: true },
      {
        name: 'code',
        label: 'Código de registro',
        align: 'left',
        field: (row) => row.code,
        sortable: true,
      },
      {
        name: 'description',
        label: 'Descripción código de registro tipos participación',
        align: 'left',
        field: (row) => row.description,
        style:
          'white-space: normal; word-break: break-word; max-width: 600px; text-align: justify;',
        sortable: true,
      },
      { name: 'actions', label: 'Acciones', align: 'center', field: () => '' },
    ],
    rows: [],
    pages: { currentPage: 1, lastPage: 1 },
  })

  const listAction = async (params = '') => {
    tableProps.value.loading = true
    await _getListAction(params)

    const hasResults = participation_type_registration_list.value.length > 0

    showState.value = params ? 1 : 0
    isParticipationTypeEmpty.value = !hasResults

    tableProps.value.loading = false
  }

  const handleFilter = ($filters: { 'filter[search]': string }) => {
    filtersFormat.value = {
      ...$filters,
    }
    listAction(formatParamsCustom(filtersFormat.value))
  }

  const updatePage = (page: number) => {
    filtersFormat.value = {
      ...filtersFormat.value,
      page,
    }
    listAction(formatParamsCustom(filtersFormat.value))
  }

  const updatePerPage = (rowsPerPage: number) => {
    filtersFormat.value = {
      ...filtersFormat.value,
      rows: rowsPerPage,
    }
    listAction(formatParamsCustom(filtersFormat.value))
  }

  const handleSubmit = async () => {
    const isValid = await formRef.value?.formElementRef?.validate?.()
    if (!isValid) return

    let success = false

    if (formAction.value === 'create') success = await _create(formData.value)
    else if (formAction.value === 'edit')
      success = await _update(formData.value.id!, formData.value)

    if (success) {
      openFormModal.value = false

      if (formAction.value === 'edit') {
        const updatedId = formData.value.id
        const index = tableProps.value.rows.findIndex((r) => r.id === updatedId)
        if (index !== -1) {
          tableProps.value.rows.splice(index, 1)
        }
        tableProps.value.rows.unshift({ ...formData.value })
      } else await listAction(formatParamsCustom(filtersFormat.value))
    }
  }

  const handleCancel = () => (openFormModal.value = false)

  const handleEdit = async (id: number) => {
    const item = participation_type_registration_list.value.find(
      (item) => item.id === id
    )
    if (!item) return

    formData.value = {
      id: item.id,
      code: item.code,
      description: item.description,
    }

    formAction.value = 'edit'
    openFormModal.value = true
  }

  const handleOptions = (option: string, id: number) => {
    if (option === 'edit') handleEdit(id)
  }

  const handleClearFilters = () => {
    _cleanData()
    showState.value = 0
    tableProps.value.rows = []
    isParticipationTypeEmpty.value = true
  }

  const handleCreate = () => {
    formAction.value = 'create'
    formData.value = {
      id: undefined,
      code: 0,
      description: '',
    }
    openFormModal.value = true
  }

  watch(
    participation_type_registration_list,
    () => (tableProps.value.rows = participation_type_registration_list.value)
  )

  watch(
    participation_type_registration_pages,
    () =>
      (tableProps.value.pages = {
        currentPage: participation_type_registration_pages.value.currentPage,
        lastPage: participation_type_registration_pages.value.lastPage,
      })
  )

  onMounted(async () => {
    await _getResources(keys)
    _cleanData()
  })

  onBeforeUnmount(() => _resetKeys(keys))

  return {
    filters,
    formRef,
    formData,
    showState,
    tableProps,
    formAction,
    updatePage,
    headerProps,
    handleCreate,
    handleCancel,
    handleSubmit,
    handleFilter,
    updatePerPage,
    handleOptions,
    openFormModal,
    validateRouter,
    defaultIconsLucide,
    handleClearFilters,
    isParticipationTypeEmpty,
  }
}

export default useParticipationTypeRegistrationList
