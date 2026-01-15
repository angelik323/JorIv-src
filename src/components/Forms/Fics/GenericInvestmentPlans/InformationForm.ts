// Vue - Pinia
import { storeToRefs } from 'pinia'
import { ref, watch } from 'vue'

// Stores
import { useTreasuryResourceStore } from '@/stores/resources-manager/treasury'
import { useFicResourceStore } from '@/stores/resources-manager/fics'
import { useResourceManagerStore } from '@/stores/resources-manager'

const useInformationForm = () => {
  const { third_parties } = storeToRefs(useTreasuryResourceStore('v1'))
  const { funts_to_investment_plans, fiduciary_investment_plans } = storeToRefs(
    useFicResourceStore('v1')
  )
  const { _getResources } = useResourceManagerStore('v1')

  const { means_of_payments } = storeToRefs(useTreasuryResourceStore('v1'))

  const informationFormRef = ref()

  const formData = ref({
    collective_investment_fund_id: null as number | null,
    fiduciary_investment_plan_id: null as number | null,
    fiduciary_investment_plan_description: '',
    check_digit: Math.floor(Math.random() * 10).toString(),
    participation_type: '',
    treasurie_pay_form_id: null as number | null,
  })

  watch(
    () => formData.value.collective_investment_fund_id,
    async (newId) =>
      await _getResources(
        { fics: ['fiduciary_investment_plans'] },
        `filter[collective_investment_fund_id]=${newId}`
      )
  )

  watch(
    () => formData.value.fiduciary_investment_plan_id,
    async (newId) => {
      if (!newId) {
        formData.value.fiduciary_investment_plan_description = ''
        return
      }

      const plan = fiduciary_investment_plans.value.find(
        (item) => item.id === newId
      )
      const holderId = plan?.fip_holder_identifications?.holder_id

      if (holderId) {
        await _getResources(
          { treasury: ['third_parties'] },
          `filter[id]=${holderId}`
        )

        const thirdParty = third_parties.value.find((t) => t.id === holderId)

        formData.value.fiduciary_investment_plan_description =
          thirdParty?.label ?? ''

        formData.value.participation_type =
          plan?.fip_parameters?.fic_participation_type?.participation_type
            ?.description ?? ''
      } else {
        formData.value.fiduciary_investment_plan_description = ''
        formData.value.participation_type = ''
      }
    }
  )

  return {
    formData,
    means_of_payments,
    informationFormRef,
    funts_to_investment_plans,
    fiduciary_investment_plans,
  }
}

export default useInformationForm
