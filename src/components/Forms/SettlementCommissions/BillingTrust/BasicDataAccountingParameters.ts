import { IAccountingParametersForm } from '@/interfaces/customs'
import { ref, watch } from 'vue'
import { useAlert, useRules } from '@/composables'
import { isEmptyOrZero } from '@/utils'
import { storeToRefs } from 'pinia'
import {
  useBillingTrustsStore,
  useResourceManagerStore,
  useResourceStore,
  useTrustBusinessResourceStore,
} from '@/stores'
import { debounce } from 'quasar'
import { TrustBusinessStatusID } from '@/interfaces/global'
import { TIMEOUT_ALERT } from '@/constants/alerts'

const useBasicDataForm = (
  props: {
    data: IAccountingParametersForm | null
  },
  emit: Function
) => {
  const {
    is_required,
    is_required_boolean,
    only_positive_number,
    no_leading_zeros,
  } = useRules()
  const { _getResources, _resetKeys } = useResourceManagerStore('v1')
  const { showAlert } = useAlert()

  const { who_pays_commission, options_boolean_value } = storeToRefs(
    useResourceStore('v1')
  )
  const { business_trusts } = storeToRefs(useTrustBusinessResourceStore('v1'))
  const { billing_trusts_response } = storeToRefs(useBillingTrustsStore('v1'))

  const formElementRef = ref()
  const selectedBusiness = ref()
  const isValidBusiness = ref<boolean>(true)
  const isLoadingBusiness = ref(false)
  const iva = ref(19)

  const initialModelsValues: IAccountingParametersForm = {
    business_code: null,
    business_name: null,
    who_pays: null,
    accounts: null,
    generates_iva: null,
    iva: null,
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
      if (selectedBusiness.value.status_id !== TrustBusinessStatusID.VALID) {
        showAlert(
          'Negocio en estado diferente a vigente',
          'error',
          undefined,
          TIMEOUT_ALERT
        )
        isValidBusiness.value = false
        return
      }
      showAlert('Registro obtenido exitosamente', 'success')

      isValidBusiness.value = true
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

  watch(
    () => models.value.generates_iva,
    (val) => {
      if (val) models.value.iva = iva.value
      else models.value.iva = null
    }
  )

  watch(billing_trusts_response, (val) => {
    if (val?.business_code_snapshot) {
      models.value.business_code = val.business_code_snapshot
      models.value.business_name = val.business_name_snapshot
    }
  })

  return {
    formElementRef,
    models,
    who_pays_commission,
    options_boolean_value,
    handleBusinessCode,
    isValidBusiness,
    isLoadingBusiness,
    is_required_boolean,
    is_required,
    no_leading_zeros,
    only_positive_number,
  }
}

export default useBasicDataForm
