// Vue - pinia
import { ref, onMounted, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { useRouter } from 'vue-router'

// Interfaces
import { ITabs } from '@/interfaces/global'
import {
  ICostCenterInformationForm,
  ICostCenterResponse,
} from '@/interfaces/customs/accounting/CostCenterV2'

// Composables
import { useUtils, useMainLoader, useGoToUrl } from '@/composables'

// Stores
import { useCostCenterStore } from '@/stores/accounting/cost-centers'

const useCostCenterView = () => {
  const { _getByStructureId, _clearData } = useCostCenterStore('v2')
  const { headerPropsDefault, cost_center_response } = storeToRefs(
    useCostCenterStore('v2')
  )

  const { defaultIconsLucide } = useUtils()
  const { openMainLoader } = useMainLoader()
  const { goToURL } = useGoToUrl()

  const router = useRouter()

  const structureId = Number(router.currentRoute.value.params.id)

  // Data de formularios
  const information_form = ref<ICostCenterInformationForm | null>(null)

  // Referencias a formularios
  const informationFormRef = ref()

  const headerProperties = {
    title: 'Ver centro de costos',
    breadcrumbs: [
      ...headerPropsDefault.value.breadcrumbs,
      {
        label: 'Ver',
        route: 'CostCenterView',
      },
      {
        label: structureId.toString(),
      },
    ],
  }

  const tabs = ref<ITabs[]>([
    {
      name: 'information_form',
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

  const setFormView = (data: ICostCenterResponse) => {
    // Seteo del formulario
    information_form.value = {
      id: data.structure.id,
      account_structure: data.structure
        ? [data.structure.code, data.structure.purpose]
            .filter(Boolean)
            .join(' - ')
        : null,
      purpose: data.structure.purpose ?? null,
      structure: data.structure.structure ?? null,
      status: data.structure.status?.name ?? null,
      costCenters:
        data.cost_centers?.map((item) => ({
          id: item.id,
          code: item.code ?? null,
          type: item.type ?? null,
          name: item.name ?? null,
        })) ?? [],
    }
  }

  const filtersFormat = ref<Record<string, string | number>>({
    'filter[search]': '',
  })

  const listAction = async (
    structureId: number,
    filters?: Record<string, string | number>
  ) => {
    openMainLoader(true)
    await _getByStructureId(structureId, filters)
    openMainLoader(false)
  }

  const handleFilterSearch = async (search: string) => {
    filtersFormat.value = {
      'filter[search]': search,
    }

    await listAction(structureId, filtersFormat.value)
  }

  onMounted(async () => {
    _clearData()
    await listAction(structureId)
  })

  watch(
    () => cost_center_response.value,
    (val) => {
      if (!val) return
      setFormView(val)
    }
  )

  return {
    cost_center_response,
    information_form,
    informationFormRef,
    headerProperties,
    tabs,
    tabActive,
    tabActiveIdx,
    goToURL,
    handleFilterSearch,
  }
}

export default useCostCenterView
