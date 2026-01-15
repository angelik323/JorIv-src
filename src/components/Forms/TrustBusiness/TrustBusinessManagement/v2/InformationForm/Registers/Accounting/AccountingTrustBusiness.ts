// vue - pinia
import { storeToRefs } from 'pinia'
import { onMounted, ref, watch, computed } from 'vue'

// interfaces
import { IBusinessAccounting } from '@/interfaces/customs/trust-business/v2/TrustBusinessManagement'
import { ActionType, TrustBusinessStatusID } from '@/interfaces/global'

// stores
import { useResourceStore } from '@/stores/resources-selects'
import { useTrustBusinessResourceStore } from '@/stores/resources-manager/trust-business'
import { useInvestmentPortfolioResourceStore } from '@/stores/resources-manager/investment-portfolio'

// composables
import { useUtils } from '@/composables'

// constants
import { default_yes_no } from '@/constants/resources'

const useAccountingTrustBusiness = (
  props: {
    data?: IBusinessAccounting | null
    action: ActionType
  },
  emit: Function
) => {
  // imports
  const { countries, departments, cities } = storeToRefs(useResourceStore('v1'))

  const {
    cost_centers_structures,
    account_structures,
    status_accounting_trust_business,
    business_trust_third_parties,
    nit_agents_v2,
    fiscal_responsibility,
  } = storeToRefs(useTrustBusinessResourceStore('v1'))

  const { coins: business_currency } = storeToRefs(
    useInvestmentPortfolioResourceStore('v1')
  )

  // computed
  const is_view = computed(() => props.action === 'view')

  const models = ref<IBusinessAccounting>({
    address: null,
    country_id: null,
    department_id: null,
    city_id: null,
    auxiliary_nit: null,
    identification_tax: null,
    has_cost_center: null,
    cost_center_structure_id: null,
    functional_currency_id: null,
    has_consolidator: null,
    can_foreign_currency: null,
    has_fiscal_responsibility: null,
    has_responsibility_iva: null,
    can_retains_ica: null,
    retains_differential_ica: null,
    last_restatement_foreign_currency: null,
    status_id: null,
    retaining_agent_id: null,
    retaining_agent: null,
    nit_auxiliary: null,
    tax_identification: null,
    has_tax_structure: null,
    has_equivalent_structure: null,
    principal_account: {
      account_structure_id: undefined,
      type: 'Principal',
      startup_period: null,
      current_period: null,
      last_closing: null,
      last_closing_daily: null,
      last_closing_day: null,
      daily_closing: null,
    },
    equivalent_account: {
      account_structure_id: undefined,
      type: 'Equivalente',
      startup_period: null,
      current_period: null,
      last_closing: null,
      last_closing_daily: null,
      last_closing_day: null,
      daily_closing: null,
    },
    fiscal_account: {
      account_structure_id: undefined,
      type: 'Fiscal',
      startup_period: null,
      current_period: null,
      last_closing: null,
      last_closing_daily: null,
      last_closing_day: null,
      daily_closing: null,
    },
  })

  const is_colombia = computed(
    () =>
      models.value.country_id === 41 || models.value.country_id === 'Colombia'
  )
  const can_foreign_currency = computed(
    () => models.value.can_foreign_currency === true
  )
  const responsable_vat = computed(
    () => models.value.has_fiscal_responsibility === 'No responsable'
  )

  const accounting_trust_business_form_ref = ref()
  const isInitialLoading = ref(true)

  // init
  const _setValueModel = () => {
    if (props.data) {
      models.value = {
        ...props.data,
      }
    }
  }

  const _loadCitiesOnMount = async () => {
    if (models.value.department_id) {
      await useResourceStore('v1').getResources(
        `keys[]=cities&filter[department_id]=${models.value.department_id}`
      )
    }
    isInitialLoading.value = false
  }

  // lifecycles
  onMounted(async () => {
    await _setValueModel()
    await _loadCitiesOnMount()
  })

  // watchs
  watch(
    () => models.value,
    (newVal) => {
      if (useUtils().isEmptyOrZero(newVal)) {
        emit('update:models', null)
      } else {
        emit('update:models', {
          ...newVal,
          principal_account: newVal.principal_account?.account_structure_id
            ? newVal.principal_account
            : null,
          equivalent_account: newVal.equivalent_account?.account_structure_id
            ? newVal.equivalent_account
            : null,
          fiscal_account: newVal.fiscal_account?.account_structure_id
            ? newVal.fiscal_account
            : null,
        })
      }
    },
    { deep: true }
  )

  watch(
    () => models.value.country_id,
    (val) => {
      if (val !== 41) {
        models.value.department_id = null
        models.value.city_id = null
      }
    },
    { deep: true }
  )

  watch(
    () => models.value.department_id,
    async (val) => {
      if (isInitialLoading.value) {
        await useResourceStore('v1').getResources(
          `keys[]=cities&filter[department_id]=${val}`
        )
        return
      }

      models.value.city_id = null

      cities.value = []
      if (!val) return
      await useResourceStore('v1').getResources(
        `keys[]=cities&filter[department_id]=${val}`
      )
    }
  )

  watch(
    () => models.value.has_cost_center,
    async (val) => {
      if (!val) models.value.cost_center_structure_id = null
    }
  )

  watch(
    () => models.value.can_foreign_currency,
    (val) => {
      if (!val) {
        models.value.last_restatement_foreign_currency = null
      }
    }
  )

  watch(
    () => models.value.has_fiscal_responsibility,
    (val) => {
      if (val === 'No responsable') {
        models.value.has_responsibility_iva = null
        models.value.can_retains_ica = null
        models.value.retains_differential_ica = null
      }
    }
  )

  // principal
  watch(
    () => models.value.principal_account?.startup_period,
    (val) => {
      const account = models.value.principal_account
      if (!account) return

      if (!val && account) {
        account.daily_closing = null
      }
    }
  )

  watch(
    () => models.value.principal_account?.daily_closing,
    (val) => {
      const account = models.value.principal_account
      if (!account) return

      if (!val) {
        account.last_closing_daily = ''
      } else if (['create', 'edit'].includes(props.action) && val) {
        account.last_closing_daily = account.daily_closing
          ? account.last_closing_day
          : ''
      }
    }
  )

  watch(
    () => models.value.principal_account?.startup_period,
    (val) => {
      const account = models.value.principal_account
      if (!account) return

      if (val) {
        const date = new Date(`${val}-01T00:00:00`)
        const year = date.getFullYear()
        const month = date.getMonth()
        const adjustedDate = new Date(year, month, 0)

        account.startup_period = useUtils().formatDate(val, 'YYYY-MM')

        if (props.action === 'edit') {
          account.current_period = val
          account.last_closing_day = useUtils().lastDateOfMonth(adjustedDate)
          account.last_closing = adjustedDate
            ? useUtils().formatDate(adjustedDate.toISOString(), 'YYYY-MM')
            : ''
        }

        if (props.action === 'create') {
          account.last_closing_day = useUtils().lastDateOfMonth(adjustedDate)
          account.current_period = val
          account.last_closing = adjustedDate
            ? useUtils().formatDate(adjustedDate.toISOString(), 'YYYY-MM')
            : ''
        }
      } else {
        account.last_closing = null
        account.last_closing_day = null
        account.current_period = null
      }
    }
  )

  // equivalente
  watch(
    () => models.value.has_equivalent_structure,
    (val) => {
      if (val === false) {
        models.value.equivalent_account = {
          account_structure_id: undefined,
          type: 'Equivalente',
          startup_period: null,
          current_period: null,
          last_closing: null,
          last_closing_daily: null,
          last_closing_day: null,
          daily_closing: null,
        }
      }
    }
  )

  watch(
    () => models.value.equivalent_account?.startup_period,
    (val) => {
      const account = models.value.equivalent_account
      if (!account) return

      if (!val && account) {
        account.daily_closing = null
      }
    }
  )

  watch(
    () => models.value.equivalent_account?.daily_closing,
    (val) => {
      const account = models.value.equivalent_account
      if (!account) return

      if (!val) {
        account.last_closing_daily = ''
      } else if (['create', 'edit'].includes(props.action) && val) {
        account.last_closing_daily = account.daily_closing
          ? account.last_closing_day
          : ''
      }
    }
  )

  watch(
    () => models.value.equivalent_account?.startup_period,
    (val) => {
      const account = models.value.equivalent_account
      if (!account) return

      if (val) {
        const date = new Date(`${val}-01T00:00:00`)
        const year = date.getFullYear()
        const month = date.getMonth()
        const adjustedDate = new Date(year, month, 0)

        account.startup_period = useUtils().formatDate(val, 'YYYY-MM')

        if (props.action === 'edit') {
          account.current_period = val
          account.last_closing_day = useUtils().lastDateOfMonth(adjustedDate)
          account.last_closing = adjustedDate
            ? useUtils().formatDate(adjustedDate.toISOString(), 'YYYY-MM')
            : ''
        }

        if (props.action === 'create') {
          account.last_closing_day = useUtils().lastDateOfMonth(adjustedDate)
          account.current_period = val
          account.last_closing = adjustedDate
            ? useUtils().formatDate(adjustedDate.toISOString(), 'YYYY-MM')
            : ''
        }
      } else {
        account.last_closing = null
        account.last_closing_day = null
        account.current_period = null
      }
    }
  )

  // fiscal
  watch(
    () => models.value.has_tax_structure,
    (val) => {
      if (val === false) {
        models.value.fiscal_account = {
          account_structure_id: undefined,
          type: 'Fiscal',
          startup_period: null,
          current_period: null,
          last_closing: null,
          last_closing_daily: null,
          last_closing_day: null,
          daily_closing: null,
        }
      }
    }
  )

  watch(
    () => models.value.fiscal_account?.startup_period,
    (val) => {
      const account = models.value.fiscal_account
      if (!account) return

      if (!val && account) {
        account.daily_closing = null
      }
    }
  )

  watch(
    () => models.value.fiscal_account?.daily_closing,
    (val) => {
      const account = models.value.fiscal_account
      if (!account) return

      if (!val) {
        account.last_closing_daily = ''
      } else if (['create', 'edit'].includes(props.action) && val) {
        account.last_closing_daily = account.daily_closing
          ? account.last_closing_day
          : ''
      }
    }
  )

  watch(
    () => models.value.fiscal_account?.startup_period,
    (val) => {
      const account = models.value.fiscal_account
      if (!account) return

      if (val) {
        const date = new Date(`${val}-01T00:00:00`)
        const year = date.getFullYear()
        const month = date.getMonth()
        const adjustedDate = new Date(year, month, 0)

        account.startup_period = useUtils().formatDate(val, 'YYYY-MM')

        if (props.action === 'edit') {
          account.current_period = val
          account.last_closing_day = useUtils().lastDateOfMonth(adjustedDate)
          account.last_closing = adjustedDate
            ? useUtils().formatDate(adjustedDate.toISOString(), 'YYYY-MM')
            : ''
        }

        if (props.action === 'create') {
          account.last_closing_day = useUtils().lastDateOfMonth(adjustedDate)
          account.current_period = val
          account.last_closing = adjustedDate
            ? useUtils().formatDate(adjustedDate.toISOString(), 'YYYY-MM')
            : ''
        }
      } else {
        account.last_closing = null
        account.last_closing_day = null
        account.current_period = null
      }
    }
  )

  return {
    models,
    countries,
    departments,
    cities,
    fiscal_responsibility,
    default_yes_no,
    business_currency,
    cost_centers_structures,
    account_structures,
    status_accounting_trust_business,
    accounting_trust_business_form_ref,
    business_trust_third_parties,
    nit_agents_v2,
    is_colombia,
    can_foreign_currency,
    responsable_vat,
    TrustBusinessStatusID,
    is_view,
  }
}

export default useAccountingTrustBusiness
