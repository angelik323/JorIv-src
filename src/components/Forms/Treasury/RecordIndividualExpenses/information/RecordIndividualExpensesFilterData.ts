// vue-router-quasar-pinia
import { computed, onBeforeMount, onMounted, ref, watch } from 'vue'
import router from '@/router'
import { storeToRefs } from 'pinia'
// composables
import { useMainLoader } from '@/composables'
// stores
import {
  useFicResourceStore,
  useRecordIndividualExpensesStore,
  useResourceManagerStore,
  useTreasuryResourceStore,
} from '@/stores'
// utils
import { isEmptyOrZero } from '@/utils'

const useRecordIndividualExpensesBasicData = (props: { data?: boolean }) => {
  const { openMainLoader } = useMainLoader()
  const {
    data_information_form,
    data_list,
    effective_date_filter,
    resetFormFilter,
  } = storeToRefs(useRecordIndividualExpensesStore('v1'))

  const { _setSelectedMovementHasCostCenter } =
    useRecordIndividualExpensesStore('v1')

  const { treasury_movement_code_expense, business_trusts_egreso } =
    storeToRefs(useTreasuryResourceStore('v1'))

  const { offices_fics } = storeToRefs(useFicResourceStore('v1'))

  const { _getResources } = useResourceManagerStore('v1')

  const keys = {
    treasury: [
      'business_trusts_egreso',
      'payments',
      'banks',
      'third_parties',
      'banks_third_party',
      'document_type',
    ],
    fics: ['offices'],
  }

  const { _setDataBasicRecodIndividualExpenses } =
    useRecordIndividualExpensesStore('v1')
  const formInformation = ref()

  const is_creating = computed(() => data_list.value.length > 0)

  const models = ref<{
    office_id: number | null
    name_office: string | null
    business_id: number | null
    name_business: string | null
    date: string | null
    movement_id: number | null
    voucher: string | null
    sub_voucher: string | null
  }>({
    office_id: null,
    name_office: '',
    business_id: null,
    name_business: '',
    date: new Date().toISOString().split('T')[0],
    movement_id: null,
    voucher: '',
    sub_voucher: '',
  })

  const selectVoucher = computed(() => {
    const selectedMovement = treasury_movement_code_expense.value.find(
      (item) => item.id === models.value.movement_id
    )
    return `${selectedMovement?.receipt_types?.code ?? ''} - ${
      selectedMovement?.receipt_types?.name ?? ''
    }`
  })

  const selectSubVoucher = computed(() => {
    const selectedMovement = treasury_movement_code_expense.value.find(
      (item) => item.id === models.value.movement_id
    )
    return `${selectedMovement?.sub_receipt_types?.code ?? ''} - ${
      selectedMovement?.sub_receipt_types?.name ?? ''
    }`
  })

  const isDateAllowed = (dateStr: string): boolean => {
    const today = new Date()
    const date = new Date(dateStr)

    if (date > new Date(today.toDateString())) return false

    const day = date.getDay()
    if (day === 0 || day === 6) return false

    return true
  }

  const _setValueModel = () => {
    if (!data_information_form.value) return
    Object.assign(models.value, {
      office_id: data_information_form.value.office_id ?? null,
      name_office: data_information_form.value.name_office ?? '',
      business_id: data_information_form.value.business_id ?? null,
      name_business: data_information_form.value.name_business ?? '',
      date: data_information_form.value.date ?? '',
      movement_id: Number(data_information_form.value.movement_id) || 0,
      voucher: data_information_form.value.voucher ?? '',
      sub_voucher: data_information_form.value.sub_voucher ?? '',
    })
  }

  const validateForm = async () => {
    return (await formInformation.value?.validate()) ?? false
  }

  const selectOfficeName = (office_id: number) => {
    const selectedOffice = offices_fics.value.find(
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
    models.value.business_id = business_trust_id
  }

  const onSubmit = async () => {
    if (formInformation.value) {
      const isValid = await validateForm()
      if (isValid) {
        router.push({
          name: 'RecordIndividualExpensesCreate',
        })
      }
    }
  }

  watch(
    () => models.value,
    () => {
      if (isEmptyOrZero(models.value)) {
        _setDataBasicRecodIndividualExpenses(null)
      } else {
        _setDataBasicRecodIndividualExpenses({
          ...models.value,
          office_id: models.value.office_id,
          name_office: models.value.name_office,
          business_id: models.value.business_id,
          name_business: models.value.name_business,
          movement_id: Number(models.value.movement_id) || 0,
          voucher: selectVoucher.value,
          sub_voucher: selectSubVoucher.value,
          date: models.value.date,
        })
        effective_date_filter.value = models.value.date
      }
    },
    { deep: true }
  )

  watch(
    () => data_information_form.value,
    (newValue) => {
      if (!newValue) {
        Object.assign(models.value, {
          office_id: null,
          name_office: '',
          business_id: null,
          name_business: '',
          movement_id: null,
          voucher: '',
          sub_voucher: '',
          date: '',
        })
        _setDataBasicRecodIndividualExpenses(null)
      }
    }
  )

  watch(
    () => models.value.movement_id,
    (newValue) => {
      if (newValue) {
        const selected_movement = treasury_movement_code_expense.value.find(
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

  onBeforeMount(async () => {
    openMainLoader(true)
    _setValueModel()
    openMainLoader(false)
  })

  onMounted(async () => {
    await _getResources(keys)
  })

  watch(
    () => props.data,
    (newValue) => {
      if (newValue) {
        resetFormFilter.value = false
        formInformation.value?.reset?.()
      }
    }
  )

  watch(
    () => models.value.business_id,
    async (newValue) => {
      if (newValue) {
        const keys_business_id = {
          treasury: [
            'bank_account_cost_centers',
            'movement_egreso',
            'treasury_movement_code_expense',
          ],
        }
        const key = {
          treasury: ['banks_record_expenses', 'cash_flow_structure_egreso'],
        }
        const query = `business_trust_id=${newValue}`
        await _getResources(key, query)
        const query_business_id_ = `business_id=${newValue}`
        await _getResources(keys_business_id, query_business_id_)
      }
    }
  )

  return {
    models,
    offices_fics,
    formInformation,
    selectVoucher,
    selectSubVoucher,
    treasury_movement_code_expense,
    data_information_form,
    business_trusts_egreso,
    is_creating,
    isDateAllowed,
    onSubmit,
    selectOfficeName,
    selectBusinessName,
  }
}

export default useRecordIndividualExpensesBasicData
