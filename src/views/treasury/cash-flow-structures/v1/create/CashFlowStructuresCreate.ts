import { useMainLoader, useUtils } from '@/composables'
import { useResourceStore, useCashFlowStructuresStore } from '@/stores'
import { storeToRefs } from 'pinia'
import { onMounted, reactive, ref } from 'vue'
import { useRouter } from 'vue-router'

const useCashFlowStructuresCreate = () => {
  const router = useRouter()
  const { openMainLoader } = useMainLoader()
  const { defaultIconsLucide } = useUtils()

  const { _getResourcesTreasuries } = useResourceStore('v1')

  const { data_basic_cash_flow_structure, headerPropsDefault } = storeToRefs(
    useCashFlowStructuresStore('v1')
  )
  const { _createAction } = useCashFlowStructuresStore('v1')

  const basicDataFormRef = ref()

  const headerProperties = {
    ...headerPropsDefault.value,
    title: 'Crear estructura flujo de caja',
    breadcrumbs: [
      ...headerPropsDefault.value.breadcrumbs,
      {
        label: 'Crear',
      },
    ],
  }

  const tabs = reactive([
    {
      name: 'InformationForm',
      label: 'Datos Básicos',
      icon: defaultIconsLucide.listBulleted,
      outlined: true,
      disable: false,
      show: true,
      required: true,
    },
  ])
  const activeTab = ref(tabs[0].name)
  const tabActiveIdx = ref(
    tabs.findIndex((tab) => tab.name === activeTab.value)
  )

  const keys = [
    'account_structures',
    'cash_flow_structure_types',
    'cash_flow_structure_natures',
    'cash_flow_structure_activity_groups',
  ]

  onMounted(() => {
    _getResourcesTreasuries(`keys[]=${keys.join('&keys[]=')}`)
  })

  const handlerGoTo = (goURL: string) => {
    router.push({ name: goURL })
  }

  const validateForms = async () => {
    if (activeTab.value === 'InformationForm') {
      return await basicDataFormRef.value?.validateForm()
    }

    return true
  }

  const onSubmit = async () => {
    if (!(await validateForms()) || !data_basic_cash_flow_structure.value) {
      return
    }

    openMainLoader(true)
    if (await _createAction(data_basic_cash_flow_structure.value)) {
      router.push({ name: 'CashFlowStructuresList' })
    }

    setTimeout(() => {
      openMainLoader(false)
    }, 1000)
  }

  return {
    headerProperties,
    tabs,
    activeTab,
    tabActiveIdx,
    basicDataFormRef,
    handlerGoTo,
    onSubmit,
  }
}

export default useCashFlowStructuresCreate
