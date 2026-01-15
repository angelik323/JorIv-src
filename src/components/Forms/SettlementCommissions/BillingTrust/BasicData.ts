import { IBillingTrustForm } from '@/interfaces/customs'
import { ref, watch } from 'vue'
import { useAlert, useRules } from '@/composables'
import { isEmptyOrZero } from '@/utils'
import { storeToRefs } from 'pinia'
import {
  useResourceManagerStore,
  useResourceStore,
  useTrustBusinessResourceStore,
} from '@/stores'
import { debounce } from 'quasar'
import { TrustBusinessStatusID } from '@/interfaces/global'
import { TIMEOUT_ALERT } from '@/constants/alerts'

const useBasicDataForm = (
  props: {
    data: IBillingTrustForm | null
  },
  emit: Function
) => {
  const {
    is_required,
    max_length,
    only_positive_number,
    no_leading_zeros,
    only_alphanumeric,
  } = useRules()
  const { _getResources, _resetKeys } = useResourceManagerStore('v1')
  const { showAlert } = useAlert()

  const { periodicity_billing_trust } = storeToRefs(useResourceStore('v1'))
  const { business_trusts } = storeToRefs(useTrustBusinessResourceStore('v1'))

  const formElementRef = ref()
  const selectedBusiness = ref()
  const isValidBusiness = ref<boolean>(true)
  const isLoadingBusiness = ref(false)

  const initialModelsValues: IBillingTrustForm = {
    business_code: null,
    business_name: null,
    start_date: null,
    end_date: null,
    periodicity: null,
    other: null,
  }

  const models = ref<typeof initialModelsValues>({ ...initialModelsValues })

  const _setValueModel = () => {
    if (!props.data) return
    models.value = { ...props.data }
  }

  const handleBusinessCode = debounce((businessCode: string) => {
    selectBusiness(businessCode)
  }, 1000)

  const selectBusiness = async (businessCode: string) => {
    if (selectedBusiness.value?.business_code === businessCode) return
    models.value.business_name = null

    _resetKeys({ trust_business: ['business_trusts'] })

    isLoadingBusiness.value = true
    await _getResources(
      { trust_business: ['business_trusts'] },
      'filter[business_code]=' + businessCode
    )

    selectedBusiness.value = business_trusts.value.find(
      (business) => `${business.code}` === `${businessCode}`
    )

    isLoadingBusiness.value = false

    if (selectedBusiness.value) {
      models.value.business_code = Number(selectedBusiness.value.code)
      models.value.business_name = selectedBusiness.value.name
      const status_id = selectedBusiness.value.status_id

      if (
        status_id === TrustBusinessStatusID.VALID ||
        status_id === TrustBusinessStatusID.LIQUIDATION
      ) {
        showAlert('Registro obtenido exitosamente', 'success')
        isValidBusiness.value = true
      } else {
        showAlert(
          'Negocio en estado diferente a vigente o liquidación',
          'error',
          undefined,
          TIMEOUT_ALERT
        )
        isValidBusiness.value = false
        return
      }
    } else {
      showAlert('El Negocio no existe', 'error', undefined, TIMEOUT_ALERT)
      isValidBusiness.value = false
    }
  }

  watch(
    () => props.data,
    (val) => {
      if (!val) return
      _setValueModel()
    },
    { deep: true, immediate: true }
  )

  watch(
    models,
    (val) => {
      if (JSON.stringify(val) === JSON.stringify(props.data)) return
      emit('update:data', isEmptyOrZero(val) ? null : val)
    },
    { deep: true }
  )

  return {
    formElementRef,
    models,
    periodicity_billing_trust,
    isValidBusiness,
    handleBusinessCode,
    isLoadingBusiness,
    is_required,
    max_length,
    no_leading_zeros,
    only_alphanumeric,
    only_positive_number,
  }
}

export default useBasicDataForm
