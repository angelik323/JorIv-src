import { ref, watch, computed } from 'vue'
import { storeToRefs } from 'pinia'

import { IGeneralRequests } from '@/interfaces/customs'
import { ActionType } from '@/interfaces/global'

import {
  useFicResourceStore,
  useTrustBusinessResourceStore,
  useInvestmentPortfolioResourceStore,
  useResourceManagerStore,
} from '@/stores'

const useInformationForm = (props: {
  action: ActionType
  data?: IGeneralRequests
}) => {
  const { funds } = storeToRefs(useFicResourceStore('v1'))
  const { coins } = storeToRefs(useInvestmentPortfolioResourceStore('v1'))
  const { fiduciary_mandates_statuses: status, business_trusts: business } =
    storeToRefs(useTrustBusinessResourceStore('v1'))

  const { _getResources } = useResourceManagerStore('v1')

  const informationFormRef = ref()
  const COP_ID = 2
  const formData = ref<IGeneralRequests>({
    name: '',
    business_trust_id: null,
    currency_id: COP_ID,
    record_status_id: null,
    fund_id: null,
  })

  const isEdit = computed(() => ['edit'].includes(props.action))
  const isView = computed(() => ['view'].includes(props.action))

  const selectedCoinLabel = computed(() => {
    const coin = coins.value.find(
      (c) => Number(c.value) === Number(formData.value.currency_id)
    )
    return coin ? coin.label : '-'
  })

  watch(
    () => props.data,
    (newVal) => {
      if (newVal) {
        formData.value = { ...formData.value, ...newVal }
        formData.value.business_trust_id = newVal.business_trust?.id ?? null
      }
    },
    { deep: true, immediate: true }
  )

  watch(
    () => formData.value.business_trust_id,
    async (val) => {
      if (!val) return

      const keys = {
        fics: [`funds&filter[business_trust_id]=${val}`],
      }

      if (props.action !== 'view') {
        await _getResources(keys)
      }
    },
    { deep: true, immediate: true }
  )

  return {
    funds,
    status,
    isView,
    isEdit,
    business,
    formData,
    selectedCoinLabel,
    informationFormRef,
  }
}

export default useInformationForm
