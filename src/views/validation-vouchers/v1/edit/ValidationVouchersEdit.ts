import { ref, onMounted, onBeforeUnmount } from 'vue'
import { storeToRefs } from 'pinia'
import { useRouter } from 'vue-router'
import { ITabs, IResource } from '@/interfaces/global'
import { useMainLoader } from '@/composables'
import { defaultIconsLucide } from '@/utils'
import {
  useValidationVouchersStore,
  useAccountingResourceStore,
  useResourceManagerStore,
} from '@/stores'
import {
  IValidateVouchersForm,
  IUpdateVouchersForm,
} from '@/interfaces/customs'

const useValidationVouchersEdit = () => {
  const { _clearData, _validateVouchersUpdate, _updateVouchers } =
    useValidationVouchersStore('v1')
  const {
    validate_vouchers_form,
    validate_vouchers_response,
    update_vouchers_form,
  } = storeToRefs(useValidationVouchersStore('v1'))

  const {
    business_trusts_with_description_by_account_structure,
    account_structures_active_revert_vouchers,
  } = storeToRefs(useAccountingResourceStore('v1'))
  const { _getResources, _resetKeys } = useResourceManagerStore('v1')

  const keys = { accounting: ['account_structures_active', 'receipt_types'] }

  const router = useRouter()
  const { openMainLoader } = useMainLoader()

  const validateVouchersFormRef = ref()
  const updateVouchersFormRef = ref()
  const validateVouchersSuccess = ref(false)

  const headerProps = {
    title: 'Actualización de comprobantes',
    breadcrumbs: [
      {
        label: 'Inicio',
        route: 'HomeView',
      },
      {
        label: 'Contabilidad',
      },
      {
        label: 'Validación de comprobantes',
        route: 'ValidationVoucherList',
      },
      {
        label: 'Actualizar',
        route: 'ValidationVouchersEdit',
      },
    ],
  }

  const tabs = ref<ITabs[]>([
    {
      name: 'information',
      label: 'Datos básicos',
      icon: defaultIconsLucide.bulletList,
      outlined: true,
      disable: true,
      show: true,
      required: false,
    },
  ])

  const tabActive = ref(tabs.value[0].name)
  const tabActiveIdx = ref(
    tabs.value.findIndex((tab) => tab.name === tabActive.value)
  )

  const makeDataValidateRequest = (): IValidateVouchersForm => {
    const form = validate_vouchers_form.value

    return {
      period_date: form?.period_date ?? '',
      structure:
        account_structures_active_revert_vouchers.value.find(
          (structure: IResource) => structure.id === form?.structure
        )?.code ?? '',
      from_business_trust_id:
        business_trusts_with_description_by_account_structure.value.find(
          (business: IResource) => business.id === form?.from_business_trust_id
        )?.business_code ?? '',
      to_business_trust_id:
        business_trusts_with_description_by_account_structure.value.find(
          (business: IResource) => business.id === form?.to_business_trust_id
        )?.business_code ?? '',
      from_update: form?.from_update ?? true,
      daily_closing: form?.daily_closing ?? false,
      update: form?.update ?? '',
      day_to_update: form?.day_to_update ?? '',
      needs_voucher: form?.needs_voucher ?? false,
    }
  }

  const makeDataUpdateRequest = (): IUpdateVouchersForm => {
    const form = update_vouchers_form.value

    return {
      period_date: form?.period_date ?? '',
      structure:
        account_structures_active_revert_vouchers.value.find(
          (structure: IResource) => structure.id === form?.structure
        )?.code ?? '',
      from_business_trust_id: form?.from_business_trust_id ?? '',
      to_business_trust_id: form?.to_business_trust_id ?? '',
      from_update: form?.from_update ?? true,
      daily_closing: form?.daily_closing ?? false,
      update: form?.update ?? '',
      day_to_update: form?.day_to_update ?? '',
      needs_voucher: form?.needs_voucher ?? false,

      receipt_type_id: form?.receipt_type_id,
      sub_receipt_type_id: form?.sub_receipt_type_id,
      status: form?.status,
      businesses: form?.businesses,
    }
  }

  const validateFormValidate = async () => {
    return (await validateVouchersFormRef.value?.validateForm()) ?? false
  }

  const validateFormUpdate = async () => {
    return (await updateVouchersFormRef.value?.validateForm()) ?? false
  }

  const onValidateSubmit = async () => {
    if (!(await validateFormValidate())) return
    openMainLoader(true)

    try {
      const payload = makeDataValidateRequest()
      const success = await _validateVouchersUpdate(payload)
      const response = validate_vouchers_response.value ?? []
      if (success && response?.length > 0) {
        validateVouchersSuccess.value = true
        updateVouchersFormRef.value?.setFormData()
      }
    } finally {
      openMainLoader(false)
    }
  }

  const onUpdateSubmit = async () => {
    if (!(await validateFormUpdate())) return
    openMainLoader(true)

    try {
      const payload = makeDataUpdateRequest()
      const success = await _updateVouchers(payload)
      if (success) {
        router.push({ name: 'ValidationVoucherList' })
      }
    } finally {
      openMainLoader(false)
    }
  }

  onMounted(async () => {
    openMainLoader(true)
    await _getResources(keys)
    openMainLoader(false)
  })

  onBeforeUnmount(() => {
    _clearData()
    _resetKeys(keys)
  })

  return {
    headerProps,
    tabs,
    tabActive,
    tabActiveIdx,
    validateVouchersFormRef,
    updateVouchersFormRef,
    onValidateSubmit,
    onUpdateSubmit,
    validateVouchersSuccess,
  }
}

export default useValidationVouchersEdit
