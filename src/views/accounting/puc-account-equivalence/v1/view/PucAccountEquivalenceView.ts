import { IAccountEquivalenceData } from '@/interfaces/customs'
import { usePucAccountEquivalenceStore } from '@/stores'
import { computed, onMounted, ref } from 'vue'
import { useMainLoader } from '@/composables'
import { defaultIconsLucide } from '@/utils'
import { ITabs } from '@/interfaces/global'
import { useRoute } from 'vue-router'
import { QTable } from 'quasar'
import router from '@/router'

const usePucAccountEquivalenceView = () => {
  const { _getByIdAction, _exportExcelAction } =
    usePucAccountEquivalenceStore('v1')
  const { openMainLoader } = useMainLoader()
  const route = useRoute()

  const id = route.params.id as string

  const initialData = ref<IAccountEquivalenceData | null>(null)

  const headerProperties = {
    title: 'Ver configuración PUC equivalente - fiscal',
    breadcrumbs: [
      { label: 'Inicio', route: 'HomeView' },
      { label: 'Contabilidad' },
      {
        label: 'Configuración PUC equivalente - fiscal',
        route: 'PucAccountEquivalenceList',
      },
      { label: 'Ver', route: 'PucAccountEquivalenceView' },
      { label: id },
    ],
  }

  const tabs = ref<ITabs[]>([
    {
      name: 'information',
      label: 'Datos básicos',
      icon: defaultIconsLucide.bulletList,
      outlined: true,
      disable: true,
      show: true,
      required: false,
    },
  ])

  const tabActive = ref(tabs.value[0].name)

  const tabActiveIdx = ref(
    tabs.value.findIndex((tab) => tab.name === tabActive.value)
  )

  const tableProperties = ref({
    title: '',
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
        name: 'source_account_code',
        required: true,
        label: 'Código cuenta fuente',
        align: 'left',
        field: 'source_account_code',
        sortable: true,
      },
      {
        name: 'source_account_name',
        required: true,
        label: 'Nombre cuenta fuente',
        align: 'left',
        field: 'source_account_name',
        sortable: true,
      },
      {
        name: 'type',
        required: true,
        label: 'Tipo',
        align: 'left',
        field: 'type',
        sortable: true,
      },
      {
        name: 'equivalent_account_code',
        required: true,
        label: 'Código cuenta equivalente',
        align: 'left',
        field: 'equivalent_account_code',
        sortable: true,
      },
      {
        name: 'equivalent_account_name',
        required: true,
        label: 'Nombre cuenta equivalente',
        align: 'left',
        field: 'equivalent_account_name',
        sortable: true,
      },
    ] as QTable['columns'],
    rows: [],
  })

  const loadData = async () => {
    openMainLoader(true)

    const success = await _getByIdAction(id)

    if (success) initialData.value = success

    setTimeout(() => {
      openMainLoader(false)
    }, 1000)
  }

  const handleUploadExcel = async () => {
    await _exportExcelAction(id)
  }

  const handleGoToList = () => {
    router.push({ name: 'PucAccountEquivalenceList' })
  }

  const tableFiscalRows = computed(() =>
    (initialData.value?.fiscal_equivalences ?? []).map((item) => ({
      id: item.id,
      source_account_code: item.source_account_code,
      source_account_name: item.source_account_name,
      type: item.type,
      equivalent_account_code: item.equivalent_account_code,
      equivalent_account_name: item.equivalent_account_name,
    }))
  )

  const tableRegularRows = computed(() =>
    (initialData.value?.regular_equivalences ?? []).map((item) => ({
      id: item.id,
      source_account_code: item.source_account_code,
      source_account_name: item.source_account_name,
      type: item.type,
      equivalent_account_code: item.equivalent_account_code,
      equivalent_account_name: item.equivalent_account_name,
    }))
  )

  onMounted(() => {
    loadData()
  })

  return {
    tabs,
    tabActive,
    initialData,
    tabActiveIdx,
    handleGoToList,
    tableProperties,
    tableFiscalRows,
    tableRegularRows,
    headerProperties,
    handleUploadExcel,
  }
}

export default usePucAccountEquivalenceView
