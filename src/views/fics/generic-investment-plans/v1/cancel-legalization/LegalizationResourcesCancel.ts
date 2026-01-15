// Vue - Pinia - Router
import { ref, computed, onMounted, watch, onBeforeUnmount } from 'vue'
import { useRoute } from 'vue-router'
import { storeToRefs } from 'pinia'

// Components
import AlertModalComponent from '@/components/common/AlertModal/AlertModalComponent.vue'

// Interfaces
import { IBaseTableProps, ITabs } from '@/interfaces/global'
import { IFieldFilters } from '@/interfaces/customs/Filters'
import {
  IGenericInvestmentPlansLegalizeResponse,
  IGenericInvestmentPlansLegalizeLegalization,
} from '@/interfaces/customs/fics/GenericInvestmentPlans'

// Composables
import { useMainLoader, useUtils, useRules, useGoToUrl } from '@/composables'

// Stores
import { useGenericInvestmentPlansStore } from '@/stores/fics/generic-investment-plans'
import { useFicResourceStore } from '@/stores/resources-manager/fics'
import { useResourceManagerStore } from '@/stores/resources-manager'

const useLegalizationResourcesCancel = () => {
  const { date_before_or_equal_to_the_current_date } = useRules()
  const { openMainLoader } = useMainLoader()
  const { defaultIconsLucide, formatCurrency } = useUtils()
  const { goToURL } = useGoToUrl()
  const route = useRoute()

  const {
    _showGenericPlanById,
    _clearGenericPlanLegalizations,
    _listGenericPlanLegalizations,
    _cancelInvestmentPlansLegalization,
  } = useGenericInvestmentPlansStore('v1')

  const {
    generic_investment_plan_legalizations_list,
    generic_investment_plan_legalizations_pages,
  } = storeToRefs(useGenericInvestmentPlansStore('v1'))

  const { fiduciary_investment_plans } = storeToRefs(useFicResourceStore('v1'))
  const { _getResources, _resetKeys } = useResourceManagerStore('v1')

  const genericInvestmentPlan =
    ref<IGenericInvestmentPlansLegalizeResponse | null>(null)
  const filtersFormat = ref<Record<string, string | number>>({})
  const isLoadingGenericInvestmentPlan = ref<boolean>(true)

  const selectedLegalization =
    ref<IGenericInvestmentPlansLegalizeLegalization | null>(null)
  const cancelLegalizationsModalRef = ref<InstanceType<
    typeof AlertModalComponent
  > | null>(null)

  const genericInvestmentPlanId = +route.params.id

  const cancelLegalizationsModalProps = ref({
    title: '¿Desea anular las transferencias seleccionadas?',
    description: '',
  })

  const keys = {
    fics: ['fiduciary_investment_plans'],
  }

  const headerProps = {
    title: 'Anulación de legalización de recursos',
    breadcrumbs: [
      {
        label: 'Inicio',
        route: 'HomeView',
      },
      {
        label: 'Fics',
      },
      {
        label: 'Planes de inversión genéricos',
        route: 'GenericInvestmentPlansList',
      },
      {
        label: 'Anulación de legalización de recursos',
        route: 'GenericInvestmentPlansLegalizeCancel',
      },
    ],
  }

  const tabs: ITabs[] = [
    {
      name: 'information',
      label: 'Datos básicos',
      icon: defaultIconsLucide.bulletList,
      outlined: true,
      disable: true,
      show: true,
      required: false,
    },
  ]

  const activeTab = tabs[0].name
  const activeTabIdx = 0

  const filterConfig = ref<IFieldFilters[]>([
    {
      name: 'contribution_number',
      label: 'Número de aporte',
      type: 'q-input',
      value: null,
      class: 'col-12 col-md-3',
      disable: false,
      clean_value: true,
      placeholder: 'Buscar por número de aporte',
    },
    {
      name: 'transfer_number',
      label: 'Número de traslado',
      type: 'q-input',
      value: null,
      class: 'col-12 col-md-3',
      disable: false,
      clean_value: true,
      placeholder: 'Buscar por número de traslado',
    },
    {
      name: 'transfer_date',
      label: 'Fecha de traslado',
      type: 'q-date',
      value: null,
      rules: [
        (val: string) =>
          val ? date_before_or_equal_to_the_current_date(val) : true,
      ],
      class: 'col-12 col-md-3',
      disable: false,
      clean_value: true,
      placeholder: 'AAAA-MM-DD',
    },
    {
      name: 'destination_plan',
      label: 'Plan destino',
      type: 'q-select',
      options: fiduciary_investment_plans,
      value: null,
      class: 'col-12 col-md-3',
      disable: false,
      clean_value: true,
      placeholder: 'Todos',
    },
  ])

  const tableProps = ref<
    IBaseTableProps<IGenericInvestmentPlansLegalizeLegalization>
  >({
    title: 'Lista de legalizaciones generadas',
    loading: false,
    columns: [
      {
        name: 'id',
        label: '#',
        field: 'id',
        align: 'left',
        sortable: true,
        format: (item) => item || '-'
      },
      {
        name: 'operation_number',
        label: 'Número de aporte',
        field: 'operation_number',
        align: 'left',
        sortable: true,
        format: (item) => item || '-'
      },
      {
        name: 'contribution_date',
        label: 'Fecha de aporte',
        field: 'contribution_date',
        align: 'left',
        sortable: true,
        format: (item) => item || '-'
      },
      {
        name: 'transfer_number',
        label: 'Número de traslado',
        field: 'transfer_number',
        align: 'left',
        sortable: true,
        format: (item) => item || '-'
      },
      {
        name: 'destination_plans',
        label: 'Plan destino',
        field: 'destination_plans',
        align: 'left',
        sortable: true,
        format: (item) => item || '-'
      },
      {
        name: 'value',
        label: 'Valor del aporte',
        field: (row) => formatCurrency(row.value ?? 0),
        align: 'left',
        sortable: true,
        format: (item) => item || '-'
      },
      {
        name: 'returns',
        label: 'Rendimientos',
        field: 'returns',
        align: 'left',
        sortable: true,
        format: (item) => item || '0'
      },
      {
        name: 'balance',
        label: 'Saldo del aporte',
        field: (row) => formatCurrency(row.balance ?? 0),
        align: 'left',
        sortable: true,
        format: (item) => item || '0'
      },

      {
        name: 'retention',
        label: 'Retención contingente',
        field: 'retention',
        align: 'left',
        sortable: true,
        format: (item) => item || '0'
      },
    ],
    rows: [],
    pages: { currentPage: 0, lastPage: 0 },
  })

  const hasSelectedLegalization = computed<boolean>(
    () => selectedLegalization.value !== null
  )

  const handleGoToList = () =>
    goToURL('GenericInvestmentPlansList', undefined, { reload: true })

  const loadGenericInvestmentPlanData = async () => {
    isLoadingGenericInvestmentPlan.value = true
    genericInvestmentPlan.value = await _showGenericPlanById(
      String(genericInvestmentPlanId)
    )
    isLoadingGenericInvestmentPlan.value = true
  }

  const loadLegalizationsTableData = async (
    filters: Record<string, string | number>
  ) => {
    openMainLoader(true)
    await _listGenericPlanLegalizations(genericInvestmentPlanId, filters)
    openMainLoader(false)
  }

  const handleFilter = async (filters: Record<string, string | number>) => {
    filtersFormat.value = {
      ...filtersFormat.value,
      ...filters,
    }

    const filterDestinationPlan =
      filtersFormat.value['filter[destination_plan]']

    if (filterDestinationPlan) {
      const selectedPlan = fiduciary_investment_plans.value.find(
        (plan) => plan.value === filterDestinationPlan
      )

      if (selectedPlan?.code) {
        filtersFormat.value['filter[destination_plan]'] = selectedPlan.code
      }
    }

    await loadLegalizationsTableData(filtersFormat.value)
  }

  const handleClearFilter = () => _clearGenericPlanLegalizations()

  const handleUpdatePage = async (page: number) => {
    filtersFormat.value = {
      ...filtersFormat.value,
      page,
    }
    await loadLegalizationsTableData(filtersFormat.value)
  }

  const handleUpdateRowsPerPage = async (rows: number) => {
    filtersFormat.value = {
      ...filtersFormat.value,
      page: 1,
      rows,
    }

    await loadLegalizationsTableData(filtersFormat.value)
  }

  const handleSelectedLegalizations = (
    legalizations: IGenericInvestmentPlansLegalizeLegalization[]
  ) => {
    const [legalization] = legalizations
    selectedLegalization.value = legalization || null
  }

  const handleOpenCancelLegalizationsModal = async () => {
    await cancelLegalizationsModalRef.value?.openModal()
  }

  const handleCancelLegalizations = async () => {
    openMainLoader(true)

    if (!selectedLegalization.value) {
      openMainLoader(false)
      cancelLegalizationsModalRef.value?.closeModal()
      return
    }

    const success = await _cancelInvestmentPlansLegalization(
      selectedLegalization.value.legalization_id
    )

    if (success) await loadLegalizationsTableData(filtersFormat.value)

    openMainLoader(false)

    cancelLegalizationsModalRef.value?.closeModal()
  }

  onMounted(async () => {
    openMainLoader(true)

    await loadGenericInvestmentPlanData()
    await _getResources(keys)

    openMainLoader(false)
  })

  onBeforeUnmount(() => {
    _resetKeys(keys)
    _clearGenericPlanLegalizations()
  })

  watch(
    generic_investment_plan_legalizations_list,
    (val) => {
      tableProps.value.rows = [...val]

      const { currentPage, lastPage } =
        generic_investment_plan_legalizations_pages.value
      tableProps.value.pages = {
        currentPage,
        lastPage,
      }
    },
    { deep: true }
  )

  return {
    tabs,
    activeTab,
    tableProps,
    headerProps,
    filterConfig,
    activeTabIdx,
    handleFilter,
    handleGoToList,
    handleUpdatePage,
    handleClearFilter,
    genericInvestmentPlan,
    hasSelectedLegalization,
    handleUpdateRowsPerPage,
    handleCancelLegalizations,
    handleSelectedLegalizations,
    cancelLegalizationsModalRef,
    cancelLegalizationsModalProps,
    handleOpenCancelLegalizationsModal,
  }
}

export default useLegalizationResourcesCancel
