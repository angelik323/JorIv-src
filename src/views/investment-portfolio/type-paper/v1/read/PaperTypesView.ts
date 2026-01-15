// Vue - pinia
import { ref, onMounted, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { useRouter } from 'vue-router'

// Interfaces
import { ITabs } from '@/interfaces/global'
import {
  IPaperTypeInformationForm,
  ITypePaperResponse,
} from '@/interfaces/customs/investment-portfolio/TypePaper'

// Composables
import { useMainLoader, useUtils } from '@/composables'

// Stores
import { usePaperTypesStore } from '@/stores/investment-portfolio/type-paper'

const usePaperTypesView = () => {
  const { _getByPaperTypeId, _clearData } = usePaperTypesStore('v1')
  const { headerPropsDefault, paper_type_response } = storeToRefs(
    usePaperTypesStore('v1')
  )

  const { openMainLoader } = useMainLoader()
  const { defaultIconsLucide } = useUtils()
  const router = useRouter()

  const paperTypeId = Number(router.currentRoute.value.params.id)

  // Data de formularios
  const information_form = ref<IPaperTypeInformationForm | null>(null)

  // Referencias a formularios
  const informationFormRef = ref()

  const headerProperties = {
    title: 'Ver tipo de papel',
    breadcrumbs: [
      ...headerPropsDefault.value.breadcrumbs,
      {
        label: 'Ver',
        route: 'PaperTypesView',
      },
      {
        label: paperTypeId.toString(),
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
      required: true,
    },
  ])

  const tabActive = ref(tabs.value[0].name)
  const tabActiveIdx = ref(
    tabs.value.findIndex((tab) => tab.name === tabActive.value)
  )

  const setFormView = (data: ITypePaperResponse) => {
    // Seteo del formulario
    information_form.value = {
      id: data.id,
      code: data.code ?? null,
      description: data.description ?? null,
      currency: data.currency ?? null,
      investment_type: data.investment_type ?? null,
      investment_class: data.investment_class ?? null,
      rate_type: data.rate_type ?? null,
      rate_class: data.rate_class ?? null,
      rate: data.rate ?? null,
      rate_mode: data.rate_mode ?? null,
      base_flow_rate: data.base_flow_rate ?? null,
      flow_type: data.flow_type ?? null,
      payment_flow: data.payment_flow ?? null,
      hasAmortization: !!data.amortization_type,
      amortization_type: data.amortization_type ?? null,
      created_at: data.created_at ?? null,
      creator_data: data.creator_data ?? null,
    }
  }

  onMounted(async () => {
    _clearData()
    openMainLoader(true)
    await _getByPaperTypeId(paperTypeId)
    openMainLoader(false)
  })

  watch(
    () => paper_type_response.value,
    (val) => {
      if (!val) return
      setFormView(val)
    }
  )

  return {
    paper_type_response,
    information_form,
    informationFormRef,
    headerProperties,
    tabs,
    tabActive,
    tabActiveIdx,
  }
}

export default usePaperTypesView
