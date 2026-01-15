import { onMounted, ref, watch, onBeforeUnmount } from 'vue'
import { storeToRefs } from 'pinia'
import { isEmptyOrZero } from '@/utils'
import { IReceiptTypeResource, IUpdateVouchersForm } from '@/interfaces/customs'
import {
  useValidationVouchersStore,
  useAccountingResourceStore,
} from '@/stores'

const useValidateVouchersForm = () => {
  const { _setUpdateVouchersForm } = useValidationVouchersStore('v1')
  const {
    validate_vouchers_form,
    update_vouchers_form,
    validate_vouchers_response,
  } = storeToRefs(useValidationVouchersStore('v1'))

  const { receipt_types } = storeToRefs(useAccountingResourceStore('v1'))

  const formUpdateElementRef = ref()
  const sub_receipt_types = ref<Array<{ value: number; label: string }>>([])

  const initialModelsValuesToEdit: IUpdateVouchersForm = {
    period_date: '',
    structure: '',
    structure_name: '',
    from_business_trust_id: '',
    from_business_trust_name: '',
    to_business_trust_id: '',
    to_business_trust_name: '',
    from_update: true,
    daily_closing: false,
    update: 'Mes',
    day_to_update: '',
    needs_voucher: false,
    status: '',
    receipt_type_id: null,
    sub_receipt_type_id: null,
    businesses: [],
  }

  const models = ref<IUpdateVouchersForm>({
    ...initialModelsValuesToEdit,
  })

  const setFormData = () => {
    Object.assign(models.value, validate_vouchers_form.value ?? {})

    models.value.status = models.value.needs_voucher
      ? 'Actualizados'
      : 'Actualización sin comprobantes de cierre'

    models.value.receipt_type_id =
      update_vouchers_form.value?.receipt_type_id ?? null
    models.value.sub_receipt_type_id =
      update_vouchers_form.value?.sub_receipt_type_id ?? null
    models.value.businesses = validate_vouchers_response.value ?? []
  }

  const updateSubReceiptTypes = (receiptTypeId: number | null) => {
    if (!receiptTypeId) {
      sub_receipt_types.value = []
      models.value.sub_receipt_type_id = null
      return
    }

    const selectedReceiptType = receipt_types.value.find(
      (item: IReceiptTypeResource) => item.id === receiptTypeId
    )

    models.value.sub_receipt_type_id = null
    sub_receipt_types.value =
      selectedReceiptType?.related?.map(
        (item: { value: string | number; label: string }) => ({
          value: Number(item.value),
          label: item.label,
        })
      ) ?? []
  }

  onMounted(async () => {
    await setFormData()
  })

  onBeforeUnmount(async () => {
    _setUpdateVouchersForm(null)
  })

  watch(
    () => models.value,
    () => {
      if (isEmptyOrZero(models.value)) {
        _setUpdateVouchersForm(null)
      } else {
        _setUpdateVouchersForm({ ...models.value })
      }
    },
    { deep: true }
  )

  watch(
    () => models.value.receipt_type_id,
    () => updateSubReceiptTypes(models.value.receipt_type_id ?? null),
    {
      immediate: true,
    }
  )

  return {
    models,
    formUpdateElementRef,
    receipt_types,
    sub_receipt_types,
    setFormData,
  }
}

export default useValidateVouchersForm
