// Vue - pinia - moment
import { onBeforeUnmount, onMounted, ref } from 'vue'
import { storeToRefs } from 'pinia'

// Interfaces
import { ITabs } from '@/interfaces/global'
import {
  IDerivativeClassesForm,
  IDerivativeClassesToCreate,
} from '@/interfaces/customs/investment-portfolio/DerivativeClasses'

// Composables
import { useMainLoader, useUtils, useGoToUrl } from '@/composables'

// Store
import { useResourceManagerStore } from '@/stores'
import { useDerivativeClassesStore } from '@/stores/investment-portfolio/derivative-classes'

export const useDerivativeClassesCreate = () => {
  const { _createDerivativeClasses, _clearData } =
    useDerivativeClassesStore('v1')
  const { headerPropsDefault } = storeToRefs(useDerivativeClassesStore('v1'))

  const { _getResources, _resetKeys } = useResourceManagerStore('v1')

  const { openMainLoader } = useMainLoader()
  const { defaultIconsLucide, cleanEmptyFields } = useUtils()
  const { goToURL } = useGoToUrl()

  // Data de formularios
  const information_form = ref<IDerivativeClassesForm | null>(null)

  // Referencias a formularios
  const informationFormRef = ref()

  const headerProps = {
    title: 'Crear clase de derivado',
    breadcrumbs: [
      ...headerPropsDefault.value.breadcrumbs,
      { label: 'Crear', route: 'DerivativeClassesCreate' },
    ],
  }

  const tabs: ITabs[] = [
    {
      name: 'information_form',
      label: 'Datos básicos',
      icon: defaultIconsLucide.bulletList,
      outlined: true,
      disable: true,
      show: true,
      required: false,
    },
  ]

  const tabActive = tabs[0].name
  const tabActiveIdx = tabs.findIndex((tab) => tab.name === tabActive)

  const validateForms = async () => {
    let valid = false
    const forms = [informationFormRef]

    if (tabActiveIdx >= 0 && tabActiveIdx < forms.length) {
      try {
        valid = (await forms[tabActiveIdx]?.value?.validateForm()) ?? false
      } catch {
        valid = false
      }
    }
    return valid
  }

  // Information form
  const makeBaseInfoRequest = (data: IDerivativeClassesForm | null) => {
    if (!data) return {}

    const request: IDerivativeClassesToCreate = {
      code: data.code ?? '',
      derivative_type_id: data.derivative_type_id ?? '',
      description: data.description ?? '',
      derivative_underlying_id: data.derivative_underlying_id ?? '',
      currency_id: data.currency_id ?? '',
      operation_type: data.operation_type ?? '',
      end_early: data.end_early ?? false,
      paper_type_id: data.paper_type_id ?? 1,
      currency_payment_id: data.currency_payment_id ?? '',
      badge_x_id: data.badge_x_id ?? '',
      badge_y_id: data.badge_y_id ?? '',
      rate_point_id: Number(data.rate_point_id) ?? null,
      rate_x_id: Number(data.rate_x_id) ?? null,
      rate_y_id: Number(data.rate_y_id) ?? null,
      status_id: data.status_id ?? 'Activo',
    }

    return cleanEmptyFields(request, true)
  }

  const makeDataRequest = () => {
    const apiRequestBody: Partial<IDerivativeClassesToCreate> = {
      ...makeBaseInfoRequest(information_form.value),
    }

    return apiRequestBody
  }

  const onSubmit = async () => {
    if (!(await validateForms())) return

    openMainLoader(true)

    const payload = makeDataRequest()
    const success = await _createDerivativeClasses(payload)

    if (success) {
      goToURL('DerivativeClassesList')
    }

    openMainLoader(false)
  }

  const keys = {
    investment_portfolio: [
      'coins',
      'paper_type',
      'interest_rates',
      'derivative_type',
      'derivative_underlying',
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
    headerProps,
    tabs,
    tabActive,
    tabActiveIdx,
    goToURL,
    onSubmit,
  }
}
