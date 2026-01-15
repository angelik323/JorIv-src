// Vue - pinia - moment
import { computed, ref, onBeforeUnmount } from 'vue'
import { storeToRefs } from 'pinia'
import { useRoute } from 'vue-router'

// Interfaces
import { ITabs } from '@/interfaces/global'
import { IBudgetDcocumentsTableEmitValue } from '@/interfaces/customs/budget/BudgetDocuments'

// Composables
import { useUtils } from '@/composables/useUtils'
import { useGoToUrl } from '@/composables/useGoToUrl'

// Stores
import { useBudgetDocumentsStore } from '@/stores/budget/budget-documents'

const useBudgetDocumentsView = () => {
  const { params } = useRoute()

  const { defaultIconsLucide } = useUtils()
  const { goToURL } = useGoToUrl()

  const { filtersFormat } = storeToRefs(useBudgetDocumentsStore('v1'))
  const { _downloadDocumentDetails, _clearFiltersFormat } =
    useBudgetDocumentsStore('v1')

  const documentId = +params.id

  const headerConfig = {
    title: 'Ver consultas de documentos presupuestales',
    breadcrumbs: [
      {
        label: 'Inicio',
        route: 'HomeView',
      },
      {
        label: 'Presupuesto',
        route: '',
      },
      {
        label: 'Consultas de documentos presupuestales',
        route: 'BudgetDocumentsView',
      },
      {
        label: 'Ver',
        route: '',
      },
      {
        label: `${documentId}`,
        route: '',
      },
    ],
  }

  // Refs and computed props

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
    {
      name: 'balance',
      label: 'Saldos por rubro',
      icon: defaultIconsLucide.dollarSign,
      outlined: true,
      disable: true,
      show: true,
      required: false,
    },
  ]

  const tabActive = ref<'information' | 'balance'>('information')
  const tabActiveIdx = ref<number>(0)

  const navigationButtonLabel = computed<string>(() => {
    if (tabActive.value === 'information') return 'Continuar'
    return 'Atrás'
  })

  const tableInfo = ref<IBudgetDcocumentsTableEmitValue>({
    length: 0,
    loading: false,
  })

  const isDownloadingFile = ref(false)

  const isEnableToDownloadFile = computed<boolean>(() => {
    return !isDownloadingFile.value && tableInfo.value.length > 0
  })

  // Functions/Methods

  const nextTab = () => {
    tabActiveIdx.value += 1
    tabActive.value = 'balance'
  }

  const backTab = () => {
    tabActiveIdx.value -= 1
    tabActive.value = 'information'
  }

  const handleNavigationBtnClick = () => {
    if (tabActive.value === 'information') {
      nextTab()
      return
    }

    if (tabActive.value === 'balance') {
      backTab()
      return
    }
  }

  const handleDoneBtnClick = () => goToURL('BudgetDocumentsList')

  const handleDownloadExcel = async () => {
    isDownloadingFile.value = true
    await _downloadDocumentDetails(documentId, filtersFormat.value)
    isDownloadingFile.value = false
  }

  onBeforeUnmount(() => _clearFiltersFormat())

  return {
    // composable refs and variables
    documentId,

    // Refs and computed props
    headerConfig,
    tabs,
    tabActive,
    tabActiveIdx,
    navigationButtonLabel,
    tableInfo,
    isEnableToDownloadFile,

    // Functions/Methods
    handleNavigationBtnClick,
    handleDoneBtnClick,
    handleDownloadExcel,
  }
}

export default useBudgetDocumentsView
