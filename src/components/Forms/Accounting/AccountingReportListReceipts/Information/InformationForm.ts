// vue | quasar | router
import { onBeforeMount, onUnmounted, ref, watch } from 'vue'

// store
import { storeToRefs } from 'pinia'
import {
  useAccountingResourceStore,
  useAccoutingReportStore,
  useLogin,
  useResourceManagerStore,
} from '@/stores'

// utils
import { isEmptyOrZero } from '@/utils'
import { ActionType } from '@/interfaces/global'
import {
  IAccountingReportListReceiptsForm,
  ReportTypes,
} from '@/interfaces/customs'

const useInformationForm = (props: {
  action: ActionType
  data?: IAccountingReportListReceiptsForm | null
}) => {
  const listReceipts = useAccoutingReportStore(
    'v1',
    'listReceipts'
  ) as ReportTypes['listReceipts']

  const { _setDataInformationForm } = listReceipts
  const { data_information_form } = storeToRefs(listReceipts)

  const {
    structure_by_business,
    voucher_consecutives_codes,
    voucher_consecutives_ids,
    template,
    business_trusts_with_description,
    business_trust_receipt_types,
  } = storeToRefs(useAccountingResourceStore('v1'))

  const { _getResources } = useResourceManagerStore('v1')

  const { loggedUser } = storeToRefs(useLogin())
  const formElementRef = ref()

  const initialModelsValues: IAccountingReportListReceiptsForm = {
    id: null,
    business_trust_id: null,
    accounting_structure_id: null,
    from_period: '',
    to_period: '',
    from_receipt_types_id: null,
    to_receipt_types_id: null,
    from_consecutive: null,
    to_consecutive: null,
    from_account: null,
    to_account: null,
    report_template_id: null,
    user: `${loggedUser.value?.user.name} ${loggedUser.value?.user.last_name}`,
  }

  const models = ref<IAccountingReportListReceiptsForm>({
    ...initialModelsValues,
  })

  const handlerActionForm = (action: ActionType) => {
    const actionHandlers: Record<typeof action, () => void> = {
      create: _setValueModel,
      edit: data_information_form.value ? _setValueModel : setFormEdit,
      view: _setFormView,
    }
    actionHandlers[action]?.()
  }

  const setFormData = (data: IAccountingReportListReceiptsForm) => {
    models.value.business_trust_id = data.business_trust_id ?? null
    models.value.accounting_structure_id = data.accounting_structure_id ?? null
    models.value.from_period = data.from_period ?? ''
    models.value.to_period = data.to_period ?? ''
    models.value.from_receipt_types_id = data.from_receipt_types_id ?? null
    models.value.to_receipt_types_id = data.to_receipt_types_id ?? null
    models.value.from_consecutive = data.from_consecutive ?? null
    models.value.to_consecutive = data.to_consecutive ?? null
    models.value.from_account = data.from_account ?? null
    models.value.to_account = data.to_account ?? null
    models.value.report_template_id = data.report_template_id ?? null
  }
  const setFormEdit = async () => {
    clearForm()
    if (props.data) setFormData(props.data)
  }

  const _setFormView = async () => {
    if (!data_information_form.value) return

    Object.assign(models.value, data_information_form.value)
  }

  const _setValueModel = () => {
    if (!data_information_form.value) return

    Object.assign(models.value, data_information_form.value)
  }

  const clearForm = () => {
    Object.assign(models.value, initialModelsValues)
  }

  onUnmounted(async () => {
    _setDataInformationForm(null)
  })
  onBeforeMount(() => {
    handlerActionForm(props.action)
  })

  watch(
    () => data_information_form.value,
    (val) => {
      if (val) {
        handlerActionForm(props.action)
      }
    },
    { deep: true }
  )

  watch(
    () => models.value,
    () => {
      if (props.action === 'view') return
      if (isEmptyOrZero(models.value)) {
        _setDataInformationForm(null)
      } else {
        _setDataInformationForm({ ...models.value })
      }
    },
    { deep: true }
  )

  watch(
    () => [
      models.value.business_trust_id,
      models.value.from_period,
      models.value.to_period,
    ],
    async ([businessId, fromPeriod, toPeriod]) => {
      const hasBiz = Number(businessId) > 0
      const fromOk =
        typeof fromPeriod === 'string' && fromPeriod.trim().length > 0
      const toOk = typeof toPeriod === 'string' && toPeriod.trim().length > 0

      if (!hasBiz || !fromOk || !toOk) return

      const params = new URLSearchParams()

      params.set('filter[business_trust_id]', String(businessId))

      params.set('filter[from_period]', fromPeriod)
      params.set('filter[to_period]', toPeriod)

      await _getResources(
        { accounting: ['business_trust_receipt_types'] },
        params.toString(),
        'v2'
      )
    }
  )

  watch(
    () => models.value.business_trust_id,
    async (newBusinessId) => {
      if (!newBusinessId) return

      const filters = `filter[business_id]=${newBusinessId}`

      await _getResources({ accounting: ['structure_by_business'] }, filters)

      _getResources(
        {
          accounting: [
            'voucher_consecutives_by_business_trust_and_receipt_type',
          ],
        },
        `filter[business_trust_id]=${newBusinessId}`,
        'v2'
      )
    }
  )

  return {
    models,
    formElementRef,
    structure_by_business,
    voucher_consecutives_codes,
    voucher_consecutives_ids,
    template,
    business_trusts_with_description,
    business_trust_receipt_types,
  }
}

export default useInformationForm
