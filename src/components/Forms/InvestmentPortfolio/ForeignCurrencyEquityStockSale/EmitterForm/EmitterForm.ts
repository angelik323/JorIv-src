import { computed, ref } from 'vue'
import { storeToRefs } from 'pinia'

import { IEmitterForeignFormData } from '@/interfaces/customs'

import {
  useForeignCurrencyEquityStockSaleStore,
  useInvestmentPortfolioResourceStore,
} from '@/stores'
import { watch } from 'vue'

const useEmitterForm = () => {
  const optionsBaseCommission = [
    { label: 'Porcentaje', value: 'Porcentaje' },
    { label: 'Valor fijo', value: 'Valor fijo' },
  ]

  const {
    issuer_seller,
    local_currency_share_class,
    issuer_counterparty_local_currency,
  } = storeToRefs(useInvestmentPortfolioResourceStore('v1'))

  const foreignCurrencyStore = useForeignCurrencyEquityStockSaleStore('v1')
  const { getBasicData } = storeToRefs(foreignCurrencyStore)

  const emitterFormRef = ref()

  const formData = ref<IEmitterForeignFormData>({
    emitter_id: null,
    class_action: '',
    buyer_id: null,
    commissioner_id: null,
    commission_base: 'Porcentaje',
    commission_value: 0,
    unit_actions: '',
  })

  const dynamicFields = ref({
    emitter_description: '',
    buyer_description: '',
    commissioner_description: '',
  })

  const selectOptions = computed(() => ({
    issuers: issuer_seller.value,
    actionClass: local_currency_share_class.value,
    issuersCounterparties: issuer_counterparty_local_currency.value,
  }))

  watch(
    () => formData.value.emitter_id,
    () => {
      dynamicFields.value.emitter_description =
        selectOptions.value.issuersCounterparties.find(
          (item) => item.value === formData.value.emitter_id
        )?.description || ''
    }
  )

  watch(
    () => formData.value.buyer_id,
    () => {
      dynamicFields.value.buyer_description =
        selectOptions.value.issuers.find(
          (item) => item.value === formData.value.buyer_id
        )?.description || ''
    }
  )

  watch(
    () => formData.value.commissioner_id,
    () => {
      dynamicFields.value.commissioner_description =
        selectOptions.value.issuersCounterparties.find(
          (item) => item.value === formData.value.commissioner_id
        )?.description || ''
    }
  )

  const resetForm = () => {
    formData.value = {
      emitter_id: null,
      class_action: '',
      buyer_id: null,
      commissioner_id: null,
      commission_base: 'Porcentaje',
      commission_value: 0,
      unit_actions: '',
    }
    emitterFormRef.value?.reset()
  }

  return {
    formData,
    resetForm,
    selectOptions,
    emitterFormRef,
    dynamicFields,
    getBasicData,
    optionsBaseCommission,
  }
}
export default useEmitterForm
