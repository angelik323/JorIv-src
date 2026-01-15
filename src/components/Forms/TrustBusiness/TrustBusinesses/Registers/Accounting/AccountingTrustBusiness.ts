import { storeToRefs } from 'pinia'
import { onMounted, ref, watch, computed } from 'vue'

//Interfaces
import {
  IBusinessAccounting,
  IBusinessAccountingV2,
  IBusinessAccountingStructures,
} from '@/interfaces/customs'
import { ActionType, TrustBusinessStatusID } from '@/interfaces/global'

// Stores
import {
  useResourceStore,
  useTrustBusinessResourceStore,
  useTrustBusinessStore,
} from '@/stores'
import { useUtils } from '@/composables'

import { default_yes_no } from '@/constants/resources'

const useAccountingTrustBusiness = (
  props: {
    data: IBusinessAccountingV2 | null
    action: ActionType
  },
  emit: Function
) => {
  const { countries, departments, cities, fiscal_responsability } = storeToRefs(
    useResourceStore('v1')
  )

  const {
    business_currency,
    cost_centers_structures,
    account_structures,
    status_accounting_trust_business,
    business_trust_third_parties,
    nit_agents,
  } = storeToRefs(useTrustBusinessResourceStore('v1'))

  const { data_information_form } = storeToRefs(useTrustBusinessStore('v1'))

  const emptyModelsArray = ref([
    {
      accounting_structure: 'Estandar',
      type: 'Principal',
      startup_period: '',
      current_period: '',
      last_closing: '',
      daily_closing: false,
      last_closing_day: '',
      last_closing_daily: '',
      account_structure_id: undefined,
    },
    {
      accounting_structure: 'Estandar',
      type: 'Equivalente',
      startup_period: '',
      current_period: '',
      last_closing: '',
      daily_closing: false,
      last_closing_day: '',
      last_closing_daily: '',
      account_structure_id: undefined,
    },
    {
      accounting_structure: 'Estandar',
      type: 'Fiscal',
      startup_period: '',
      current_period: '',
      last_closing: '',
      daily_closing: false,
      last_closing_day: '',
      last_closing_daily: '',
      account_structure_id: undefined,
    },
  ])

  const models = ref<IBusinessAccounting>({
    address: null,
    country_id: null,
    department_id: null,
    city_id: null,
    auxiliary_nit: null,
    identification_tax: null,
    accounting_structure_id: null,
    has_cost_center: null,
    cost_center_structure_id: null,
    functional_business_currency: null,
    has_consolidator: null,
    can_foreign_currency: null,
    has_fiscal_responsibility: null,
    has_responsibility_iva: null,
    can_retains_ica: null,
    retains_differential_ica: null,
    startup_period: null,
    current_period: null,
    last_closing: null,
    last_closing_daily: null,
    last_closing_day: null,
    daily_closing: null,
    last_restatement_foreign_currency: null,
    status_id: null,
    retaining_agent_id: null,
    department: null,
    city: null,
    country: null,
    cost_center_structure: null,
    retaining_agent: null,
    retaining_agent_view: null,
    nit_auxiliary: null,
    nit_auxiliary_view: null,
    tax_identification: null,
    tax_identification_view: null,
    has_tax_structure: null,
    has_equivalent_structure: null,
    business_account_structures: emptyModelsArray.value,
  })

  const is_colombia = computed(() => models.value.country_id === 41)
  const can_foreign_currency = computed(
    () => models.value.can_foreign_currency === true
  )
  const responsable_vat = computed(
    () => models.value.has_fiscal_responsibility === 'No responsable'
  )

  const accounting_trust_business_form_ref = ref()

  const _setValueModel = () => {
    if (props.data) {
      models.value = {
        ...props.data,
        city: props.data.city?.name ?? null,
        cost_center_structure: props.data.cost_center_structure?.purpose,
        business_account_structures: props.data.business_account_structures
          .length
          ? props.data.business_account_structures.map(
              (item: IBusinessAccountingStructures) => ({
                ...item,
                daily_closing: item.daily_closing === true ? true : false,
              })
            )
          : emptyModelsArray.value,
      }
    }
  }

  const setFormView = () => {
    const data = { ...props.data }
    if (props.data) {
      models.value = {
        ...props.data,
        country: data.contry?.name,
        department: data.departament?.name ?? '',
        city: data.city?.name ?? '',
        retaining_agent_id: data.retaining_agent?.id ?? null,
        status_id: data.status?.id ?? null,
        cost_center_structure: data.cost_center_structure?.purpose,
        // @TODO: Esto es temporal hasta validar que no rompa nada
        accounting_structure_id: data.accounting_structure?.id ?? null,
        has_cost_center: data.has_cost_center ?? false,
        retaining_agent_view: `${data.retaining_agent?.abbreviation}.${data.retaining_agent?.document_number} - ${data.retaining_agent?.name}`,
        nit_auxiliary_view: `${data.nit_auxiliary?.abbreviation}.${data.nit_auxiliary?.document_number} - ${data.nit_auxiliary?.name}`,
        tax_identification_view: `${data.tax_identification?.abbreviation}.${data.tax_identification?.document_number} - ${data.tax_identification?.name}`,
        business_account_structures: props.data.business_account_structures
          ? props.data.business_account_structures.map(
              (item: IBusinessAccountingStructures) => ({
                ...item,
                daily_closing: item.daily_closing === true ? true : false,
              })
            )
          : emptyModelsArray.value,
      }
    }
  }

  const handlerActionForm = (action: 'create' | 'edit' | 'view') => {
    const actionHandlers: Record<typeof action, () => void> = {
      create: _setValueModel,
      edit: _setValueModel,
      view: setFormView,
    }
    actionHandlers[action]?.()
  }

  const setFiscalStructure = () => {
    // Estructura fiscal
    if (models.value.business_account_structures.length > 2) {
      if (models.value.business_account_structures[2]?.startup_period) {
        const date = new Date(
          `${models.value.business_account_structures[2].startup_period}-01T00:00:00`
        )
        const year = date.getFullYear()
        const month = date.getMonth()
        const adjustedDate = new Date(year, month, 0)

        if (models.value.business_account_structures[2].startup_period) {
          models.value.business_account_structures[2].startup_period =
            useUtils().formatDate(
              models.value.business_account_structures[2].startup_period,
              'YYYY-MM'
            )
        }
        if (
          ['edit'].includes(props.action) &&
          data_information_form.value?.status_id ===
            TrustBusinessStatusID.PREOPERATIONAL
        ) {
          models.value.business_account_structures[2].current_period =
            models.value.business_account_structures[2].startup_period

          models.value.business_account_structures[2].last_closing_day =
            adjustedDate ? useUtils().lastDateOfMonth(adjustedDate) : ''
          models.value.business_account_structures[2].last_closing =
            adjustedDate
              ? useUtils().formatDate(adjustedDate.toISOString(), 'YYYY-MM')
              : ''
        }
        if (props.action === 'create') {
          models.value.business_account_structures[2].last_closing_day =
            useUtils().lastDateOfMonth(adjustedDate)
          models.value.business_account_structures[2].current_period =
            models.value.business_account_structures[2].startup_period
          models.value.business_account_structures[2].last_closing =
            adjustedDate
              ? useUtils().formatDate(adjustedDate.toISOString(), 'YYYY-MM')
              : ''
        }
      } else {
        models.value.business_account_structures[2].last_closing = null
        models.value.business_account_structures[2].last_closing_day = null
        models.value.business_account_structures[2].current_period = null
      }
      if (models.value.business_account_structures[2]?.daily_closing) {
        if (
          ['edit'].includes(props.action) &&
          models.value.business_account_structures[2].daily_closing &&
          data_information_form.value?.status_id ===
            TrustBusinessStatusID.PREOPERATIONAL
        ) {
          models.value.business_account_structures[2].last_closing_daily =
            models.value.business_account_structures[2].daily_closing
              ? models.value.business_account_structures[2].last_closing_day
              : ''
        }
      } else {
        models.value.business_account_structures[2].last_closing_daily = ''
      }
    }
  }

  const setEquivalentStructure = () => {
    // Estructura equivalente
    if (models.value.business_account_structures.length > 1) {
      if (models.value.business_account_structures[1]?.daily_closing) {
        if (
          ['edit'].includes(props.action) &&
          models.value.business_account_structures[1].daily_closing &&
          data_information_form.value?.status_id ===
            TrustBusinessStatusID.PREOPERATIONAL
        ) {
          models.value.business_account_structures[1].last_closing_daily =
            models.value.business_account_structures[1].daily_closing
              ? models.value.business_account_structures[1].last_closing_day
              : ''
        }
      } else {
        models.value.business_account_structures[1].last_closing_daily = ''
      }

      if (models.value.business_account_structures[1]?.startup_period) {
        const date = new Date(
          `${models.value.business_account_structures[1].startup_period}-01T00:00:00`
        )
        const year = date.getFullYear()
        const month = date.getMonth()
        const adjustedDate = new Date(year, month, 0)

        models.value.business_account_structures[1].startup_period =
          useUtils().formatDate(
            models.value.business_account_structures[1].startup_period,
            'YYYY-MM'
          )
        if (
          ['edit'].includes(props.action) &&
          data_information_form.value?.status_id ===
            TrustBusinessStatusID.PREOPERATIONAL
        ) {
          models.value.business_account_structures[1].current_period =
            models.value.business_account_structures[1].startup_period
          models.value.business_account_structures[1].last_closing_day =
            useUtils().lastDateOfMonth(adjustedDate)
          models.value.business_account_structures[1].last_closing =
            adjustedDate
              ? useUtils().formatDate(adjustedDate.toISOString(), 'YYYY-MM')
              : ''
        }
        if (props.action === 'create') {
          models.value.business_account_structures[1].last_closing_day =
            useUtils().lastDateOfMonth(adjustedDate)
          models.value.business_account_structures[1].current_period =
            models.value.business_account_structures[1].startup_period
          models.value.business_account_structures[1].last_closing =
            adjustedDate
              ? useUtils().formatDate(adjustedDate.toISOString(), 'YYYY-MM')
              : ''
        }
      } else {
        models.value.business_account_structures[1].last_closing = null
        models.value.business_account_structures[1].last_closing_day = null
        models.value.business_account_structures[1].current_period = null
      }
    }
  }

  watch(
    () => models.value.country_id,
    (val) => {
      if (val !== 41) {
        models.value.department_id = undefined
        models.value.city_id = undefined
      }
    }
  )

  watch(
    () => models.value.department_id,
    async (val) => {
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
    async (val: boolean | null | undefined) => {
      if (!val) models.value.cost_center_structure_id = null
    }
  )

  watch(
    () => models.value,
    () => {
      if (useUtils().isEmptyObject(models.value)) {
        emit('update:models', null)
      } else {
        emit('update:models', models.value)
      }
    },
    {
      deep: true,
    }
  )

  watch(
    () => models.value.can_foreign_currency,
    (val) => {
      if (!val) {
        models.value.last_restatement_foreign_currency = ''
      }
    }
  )

  watch(
    () => models.value.startup_period,
    (val) => {
      if (!val) {
        models.value.daily_closing = null
        models.value.daily_closing = null
      }
    }
  )

  watch(
    () => models.value.daily_closing,
    (val) => {
      if (!val) {
        models.value.last_closing_daily = ''
      } else if (
        ['edit'].includes(props.action) &&
        val &&
        data_information_form.value?.status_id ===
          TrustBusinessStatusID.PREOPERATIONAL
      ) {
        models.value.last_closing_daily = models.value.daily_closing
          ? models.value.last_closing_day
          : ''
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

  watch(
    () => models.value.startup_period,
    (val) => {
      if (val) {
        const date = new Date(`${val}-01T00:00:00`)
        const year = date.getFullYear()
        const month = date.getMonth()
        const adjustedDate = new Date(year, month, 0)

        models.value.startup_period = useUtils().formatDate(val, 'YYYY-MM')
        models.value.business_account_structures[0].startup_period =
          useUtils().formatDate(val, 'YYYY-MM')
        if (
          ['edit'].includes(props.action) &&
          data_information_form.value?.status_id ===
            TrustBusinessStatusID.PREOPERATIONAL
        ) {
          models.value.current_period = val
          models.value.business_account_structures[0].current_period = val

          models.value.last_closing_day =
            useUtils().lastDateOfMonth(adjustedDate)
          models.value.business_account_structures[0].last_closing_day =
            useUtils().lastDateOfMonth(adjustedDate)

          models.value.last_closing = adjustedDate
            ? useUtils().formatDate(adjustedDate.toISOString(), 'YYYY-MM')
            : ''
          models.value.business_account_structures[0].last_closing =
            adjustedDate
              ? useUtils().formatDate(adjustedDate.toISOString(), 'YYYY-MM')
              : ''
        }
        if (props.action === 'create') {
          models.value.last_closing_day =
            useUtils().lastDateOfMonth(adjustedDate)
          models.value.business_account_structures[0].last_closing_day =
            useUtils().lastDateOfMonth(adjustedDate)

          models.value.current_period = val
          models.value.business_account_structures[0].current_period = val

          models.value.last_closing = adjustedDate
            ? useUtils().formatDate(adjustedDate.toISOString(), 'YYYY-MM')
            : ''
          models.value.business_account_structures[0].last_closing =
            adjustedDate
              ? useUtils().formatDate(adjustedDate.toISOString(), 'YYYY-MM')
              : ''
        }
      } else {
        models.value.last_closing = null
        models.value.last_closing_day = null
        models.value.current_period = null

        models.value.business_account_structures[0].last_closing = null
        models.value.business_account_structures[0].last_closing_day = null
        models.value.business_account_structures[0].current_period = null
      }
    }
  )

  watch(
    () => models.value.business_account_structures,
    () => {
      setFiscalStructure()
      setEquivalentStructure()
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

  onMounted(() => {
    handlerActionForm(props.action)
  })

  return {
    models,
    countries,
    departments,
    cities,
    fiscal_responsability,
    default_yes_no,
    business_currency,
    cost_centers_structures,
    account_structures,
    status_accounting_trust_business,
    accounting_trust_business_form_ref,
    business_trust_third_parties,
    nit_agents,
    is_colombia,
    can_foreign_currency,
    responsable_vat,
    data_information_form,
    TrustBusinessStatusID,
    // Methods
  }
}

export default useAccountingTrustBusiness
