import { onMounted, ref, watch } from 'vue'
import { storeToRefs } from 'pinia'
import moment from 'moment'
import { isEmptyOrZero } from '@/utils'
import { IRecordIndividualIncomeFilterForm } from '@/interfaces/customs'
import {
  useRecordIndividualIncomeStore,
  useTreasuryResourceStore,
  useFicResourceStore,
  useResourceManagerStore,
} from '@/stores'

const useRecordIndividualIncomeFilterForm = (props: {
  createdListData?: boolean
}) => {
  const { data_filter_form } = storeToRefs(useRecordIndividualIncomeStore('v1'))
  const {
    _setDataFilterForm,
    _setBusinessSelected,
    _setDataDetailForm,
    _setSelectedMovementHasCostCenter,
  } = useRecordIndividualIncomeStore('v1')

  const { business_trusts_egreso, movement_egreso } = storeToRefs(
    useTreasuryResourceStore('v1')
  )

  const { _getResources } = useResourceManagerStore('v1')

  const { offices } = storeToRefs(useFicResourceStore('v1'))

  const filterFormElementRef = ref()

  const initialModelsValues: IRecordIndividualIncomeFilterForm = {
    office_id: null,
    name_office: '',
    business_trust_id: null,
    name_business: '',
    date: '',
    movement_id: null,
    voucher: '',
    sub_voucher: '',
    income_record_id: null,
  }

  const models = ref<IRecordIndividualIncomeFilterForm>({
    ...initialModelsValues,
  })

  const setValueModelCreate = () => {
    if (data_filter_form.value) {
      Object.assign(models.value, data_filter_form.value)
    }
  }

  const selectOfficeName = (office_id: number) => {
    const selectedOffice = offices.value.find(
      (office) => office.id === office_id
    )
    models.value.name_office = selectedOffice?.office_description ?? ''
    models.value.office_id = office_id
  }

  const selectBusinessName = (business_trust_id: number) => {
    const selectedBusiness = business_trusts_egreso.value.find(
      (business) => business.value === business_trust_id
    )

    models.value.name_business = selectedBusiness?.name ?? ''
    models.value.business_trust_id = business_trust_id

    if (!selectedBusiness) {
      _setBusinessSelected(null)
      return
    }

    _getResources(
      { treasury: ['business_bank_accounts'] },
      `business_id=${selectedBusiness.id}`,
      'v2'
    )

    _setBusinessSelected(selectedBusiness)
  }

  const selectVouchers = (movement_id: number) => {
    const selectedMovement = movement_egreso.value.find(
      (movement) => movement.id === movement_id
    )
    models.value.movement_id = movement_id

    const formatVoucher = (
      type: { code?: string | number; name?: string } | undefined
    ) => {
      if (!type) return ''
      const code = type.code?.toString() || ''
      const name = type.name || ''
      return code && name ? `${code} - ${name}` : ''
    }

    models.value.voucher = selectedMovement?.receipt_types
      ? formatVoucher({
          code: selectedMovement.receipt_types.code,
          name: selectedMovement.receipt_types.name,
        })
      : ''

    models.value.sub_voucher = selectedMovement?.sub_receipt_types
      ? formatVoucher({
          code: selectedMovement.sub_receipt_types.code,
          name: selectedMovement.sub_receipt_types.name,
        })
      : ''
  }

  const isDateBeforeTodayAndNotWeekend = (date: string): boolean => {
    if (!date) return false

    const selectedDate = moment(date, 'YYYY-MM-DD')
    const today = moment().startOf('day')
    const dayOfWeek = selectedDate.day()

    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6
    const isFuture = selectedDate.isAfter(today)

    return !(isWeekend || isFuture)
  }

  const resetForm = async () => {
    if (!props.createdListData) {
      models.value = { ...initialModelsValues }
      await _setDataDetailForm(null)
      await _setBusinessSelected(null)
      filterFormElementRef.value?.resetValidation()
    }
  }

  watch(
    () => models.value.movement_id,
    (newValue) => {
      if (newValue) {
        const selected_movement = movement_egreso.value.find(
          (move) => move.id === newValue
        )
        if (selected_movement && selected_movement.accounting_blocks) {
          if (selected_movement.accounting_blocks.length > 0) {
            _setSelectedMovementHasCostCenter(
              selected_movement.accounting_blocks[0].account_chart
                ?.has_cost_center ?? false
            )
            return
          }
        }
        _setSelectedMovementHasCostCenter(false)
      }
    }
  )

  watch(
    () => models.value.business_trust_id,
    (newValue) => {
      if (newValue) {
        const key = {
          treasury: ['movement_egreso'],
        }
        const query = `business_id=${newValue}&nature=ingreso`
        _getResources(key, query)
      }
    }
  )

  onMounted(async () => {
    await setValueModelCreate()
  })

  watch(
    () => data_filter_form.value,
    (val) => {
      if (val) {
        setValueModelCreate()
      }
    },
    { deep: true }
  )

  watch(
    () => models.value,
    () => {
      if (isEmptyOrZero(models.value)) {
        _setDataFilterForm(null)
      } else {
        _setDataFilterForm({ ...models.value })
      }
    },
    { deep: true }
  )

  return {
    models,
    filterFormElementRef,
    offices,
    movement_egreso,
    business_trusts_egreso,
    selectOfficeName,
    selectBusinessName,
    selectVouchers,
    isDateBeforeTodayAndNotWeekend,
    resetForm,
  }
}

export default useRecordIndividualIncomeFilterForm
