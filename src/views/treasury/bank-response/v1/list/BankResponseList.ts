import { ref, watch, onBeforeUnmount, onBeforeMount } from 'vue'
import { storeToRefs } from 'pinia'

import {
  IBankResponseDetailRejectForm,
  IBankResponsePayment,
} from '@/interfaces/customs'
import { ISelectorResources } from '@/interfaces/customs/Filters'

import { useMainLoader, useUtils, useRules } from '@/composables'

import {
  useBankResponseStore,
  useResourceManagerStore,
  useTreasuryResourceStore,
} from '@/stores'

const useBankResponseList = () => {
  const { openMainLoader } = useMainLoader()
  const { isEmptyOrZero, isDateAllowed, getHolidaysByYear } = useUtils()

  const { _getResources, _resetKeys } = useResourceManagerStore('v1')

  const {
    bank_response_payment_list,
    bank_response_assign_form,
    bank_response_filter_form,
    bank_response_payment_selected,
    bank_response_reject_response,
    has_rejected_records,
    bank_response_filter_form_response,
  } = storeToRefs(useBankResponseStore('v1'))

  const { reasons_bank_return } = storeToRefs(useTreasuryResourceStore('v1'))
  const {
    _errorsBankResponseDetailReject,
    _processBankResponseDetailReject,
    _setBankResponseDetailRejectForm,
    _clearBankResponse,
  } = useBankResponseStore('v1')

  const keyBanks = {
    treasury: ['banks'],
  }

  const keysResponseBankFileTypes = {
    treasury: ['response_bank_file_types'],
  }

  const keysReasonsForBankReturn = {
    treasury: ['reasonsForBankReturn'],
  }

  const keysToClear = {
    treasury: [
      'banks',
      'banks_label_code',
      'response_bank_file_types',
      'response_bank_formats',
      'response_bank_dispersion_groups',
      'reasonsForBankReturn',
    ],
  }

  const filterFormRef = ref()
  const detailRejectFormElementRef = ref()
  const paymentListRef = ref()
  const processTypeSelected = ref<string>('Archivo')
  const holidays = ref<string[]>([])

  const models = ref<IBankResponseDetailRejectForm>({
    date: null,
    bank_structure_id: null,
    observations: null,
    ids: {},
  })

  const headerProperties = ref({
    title: 'Respuestas de banco',
    breadcrumbs: [
      {
        label: 'Inicio',
        route: 'HomeView',
      },
      {
        label: 'Tesorería',
      },
      {
        label: 'Respuestas de banco',
        route: 'BankResponseList',
      },
    ],
  })

  const handlerHolidays = async ({ year }: { year: number }) => {
    holidays.value = getHolidaysByYear(year)
  }

  const validateForm = async () => {
    const isValid = await detailRejectFormElementRef.value?.validate()
    return isValid
  }

  const makeDataRequest = (): IBankResponseDetailRejectForm => {
    const ids: {
      [key: string]: { code: string | null; status_id: number | null }
    } = {}

    const isFileProcess =
      bank_response_filter_form.value?.file_type === 'Archivo'

    bank_response_payment_selected.value.forEach(
      (item: IBankResponsePayment) => {
        let code: string | null = null
        let status_id: number | null = null

        if (isFileProcess) {
          code =
            typeof item.cancellation_code === 'object'
              ? item.cancellation_code?.cancellation_code ?? null
              : typeof item.cancellation_code === 'string'
              ? item.cancellation_code !== 'null'
                ? item.cancellation_code
                : null
              : null

          status_id = item.bank_response_status?.id ?? null
        } else {
          const reason = reasons_bank_return.value.find(
            (itemReason: ISelectorResources) =>
              itemReason.id === bank_response_assign_form.value?.reason_id
          )

          code = reason?.causal_code ?? null
          status_id = bank_response_assign_form.value?.status ?? null
        }

        ids[item.id.toString()] = { code, status_id }
      }
    )

    return {
      date: models.value.date ?? null,
      bank_structure_id:
        bank_response_filter_form.value?.bank_structure_id ?? null,
      observations: bank_response_assign_form.value?.observations ?? null,
      ids,
    }
  }

  const onSubmitErrors = async () => {
    if (!(await validateForm())) return
    openMainLoader(true)

    try {
      const payload = bank_response_reject_response.value?.errors ?? []
      await _errorsBankResponseDetailReject(payload)
    } finally {
      openMainLoader(false)
    }
  }

  const onSubmitProcess = async () => {
    if (!(await validateForm())) return
    openMainLoader(true)

    try {
      const payload = makeDataRequest()
      await _processBankResponseDetailReject(payload)
    } finally {
      openMainLoader(false)
    }
  }

  const onSearch = () => {
    paymentListRef.value?.onSearchPaymentList()
  }

  onBeforeMount(async () => {
    _clearBankResponse()
    openMainLoader(true)
    await _getResources(keyBanks, `filter[has_bank_account]=true`, 'v2')
    await _getResources(keysResponseBankFileTypes, '', 'v2')
    await _getResources(keysReasonsForBankReturn)
    handlerHolidays({ year: new Date().getFullYear() })
    openMainLoader(false)
  })

  onBeforeUnmount(() => {
    _clearBankResponse()
    _resetKeys(keysToClear)
  })

  watch(
    () => models.value,
    () => {
      if (isEmptyOrZero(models.value)) {
        _setBankResponseDetailRejectForm(null)
      } else {
        _setBankResponseDetailRejectForm({ ...models.value })
      }
    },
    { deep: true }
  )

  watch(
    () => has_rejected_records.value,
    (hasRejected) => {
      if (!hasRejected) {
        models.value.date = null
      } else {
        models.value.date =
          bank_response_filter_form_response.value?.date ?? null
      }
    }
  )

  return {
    bank_response_payment_list,
    models,
    filterFormRef,
    detailRejectFormElementRef,
    paymentListRef,
    headerProperties,
    processTypeSelected,
    bank_response_assign_form,
    holidays,
    has_rejected_records,

    onSubmitErrors,
    onSubmitProcess,
    onSearch,
    useRules,
    isDateAllowed,
    handlerHolidays,
  }
}

export default useBankResponseList
