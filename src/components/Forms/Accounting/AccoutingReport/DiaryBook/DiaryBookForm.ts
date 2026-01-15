// core
import { ref, watch, computed } from 'vue'

// stores
import { storeToRefs } from 'pinia'
import {
  useAccountingResourceStore,
  useOpeningRecordStore,
  useResourceManagerStore,
  useAccoutingReportStore,
} from '@/stores'

// interfaces y constantes
import {
  IDiaryBookModel,
  IOpeningRecordModel,
  IReceiptTypeOption,
  ReportTypes,
} from '@/interfaces/customs'
import { ActionType } from '@/interfaces/global'

// utils
import { defaultIconsLucide, fullName } from '@/utils'
import { useUtils, useMainLoader } from '@/composables'

const useDiaryBookForm = (
  props: {
    action: ActionType
    data?: IOpeningRecordModel
  },
  emits: Function
) => {
  const diaryBook = useAccoutingReportStore(
    'v1',
    'diaryBook'
  ) as ReportTypes['diaryBook']

  const {
    business_trusts_basic,
    structure_by_business,
    business_trust,
    amount_types,
    accounts_by_structure,
    template,
    business_trust_receipt_types,
    business_trust_account,
  } = storeToRefs(useAccountingResourceStore('v1'))

  const { opening_bussines_list } = storeToRefs(useOpeningRecordStore('v1'))

  const { _getResources, _resetKeys } = useResourceManagerStore('v1')

  const openingReportForm = ref()
  const isEdit = computed(() => props.action === 'edit')
  const selectedBusiness = ref()
  const showTable = ref(false)
  const { openMainLoader } = useMainLoader()

  const defaultPeriod = computed(() => {
    if (selectedBusiness.value?.account?.current_period) {
      return useUtils().formatDate(
        selectedBusiness.value.account.current_period,
        'YYYY-MM'
      )
    }
    return useUtils().formatDate(new Date().toISOString(), 'YYYY-MM')
  })

  const models = ref<IDiaryBookModel>({
    report_template_id: '',
    from_receipt_types_id: '',
    to_receipt_types_id: '',
    business_id: 0,
    account_structure_id: 0,
    from_period: '',
    to_period: '',
  })

  if (props.action === 'edit' && props.data) {
    models.value = { ...models.value, ...props.data }
  }

  const pagination = ref({
    page: 1,
    rowsPerPage: 5,
  })

  const validate = async () => {
    const result = await openingReportForm.value?.validate?.()
    return result
  }

  const setFormData = () => {
    if (!props.data) return
  }

  const getFormData = () => {
    const data = JSON.parse(JSON.stringify(models.value))

    return data
  }

  watch(
    () => models.value.business_id,
    async (newBusinessId) => {
      if (models.value.account_structure_id) {
        models.value.account_structure_id = ''
      }
      _resetKeys({
        accounting: ['structure_by_business'],
      })
      if (!newBusinessId) return

      const list = (
        business_trust.value && business_trust.value.length > 0
          ? business_trust.value
          : business_trusts_basic.value || []
      ) as Array<{
        id?: number | string
        value?: number | string
        business_code?: string
        code?: string
        label?: string
      }>

      const selected = list.find(
        (item) => String(item?.id ?? item?.value) === String(newBusinessId)
      )

      let code: string = selected?.business_code ?? selected?.code ?? ''

      if (!code && typeof selected?.label === 'string') {
        code = selected.label.split(' - ')[0]?.trim() || ''
      }

      if (!code) {
        models.value.from_receipt_types_id = ''
        models.value.to_receipt_types_id = ''
        return
      }

      const params = new URLSearchParams()
      params.set('filter[search]', code)

      await Promise.all([
        _getResources(
          { accounting: ['business_trust_without_permissions'] },
          params.toString(),
          'v2'
        ),
        _getResources({ accounting: ['template'] }, '', 'v2'),
      ])

      models.value.from_receipt_types_id = ''
      models.value.to_receipt_types_id = ''

      _getResources(
        {
          accounting: ['structure_by_business'],
        },
        `filter[business_id]=${newBusinessId}`
      )
    }
  )

  watch(
    () => [
      models.value.business_id,
      models.value.from_period,
      models.value.to_period,
      models.value.account_structure_id,
    ],
    async ([businessId, fromPeriod, toPeriod, accountStructureId]) => {
      const hasBiz = Number(businessId) > 0
      const fromOk =
        typeof fromPeriod === 'string' && fromPeriod.trim().length > 0
      const toOk = typeof toPeriod === 'string' && toPeriod.trim().length > 0

      if (!hasBiz || !fromOk || !toOk) return

      const params = new URLSearchParams()

      params.set('filter[business_trust_id]', String(businessId))

      params.set('filter[from_period]', fromPeriod)
      params.set('filter[to_period]', toPeriod)
      params.set('filter[accounting_structure_id]', String(accountStructureId))

      await _getResources(
        { accounting: ['business_trust_receipt_types'] },
        params.toString(),
        'v2'
      )
    }
  )

  const onChangeFromReceipt = (
    val: IReceiptTypeOption | number | string | null
  ) => {
    if (val && typeof val === 'object') {
      const code = val.label?.split(' - ')[0]?.trim() || ''
      models.value.from_receipt_types_id = code
    } else {
      models.value.from_receipt_types_id = String(val ?? '')
    }
  }

  const onChangeToReceipt = (
    val: IReceiptTypeOption | number | string | null
  ) => {
    if (val && typeof val === 'object') {
      const code = val.label?.split(' - ')[0]?.trim() || ''
      models.value.to_receipt_types_id = code
    } else {
      models.value.to_receipt_types_id = String(val ?? '')
    }
  }

  watch(
    () => props.data,
    () => setFormData()
  )

  watch(models, () => emits('update'), { deep: true })

  const handleContinue = async () => {
    openMainLoader(true)
    const filters = {
      report_template_id: models.value.report_template_id,
      'filter[business_trust_id]': models.value.business_id,
      'filter[from_receipt_types_code]': models.value.from_receipt_types_id,
      'filter[to_receipt_types_code]': models.value.to_receipt_types_id,
      'filter[from_period]': models.value.from_period,
      'filter[to_period]': models.value.to_period,
      'filter[account_structures_id]': models.value.account_structure_id,
    }

    const result = await diaryBook._getDiaryBookBalance(filters)
    openMainLoader(false)
    if (result) {
      emits('enable-preview-tab', filters)
    }
  }

  const isFormValid = computed(() => {
    const m = models.value
    return (
      !!m.business_id &&
      !!m.from_period &&
      !!m.to_period &&
      !!m.account_structure_id &&
      !!m.report_template_id &&
      !!m.from_receipt_types_id &&
      !!m.to_receipt_types_id
    )
  })

  return {
    openingReportForm,
    models,
    isEdit,
    pagination,
    defaultIconsLucide,
    defaultPeriod,
    business_trusts_basic,
    business_trust_receipt_types,
    template,
    business_trust_account,
    amount_types,
    accounts_by_structure,
    fullName,
    selectedBusiness,
    isFormValid,
    opening_bussines_list,
    showTable,
    validate,
    handleContinue,
    getFormData,
    structure_by_business,
    onChangeFromReceipt,
    onChangeToReceipt,
  }
}

export default useDiaryBookForm
