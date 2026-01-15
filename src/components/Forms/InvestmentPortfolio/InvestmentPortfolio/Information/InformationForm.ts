// Core
import { computed, onMounted, ref, watch } from 'vue'
import { storeToRefs } from 'pinia'

// Composables
import { useAlert, useUtils } from '@/composables'

// Interfaces
import { debounce } from 'quasar'
import { ActionType, TrustBusinessStatusID } from '@/interfaces/global'
import { IBankAccountWithCoinResource } from '@/interfaces/customs/resources/Treasury'

// Constants
import { TIMEOUT_ALERT } from '@/constants/alerts'

// Stores
import { useResourceManagerStore } from '@/stores/resources-manager'
import { useFicResourceStore } from '@/stores/resources-manager/fics'
import { useTreasuryResourceStore } from '@/stores/resources-manager/treasury'
import { useAccountingResourceStore } from '@/stores/resources-manager/accounting'
import { useTrustBusinessResourceStore } from '@/stores/resources-manager/trust-business'
import { useInvestmentPortfoliosStore } from '@/stores/investment-portfolio/investment-portfolio'
import { useInvestmentPortfolioResourceStore } from '@/stores/resources-manager/investment-portfolio'

const useInformationForm = (props: {
  action: ActionType
  id?: number
  hasLoadedData: boolean
}) => {
  const { investment_portfolio } = storeToRefs(
    useInvestmentPortfoliosStore('v1')
  )
  const { _getResources, _resetKeys } = useResourceManagerStore('v1')

  const { business_trusts } = storeToRefs(useTrustBusinessResourceStore('v1'))
  const { coins } = storeToRefs(useInvestmentPortfolioResourceStore('v1'))
  const { cost_center } = storeToRefs(useAccountingResourceStore('v1'))
  const { banks, bank_account, type_receive, means_of_payments } = storeToRefs(
    useTreasuryResourceStore('v1')
  )
  const { funds } = storeToRefs(useFicResourceStore('v1'))

  const { showAlert } = useAlert()

  const informationForm = ref()
  const isView = computed(() => props.action === 'view')
  const isEdit = computed(() => props.action === 'edit')

  const lastValuationDateDefaultValue = computed<string>(() =>
    investment_portfolio.value?.last_valuation_date
      ? useUtils().formatDate(
          investment_portfolio.value.last_valuation_date,
          'YYYY-MM-DD'
        )
      : useUtils().formatDate(new Date().toISOString(), 'YYYY-MM-DD')
  )

  const selectedBusiness = ref()
  const isValidBusiness = ref<boolean>(true)

  const selectBusiness = async (businessCode: string) => {
    if (selectedBusiness.value?.business_code === businessCode) return
    investment_portfolio.value.fic_code = ''
    _resetKeys({ fics: ['funds'] })
    await _getResources(
      { trust_business: ['business_trusts'] },
      'filter[business_code]=' + businessCode
    )

    selectedBusiness.value = business_trusts.value.find(
      (business) => `${business.code}` === `${businessCode}`
    )

    if (selectedBusiness.value) {
      investment_portfolio.value.business_trust_id = selectedBusiness.value.id
      investment_portfolio.value.business_code = Number(
        selectedBusiness.value.code
      )
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
      isValidBusiness.value = true
      _getResources(
        { fics: ['funds'] },
        `filter[business_trust_id]=${selectedBusiness.value?.id}`
      )
    } else {
      showAlert('El Negocio no existe', 'error', undefined, TIMEOUT_ALERT)
      isValidBusiness.value = false
    }
  }

  const handleBusinessCode = debounce((businessCode: string) => {
    selectBusiness(businessCode)
  }, 1000)

  const bankAccounts = ref<IBankAccountWithCoinResource[]>()

  const selectBanks = (banks: number[]) => {
    investment_portfolio.value.bank_id = banks
    filterBankAccounts(banks)
  }

  const filterBankAccounts = (banks: number[]) => {
    bankAccounts.value = bank_account.value.filter((bank_account) =>
      banks.includes(bank_account.bank_id)
    )
    const filteredIds = bankAccounts.value.map((item) => item.id)

    investment_portfolio.value.bank_account =
      investment_portfolio.value.bank_account?.filter((id) =>
        filteredIds.includes(id)
      ) || []
  }

  const validateInvestmentPortfolio = () => {
    return informationForm.value?.validate()
  }

  const getPayloadData = () => {
    return investment_portfolio.value
  }
  watch(
    () => props.hasLoadedData,
    () => {
      if (!investment_portfolio.value.name) setPortfolioData()
    }
  )

  watch(
    () => investment_portfolio.value.last_valuation_date,
    (v) => {
      if (!v) {
        investment_portfolio.value.last_valuation_date =
          lastValuationDateDefaultValue.value
      }
    },
    { immediate: true }
  )

  const setPortfolioData = () => {
    investment_portfolio.value.name = investment_portfolio.value.description!
    investment_portfolio.value.currency = Number(
      investment_portfolio.value.currency_id
    )

    const selectedBankAccounts: number[] = []
    if (Array.isArray(investment_portfolio.value.bank_account)) {
      investment_portfolio.value.bank_id =
        investment_portfolio.value.bank_account.map((item: number) => {
          const itemData = item as unknown as {
            bank_accounts?: number
            id: number
          }
          if (itemData.bank_accounts && Array.isArray(itemData.bank_accounts)) {
            itemData.bank_accounts.forEach((bankAccount: { id: number }) => {
              selectedBankAccounts.push(bankAccount.id)
            })
          }
          return itemData.id
        })
    } else {
      investment_portfolio.value.bank_id = []
    }

    investment_portfolio.value.bank_account = selectedBankAccounts
    filterBankAccounts(investment_portfolio.value.bank_id)

    investment_portfolio.value.collection_method =
      investment_portfolio.value.forms_compliance?.method_receives?.map(
        (item) => item.id
      ) || []
    investment_portfolio.value.method_payment =
      investment_portfolio.value.forms_compliance?.method_payment?.map(
        (item) => item.id
      ) || []
  }

  onMounted(() => {
    if (props.action !== 'create') setPortfolioData()
  })

  const defaultBankIds = computed<number[]>(() =>
    Array.isArray(investment_portfolio.value?.bank_id)
      ? (investment_portfolio.value.bank_id as number[])
      : []
  )

  const defaultBankAccountIds = computed<number[]>(() =>
    Array.isArray(investment_portfolio.value?.bank_account)
      ? (investment_portfolio.value.bank_account as number[])
      : []
  )

  const defaultFicCode = computed<string>(() =>
    typeof investment_portfolio.value?.fic_code === 'string'
      ? (investment_portfolio.value.fic_code as string)
      : ''
  )

  const defaultCurrency = computed<number | string>(
    () => investment_portfolio.value?.currency ?? ''
  )

  const defaultCostCenterId = computed<number | string>(
    () => investment_portfolio.value?.cost_center_id ?? ''
  )

  const defaultCollectionMethods = computed<number[]>(() =>
    Array.isArray(investment_portfolio.value?.collection_method)
      ? (investment_portfolio.value.collection_method as number[])
      : []
  )

  const defaultPaymentMethods = computed<number[]>(() =>
    Array.isArray(investment_portfolio.value?.method_payment)
      ? (investment_portfolio.value.method_payment as number[])
      : []
  )

  return {
    investment_portfolio,
    informationForm,
    isView,
    isEdit,
    lastValuationDateDefaultValue,
    handleBusinessCode,
    coins,
    cost_center,
    banks,
    bankAccounts,
    type_receive,
    means_of_payments,
    isValidBusiness,
    funds,
    selectBanks,
    getPayloadData,
    validateInvestmentPortfolio,

    // defaults para usar en el template
    defaultBankIds,
    defaultBankAccountIds,
    defaultFicCode,
    defaultCurrency,
    defaultCostCenterId,
    defaultCollectionMethods,
    defaultPaymentMethods,
  }
}

export default useInformationForm
