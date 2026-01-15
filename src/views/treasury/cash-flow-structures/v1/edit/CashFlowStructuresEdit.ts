import { useMainLoader } from '@/composables'
import { useResourceStore, useCashFlowStructuresStore } from '@/stores'
import { defaultIcons } from '@/utils'
import { storeToRefs } from 'pinia'
import { onBeforeMount, reactive, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const useCashFlowStructuresEdit = () => {
  const { openMainLoader } = useMainLoader()
  const route = useRoute()
  const router = useRouter()

  const { _getResourcesTreasuries } = useResourceStore('v1')
  const {
    data_basic_cash_flow_structure,
    cash_flow_structures_request,
    headerPropsDefault,
  } = storeToRefs(useCashFlowStructuresStore('v1'))

  const { _getByIdAction, _updateAction } = useCashFlowStructuresStore('v1')

  const cashFlowStructureId = router.currentRoute.value.params.id

  const headerProperties = {
    ...headerPropsDefault.value,
    title: 'Editar estructura flujo de caja',
    breadcrumbs: [
      ...headerPropsDefault.value.breadcrumbs,
      {
        label: 'Editar',
        route: 'CashFlowStructuresList',
      },
      {
        label: cashFlowStructureId.toString(),
      },
    ],
  }

  const tabs = reactive([
    {
      name: 'basic_data',
      label: 'Datos Básicos',
      icon: defaultIcons.listBulleted,
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

  const handlerGoTo = (goURL: string) => {
    router.push({ name: goURL })
  }

  const onSubmit = async () => {
    openMainLoader(true)
    if (!data_basic_cash_flow_structure.value) return

    if (
      await _updateAction(
        cashFlowStructureId as string,
        data_basic_cash_flow_structure.value
      )
    ) {
      router.push({ name: 'CashFlowStructuresList' })
    }

    setTimeout(() => {
      openMainLoader(false)
    }, 1000)
  }

  const keys = [
    'account_structures',
    'cash_flow_structure_types',
    'cash_flow_structure_natures',
    'cash_flow_structure_activity_groups',
  ]

  onBeforeMount(async () => {
    openMainLoader(true)
    await _getResourcesTreasuries(`keys[]=${keys.join('&keys[]=')}`)
    await _getByIdAction(route.params.id.toString())
    openMainLoader(false)
  })

  return {
    cash_flow_structures_request,
    headerProperties,
    tabs,
    activeTab,
    tabActiveIdx,
    handlerGoTo,
    onSubmit,
  }
}

export default useCashFlowStructuresEdit
