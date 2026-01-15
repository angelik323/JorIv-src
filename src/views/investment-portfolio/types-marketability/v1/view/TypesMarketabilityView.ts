import { useMainLoader } from '@/composables'
import { useMarketabilityTypesStore } from '@/stores/investment-portfolio/types-marketability'
import { defaultIconsLucide } from '@/utils'
import { storeToRefs } from 'pinia'
import { computed, onMounted, reactive, ref } from 'vue'
import { useRoute } from 'vue-router'

export const useTypesMarketabilityView = () => {
  const { openMainLoader } = useMainLoader()
  const route = useRoute()
  const id = Number(route.params.id)
  const { data_information_form } = storeToRefs(
    useMarketabilityTypesStore('v1')
  )
  const { _getMarketabilityTypeById } = useMarketabilityTypesStore('v1')

  const headerProps = {
    title: 'Ver tipo de bursatilidad',
    breadcrumbs: [
      { label: 'Inicio', route: 'HomeView' },
      { label: 'Portafolio de inversión', route: '' },
      { label: 'Tipos de bursatilidad', route: 'TypesMarketabilityList' },
      { label: 'Ver', route: 'TypesMarketabilityView' },
      { label: String(route.params.id), route: '' },
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

  const models = ref({
    id: 0,
    code: '',
    description: '',
    type: '',
    created_at: '',
    updated_at: '',
    creator_data: '',
    updated_data: '',
  })

  const chunkArray = <T>(arr: T[], size: number): T[][] => {
    const result: T[][] = []
    for (let i = 0; i < arr.length; i += size) {
      result.push(arr.slice(i, i + size))
    }
    return result
  }

  const initialFields = [
    {
      label: 'Código',
      value: () => models.value.code,
      fallback: 'No registrado',
    },
    {
      label: 'Descripción',
      value: () => models.value.description,
      fallback: 'No registrado',
    },
    {
      label: 'Tipo',
      value: () => models.value.type,
      fallback: 'No registrado',
    },
  ]

  const secundaryFields = [
    {
      label: 'Fecha de creación',
      value: () => models.value.created_at,
      fallback: 'No registrado',
    },
    {
      label: 'Creado por',
      value: () => models.value.creator_data,
      fallback: 'No registrado',
    },
    {
      label: 'Fecha de actualización',
      value: () => models.value.updated_at,
      fallback: 'No registrado',
    },
    {
      label: 'Actualizado por',
      value: () => models.value.updated_data,
      fallback: 'No registrado',
    },
  ]

  const firstRows = computed(() => chunkArray(initialFields, 4))
  const secondRows = computed(() => chunkArray(secundaryFields, 4))

  onMounted(async () => {
    openMainLoader(true)
    await _getMarketabilityTypeById(id)
    if (data_information_form.value) {
      models.value.code = data_information_form.value.code
      models.value.description = data_information_form.value.description
      models.value.type = data_information_form.value.type
      models.value.created_at = data_information_form.value.created_at ?? ''
      models.value.creator_data = data_information_form.value.creator_data ?? ''
      models.value.updated_at = data_information_form.value.updated_at ?? ''
      models.value.updated_data = data_information_form.value.updated_data ?? ''
    }
    setTimeout(() => openMainLoader(false), 1200)
  })

  return {
    headerProps,
    tabs,
    activeTab,
    tabActiveIdx,
    firstRows,
    secondRows,
    models,
    data_information_form,
  }
}
