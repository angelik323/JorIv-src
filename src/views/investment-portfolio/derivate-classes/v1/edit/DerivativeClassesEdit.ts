// Vue - pinia
import { onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { useRouter } from 'vue-router'

// Interfaces
import { ITabs } from '@/interfaces/global'
import {
  IDerivativeClassesForm,
  IDerivativeClassesToCreate,
} from '@/interfaces/customs/investment-portfolio/DerivativeClasses'

// Composables
import { useMainLoader, useUtils, useGoToUrl } from '@/composables'

// Stores
import { useResourceManagerStore } from '@/stores'
import { useDerivativeClassesStore } from '@/stores/investment-portfolio/derivative-classes'

export const useDerivativeClassesEdit = () => {
  const { _updateDerivativeClasses, _getDerivativeClassesById, _clearData } =
    useDerivativeClassesStore('v1')

  const { headerPropsDefault, derivate_classes_response } = storeToRefs(
    useDerivativeClassesStore('v1')
  )

  const { _getResources, _resetKeys } = useResourceManagerStore('v1')

  const { defaultIconsLucide, cleanEmptyFields } = useUtils()
  const { openMainLoader } = useMainLoader()
  const { goToURL } = useGoToUrl()

  const router = useRouter()
  const id = Number(router.currentRoute.value.params.id)

  // Data de formularios
  const information_form = ref<IDerivativeClassesForm | null>(null)

  // Referencias a formularios
  const informationFormRef = ref()

  const headerProps = {
    title: 'Editar clase de derivado',
    breadcrumbs: [
      ...headerPropsDefault.value.breadcrumbs,
      { label: 'Editar', route: 'DerivativeClassesEdit' },
      {
        label: id.toString(),
      },
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

  const setFormEdit = (data: IDerivativeClassesForm) => {
    information_form.value = {
      id: data.id,
      code: data.code,
      derivative_type_id: data.derivative_type_id,
      description: data.description,
      derivative_underlying_id: data.derivative_underlying_id,
      currency_id: data.currency_id,
      operation_type: data.operation_type,
      end_early: data.end_early,
      paper_type_id: data.paper_type_id,
      currency_payment_id: data.currency_payment_id,
      badge_x_id: data.badge_x_id,
      badge_y_id: data.badge_y_id,
      rate_point_id: data.rate_point_id,
      rate_x_id: data.rate_x_id,
      rate_y_id: data.rate_y_id,
      status_id: data.status_id,
    }
  }

  const validateForms = async () => {
    let valid: boolean = false
    const forms = [informationFormRef]

    if (tabActiveIdx >= 0 && tabActiveIdx < forms.length) {
      valid = (await forms[tabActiveIdx]?.value?.validateForm()) ?? false
    }
    return valid
  }

  // Information form request
  const makeBaseInfoRequest = (data: IDerivativeClassesForm | null) => {
    if (!data) return {}

    const request: IDerivativeClassesForm = {
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
      rate_point_id: Number(data.rate_point_id) ?? 0,
      rate_x_id: Number(data.rate_x_id) ?? 0,
      rate_y_id: Number(data.rate_y_id) ?? 0,
      status_id: data.status_id ?? 'Activo',
    }

    return cleanEmptyFields(request)
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
    const success = await _updateDerivativeClasses(payload, id)
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
    await _getDerivativeClassesById(id)
    _getResources(keys)
    openMainLoader(false)
  })

  onBeforeUnmount(() => {
    _resetKeys(keys)
  })

  watch(
    () => derivate_classes_response.value,
    (val) => {
      if (!val) return
      setFormEdit(val)
    }
  )

  return {
    derivate_classes_response,
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
