import { useRoute } from 'vue-router'
import { onMounted, ref } from 'vue'

import { useGoToUrl, useMainLoader, useUtils } from '@/composables'

import { IBulkUploadHistory } from '@/interfaces/customs'
import { ITabs } from '@/interfaces/global'

import { useBulkUploadStore } from '@/stores'

const useBulkUploadView = () => {
  const { openMainLoader } = useMainLoader()
  const { defaultIconsLucide } = useUtils()
  const { goToURL } = useGoToUrl()
  const route = useRoute()

  const { _showAction } = useBulkUploadStore('v1')

  const tabs = ref<ITabs[]>([])
  const isLoaded = ref(false)
  const tabActive = ref()

  const bulkUploadId = route.params.bulkUploadId
  const recordId = route.params.recordId

  const initialData = ref<IBulkUploadHistory>({
    id: 0,
    code: '',
    name: null,
    bank: {
      id: 0,
      code: '',
      name: null,
    },
    bank_account: {
      id: 0,
      account_number: '',
      account_name: '',
    },
    account_name: '',
    account_number: '',
    business: {
      id: 0,
      code: null,
      name: '',
    },
    business_name: null,
    status: {
      id: 0,
      status: '',
    },
    created_at: '',
  })

  const headerProperties = ref({
    title: 'Ver',
    breadcrumbs: [
      {
        label: 'Inicio',
        route: 'HomeView',
      },
      {
        label: 'Tesorería',
      },
      {
        label: 'Cargue masivo',
        route: 'BulkUploadCreate',
      },
      {
        label: 'Ver',
        route: 'BulkUploadView',
      },
      {
        label: `${bulkUploadId}`,
      },
    ],
  })

  const tabActiveIdx = ref(
    tabs.value.findIndex((tab) => tab.name === tabActive.value)
  )

  const loadData = async () => {
    openMainLoader(true)

    const success = await _showAction(Number(bulkUploadId), Number(recordId))

    if (success) {
      initialData.value = success
      isLoaded.value = true

      const title = success.operation_type_label
        ? `Ver ${success.operation_type_label.toLowerCase()}`
        : 'Ver cargue masivo'
      headerProperties.value.title = title
      headerProperties.value.breadcrumbs[3].label = title

      if (success.operation_type === 'transfer') {
        tabs.value = [
          {
            name: 'BulkUploadIncomeForm',
            label: 'Ingresos',
            icon: defaultIconsLucide.chartLine,
            outlined: true,
            disable: false,
            show: true,
            required: false,
          },
          {
            name: 'BulkUploadExpenseForm',
            label: 'Egresos',
            icon: defaultIconsLucide.dollarSign,
            outlined: true,
            disable: false,
            show: true,
            required: false,
          },
        ]
        tabActive.value = tabs.value[0].name
      } else {
        tabs.value = [
          {
            name: 'BulkUploadForm',
            label: 'Datos básicos',
            icon: defaultIconsLucide.listBulleted,
            outlined: true,
            disable: false,
            show: true,
            required: false,
          },
        ]
        tabActive.value = tabs.value[0].name
      }
    }

    setTimeout(() => {
      openMainLoader(false)
    }, 1000)
  }

  const handleGoToList = () =>
    goToURL('BulkUploadCreate', undefined, { bulkUploadId })

  onMounted(() => loadData())

  return {
    tabs,
    isLoaded,
    tabActive,
    initialData,
    tabActiveIdx,
    handleGoToList,
    headerProperties,
  }
}

export default useBulkUploadView
