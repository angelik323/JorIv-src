import {
  IAccountingConsolidation,
  IAccountingConsolidationDetail,
  IConsolidatedBusiness,
  IConsolidationTreeAccountingStructure,
} from '@/interfaces/customs'
import { useAccountingConsolidationStore } from '@/stores'
import { isEmptyOrZero } from '@/utils'
import { storeToRefs } from 'pinia'
import { onMounted, ref, watch } from 'vue'

export const useInformationForm = (props: {
  action: 'create' | 'view'
  data?: IAccountingConsolidationDetail | null
}) => {
  const { data_accounting_business, data_accounting_consolidation_view } =
    storeToRefs(useAccountingConsolidationStore('v1'))

  const {
    _getBussinesAccounting,
    _getAccountingBussinessById,
    _setDataSearch,
    _setAccountingBussinessRequest,
  } = useAccountingConsolidationStore('v1')

  const menuBusiness = ref()

  const models = ref({
    id: null as string | number | null,
    code_identificator_bussines: null as string | string[] | null,
    business_name: '' as string | null,
    business_code: '' as string | null,
    current_period: '' as string | null,
    last_verified: '' as string | null,
    generates_daily_closure: false,
    is_consolidator: false as boolean | string | null,
    status: '' as string | null,
    business_trust_id: 0 as number | null,
    last_consolidation_date: '' as string | null,
    consolidation_type: '' as string | null,
    last_consolidation: '' as string | null,
    execution_date: '' as string | null,
    accounting_period: '' as string | null,
    date: '' as string | null,
    accounting_structure: null as IConsolidationTreeAccountingStructure | null,
    consolidated_businesses: [] as IConsolidatedBusiness[],
  })
  onMounted(async () => {
    await _getBussinesAccounting()
    menuBusiness.value = data_accounting_business.value.map(
      (item: IAccountingConsolidation) => {
        const parent = item.parent as
          | { business_code?: string; id?: number }
          | undefined
        if (parent && typeof parent.business_code === 'string') {
          return {
            label: parent.business_code,
            value: parent.business_code,
          }
        }
        return { label: '', value: '' }
      }
    )
  })

  const handlerActionForm = (action: 'create' | 'view') => {
    const actionHandlers: Record<typeof action, () => void> = {
      create: _setValueModel,
      view: _setFormView,
    }
    actionHandlers[action]?.()
  }
  onMounted(() => {
    handlerActionForm(props.action)
  })
  const _setValueModel = () => {
    if (data_accounting_consolidation_view.value) {
      models.value.business_trust_id =
        data_accounting_consolidation_view.value.business_trust_id ?? 0
      models.value.business_name =
        data_accounting_consolidation_view.value.business_name ?? ''
      models.value.current_period =
        data_accounting_consolidation_view.value.current_period ?? ''
      models.value.last_consolidation_date =
        data_accounting_consolidation_view.value.last_consolidation_date ?? ''
      models.value.consolidation_type =
        data_accounting_consolidation_view.value.consolidation_type ?? ''
      models.value.execution_date =
        data_accounting_consolidation_view.value.execution_date ?? ''
      models.value.accounting_period =
        data_accounting_consolidation_view.value.accounting_period ?? ''
      models.value.last_verified =
        data_accounting_consolidation_view.value.last_verified ?? ''
      models.value.is_consolidator =
        data_accounting_consolidation_view.value.is_consolidator ?? false
    }
  }
  const clearForm = () => {
    models.value.business_trust_id = 0
    models.value.business_name = ''
    models.value.current_period = ''
    models.value.last_consolidation_date = ''
    models.value.consolidation_type = ''
    models.value.execution_date = ''
    models.value.accounting_period = ''
    models.value.last_verified = ''
    models.value.is_consolidator = false
    models.value.date = ''
  }

  const _setFormView = () => {
    clearForm()
    const data = props.data
    if (data) {
      models.value.id = data.id ?? null
      models.value.business_trust_id = data.business_trust_id ?? 0
      models.value.business_code = data.business_code ?? ''
      models.value.business_name = data.business_name ?? ''
      models.value.current_period = data.current_period ?? ''
      models.value.last_consolidation_date = data.last_consolidation_date ?? ''
      models.value.consolidation_type = data.consolidation_type ?? ''
      models.value.accounting_period = data.accounting_period ?? ''
      models.value.execution_date = data.execution_date ?? ''
      models.value.accounting_structure = data.accounting_structure ?? null
      models.value.consolidated_businesses = data.consolidated_businesses ?? []
      models.value.is_consolidator = data.is_consolidator ?? false
    }
  }
  watch(
    () => props.data,
    () => {
      if (props.action === 'view') {
        _setFormView()
      }
    },
    { immediate: true, deep: true }
  )

  watch(
    () => models.value.code_identificator_bussines,
    async (newValue) => {
      let id: string | number | null = null
      if (Array.isArray(newValue)) {
        id = newValue.length > 0 ? newValue[0] : null
      } else {
        id = newValue
      }
      if (id) {
        await _getAccountingBussinessById(id)

        const found = data_accounting_business.value.find(
          (item: IAccountingConsolidation) => {
            if (typeof item.parent === 'object' && item.parent !== null) {
              const parent = item.parent as IAccountingConsolidationDetail
              return parent.business_code === id || parent.id === id
            }
            return false
          }
        )
        if (
          found &&
          typeof found.parent === 'object' &&
          found.parent !== null
        ) {
          const parent = found.parent as IAccountingConsolidationDetail
          if (parent.id !== undefined && parent.id !== null) {
            _setDataSearch(parent.id)
            models.value.id = parent.id
          }
          models.value.business_name = parent.name ?? ''
          models.value.business_code = parent.business_code ?? ''
          models.value.current_period = parent.current_period ?? ''
          models.value.last_consolidation_date =
            parent.last_consolidation_date ?? ''
          models.value.last_verified = parent.last_consolidation ?? ''
          models.value.consolidation_type = parent.consolidation_type ?? ''
          models.value.accounting_period = parent.accounting_period ?? ''
          models.value.execution_date = parent.execution_date ?? ''
          models.value.is_consolidator = parent.is_consolidator
            ? parent.is_consolidator
            : false
          models.value.accounting_structure =
            parent.accounting_structure ?? null
          models.value.consolidated_businesses =
            parent.consolidated_businesses ?? []
        }
      } else {
        models.value.id = null
        models.value.business_name = ''
        models.value.business_code = ''
        models.value.current_period = ''
        models.value.last_verified = ''
        models.value.last_consolidation_date = ''
        models.value.consolidation_type = ''
        models.value.accounting_period = ''
        models.value.execution_date = ''
        models.value.generates_daily_closure = false
        models.value.is_consolidator = ''
        models.value.status = ''
        _setAccountingBussinessRequest(null)
      }
    }
  )

  watch(
    () => models.value,
    () => {
      if (props.action !== 'create') return
      if (isEmptyOrZero(models.value)) {
        return
      }

      _setAccountingBussinessRequest({
        id: models.value.id ?? null,
        business_name: models.value.business_name ?? '',
        current_period: models.value.current_period ?? '',
        last_verified: models.value.last_verified,
        generates_daily_closure: models.value.generates_daily_closure,
        is_consolidator: models.value.is_consolidator,
        status: models.value.status ? 'active' : 'inactive',
        business_code: models.value.business_code,
        code_identificator_bussines: models.value.code_identificator_bussines,
        business_trust_id: 0,
        last_consolidation_date: null,
        consolidation_type: '',
        accounting_period: '',
        execution_date: '',
        consolidated_businesses: [],
      })
    },
    { deep: true }
  )

  return {
    menuBusiness,
    models,
    data_accounting_consolidation_view,
  }
}
