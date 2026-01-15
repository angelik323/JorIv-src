// Vue - Pinia - Quasar
import { storeToRefs } from 'pinia'
import {
  onBeforeUnmount,
  onBeforeMount,
  onMounted,
  computed,
  watch,
  ref,
} from 'vue'

// Interfaces
import { IBaseTableProps, ITabs } from '@/interfaces/global'
import {
  IWithdrawalContributionLimitRequest,
  IWithdrawalContributionLimit,
} from '@/interfaces/customs/fics/WithdrawalContributionLimits'

// Composables
import { useRouteValidator, useUtils } from '@/composables'

// Stores
import { useWithdrawalContributionLimitsStore } from '@/stores/fics/withdrawal-contribution-limits'
import { useUserResourceStore } from '@/stores/resources-manager/users'
import { useResourceManagerStore } from '@/stores/resources-manager'

const useWithdrawalContributionLimitsList = () => {
  const whithdrawalStore = useWithdrawalContributionLimitsStore('v1')
  const { defaultIconsLucide, formatCurrencyString } = useUtils()
  const { validateRouter } = useRouteValidator()

  const { withdrawal_list, withdrawal_pages } = storeToRefs(whithdrawalStore)
  const { _getResources, _resetKeys } = useResourceManagerStore('v1')
  const { user_roles } = storeToRefs(useUserResourceStore('v1'))
  const { _listAction, _createAction, _updateAction, _deleteAction } =
    whithdrawalStore

  const filtersFormat = ref<Record<string, string | number>>({})
  const currentOption = ref<'create' | 'edit'>('create')
  const createEditModalRef = ref()
  const tabActiveType = ref(true)
  const deleteModalRef = ref()

  let perPage = 20

  const formData = ref<IWithdrawalContributionLimitRequest>({
    position: null,
    minimum_amount: '0',
    maximum_amount: '',
    type: 1,
  })

  const deleteModalConfig = ref({
    title: 'Advertencia',
    description: tabActiveType.value
      ? '¿Desea eliminar el monto de retiro y cancelación?'
      : '¿Desea eliminar el monto de aporte?',
    id: null as number | null,
  })

  const headerProperties = {
    title: 'Configurar montos de retiros y aportes máximos',
    breadcrumbs: [
      {
        label: 'Inicio',
        route: 'HomeView',
      },
      {
        label: 'Fics',
      },
      {
        label: 'Configurar montos de retiros y aportes máximos',
        route: 'WithdrawalContributionLimitsList',
      },
    ],
  }

  const tabs = ref<ITabs[]>([
    {
      name: 'amountsWithdrawal',
      label: 'Montos de retiros y cancelación',
      icon: defaultIconsLucide.sliders,
      outlined: true,
      disable: false,
      show: true,
      required: false,
    },
    {
      name: 'amountsContribution',
      label: 'Montos de aportes',
      icon: defaultIconsLucide.dollarSign,
      outlined: true,
      disable: false,
      show: true,
      required: false,
    },
  ])

  const tableProperties = ref<IBaseTableProps<IWithdrawalContributionLimit>>({
    loading: false,
    columns: [
      {
        name: 'id',
        align: 'center',
        label: '#',
        field: 'id',
      },
      {
        name: 'position',
        align: 'left',
        label: 'Cargo',
        field: 'position',
        sortable: true,
      },
      {
        name: 'minimum_amount',
        align: 'left',
        label: 'Monto mínimo',
        field: (row) => formatCurrencyString(row.minimum_amount),
        sortable: true,
      },
      {
        name: 'maximum_amount',
        align: 'left',
        label: 'Monto máximo',
        field: (row) => formatCurrencyString(row.maximum_amount),
        sortable: true,
      },
      {
        name: 'actions',
        align: 'center',
        label: 'Acciones',
        field: 'id',
      },
    ],
    rows: [],
    pages: {
      currentPage: 0,
      lastPage: 0,
    },
  })

  const filteredTabs = computed(() => tabs.value.filter((tab) => tab.show))

  const tabActive = ref(filteredTabs.value[0].name)

  const tabActiveIdx = ref(
    filteredTabs.value.findIndex((tab) => tab.name === tabActive.value)
  )

  const loadData = async (filters: Record<string, string | number>) => {
    tableProperties.value.loading = true

    const typeValue = tabActiveType.value ? 1 : 2
    const query = `filter[type]=${typeValue}`

    await _listAction({ ...filters, ...filtersFormat.value, query })

    setTimeout(() => {
      tableProperties.value.loading = false
    }, 1000)
  }

  const handleUpdatePage = async (page: number) => await loadData({ page })

  const handleUpdatePerPage = async (rowsPerPage: number) => {
    perPage = rowsPerPage
    await loadData({ rows: perPage })
  }

  const resetFormData = () => {
    formData.value = {
      id: 0,
      position: null,
      minimum_amount: '0',
      maximum_amount: '',
      type: tabActiveType.value ? 1 : 2,
    }
  }

  const handleOptions = async (
    option: 'create' | 'edit' | 'delete',
    id?: number
  ) => {
    if (option === 'create') {
      resetFormData()
      createEditModalRef.value.openModal()
      currentOption.value = option
      return
    }

    if (!id) return

    if (option === 'edit') {
      const selectedItem = tableProperties.value.rows.find(
        (row) => row.id === id
      )
      if (!selectedItem) return

      formData.value = {
        id: selectedItem.id,
        position: selectedItem.position,
        minimum_amount: selectedItem.minimum_amount,
        maximum_amount: selectedItem.maximum_amount,
        type: selectedItem.type,
      }

      createEditModalRef.value.openModal(id)
      currentOption.value = option
    } else if (option === 'delete') {
      deleteModalConfig.value.id = id
      await deleteModalRef.value.openModal()
    }
  }

  const onSelectPosition = (selectedValue: string | number) => {
    const selectedOption = user_roles.value.find(
      (opt) => opt.value === selectedValue
    )
    formData.value.position = selectedOption ? selectedOption.label : ''
  }

  const handleSubmitForm = async (option: 'create' | 'edit') => {
    if (!validateForm()) return

    const payload = {
      id: formData.value.id,
      position: formData.value.position,
      minimum_amount: formData.value.minimum_amount,
      maximum_amount: formData.value.maximum_amount,
      type: tabActiveType.value ? 1 : 2,
    }

    const actionMap = {
      create: _createAction,
      edit: _updateAction,
    }

    await actionMap[option](payload)

    await loadData({})
    handleCloseModal()
    resetFormData()
  }

  const handleDeleteItem = async () => {
    await _deleteAction(deleteModalConfig.value.id!)
    deleteModalRef.value.closeModal()
    await loadData({})
  }

  const handleCloseModal = () => createEditModalRef.value.closeModal()

  const validateForm = (): boolean => {
    const isPositionValid = !!formData.value.position
    const isMinimumValid = !!formData.value.minimum_amount
    const isMaximumValid = !!formData.value.maximum_amount

    return isPositionValid && isMinimumValid && isMaximumValid
  }

  onBeforeMount(async () => await _getResources({ user: ['roles'] }))

  onMounted(async () => await loadData({}))

  onBeforeUnmount(() => _resetKeys({ user: ['roles'] }))

  watch(tabActive, async (newTab) => {
    tabActiveType.value = newTab === 'amountsWithdrawal'
    await loadData({})
  })

  watch(
    withdrawal_list,
    (val) => {
      tableProperties.value.rows = [...val]

      const { currentPage, lastPage } = withdrawal_pages.value
      tableProperties.value.pages = {
        currentPage,
        lastPage,
      }
    },
    { deep: true }
  )

  return {
    formData,
    tabActive,
    user_roles,
    tabActiveIdx,
    filteredTabs,
    currentOption,
    tabActiveType,
    handleOptions,
    deleteModalRef,
    validateRouter,
    tableProperties,
    handleSubmitForm,
    handleDeleteItem,
    headerProperties,
    handleUpdatePage,
    handleCloseModal,
    onSelectPosition,
    deleteModalConfig,
    createEditModalRef,
    defaultIconsLucide,
    handleUpdatePerPage,
  }
}

export default useWithdrawalContributionLimitsList
