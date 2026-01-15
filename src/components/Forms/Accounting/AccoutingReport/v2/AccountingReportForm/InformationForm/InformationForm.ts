// Vue - Pinia
import { computed, nextTick, ref, watch } from 'vue'
import { storeToRefs } from 'pinia'

// Interfaces
import { IAccountStructureResource } from '@/interfaces/customs/accounting/AccountStructure'
import { IAccountingReportForm } from '@/interfaces/customs/accounting/v2/AccountingReport'
import { IBusinessTrustResource } from '@/interfaces/customs/resources/BusinessTrust'

// Composables
import { useMainLoader } from '@/components/loader/composable/useMainLoader'
import { useUtils } from '@/composables/useUtils'
import { useRules } from '@/composables/useRules'

// Stores
import { useTrustBusinessResourceStore } from '@/stores/resources-manager/trust-business'
import { useAccountingResourceStore } from '@/stores/resources-manager/accounting'
import { useResourceManagerStore } from '@/stores/resources-manager'

const useInformationForm = (params: {
  nameReport: string
  typeReport: string
  noVisible?: number[]
  defaultBusinessClass?: string
}) => {
  const { is_required, validate_date_order } = useRules()
  const { openMainLoader } = useMainLoader()
  const { defaultIconsLucide } = useUtils()

  const { _getResources } = useResourceManagerStore('v1')
  const {
    amount_types,
    accounts_charts,
    unit_businesses,
    business_classes,
    levels_structure,
    account_structures,
    template_reports: template,
    business_list_without_permissions,
  } = storeToRefs(useAccountingResourceStore('v1'))
  const { business_trust_fideico_types } = storeToRefs(
    useTrustBusinessResourceStore('v1')
  )

  const from_business = ref<IBusinessTrustResource[]>()
  const to_business = ref<IBusinessTrustResource[]>()
  const accounts = ref<IAccountStructureResource[]>()
  const selectedDateType = ref<'date' | 'period'>()
  const accountingAccountFilterRef = ref()
  const informationFormRef = ref()

  const formData = ref<IAccountingReportForm>({
    // Parameters
    name_report: params.nameReport,
    type_report: params.typeReport,
    report_type_id: 11,
    report_template_id: null,
    business_class: null,
    accounting_structure_id: null,
    structure_level: null,
    amount_type: null,

    // Business
    business_unit: null,
    business_type_id: null,
    use_business_range: false,
    from_business_trust_code: null,
    to_business_trust_code: null,

    // Dates
    from_period_date: null,
    to_period_date: null,
    include_close_voucher: false,

    // Accounts
    use_account_range: false,
    from_account_code: null,
    to_account_code: null,

    filter: {
      account_code: null,
      account_code_text: null,
      account_name: null,
      account_name_text: null,
      nature: null,
      type: null,
      group: null,
    },
  })

  const selectOptions = computed(() => ({
    type_business: [
      ...(business_trust_fideico_types.value ?? []),
      { label: '0 - Todos', value: 'Todos' },
    ],

    business_classes: [
      { label: 'Todos', value: 'Todos' },
      ...(business_classes.value ?? []),
    ],

    account_structures: account_structures.value,
    levels_structure: levels_structure.value,
    unit_businesses: unit_businesses.value,
    accounts_charts: accounts_charts.value,
    amount_types: amount_types.value,
    template: template.value,
  }))

  const dateRangeConfig = computed(() => {
    const isPeriod = !isVisibleSelect.value || selectedDateType.value !== 'date'

    return {
      title: isVisibleSelect.value ? 'Fechas o períodos' : 'Períodos',
      from: {
        label: isPeriod ? 'Desde periodo' : 'Desde fecha',
        placeholder: isPeriod ? 'AAAA-MM' : 'AAAA-MM-DD',
        mask: isPeriod ? 'YYYY-MM' : 'YYYY-MM-DD',
        rules: [
          (val: string) =>
            is_required(
              val,
              isPeriod
                ? 'El periodo inicial es requerido'
                : 'La fecha inicial es requerida'
            ),
        ],
      },
      to: {
        label: isPeriod ? 'Hasta periodo' : 'Hasta fecha',
        placeholder: isPeriod ? 'AAAA-MM' : 'AAAA-MM-DD',
        mask: isPeriod ? 'YYYY-MM' : 'YYYY-MM-DD',
        rules: [
          (val: string) =>
            validate_date_order(
              val,
              formData.value.from_period_date ?? '',
              !isPeriod
            ),
          (val: string) =>
            is_required(
              val,
              isPeriod
                ? 'El periodo final es requerido'
                : 'La fecha final es requerida'
            ),
        ],
      },
      isPeriod,
    }
  })

  const unitBusinessValue = computed(() => {
    return (
      formData.value.business_unit === 'Negocios fiduciarios' ||
      formData.value.business_unit === 'Todos'
    )
  })

  const isVisibleSelect = computed(() => params.typeReport === 'Balances')

  const isVisible = (index: number): boolean => {
    return !params.noVisible?.includes(index)
  }

  const getNormalizedValues = () => {
    return {
      ...formData.value,
      business_type_id:
        formData.value.business_type_id === 'Todos'
          ? ''
          : formData.value.business_type_id,
      business_class:
        formData.value.business_class === 'Todos'
          ? ''
          : formData.value.business_class,
    }
  }

  watch(selectedDateType, () => {
    formData.value.from_period_date = null
    formData.value.to_period_date = null
  })

  watch(
    () => formData.value.business_unit,
    () => {
      formData.value.business_type_id = null
    }
  )

  watch(
    () => formData.value.from_period_date,
    (newVal) => {
      if (newVal) formData.value.to_period_date = newVal
    }
  )

  watch(
    () => formData.value.accounting_structure_id,
    async (newVal) => {
      if (newVal) {
        openMainLoader(true)

        await _getResources(
          { accounting: ['levels_structure'] },
          `filter[account_structure_id]=${newVal}`,
          'v2'
        )

        await _getResources(
          { accounting: ['business_list_without_permissions'] },
          `filter[account_structure_id]=${newVal}`,
          'v2'
        )
        from_business.value = business_list_without_permissions.value

        await _getResources(
          { accounting: ['accounts_charts'] },
          `filter[account_structure_id]=${newVal}`
        )

        openMainLoader(false)
      }
    }
  )

  watch(
    () => formData.value.from_business_trust_code,
    async (newVal) => {
      if (newVal) {
        openMainLoader(true)

        await _getResources(
          { accounting: ['business_list_without_permissions'] },
          `filter[account_structure_id]=${formData.value.accounting_structure_id}&filter[from_selected_business_code]=${newVal}`,
          'v2'
        )
        to_business.value = business_list_without_permissions.value

        openMainLoader(false)
      }
    }
  )

  watch(
    () => business_classes.value,
    (newVal) => {
      if (
        !params.defaultBusinessClass ||
        !newVal?.length ||
        formData.value.business_class
      ) {
        return
      }

      const defaultOption = newVal.find(
        (item) => item.value === params.defaultBusinessClass
      )

      if (defaultOption)
        formData.value.business_class = String(defaultOption.value)
    },
    { immediate: true }
  )

  const handleAccountSelection = async (
    $event: { selectedAccount: { code: string } },
    isFromAccount: boolean
  ) => {
    const selectedCode = $event.selectedAccount.code

    if (isFromAccount) {
      // Limpiamos primero para forzar reactividad
      formData.value.from_account_code = null
      await nextTick()
      formData.value.from_account_code = selectedCode
    } else {
      // Limpiamos primero para forzar reactividad
      formData.value.to_account_code = null
      await nextTick()
      formData.value.to_account_code = selectedCode
    }
  }

  return {
    formData,
    accounts,
    isVisible,
    to_business,
    from_business,
    selectOptions,
    dateRangeConfig,
    isVisibleSelect,
    selectedDateType,
    unitBusinessValue,
    defaultIconsLucide,
    informationFormRef,
    getNormalizedValues,
    handleAccountSelection,
    accountingAccountFilterRef,
  }
}

export default useInformationForm
