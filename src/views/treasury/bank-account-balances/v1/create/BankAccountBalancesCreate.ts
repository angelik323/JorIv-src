// vue | store
import { useRouter } from 'vue-router'
import { onUnmounted, ref } from 'vue'
import { useBankAccountBalancesStore } from '@/stores'
import { storeToRefs } from 'pinia'

// composables
import { useMainLoader } from '@/composables'

// utils
import { defaultIcons } from '@/utils'

// interface
import { ITabs } from '@/interfaces/customs/Tab'
import { IBankAccountBalance } from '@/interfaces/customs'

const useBankAccountBalancesCreate = () => {
  const router = useRouter()

  // imports
  const { openMainLoader } = useMainLoader()
  const { data_information_form } = storeToRefs(
    useBankAccountBalancesStore('v1')
  )

  const {
    _createBankAccountBalances,
    _setDataInformationForm,
    _getListAction,
  } = useBankAccountBalancesStore('v1')

  // props
  const headerProps = {
    title: 'Crear saldos iniciales de cuentas bancarias',
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
        label: 'Crear',
        route: 'BankAccountBalancesCreate',
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
      initial_balance_local_currency:
        (data_information_form.value
          ?.initial_balance_local_currency as string) ?? '',
      initial_balance_foreign_currency:
        (data_information_form.value
          ?.initial_balance_foreign_currency as string) ?? '',
      initial_balance_date:
        data_information_form.value?.initial_balance_date ?? '',
    }
  }

  const validateForm = async () => {
    return (await formInformation.value?.validateForm()) ?? false
  }

  onUnmounted(() => {
    _setDataInformationForm(null)
  })

  const onSubmit = async () => {
    if (await validateForm()) {
      openMainLoader(true)
      const data = makeDataRequest()
      if (await _createBankAccountBalances(data)) {
        _getListAction('')
        router.push({ name: 'BankAccountBalancesList' })
      }
      setTimeout(() => {
        openMainLoader(false)
      }, 1000)
    }
  }

  return {
    headerProps,
    tabs,
    tabActive,
    tabActiveIdx,
    formInformation,
    data_information_form,
    onSubmit,
  }
}

export default useBankAccountBalancesCreate
