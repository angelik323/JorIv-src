// Vuew - Pinia - Router - Quasar
import { onMounted, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { storeToRefs } from 'pinia'

// Interfaces
import { IBaseTableProps, ITabs } from '@/interfaces/global'
import {
  IConsultTransmissionList,
  IConsultPercentageSummary,
  IConsultTransmissionDetailList,
} from '@/interfaces/customs/fics/CollectiveInvestmentFunds'

// Composables
import { useGoToUrl, useMainLoader, useUtils } from '@/composables'

// Stores
import { useCollectiveInvestmentFundsStore } from '@/stores/fics/collective-investment-funds'

const useConsultTransmisionFormat523 = () => {
  const { defaultIconsLucide, formatDate, formatCurrency } = useUtils()
  const { openMainLoader } = useMainLoader()
  const { goToURL } = useGoToUrl()
  const route = useRoute()

  const {
    _listConsultTransmissionAction,
    _summaryConsultPercentageAction,
    _listConsultTransmissionDetailAction,
    _exportFileConsultTransmissionAction,
  } = useCollectiveInvestmentFundsStore('v1')
  const {
    consult_transmission_list,
    consult_transmission_pages,
    consult_transmission_detail_list,
    consult_transmission_detail_pages,
  } = storeToRefs(useCollectiveInvestmentFundsStore('v1'))

  const formData = ref<IConsultPercentageSummary | null>(null)
  const selectedId = ref<number | null>(null)
  const isTableDetailEmpty = ref(true)
  const isTableEmpty = ref(true)
  const isSelected = ref(false)
  const showState = ref(0)

  const id = route.params.id as string

  const headerProps = {
    title: 'Transmisión formato 523',
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
        label: 'Transmisión formato 523',
        route: 'ConsultTransmisionFormat523View',
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

  const tableProps = ref<IBaseTableProps<IConsultTransmissionList>>({
    title: 'Tipos de participación',
    loading: false,
    columns: [
      {
        name: 'business_line_name',
        label: 'Tipo de participación',
        align: 'left',
        field: (row: IConsultTransmissionList) => row.business_line.code || '-',
        sortable: true,
        required: true,
      },
      {
        name: 'business_line_description',
        label: 'Descripción',
        align: 'left',
        field: (row: IConsultTransmissionList) =>
          row.business_line.description || '-',
      },
    ],
    rows: [],
    pages: {
      currentPage: 0,
      lastPage: 0,
    },
  })

  const tablePropsDetail = ref<IBaseTableProps<IConsultTransmissionDetailList>>(
    {
      title: 'Detalle de columnas formato 77 - 523',
      loading: false,
      columns: [
        {
          name: 'column',
          label: 'Columna',
          align: 'left',
          field: 'column',
          sortable: true,
          required: true,
        },
        {
          name: 'name',
          label: 'Detalle columna',
          align: 'left',
          field: 'name',
          sortable: true,
          required: true,
        },
        {
          name: 'value',
          label: 'Valor',
          align: 'left',
          field: (row: IConsultTransmissionDetailList) =>
            formatCurrency(row.value || 0),
          sortable: true,
          required: true,
        },
      ],
      rows: [],
      pages: {
        currentPage: 0,
        lastPage: 0,
      },
    }
  )

  const tabActive = tabs[0].name
  const tabActiveIdx = 0

  const loadData = async () => {
    openMainLoader(true)
    tableProps.value.rows = []

    formData.value = await _summaryConsultPercentageAction(Number(id))
    await _listConsultTransmissionAction(Number(id))

    const hasResults = consult_transmission_list.value.length > 0
    isTableEmpty.value = !hasResults

    setTimeout(() => openMainLoader(false), 1000)
  }

  const handleSelected = async (selected: IConsultTransmissionList[] = []) => {
    if (!selected.length) return
    isSelected.value = true
    selectedId.value = selected[0].business_line.id

    openMainLoader(true)
    tablePropsDetail.value.rows = []

    await _listConsultTransmissionDetailAction(
      Number(id),
      Number(selectedId.value)
    )

    const hasResults = consult_transmission_detail_list.value.length > 0
    showState.value = isSelected.value ? 1 : 0
    isTableDetailEmpty.value = !hasResults

    setTimeout(() => openMainLoader(false), 1000)
  }

  const handleExportExcel = async () =>
    await _exportFileConsultTransmissionAction(
      Number(id),
      Number(selectedId.value),
      'xlsx'
    )

  const handleExportTXT = async () =>
    await _exportFileConsultTransmissionAction(
      Number(id),
      Number(selectedId.value),
      'txt'
    )

  const handleGoToList = () =>
    goToURL('CollectiveInvestmentFundsList', undefined, { reload: true })

  onMounted(async () => await loadData())

  watch(
    consult_transmission_list,
    (val) => {
      tableProps.value.rows = [...val]

      const { currentPage, lastPage } = consult_transmission_pages.value
      tableProps.value.pages = {
        currentPage,
        lastPage,
      }
    },
    { deep: true }
  )

  watch(
    consult_transmission_detail_list,
    (val) => {
      tablePropsDetail.value.rows = [...val]

      const { currentPage, lastPage } = consult_transmission_detail_pages.value
      tablePropsDetail.value.pages = {
        currentPage,
        lastPage,
      }
    },
    { deep: true }
  )

  return {
    tabs,
    formData,
    showState,
    tabActive,
    formatDate,
    tableProps,
    isSelected,
    headerProps,
    tabActiveIdx,
    isTableEmpty,
    handleGoToList,
    handleSelected,
    handleExportTXT,
    tablePropsDetail,
    handleExportExcel,
    isTableDetailEmpty,
  }
}

export default useConsultTransmisionFormat523
