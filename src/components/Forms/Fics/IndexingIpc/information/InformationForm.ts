// Vue - Vue Router - Pinia
import { onMounted, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { storeToRefs } from 'pinia'

// Interfaces
import { IActionProps } from '@/interfaces/customs'

// Composables
import { useMainLoader, useRules, useUtils } from '@/composables'

// Stores
import { useCollectiveInvestmentFundsStore } from '@/stores/fics/collective-investment-funds'
import { useFicResourceStore } from '@/stores/resources-manager/fics'
import { useIndexingIpcStore } from '@/stores/fics/indexing-ipc'
import { useInvestmentPortfolioResourceStore } from '@/stores'

const useInformationForm = (props: IActionProps) => {
  const { openMainLoader } = useMainLoader()
  const { defaultIconsLucide } = useUtils()
  const route = useRoute()

  const { interest_rates } = storeToRefs(
    useInvestmentPortfolioResourceStore('v1')
  )
  const { _showAction } = useCollectiveInvestmentFundsStore('v1')
  const { indexing_fund } = storeToRefs(useIndexingIpcStore('v1'))
  const { funds } = storeToRefs(useFicResourceStore('v1'))

  const id: number | string | string[] = route.params.id
  const informationForm = ref()

  const dataForm = ref({
    fund: '',
    fund_description: '',
    fund_bussines: '',
    fund_last_closing: '',
    fund_interest_rate_description: '',
    fund_rate: '',
  })

  const validateIndexingIpc = () => {
    return informationForm.value?.validate()
  }

  const getInfoFund = async () => {
    if (indexing_fund.value.fund_id !== null) {
      const fund_info = await _showAction(indexing_fund.value.fund_id)
      dataForm.value.fund = `${fund_info.fund_code} - ${fund_info.fund_name}`
      dataForm.value.fund_description = fund_info.fund_name
      dataForm.value.fund_bussines = fund_info.business_trust.name
      dataForm.value.fund_last_closing = fund_info.last_closing_date ?? '-'

      if (interest_rates.value?.length > 0) {
        dataForm.value.fund_interest_rate_description =
          interest_rates.value[0].interest_rate_description
        dataForm.value.fund_rate = `${
          interest_rates.value?.[0]?.rate_value ?? '0'
        }%`
        indexing_fund.value.fund_rate = String(
          interest_rates.value?.[0]?.rate_value ?? '0'
        )
      }

      indexing_fund.value.fund_info = fund_info
    }
  }

  onMounted(() => {
    if (props.action === 'read') {
      openMainLoader(true)
      setTimeout(async () => {
        indexing_fund.value.fund_id = id
        await getInfoFund()
        openMainLoader(false)
      }, 3000)
    }
  })

  watch(
    () => indexing_fund.value.fund_id,
    async (newValue) => {
      if (!newValue) {
        dataForm.value = {
          fund: '',
          fund_description: '',
          fund_bussines: '',
          fund_last_closing: '',
          fund_interest_rate_description: '',
          fund_rate: '',
        }

        return
      }

      if (props.action === 'create') {
        openMainLoader(true)

        await getInfoFund()

        openMainLoader(false)
      }
    }
  )

  return {
    funds,
    informationForm,
    indexing_fund,
    dataForm,
    defaultIconsLucide,
    validateIndexingIpc,
    useRules,
  }
}

export default useInformationForm
