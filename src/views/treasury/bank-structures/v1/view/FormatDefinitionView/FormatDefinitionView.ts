import { IFormatDefinitionForm } from '@/interfaces/customs'
import {
  useBankStructuresStore,
  useResourceManagerStore,
  useTreasuryResourceStore,
} from '@/stores'
import { defaultIconsLucide } from '@/utils'
import { storeToRefs } from 'pinia'
import { onBeforeUnmount, onMounted, reactive, ref } from 'vue'
import { useRouter } from 'vue-router'

const useFormatDefinitionView = () => {
  const router = useRouter()
  const formatDefinitionId = router.currentRoute.value.params.id

  const {
    origin,
    formatType,
    validationType,
    fileExtension,
    fileType,
    valueMask,
    numericMask,
    dateMask,
  } = storeToRefs(useTreasuryResourceStore('v1'))
  const { _getResources, _resetKeys } = useResourceManagerStore('v1')

  const { headerPropsDefault } = storeToRefs(useBankStructuresStore('v1'))
  const { _getFormatDefinitionById } = useBankStructuresStore('v1')
  const headerProperties = {
    ...headerPropsDefault.value,
    title: 'Ver definición de formato',
    breadcrumbs: [
      ...headerPropsDefault.value.breadcrumbs,
      {
        label: 'Ver definición de formato',
      },
      {
        label: formatDefinitionId.toString(),
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

  const models = ref<IFormatDefinitionForm>({
    id: 0,
    code: '',
    status_id: 0,
    bank_id: 0,
    origin_id: 0,
    description: '',
    format_type_id: 0,
    validation_type_id: 0,
    generated_file_name: '',
    dispersal_group: false,
    generation_time: false,
    date: false,
    file_extension_id: 0,
    path: '',
    applies_to_dispersal: false,
    equivalence_validation: false,
    file_length: undefined,
    file_type_id: 0,
    separator: '',
    numeric_mask_id: 0,
    value_mask_id: 0,
    date_mask_id: 0,
  })

  const handlerGoTo = (goURL: string, id?: number) => {
    router.push({ name: goURL, params: { id } })
  }

  const keys = {
    treasury: [
      'origin',
      'formatType',
      'validationType',
      'fileExtension',
      'fileType',
      'numericMask',
      'valueMask',
      'dateMask',
      'variables',
    ],
  }

  onMounted(async () => {
    models.value = await _getFormatDefinitionById(Number(formatDefinitionId))
    _getResources(keys)
  })

  onBeforeUnmount(() => {
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
    origin,
    formatType,
    validationType,
    fileExtension,
    fileType,
    valueMask,
    numericMask,
    dateMask,
  }
}

export default useFormatDefinitionView
