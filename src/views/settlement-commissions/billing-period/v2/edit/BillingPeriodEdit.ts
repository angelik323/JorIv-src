// vue - router - quasar
import { ref, onBeforeMount, watch, onMounted, computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useRoute } from 'vue-router'

// Interfaces
import {
  IBillingPeriodInformationForm,
  IBillingPeriodResponse,
} from '@/interfaces/customs/settlement-commissions/BillingPeriodV2'
import { ITabs } from '@/interfaces/global'

// Composables
import { useGoToUrl, useMainLoader, useUtils } from '@/composables'

// Stores
import { useBillingPeriodStore } from '@/stores/settlement-commissions/billing-period'
import { useResourceManagerStore } from '@/stores/resources-manager'

const useBillingPeriodEdit = () => {
  const { _updateBillingPeriod, _getByIdBillingPeriod, _clearData } =
    useBillingPeriodStore('v2')
  const { billing_period_response, headerPropsDefault } = storeToRefs(
    useBillingPeriodStore('v2')
  )

  // Data de formularios
  const data_information_form = ref<IBillingPeriodInformationForm | null>(null)

  // Referencias a formularios
  const basicDataFormRef = ref()

  const route = useRoute()
  const searchId = +route.params.id

  const headerProperties = {
    title: 'Editar periodo de liquidación de comisiones',
    breadcrumbs: [
      ...headerPropsDefault.value.breadcrumbs,
      {
        label: 'Editar',
        route: 'BillingPeriodEdit',
      },
      {
        label: `${searchId}`,
      },
    ],
  }

  const { openMainLoader } = useMainLoader()
  const { cleanEmptyFields, defaultIconsLucide } = useUtils()
  const { goToURL } = useGoToUrl()

  const { _getResources, _resetKeys } = useResourceManagerStore('v1')

  const tabs: ITabs[] = [
    {
      name: 'basic-data',
      label: 'Datos básicos',
      icon: defaultIconsLucide.bulletList,
      outlined: true,
      disable: true,
      show: true,
      required: true,
    },
  ]

  const tabActive = tabs[0].name
  const tabActiveIdx = 0

  const setFormEdit = (data: IBillingPeriodResponse) => {
    const { business_code_snapshot, start_date, end_date, periodicity, code } =
      data

    data_information_form.value = {
      business_code: business_code_snapshot,
      start_date: start_date,
      end_date: end_date,
      periodicity: periodicity,

      period_code: code,
    }
  }

  // Datos básicos form
  const makeBaseInfoRequest = (data: IBillingPeriodInformationForm | null) => {
    if (!data) return {}

    const request: Partial<IBillingPeriodInformationForm> = {
      business_code: data.business_code,
      start_date: data.start_date,
      end_date: data.end_date,
      periodicity: data.periodicity,
      other: data.other,
    }
    return cleanEmptyFields(request)
  }

  const makeDataRequest = () => {
    const apiRequestBody: Partial<IBillingPeriodInformationForm> = {
      ...makeBaseInfoRequest(data_information_form.value),
    }

    return apiRequestBody
  }

  const validateForms = async () => {
    let valid: boolean = false
    const forms = [basicDataFormRef]

    try {
      valid = (await forms[tabActiveIdx]?.value?.validateForm()) ?? false
    } catch {
      valid = false
    }
    return valid
  }

  const onSubmit = async () => {
    if (!(await validateForms())) return

    openMainLoader(true)
    const payload = makeDataRequest()
    const success = await _updateBillingPeriod(payload, searchId)
    if (success) {
      goToURL('BillingPeriodList')
    }
    openMainLoader(false)
  }

  const isFormValid = computed(
    () =>
      data_information_form.value?.business_code &&
      data_information_form.value?.start_date &&
      data_information_form.value?.end_date &&
      data_information_form.value?.periodicity
  )

  const keysToClear = {
    trust_business: ['business_trusts'],
  }

  onBeforeMount(async () => {
    _clearData()
    _resetKeys(keysToClear)
    openMainLoader(true)
    await _getByIdBillingPeriod(searchId)
    openMainLoader(false)
  })

  onMounted(async () => {
    _clearData()
    await _getResources(
      { trust_business: ['business_trusts'] },
      'filter[effect]=true'
    )
  })

  watch(
    () => billing_period_response.value,
    (val) => {
      if (!val) return
      setFormEdit(val)
    }
  )

  return {
    billing_period_response,
    data_information_form,
    basicDataFormRef,
    headerProperties,
    tabs,
    tabActive,
    tabActiveIdx,
    isFormValid,

    onSubmit,
    goToURL,
  }
}

export default useBillingPeriodEdit
