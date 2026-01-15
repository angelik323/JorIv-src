// Vue - pinia
import { onMounted, ref, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { useRouter } from 'vue-router'

// Interfaces
import { ITabs } from '@/interfaces/global'
import {
  IDerivativeClassesForm,
  IDerivativeClassesResponse,
} from '@/interfaces/customs/investment-portfolio/DerivativeClasses'

// Composables
import { useMainLoader, useUtils, useGoToUrl } from '@/composables'

// Stores
import { useDerivativeClassesStore } from '@/stores/investment-portfolio/derivative-classes'

export const useDerivativeClassesView = () => {
  const { _getDerivativeClassesById, _clearData } =
    useDerivativeClassesStore('v1')
  const { headerPropsDefault, derivate_classes_response } = storeToRefs(
    useDerivativeClassesStore('v1')
  )

  const { defaultIconsLucide } = useUtils()
  const { openMainLoader } = useMainLoader()
  const { goToURL } = useGoToUrl()

  const router = useRouter()
  const id = Number(router.currentRoute.value.params.id)

  // Data de formularios
  const information_form = ref<IDerivativeClassesForm | null>(null)

  // Referencias a formularios
  const informationFormRef = ref()

  const headerProps = ref({
    title: 'Ver clases de derivados',
    breadcrumbs: [
      ...headerPropsDefault.value.breadcrumbs,
      {
        label: 'Ver',
        route: 'DerivativeClassesView',
      },
      {
        label: id.toString(),
      },
    ],
  })

  const tabs: ITabs[] = [
    {
      name: 'InformationForm',
      label: 'Datos Básicos',
      icon: defaultIconsLucide.listBulleted,
      outlined: true,
      disable: true,
      show: true,
      required: true,
    },
  ]

  const tabActive = tabs[0].name
  const tabActiveIdx = tabs.findIndex((tab) => tab.name === tabActive)

  const setFormView = (data: IDerivativeClassesResponse) => {
    information_form.value = {
      id: data.id,
      code: data.code,
      derivative_type_id: data.derivative_type_id,
      derivative_type: data.derivative_type,
      description: data.description,
      derivative_underlying_id: data.derivative_underlying_id,
      derivative_underlying: data.derivative_underlying,
      currency_id: data.currency_id,
      currency: data.currency,
      operation_type: data.operation_type,
      end_early: data.end_early,
      paper_type_id: data.paper_type_id,
      paper_type: data.paper_type,
      currency_payment_id: data.currency_payment_id,
      currency_payment: data.currency_payment,
      badge_x_id: data.badge_x_id,
      badge_x: data.badge_x,
      badge_y_id: data.badge_y_id,
      badge_y: data.badge_y,
      rate_point_id: data.rate_point_id,
      rate_point: data.rate_point,
      rate_x_id: data.rate_x_id,
      rate_x: data.rate_x,
      rate_y_id: data.rate_y_id,
      rate_y: data.rate_y,
      status_id: data.status_id,
    }
  }

  onMounted(async () => {
    _clearData()
    openMainLoader(true)
    await _getDerivativeClassesById(id)
    openMainLoader(false)
  })

  watch(
    () => derivate_classes_response.value,
    (val) => {
      if (!val) return
      setFormView(val)
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
  }
}
