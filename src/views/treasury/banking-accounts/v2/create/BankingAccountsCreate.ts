// Vue - pinia - vue-router - composables
import { ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useRouter } from 'vue-router'

// Interfaces
import { ITabs } from '@/interfaces/global'
import { IBankAccountPerformance } from '@/interfaces/customs'

// Composables & Utils
import { useUtils } from '@/composables'

// Stores
import { useBankingAccountsStore } from '@/stores'

const useBankingAccountsCreate = () => {
  const router = useRouter()
  const {
    data_information_form,
    data_performance_form,
    data_restatement_form,
  } = storeToRefs(useBankingAccountsStore('v2'))
  const {
    _isValidDataBasicForm,
    _isValidPerformanceForm,
    _isValidRestatementForm,
    _setDataPerformanceBankingAccount,
    _createBankingAccounts,
  } = useBankingAccountsStore('v2')

  const { defaultIconsLucide } = useUtils()

  const formInformation = ref()
  const formPerformance = ref()
  const formRestatement = ref()

  const headerProperties = {
    title: 'Crear cuenta bancaria',
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
        label: 'Cuentas bancarias',
        route: 'BankingAccountsList',
      },
      {
        label: 'Crear',
        route: 'BankingAccountsCreate',
      },
    ],
  }

  const tabs = ref<ITabs[]>([
    {
      name: 'information',
      label: 'Datos Básicos',
      icon: defaultIconsLucide.bulletList,
      outlined: true,
      disable: true,
      show: true,
      required: true,
    },
    {
      name: 'performance',
      label: 'Rendimientos y Tasas',
      icon: defaultIconsLucide.dollarSign,
      outlined: true,
      disable: true,
      show: true,
      required: false,
    },
    {
      name: 'restatement',
      label: 'Reexpresión',
      icon: defaultIconsLucide.chartLine,
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

  const validateForms = async () => {
    let valid = false
    const forms = [formInformation, formPerformance, formRestatement]

    if (tabActiveIdx.value >= 0 && tabActiveIdx.value < forms.length) {
      try {
        valid = (await forms[tabActiveIdx.value]?.value?.validateForm()) ?? false
      } catch {
        valid = false
      }
    }
    return valid
  }

  const nextTab = async () => {
    await validateForms()
    let validation = false

    if (tabActive.value == 'information') {
      validation = await _isValidDataBasicForm(
        data_information_form.value ?? {}
      )
    }

    if (tabActive.value == 'performance') {
      if (
        data_performance_form.value == null ||
        isBaseData(data_performance_form.value)
      ) {
        await _setDataPerformanceBankingAccount(null)
        validation = true
      } else {
        validation = await _isValidPerformanceForm(
          data_performance_form.value ?? {}
        )
      }
    }

    if (validation) {
      tabActiveIdx.value++
      tabActive.value = tabs.value[tabActiveIdx.value].name
    }
  }

  const backTab = () => {
    tabActiveIdx.value--
    tabActive.value = tabs.value[tabActiveIdx.value].name
  }

  const onSubmit = async () => {
    let validation = false

    if (tabActive.value == 'performance') {
      if (
        data_performance_form.value == null ||
        isBaseData(data_performance_form.value)
      ) {
        await _setDataPerformanceBankingAccount(null)
        validation = true
      } else {
        validation = await _isValidPerformanceForm(
          data_performance_form.value ?? {}
        )
      }
    }

    if (tabActive.value == 'restatement') {
      validation = await _isValidRestatementForm(
        data_restatement_form.value ?? {}
      )
    }

    if (validation) {
      const payload = makeDataRequest()
      if (await _createBankingAccounts(payload)) {
        router.push({ name: 'BankingAccountsList' })
      }
    }
  }

  const isBaseData = (input: IBankAccountPerformance): boolean => {
    const baseData: IBankAccountPerformance = {
      accounting_account_code: '',
      accounting_account_id: 0,
      accounting_account_name: '',
      cost_center_code: '',
      cost_center_description: '',
      cost_center_id: 0,
      movement_codes_code: '',
      movement_codes_description: '',
      movement_codes_id: '',
      rate_type: 'E.A - Efectivo anual',
      rates: [],
      treasury_movement_code: '',
      treasury_movement_description: '',
      treasury_movement_id: 0,
      type_thirdparty: 0,
      validate_balance: 0,
    }

    return deepEqual(input, baseData)
  }

  const deepEqual = (
    a: IBankAccountPerformance,
    b: IBankAccountPerformance
  ): boolean => {
    if (a === b) return true

    if (
      typeof a !== 'object' ||
      typeof b !== 'object' ||
      a == null ||
      b == null
    ) {
      return false
    }

    const keysA = Object.keys(a)
    const keysB = Object.keys(b)

    if (keysA.length !== keysB.length) return false

    for (const key of keysA) {
      if (!keysB.includes(key)) return false

      const valA = a[key as keyof IBankAccountPerformance]
      const valB = b[key as keyof IBankAccountPerformance]

      if (Array.isArray(valA) && Array.isArray(valB)) {
        if (valA.length !== valB.length) return false
        for (let i = 0; i < valA.length; i++) {
          if (valA[i] !== valB[i]) return false
        }
      } else if (valA !== valB) {
        return false
      }
    }

    return true
  }

  const makeDataRequest = () => {
    return {
      data_basic: data_information_form.value,
      performance: data_performance_form.value,
      restatement: data_restatement_form.value,
    }
  }

  const handlerGoTo = (goURL: string) => {
    router.push({ name: goURL })
  }

  return {
    headerProperties,
    tabs,
    tabActive,
    tabActiveIdx,
    formInformation,
    formPerformance,
    formRestatement,
    data_information_form,

    nextTab,
    backTab,
    onSubmit,
    handlerGoTo,
  }
}

export default useBankingAccountsCreate
