import { IRecordColumnsForm } from '@/interfaces/customs'
import {
  useBankStructuresStore,
  useResourceManagerStore,
  useTreasuryResourceStore,
} from '@/stores'
import { defaultIconsLucide } from '@/utils'
import { storeToRefs } from 'pinia'
import { onBeforeUnmount, onMounted, reactive, ref } from 'vue'
import { useRouter } from 'vue-router'

const useRecordColumnsView = () => {
  const router = useRouter()
  const recordColumnsId = router.currentRoute.value.params.id

  const { variables, mask, constant, justification } = storeToRefs(
    useTreasuryResourceStore('v1')
  )
  const { _getResources, _resetKeys } = useResourceManagerStore('v1')

  const { headerPropsDefault } = storeToRefs(useBankStructuresStore('v1'))
  const { _getRecordColumnsById } = useBankStructuresStore('v1')
  const headerProperties = {
    ...headerPropsDefault.value,
    title: 'Ver columnas de registro',
    breadcrumbs: [
      ...headerPropsDefault.value.breadcrumbs,
      {
        label: 'Ver columnas de registro',
      },
      {
        label: recordColumnsId.toString(),
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

  const models = ref<IRecordColumnsForm>({
    record_type_id: 0,
    variable_field_id: 0,
    structure_field_name: '',
    start_position: 0,
    dimension: 0,
    end_position: 0,
    data_type: '',
    justified_id: 0,
    mask_id: 0,
    constant: '',
    filler_character: '',
    value: '',
  })

  const handlerGoTo = (goURL: string, id?: number) => {
    router.push({ name: goURL, params: { id } })
  }

  const keys = { treasury: ['variables', 'constant', 'justification'] }

  onMounted(async () => {
    models.value = await _getRecordColumnsById(Number(recordColumnsId))
    await _getResources(keys)
    await _getResources(
      { treasury: ['mask'] },
      `variable_id=${models.value.variable_field_id}`,
    )
  })

  onBeforeUnmount(() => {
    keys.treasury.push('mask')
    _resetKeys(keys)
  })

  return {
    models,
    headerProperties,
    tabs,
    activeTab,
    tabActiveIdx,
    handlerGoTo,

    // Selectors
    variables,
    constant,
    justification,
    mask,
  }
}

export default useRecordColumnsView
