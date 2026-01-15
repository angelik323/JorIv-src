// Vuew - Vue Router - Pinia
import { onBeforeUnmount, onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import { storeToRefs } from 'pinia'

// Interfaces
import { IBaseTableProps, ITabs } from '@/interfaces/global'
import {
  IConsultPercentageSummary,
  IParticipationTypeSequences,
  IParticipationTypeSequencesRequest,
} from '@/interfaces/customs/fics/CollectiveInvestmentFunds'

// Composables
import { useMainLoader } from '@/components/loader/composable/useMainLoader'
import { useGoToUrl } from '@/composables/useGoToUrl'
import { useUtils } from '@/composables/useUtils'

// Stores
import { useCollectiveInvestmentFundsStore } from '@/stores/fics/collective-investment-funds'
import { useFicResourceStore } from '@/stores/resources-manager/fics'
import { useResourceManagerStore } from '@/stores/resources-manager'

const useParticipationTypeSequencesCreate = () => {
  const { defaultIconsLucide, formatDate } = useUtils()
  const { openMainLoader } = useMainLoader()
  const { goToURL } = useGoToUrl()
  const route = useRoute()

  const {
    participation_types_codes_assigned_sequence: participationTypesCodes,
    assigned_sequence: assignedSequence,
  } = storeToRefs(useFicResourceStore('v1'))

  const {
    _updateConsecutiveParticipationTypesAction,
    _listConsecutiveParticipationTypesAction,
    _showAction,
  } = useCollectiveInvestmentFundsStore('v1')
  const { _getResources, _resetKeys } = useResourceManagerStore('v1')

  const formData = ref<IConsultPercentageSummary | null>(null)
  const isTableEmpty = ref(false)
  const isAssignMode = ref(false)

  const id = route.params.id as string

  const keys = {
    fics: ['participation_types_codes', 'assigned_sequence'],
  }

  const headerProps = {
    title: 'Código de registro super informe 77',
    breadcrumbs: [
      {
        label: 'Inicio',
        route: 'HomeView',
      },
      {
        label: 'Fics',
      },
      {
        label: 'Fondos de inversión colectiva',
        route: 'CollectiveInvestmentFundsList',
      },
      {
        label: 'Código de registro super informe 77',
        route: 'ParticipationTypeSequencesCreate',
      },
      {
        label: id,
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

  const tableProps = ref<IBaseTableProps<IParticipationTypeSequences>>({
    title: 'Tipos de participación',
    loading: false,
    columns: [
      {
        name: 'participation_type_code',
        label: 'Código TP',
        align: 'left',
        field: 'participation_type_code',
        sortable: true,
      },
      {
        name: 'participation_description',
        label: 'Tipo de participación',
        align: 'left',
        field: 'participation_description',
        sortable: true,
      },
      {
        name: 'status',
        label: 'Estado',
        align: 'left',
        field: 'status',
        sortable: true,
      },
      {
        name: 'commsion_code',
        label: 'Código comisión',
        align: 'left',
        field: 'commsion_code',
        sortable: true,
      },
      {
        name: 'commsion_type',
        label: 'Tipo de comisión',
        align: 'left',
        field: 'commsion_type',
        sortable: true,
      },
      {
        name: 'commsion_percentage',
        label: '% de comisión',
        align: 'left',
        field: (row: IParticipationTypeSequences) =>
          `${row.commsion_percentage}%`,
        sortable: true,
      },
      {
        name: 'business_code',
        label: 'Código superintendencia',
        align: 'left',
        field: 'business_code',
        sortable: true,
      },
      {
        name: 'registration_code_id',
        label: 'Código registro',
        align: 'left',
        field: (row: IParticipationTypeSequences) =>
          `${row.registration_code_id ?? '-'}`,
        sortable: true,
      },
      {
        name: 'assigned_sequence',
        label: 'Consecutivo asignado',
        align: 'left',
        field: (row: IParticipationTypeSequences) =>
          `${row.assigned_sequence ?? '-'}`,
        sortable: true,
      },
    ],
    rows: [],
    pages: {
      currentPage: 0,
      lastPage: 0,
    },
  })

  const tabActive = tabs[0].name
  const tabActiveIdx = 0

  const loadData = async () => {
    openMainLoader(true)
    tableProps.value.rows = []

    await _getResources(keys)

    formData.value = await _showAction(id)
    const response = await _listConsecutiveParticipationTypesAction(Number(id))

    if (response) {
      tableProps.value.rows = response.list
      tableProps.value.pages = response.pages
    }

    isTableEmpty.value = tableProps.value.rows.length === 0

    setTimeout(() => openMainLoader(false), 1000)
  }

  const toggleAssignMode = async () => {
    if (isAssignMode.value) {
      openMainLoader(true)

      const payload: IParticipationTypeSequencesRequest = {
        participation_types: tableProps.value.rows.map((r) => ({
          participation_type_id: r.participation_type_id,
          assigned_sequence: r.assigned_sequence || null,
          registration_code_id: r.registration_code_id || null,
        })),
      }

      const success = await _updateConsecutiveParticipationTypesAction(payload)

      openMainLoader(false)

      if (!success) return

      await loadData()
      isAssignMode.value = false
      return
    }

    isAssignMode.value = true
  }

  const handleGoToList = () =>
    goToURL('CollectiveInvestmentFundsList', undefined, { reload: true })

  onMounted(async () => await loadData())

  onBeforeUnmount(() => _resetKeys(keys))

  return {
    tabs,
    formData,
    tabActive,
    formatDate,
    tableProps,
    headerProps,
    isAssignMode,
    tabActiveIdx,
    isTableEmpty,
    handleGoToList,
    toggleAssignMode,
    assignedSequence,
    participationTypesCodes,
  }
}

export default useParticipationTypeSequencesCreate
