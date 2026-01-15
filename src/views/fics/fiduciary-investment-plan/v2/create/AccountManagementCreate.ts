// Vue - Vue Router - Pinia
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { storeToRefs } from 'pinia'

// Interfaces
import { IFiduciaryInvestmentPlansAccountForm } from '@/interfaces/customs/fics/FiduciaryInvestmentPlans'
import { ITabs } from '@/interfaces/global'

// Composables
import { useGoToUrl } from '@/composables/useGoToUrl'
import { useRules } from '@/composables/useRules'
import { useUtils } from '@/composables/useUtils'
import { useMainLoader } from '@/composables'

// Stores
import { useFiduciaryInvestmentPlanStore } from '@/stores/fics/fiduciary-investment-plan'
import { useThirdPartyResourceStore } from '@/stores/resources-manager/third-party'
import { useTreasuryResourceStore } from '@/stores/resources-manager/treasury'
import { useFicResourceStore } from '@/stores/resources-manager/fics'
import { useResourceManagerStore } from '@/stores/resources-manager'

const useAccountManagementCreate = () => {
  const { openMainLoader } = useMainLoader()
  const { defaultIconsLucide } = useUtils()
  const { goToURL } = useGoToUrl()
  const route = useRoute()
  const {
    min_length,
    max_length,
    only_number,
    is_required,
    max_integer_decimal,
  } = useRules()

  const { _getResources, _resetKeys } = useResourceManagerStore('v1')
  const { _clearData, _createBankingAccount } =
    useFiduciaryInvestmentPlanStore('v1')

  const {
    account_types,
    funts_to_investment_plans,
    fiduciary_investment_plans,
    status_fip_account_management,
    identification_types_for_plans,
  } = storeToRefs(useFicResourceStore('v1'))

  const { means_of_payments, banks } = storeToRefs(
    useTreasuryResourceStore('v1')
  )
  const { third_parties } = storeToRefs(useThirdPartyResourceStore('v1'))

  const radioPaymentMethod = ref(false)
  const planSelectorKey = ref(0)
  const formAccount = ref()
  const formKey = ref(0)

  const searchId = +route.params.id

  const keys = {
    treasury: ['means_of_payments', 'banks'],
    fics: [
      'identification_types_for_plans',
      'status_fip_account_management',
      'fiduciary_investment_plans',
      'funts_to_investment_plans',
      'account_types',
    ],
  }

  const keysThirdParty = {
    key: {
      third_party: ['third_parties'],
    },
    params:
      'sort=id&include=legalPerson,financialInfo,naturalPerson,estate,documentType,contacts,addresses,status&filter[is_customer]=1&fields[]=id,document,is_customer,third_party_category,document_type_id,status_id',
  }

  const models = ref<IFiduciaryInvestmentPlansAccountForm>({
    plan_id: searchId,
    payment_method_id: null,
    destination_fund_id: null,
    destination_plan: null,
    destination_bank_id: null,
    account_number: null,
    account_type: '',
    identification_type: '',
    identification_id: null,
    identification_number: null,
    people_name: '',
    operation_count_per_day: null,
    maximum_value_per_operation: null,
    total_amount_per_day: null,
    inscription_status_id: null,
  })

  const headerProps = {
    title: 'Agregar cuenta',
    breadcrumbs: [
      {
        label: 'Inicio',
        route: 'HomeView',
      },
      {
        label: 'Fics',
      },
      {
        label: 'Registro y gestión cuentas bancarias giro',
        route: 'AccountManagementList',
      },
      {
        label: 'Agregar',
        route: 'AccountManagementCreate',
      },
    ],
  }

  const tabs: ITabs[] = [
    {
      name: 'information',
      label: 'Datos Básicos',
      icon: defaultIconsLucide.bulletList,
      outlined: true,
      disable: true,
      show: true,
      required: true,
    },
  ]

  const tabActive = tabs[0].name
  const tabActiveIdx = 0

  const handleGoTo = (goURL: string) => goToURL(goURL)

  const filteredMeansOfPayments = computed(() => {
    if (radioPaymentMethod.value) {
      return means_of_payments.value.filter(
        (item) => item.type_mean_of_payments === 'Transferencia'
      )
    } else {
      return means_of_payments.value.filter(
        (item) => item.type_mean_of_payments === 'Traslado'
      )
    }
  })

  const planOptions = computed(() => {
    if (!radioPaymentMethod.value && models.value.destination_fund_id) {
      const plan_numbers = fiduciary_investment_plans.value.filter((item) => {
        return item.fundId === models.value.destination_fund_id
      })

      return plan_numbers.map((item) => ({
        label: item.label || '',
        value: item.code ?? '',
      }))
    }

    return []
  })

  const changeRadio = () => {
    models.value = {
      plan_id: searchId,
      payment_method_id: null,
      destination_fund_id: null,
      destination_plan: null,
      destination_bank_id: null,
      account_number: null,
      account_type: '',
      identification_type: '',
      identification_id: null,
      identification_number: null,
      people_name: '',
      operation_count_per_day: null,
      maximum_value_per_operation: null,
      total_amount_per_day: null,
      inscription_status_id: null,
    }
    formKey.value++
  }

  const searchThirdParties = async () => {
    models.value.identification_id = null
    models.value.people_name = ''

    models.value.identification_number =
      models.value.identification_number === ''
        ? null
        : models.value.identification_number

    if (models.value.identification_number) {
      await _getResources(
        { third_party: ['third_parties'] },
        `sort=id&include=legalPerson,financialInfo,naturalPerson,estate,documentType,contacts,addresses,status&filter[is_customer]=1&fields[]=id,document,is_customer,third_party_category,document_type_id,status_id&filter[document]=${models.value.identification_number}`
      )
    }

    if (third_parties.value.length > 0) {
      third_parties.value = third_parties.value.filter(
        (item) => item.document == models.value.identification_number
      )
    }

    if (third_parties.value.length == 1) {
      models.value.identification_id = third_parties.value?.[0]?.id ?? null
      models.value.people_name = third_parties.value?.[0]?.name ?? ''
    }
  }

  const onSubmit = async () => {
    const isValid = await formAccount.value.validate()

    if (isValid) {
      const payload = { ...models.value }

      openMainLoader(true)
      const create = await _createBankingAccount(payload)
      openMainLoader(false)

      if (create) handleGoTo('AccountManagementList')
    }
  }

  onBeforeUnmount(() => {
    _resetKeys(keys)
    _resetKeys(keysThirdParty.key)
  })

  onMounted(async () => {
    _clearData()
    openMainLoader(true)

    await _getResources(keys)
    await _getResources(keysThirdParty.key, keysThirdParty.params)

    openMainLoader(false)
  })

  watch(
    [
      () => models.value.operation_count_per_day,
      () => models.value.maximum_value_per_operation,
    ],
    ([count, maxVal]) => {
      if (count != null && maxVal != null) {
        models.value.total_amount_per_day = count * maxVal
      } else {
        models.value.total_amount_per_day = null
      }
    }
  )

  watch(
    () => radioPaymentMethod.value,
    () => {
      models.value.payment_method_id = null
    }
  )

  watch(
    () => models.value.destination_plan,
    () => {
      const holder_id =
        fiduciary_investment_plans?.value[0]?.fip_holder_identifications
          ?.holder_id

      if (third_parties.value.length > 0) {
        third_parties.value = third_parties.value.filter(
          (item) => item.id == holder_id
        )
      }

      if (third_parties.value.length == 1) {
        models.value.identification_id = third_parties.value?.[0]?.id ?? null
        models.value.people_name = third_parties.value?.[0]?.name ?? ''
        models.value.identification_number =
          third_parties.value?.[0]?.document ?? null
      }
    }
  )

  watch(
    () => models.value.destination_fund_id,
    async (newVal, oldVal) => {
      if (newVal !== oldVal) {
        models.value.destination_plan = null
        planSelectorKey.value++

        if (newVal) {
          await _getResources(
            { fics: ['fiduciary_investment_plans'] },
            `filter[collective_investment_fund_id]=${newVal}`
          )
        }
        await nextTick()
      }
    }
  )

  return {
    tabs,
    banks,
    models,
    formKey,
    onSubmit,
    tabActive,
    min_length,
    max_length,
    handleGoTo,
    formAccount,
    is_required,
    planOptions,
    only_number,
    headerProps,
    changeRadio,
    tabActiveIdx,
    account_types,
    planSelectorKey,
    searchThirdParties,
    radioPaymentMethod,
    max_integer_decimal,
    filteredMeansOfPayments,
    funts_to_investment_plans,
    status_fip_account_management,
    identification_types_for_plans,
  }
}

export default useAccountManagementCreate
