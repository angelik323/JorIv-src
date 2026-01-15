// vue | store
import { useRoute, useRouter } from 'vue-router'
import { onBeforeMount, onMounted, onUnmounted, ref } from 'vue'
import { useBankAccountBalancesStore, useResourceStore } from '@/stores'
import { storeToRefs } from 'pinia'

// composables
import { useMainLoader } from '@/composables'

// utils
import { defaultIcons } from '@/utils'

// interface
import { ITabs } from '@/interfaces/customs/Tab'
import { IBankAccountBalance } from '@/interfaces/customs'

const useBankAccountBalancesEdit = () => {
  // router
  const router = useRouter()
  const route = useRoute()
  const bankAccountBalancesId = +route.params.id

  // imports
  const { openMainLoader } = useMainLoader()
  const { data_information_form, type_accont_balances_request } = storeToRefs(
    useBankAccountBalancesStore('v1')
  )
  const {
    _updateBankAccountBalances,
    _getByIdBankAccountBalances,
    _setDataInformationForm,
  } = useBankAccountBalancesStore('v1')

  const { _getResourcesTreasuries } = useResourceStore('v1')

  // keys
  const keys = ['business_trust', 'banks', 'bank_account']

  // props
  const headerProps = {
    title: 'Editar saldos iniciales de cuentas bancarias',
    breadcrumbs: [
      {
        label: 'Inicio',
        route: 'HomeView',
      },
      {
        label: 'Tesorería',
        route: '',
      },
      {
        label: 'Saldos iniciales de cuentas bancarias',
        route: 'BankAccountBalancesList',
      },
      {
        label: 'Editar',
        route: 'BankAccountBalancesEdit',
      },
    ],
  }

  // tabs
  const tabs = ref<ITabs[]>([
    {
      name: 'information',
      label: 'Datos Básicos',
      icon: defaultIcons.bulletList,
      outlined: true,
      disable: true,
      show: true,
      required: false,
    },
  ])

  const tabActive = ref(tabs.value[0].name)

  const tabActiveIdx = ref(
    tabs.value.findIndex((tab) => tab.name === tabActive.value)
  )

  // refs
  const formInformation = ref()

  // actions
  const makeDataRequest = (): IBankAccountBalance => {
    return {
      business_id: data_information_form.value?.business_id ?? 0,
      bank_id: data_information_form.value?.bank_id ?? 0,
      bank_account_id: data_information_form.value?.bank_account_id ?? 0,
      currency: data_information_form.value?.currency ?? '',
      initial_balance_local_currency:
        (data_information_form.value
          ?.initial_balance_local_currency as string) ?? '',
      initial_balance_foreign_currency:
        (data_information_form.value
          ?.initial_balance_foreign_currency as string) ?? '',
      initial_balance_date:
        data_information_form.value?.initial_balance_date ?? '',
      opening_date: data_information_form.value?.opening_date ?? '',
    }
  }

  const validateForm = async () => {
    return (await formInformation.value?.validateForm()) ?? false
  }

  // onMount
  onMounted(async () => {
    await _getResourcesTreasuries(`keys[]=${keys.join('&keys[]=')}`)
  })

  onUnmounted(() => {
    _setDataInformationForm(null)
  })

  onBeforeMount(async () => {
    openMainLoader(true)
    data_information_form.value = null
    await _getByIdBankAccountBalances(bankAccountBalancesId)
    openMainLoader(false)
  })

  const onSubmit = async () => {
    if (await validateForm()) {
      openMainLoader(true)
      const data = makeDataRequest()
      await _updateBankAccountBalances(data, bankAccountBalancesId)
      openMainLoader(false)
      router.push({ name: 'BankAccountBalancesList' })
    }
  }

  return {
    headerProps,
    tabs,
    tabActive,
    tabActiveIdx,
    formInformation,
    type_accont_balances_request,
    onSubmit,
  }
}

export default useBankAccountBalancesEdit
