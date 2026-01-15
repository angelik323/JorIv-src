// Vue - pinia - moment
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { storeToRefs } from 'pinia'
import { useRouter } from 'vue-router'

// Interfaces
import { ITabs } from '@/interfaces/global'
import {
  IPaperTypeInformationForm,
  ITypePaperToCreate,
} from '@/interfaces/customs/investment-portfolio/TypePaper'

// Composables
import { useMainLoader, useUtils } from '@/composables'

// Stores
import { usePaperTypesStore } from '@/stores/investment-portfolio/type-paper'
import { useResourceManagerStore } from '@/stores/resources-manager'

const usePaperTypesCreate = () => {
  const { _createPaperType, _clearData } = usePaperTypesStore('v1')
  const { headerPropsDefault } = storeToRefs(usePaperTypesStore('v1'))

  const { _getResources, _resetKeys } = useResourceManagerStore('v1')

  const { openMainLoader } = useMainLoader()
  const { defaultIconsLucide, cleanEmptyFields } = useUtils()
  const router = useRouter()

  // Data de formularios
  const information_form = ref<IPaperTypeInformationForm | null>(null)

  // Referencias a formularios
  const informationFormRef = ref()

  const headerProperties = {
    title: 'Crear tipo de papel',
    breadcrumbs: [
      ...headerPropsDefault.value.breadcrumbs,
      {
        label: 'Crear',
        route: 'PaperTypesCreate',
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

  const validateForms = async () => {
    let valid = false
    const forms = [informationFormRef]

    if (tabActiveIdx.value >= 0 && tabActiveIdx.value < forms.length) {
      try {
        valid =
          (await forms[tabActiveIdx.value]?.value?.validateForm()) ?? false
      } catch {
        valid = false
      }
    }
    return valid
  }

  // Information form
  const makeBaseInfoRequest = (data: IPaperTypeInformationForm | null) => {
    if (!data) return {}

    const request: ITypePaperToCreate = {
      code: data.code ?? null,
      description: data.description ?? null,
      currency_id: Number(data.currency) || null,
      inversion_type_id: Number(data.investment_type) || null,
      investment_class: data.investment_class ?? null,
      rate_type: data.rate_type ?? null,
      rate_class: data.rate_class ?? null,
      rate: data.rate || null,
      rate_mode: data.rate_mode ?? null,
      base_flow_rate: data.base_flow_rate ?? null,
      flow_type: data.flow_type ?? null,
      payment_flow: data.payment_flow ?? null,
      amortization_type: data.amortization_type ?? null,
    }

    return cleanEmptyFields(request, true)
  }

  const makeDataRequest = () => {
    const apiRequestBody: Partial<ITypePaperToCreate> = {
      ...makeBaseInfoRequest(information_form.value),
    }

    return apiRequestBody
  }

  const onSubmit = async () => {
    if (!(await validateForms())) return

    openMainLoader(true)

    const payload = makeDataRequest()
    const success = await _createPaperType(payload)

    if (success) {
      router.push({ name: 'PaperTypesList' })
    }

    openMainLoader(false)
  }

  const keys = {
    investment_portfolio: [
      'inversion_types',
      'class_investment',
      'interest_rates',
      'coins',
    ],
  }

  onMounted(async () => {
    _clearData()
    openMainLoader(true)
    await _getResources(keys)
    openMainLoader(false)
  })

  onBeforeUnmount(() => {
    _resetKeys(keys)
  })

  return {
    information_form,
    informationFormRef,
    headerProperties,
    tabs,
    tabActive,
    tabActiveIdx,
    onSubmit,
  }
}

export default usePaperTypesCreate
