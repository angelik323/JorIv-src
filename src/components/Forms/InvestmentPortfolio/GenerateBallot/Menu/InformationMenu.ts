// Vue - Pinia
import { storeToRefs } from 'pinia'
import { onUnmounted, ref, watch } from 'vue'
import { useRouter } from 'vue-router'

// Interfaces
import { IInstructionSlipTypeResource } from '@/interfaces/customs/resources/InvestmentPortfolio'
import { IGenerateBallotMenu } from '@interfaces/customs/investment-portfolio/GenerateBallot'

// Stores
import { useInvestmentPortfolioResourceStore } from '@/stores/resources-manager/investment-portfolio'
import { useResourceManagerStore } from '@/stores/resources-manager'
import { useGenerateBallotStore } from '@/stores/investment-portfolio/generate-ballot'

// Utils
import { useUtils } from '@/composables'

export const useInformationMenu = () => {
  const router = useRouter()
  const {
    investment_portfolio,
    instruction_slip_types,
    investment_portfolio_operation_types,
    investment_portfolio_titles,
  } = storeToRefs(useInvestmentPortfolioResourceStore('v1'))
  const {
    _setInvestmentId,
    _setMenuData,
    _setNatureOperation,
    _getSelectionMenu,
    _setIsForeign,
  } = useGenerateBallotStore('v1')
  const { _getResources, _resetKeys } = useResourceManagerStore('v1')

  const { isEmptyOrZero } = useUtils()

  const models = ref<IGenerateBallotMenu>({
    investment_portfolio_id: '',
    operation_type_id: '',
    instruction_slip_type_id: '',
    operation_date: '',
  })

  const refInvestmentDescription = ref('')
  const operationDescription = ref('')
  const operationNature = ref('')
  const currentInversionTypeId = ref<number | null>(null)
  const filteredInstructionSlipTypes = ref<IInstructionSlipTypeResource[]>([])

  watch(
    () => models.value.investment_portfolio_id,
    async (newVal) => {
      if (!newVal) return
      await _getResources({
        investment_portfolio: [
          `investment_portfolio_operation_types&filter[investment_portfolio_id]=${newVal}`,
        ],
      })
      await _getResources({
        investment_portfolio: [
          `investment_portfolio_banks&investment_portfolio_id=${newVal}`,
        ],
      })
      refInvestmentDescription.value =
        investment_portfolio.value.find((item) => item.value === newVal)
          ?.description ?? ''
      _setInvestmentId(newVal ? parseInt(newVal) : null)
    },
    { deep: true }
  )

  watch(
    () => models.value.operation_type_id,
    async (newVal) => {
      const selectedOperation = investment_portfolio_operation_types.value.find(
        (item) => item.value === newVal
      )
      operationDescription.value = selectedOperation?.label ?? ''
      operationNature.value = selectedOperation?.operation_nature ?? ''
      currentInversionTypeId.value =
        selectedOperation?.inversion_type_id ?? null
      _setNatureOperation(operationNature.value)
    }
  )

  watch(
    [() => instruction_slip_types.value, currentInversionTypeId],
    () => {
      if (!currentInversionTypeId.value) {
        filteredInstructionSlipTypes.value = []
        return
      }

      filteredInstructionSlipTypes.value = (
        instruction_slip_types.value as IInstructionSlipTypeResource[]
      ).filter(
        (item) => item.inversion_type_id === currentInversionTypeId.value
      )
    },
    { immediate: true }
  )

  onUnmounted(() => {
    _resetKeys({
      investment_portfolio: [
        'investment_portfolio_operation_types',
        'investment_portfolio_banks',
      ],
    })
  })

  onUnmounted(() => {
    _resetKeys({
      investment_portfolio: [
        'investment_portfolio_operation_types',
        'investment_portfolio_banks',
      ],
    })
  })

  watch(
    () => models.value,
    () => {
      if (isEmptyOrZero(models.value)) {
        _setMenuData(null)
      } else {
        _setMenuData(models.value)
      }
    },
    { deep: true }
  )

  const handleContinue = async () => {
    const selectedSlipItem = filteredInstructionSlipTypes.value.find(
      (item) => item.value === models.value.instruction_slip_type_id
    )
    if (!selectedSlipItem) return

    const response = await _getSelectionMenu({
      instruction_slip_type_id: Number(models.value.instruction_slip_type_id),
      investment_portfolio_id: Number(models.value.investment_portfolio_id),
      operation_type_id: Number(models.value.operation_type_id),
      operation_date: String(models.value.operation_date || ''),
    })

    const hasForeign = response?.titles?.some(
      (t: { isForeign: boolean }) => t.isForeign
    )
    _setIsForeign(Boolean(hasForeign))

    router.push({ name: 'GenerateBallotCreate' })
  }

  return {
    models,
    investment_portfolio,
    instruction_slip_types,
    filteredInstructionSlipTypes,
    investment_portfolio_operation_types,
    investment_portfolio_titles,
    refInvestmentDescription,
    operationDescription,
    handleContinue,
  }
}
