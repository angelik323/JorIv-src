// Vue / Pinia
import { ref, type Ref } from 'vue'

// Composables
import { useGoToUrl } from '@/composables/useGoToUrl'

// Utils
import { useUtils } from '@/composables/useUtils'

// Interfaces
import type { ITabs } from '@/interfaces/global'
import type {
  IOpeningRecordProcessReportData,
  OpeningRecordFormExpose,
} from '@/interfaces/customs/accounting/OpeningRecord'

const useOpeningRecordCreate = (
  openingRecordForm: Ref<OpeningRecordFormExpose | null>
) => {
  const processData = ref<IOpeningRecordProcessReportData | null>(null)
  const hasSelectedBusiness = ref(false)

  const { goToURL } = useGoToUrl()
  const { defaultIconsLucide } = useUtils()

  const headerOpeningRecord = {
    title: 'Crear apertura de período contable',
    breadcrumbs: [
      { label: 'Inicio', route: 'HomeView' },
      { label: 'Contabilidad' },
      { label: 'Registro de apertura de período', route: 'OpeningRecordList' },
      { label: 'Crear' },
    ],
    showBackBtn: true,
  }

  const tabs = ref<ITabs[]>([
    {
      name: 'basic_data',
      label: 'Datos básicos',
      icon: defaultIconsLucide.bulletList,
      outlined: true,
      disable: false,
      show: true,
      required: false,
    },
    {
      name: 'process_report',
      label: 'Informe de procesos',
      icon: defaultIconsLucide.bulletList,
      outlined: true,
      disable: false,
      show: false,
      required: false,
    },
  ])

  const activeTab = ref<string>(tabs.value[0].name)
  const activeTabIdx = ref<number>(0)

  const handleProcessCompleted = (data: IOpeningRecordProcessReportData) => {
    processData.value = data

    const reportIdx = tabs.value.findIndex((t) => t.name === 'process_report')

    if (reportIdx !== -1) {
      tabs.value[reportIdx].show = true
      activeTab.value = 'process_report'
      activeTabIdx.value = reportIdx
    }
  }

  return {
    goToURL,
    headerOpeningRecord,
    tabs,
    activeTab,
    activeTabIdx,
    openingRecordForm,
    processData,
    hasSelectedBusiness,
    handleProcessCompleted,
  }
}

export default useOpeningRecordCreate
