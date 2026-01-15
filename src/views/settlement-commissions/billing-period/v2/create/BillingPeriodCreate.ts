// vue - router - quasar
import { ref, onBeforeMount, onMounted, computed } from 'vue'

// Interfaces
import { IBillingPeriodInformationForm } from '@/interfaces/customs/settlement-commissions/BillingPeriodV2'
import { ITabs } from '@/interfaces/global'

// Composables
import { useGoToUrl, useMainLoader, useUtils } from '@/composables'

// Stores
import { useBillingPeriodStore, useResourceManagerStore } from '@/stores'
import { storeToRefs } from 'pinia'

const useBillingPeriodCreate = () => {
  const { _createBillingPeriod, _clearData } = useBillingPeriodStore('v2')
  const { headerPropsDefault } = storeToRefs(useBillingPeriodStore('v2'))

  // Data de formularios
  const data_information_form = ref<IBillingPeriodInformationForm | null>(null)

  // Referencias a formularios
  const basicDataFormRef = ref()

  const headerProperties = {
    title: 'Crear periodo de liquidación de comisiones',
    breadcrumbs: [
      ...headerPropsDefault.value.breadcrumbs,
      {
        label: 'Crear',
        route: 'BillingPeriodCreate',
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

  // Datos básicos form
  const makeBaseInfoRequest = (data: IBillingPeriodInformationForm | null) => {
    if (!data) return {}

    const request: Partial<IBillingPeriodInformationForm> = {
      business_code: Number(data.business_code),
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
    const success = await _createBillingPeriod(payload)
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

  const keys = {
    settlement_commissions: ['periodicities'],
  }

  const keysToClear = {
    trust_business: ['business_trusts'],
    settlement_commissions: ['periodicities'],
  }

  onBeforeMount(async () => {
    _clearData()
    _resetKeys(keysToClear)
  })

  onMounted(async () => {
    _clearData()
    await _getResources(keys)
    await _getResources(
      { trust_business: ['business_trusts'] },
      'filter[effect]=true'
    )
  })

  return {
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

export default useBillingPeriodCreate
