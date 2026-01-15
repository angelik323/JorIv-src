// vue
import { computed, ref, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { useRouter } from 'vue-router'

// stores
import { useFinancialObligationStore, useResourceStore } from '@/stores'

// composables
import { useAlert, useGoToUrl, useMainLoader } from '@/composables'

// interfaces
import {
  IAlertConfigAdd,
  ICreateFinancialObligation,
  IInfoBasicForm,
  ISelectorAddTypes,
  IUpdateFinancialObligation,
} from '@/interfaces/customs'
import { IResource } from '@/interfaces/global'

const useFinancialObligationForm = (props: { action: ISelectorAddTypes }) => {
  const {
    addSelectorValue,
    infoBasicForm,
    financialObligationLastModification,
    paymentFrequencyOptions,
  } = storeToRefs(useFinancialObligationStore())

  const {
    _createFinancialObligation,
    _updateFinancialObligation,
    _updateCreditType,
  } = useFinancialObligationStore()

  const {
    banks_initial_balance,
    business_trusts,
    credit_types,
    periodicity_types,
  } = storeToRefs(useResourceStore('v1'))

  const { _getResourcesFinancialObligations } = useResourceStore('v1')

  const alertDisableField = ref<boolean>(false)

  const basicFormFinancialObligation = ref<IInfoBasicForm>({
    businessTrustId: null,
    businessTrustCode: null,
    businessTrustName: null,
    bankName: null,
    creditType: null,
    paymentPeriod: null,
    paymentValue: null,
    paymentTerm: null,
    paymentNumber: null,
    interestRate: null,
    accountHolder: null,
    nitNumber: null,
    payDay: null,
    warningDays: null,
  })

  const { getUrlId } = useGoToUrl()

  const { openMainLoader } = useMainLoader()

  const router = useRouter()

  const { showAlert } = useAlert()

  const alertModalRef = ref()

  const keys = ['credit_types', 'periodicity_types']

  const alertModalConfig = ref<IAlertConfigAdd>({
    title: '',
    description: '',
    btnLabel: '',
    selectorLabel: '',
    type: 'default',
    loader: false,
    isDisabledConfirm: true,
  })

  const customPaymentPeriod = ref<{ label: string; value: string } | undefined>(
    undefined
  )

  const getDisabledFieldsEdit = computed(() => props.action === 'edit')

  const getDisableField = computed(() => alertDisableField.value)

  const getFirstBusinessOption = computed(() => {
    if (business_trusts.value.length > 0) {
      return {
        name: business_trusts.value[0].label,
        id: business_trusts.value[0].value,
        code: business_trusts.value[0].code,
      }
    }
  })

  const getBankListOptions = computed(() => banks_initial_balance.value)
  const getCreditTypeOptions = computed(() => [
    ...credit_types.value,
    { label: 'OTRO', value: 0 },
  ])

  const getPaymentFrequencyOptions = computed(() => {
    if (customPaymentPeriod.value) {
      return [
        ...periodicity_types.value,
        customPaymentPeriod.value,
        { label: 'OTRO', value: 'OTRO' },
      ]
    } else {
      return [...periodicity_types.value, { label: 'OTRO', value: 'OTRO' }]
    }
  })

  const closeModalInput = async () => {
    await alertModalRef.value.closeModal()
  }

  const openAlertModal = async (infoModal: IAlertConfigAdd) => {
    alertModalConfig.value.title = infoModal.title
    alertModalConfig.value.description = infoModal.description
    alertModalConfig.value.btnLabel = 'Crear'
    alertModalConfig.value.loader = false
    alertModalConfig.value.type = infoModal.type
    alertModalConfig.value.selectorLabel = infoModal.selectorLabel
    alertModalConfig.value.isDisabledConfirm = infoModal.isDisabledConfirm
    await alertModalRef.value.openModal()
  }

  const updateFinancialObligation = async (
    info: IUpdateFinancialObligation
  ) => {
    openMainLoader(true)
    if (await _updateFinancialObligation(info)) {
      router.push({ name: 'FinancialObligationList' })
    }
    openMainLoader(false)
  }

  const createFinancialObligation = async (
    info: ICreateFinancialObligation
  ) => {
    if (await _createFinancialObligation(info)) {
      router.push({ name: 'FinancialObligationList' })
    }
    openMainLoader(false)
  }

  const mapFinancialObligationFormToCreate = (
    form: IInfoBasicForm
  ): ICreateFinancialObligation => {
    return {
      obligation_number: String(form.paymentNumber),
      bank_id: Number(form.bankName),
      business_trust_id: Number(form.businessTrustId),
      credit_type_id: Number(form.creditType),
      periodicity_type: String(form.paymentPeriod),
      amount: Number(form.paymentValue),
      quotas: Number(form.paymentTerm),
      interest_rate: String(form.interestRate),
      titular_name: String(form.accountHolder),
      titular_nit: Number(form.nitNumber),
      payment_day: Number(form.payDay),
      alert_days: Number(form.warningDays),
    }
  }

  const mapFinancialObligationFormToUpdate = (
    form: IInfoBasicForm,
    id: number,
    date_updated_obligation?: string
  ): IUpdateFinancialObligation => {
    return {
      id,
      amount: Number(form.paymentValue),
      quotas: Number(form.paymentTerm),
      credit_type_id: Number(form.creditType),
      interest_rate: String(form.interestRate),
      periodicity_type: String(form.paymentPeriod),
      payment_day: Number(form.payDay),
      alert_days: Number(form.warningDays),
      date_updated_obligation,
    }
  }

  const handlerSubmit = async () => {
    openMainLoader(true)
    if (
      props.action === 'create' &&
      !!basicFormFinancialObligation.value.businessTrustId === true
    ) {
      const info = mapFinancialObligationFormToCreate(
        basicFormFinancialObligation.value
      )
      await createFinancialObligation(info)
    } else {
      const info = mapFinancialObligationFormToUpdate(
        basicFormFinancialObligation.value,
        Number(getUrlId.value),
        !!financialObligationLastModification.value === true
          ? financialObligationLastModification.value
          : undefined
      )
      await updateFinancialObligation(info)
    }
  }

  const handlerUpdatePaymentPeriod = async (newValue: string) => {
    const addCustomPaymentPeriod = {
      label: newValue,
      value: newValue,
    }
    customPaymentPeriod.value = addCustomPaymentPeriod
    await alertModalRef.value.closeModal()
    addSelectorValue.value = undefined
    alertModalConfig.value.loader = false
    alertDisableField.value = false
    basicFormFinancialObligation.value.paymentPeriod =
      addCustomPaymentPeriod.value
  }

  const handlerUpdateCreditType = async (newValue: string) => {
    let status = false
    if (await _updateCreditType(newValue)) {
      basicFormFinancialObligation.value.creditType = null
      addSelectorValue.value = undefined
      status = true
      alertDisableField.value = false
    }

    if (status) {
      await _getResourcesFinancialObligations(`keys[]=${keys.join('&keys[]=')}`)
      const setCurrentValue = credit_types.value.find(
        (item) => item.label === newValue
      )
      basicFormFinancialObligation.value.creditType = setCurrentValue
        ? Number(setCurrentValue.value)
        : null
      await alertModalRef.value.closeModal()
      alertModalConfig.value.loader = false
    } else {
      alertModalConfig.value.title = 'Advertencia'
      alertModalConfig.value.description =
        'Vas a agregar un nuevo tipo de crédito'
      alertModalConfig.value.loader = false
      alertModalConfig.value.type = 'credit-type'
      alertModalConfig.value.selectorLabel = 'Tipo de crédito'
      alertDisableField.value = false
    }
  }

  const validateAddNewExistLabel = (
    newVal: string,
    checkInOptions: IResource[]
  ): boolean => {
    const validation = checkInOptions.some(
      (item) => item.label.toLowerCase() === newVal.toLowerCase()
    )
    return validation
  }

  const handlerUpdateSelector = (
    info: IAlertConfigAdd,
    newValue: string | undefined,
    creditOptions: IResource[],
    periodicyOptions: IResource[]
  ) => {
    if (!newValue) return
    addSelectorValue.value = undefined
    alertModalConfig.value.loader = true
    alertModalConfig.value.description = 'Espere un momento...'
    alertDisableField.value = true

    const checkValidationCredit: boolean = validateAddNewExistLabel(
      newValue,
      creditOptions
    )
    const checkValidationPeriodicy: boolean = validateAddNewExistLabel(
      newValue,
      periodicyOptions
    )

    if (info.type === 'credit-type' && !checkValidationCredit) {
      handlerUpdateCreditType(newValue)
      return
    }
    if (info.type === 'payment-period' && !checkValidationPeriodicy) {
      handlerUpdatePaymentPeriod(newValue)
      return
    }

    showAlert(`El campo "${newValue}" ya tiene un registro similar`, 'error')
    alertModalConfig.value.description = 'Intenta otro nombre'
    addSelectorValue.value = undefined
    alertDisableField.value = false
  }

  watch(
    () => basicFormFinancialObligation.value.creditType,
    (newVal) => {
      if (newVal === 0) {
        openAlertModal({
          title: 'Advertencia',
          description: 'Vas a agregar un nuevo tipo de crédito',
          btnLabel: 'Crear',
          selectorLabel: 'Tipo de crédito*',
          type: 'credit-type',
          loader: false,
          isDisabledConfirm: true,
        })
      }
    }
  )

  watch(
    () => basicFormFinancialObligation.value.paymentPeriod,
    (newVal) => {
      addSelectorValue.value = undefined

      if (newVal === 'OTRO') {
        openAlertModal({
          title: 'Advertencia',
          description: 'Vas a agregar una nueva periodicidad de pago',
          btnLabel: 'Crear',
          selectorLabel: 'Periodicidad del pago*',
          type: 'payment-period',
          loader: false,
          isDisabledConfirm: true,
        })
      }
    }
  )

  watch(getFirstBusinessOption, (newVal, oldVal) => {
    if (newVal && newVal !== oldVal) {
      basicFormFinancialObligation.value.businessTrustName = newVal.name
      basicFormFinancialObligation.value.businessTrustId = newVal.id
        ? Number(newVal.id)
        : null
      basicFormFinancialObligation.value.businessTrustCode = newVal.code
        ? String(newVal.code)
        : null
    } else if (newVal === oldVal) {
      showAlert('El valor de busqueda no ha cambiado', 'success')
    }
  })

  watch(
    () => infoBasicForm.value,
    () => {
      if (props.action === 'edit' && infoBasicForm.value) {
        basicFormFinancialObligation.value = {
          ...infoBasicForm.value,
        }

        customPaymentPeriod.value = paymentFrequencyOptions.value
          ? {
              label: paymentFrequencyOptions.value[0].label,
              value: paymentFrequencyOptions.value[0].value,
            }
          : undefined
      }
    }
  )

  return {
    basicFormFinancialObligation,
    financialObligationLastModification,
    getDisabledFieldsEdit,
    alertModalConfig,
    alertModalRef,
    addSelectorValue,
    getBankListOptions,
    getCreditTypeOptions,
    getPaymentFrequencyOptions,
    handlerSubmit,
    closeModalInput,
    handlerUpdateSelector,
    getDisableField,
  }
}

export default useFinancialObligationForm
