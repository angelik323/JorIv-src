import { ref, reactive, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import { QTable } from 'quasar'
import { storeToRefs } from 'pinia'
import { useMainLoader } from '@/composables'
import { useAmortizationTableStore } from '@/stores/'
import { defaultIconsLucide } from '@/utils'

export const useAmortizationTitleTableView = () => {
  const { openMainLoader } = useMainLoader()
  const route = useRoute()

  const { data_information_form } = storeToRefs(useAmortizationTableStore('v1'))
  const { _getAmortizationTableById } = useAmortizationTableStore('v1')
  const amortizationTitleId = +route.params.id

  const headerProps = ref({
    title: 'Ver tabla títulos amortizables',
    breadcrumbs: [
      { label: 'Inicio', route: 'HomeView' },
      { label: 'Portafolio de inversiones', route: '' },
      {
        label: 'Tabla títulos amortizables',
        route: 'AmortizationTitleTableList',
      },
      { label: 'Ver ' },
      { label: amortizationTitleId.toString() },
    ],
  })

  const tabs = reactive([
    {
      name: 'InformationForm',
      label: 'Datos Básicos',
      icon: defaultIconsLucide.listBulleted,
      outlined: true,
      disable: true,
      show: true,
      required: true,
    },
  ])

  interface TableRow {
    id: number
    date: string
    percentage: number
    origin: string
  }

  const tableProps = ref<{
    loading: boolean
    title: string
    columns: QTable['columns']
    rows: TableRow[]
    pages: {
      currentPage: ReturnType<typeof ref>
      lastPage: ReturnType<typeof ref>
    }
  }>({
    loading: false,
    title: 'Tabla',
    columns: [
      {
        name: 'id',
        label: '#',
        field: 'id',
        align: 'center',
        sortable: true,
      },
      {
        name: 'date',
        label: 'Fecha',
        field: 'date',
        align: 'center',
        sortable: true,
      },
      {
        name: 'percentage',
        label: 'Porcentaje',
        field: 'percentage',
        align: 'center',
        sortable: true,
      },
      {
        name: 'origin',
        label: 'Origen',
        field: 'origin',
        align: 'center',
        sortable: true,
      },
    ] as QTable['columns'],
    rows: [],
    pages: {
      currentPage: ref(1),
      lastPage: ref(1),
    },
  })

  const activeTab = ref(tabs[0].name)
  const tabActiveIdx = ref(
    tabs.findIndex((tab) => tab.name === activeTab.value)
  )

  onMounted(async () => {
    openMainLoader(true)
    await _getAmortizationTableById(amortizationTitleId)
    openMainLoader(false)
  })

  watch(
    () => data_information_form.value,
    (newValue) => {
      if (newValue && Array.isArray(newValue.details)) {
        tableProps.value.rows = newValue.details.map((item, idx) => ({
          id: item.id ?? idx + 1,
          date: item.date ?? '',
          percentage: item.percentage ?? 0,
          origin: item.origin ?? '',
        }))
      } else {
        tableProps.value.rows = []
      }
    },
    { immediate: true }
  )

  return {
    headerProps,
    tabs,
    activeTab,
    tabActiveIdx,
    data_information_form,
    tableProps,
  }
}
