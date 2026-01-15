import { Ref, ref, watch } from 'vue'
import { ICancelledMovementShow } from '@/interfaces/customs'
import { useGoToUrl, useUtils } from '@/composables'

const useTreasuryMovementsCancelled = (
  data: Ref<ICancelledMovementShow | null>
) => {
  const { goToURL } = useGoToUrl()
  const { formatPeriod } = useUtils()
  const initialModelsValues = {
    business_id: '',
    business_code: '',
    business_name: '',
    structure_code: '',
    structure: '',
    office_id: '',
    office_name: '',
    original_period: '',
    original_voucher: '',
    original_voucher_id: '',
    original_voucher_description: '',
    original_subvoucher_id: '',
    original_subvoucher: '',
    original_subvoucher_description: '',
    original_consecutive: '',
    original_register: '',
    original_date: '',
    original_value: '',
    original_status: '',
    annulled_period: '',
    annulled_voucher: '',
    annulled_voucher_id: '',
    annulled_voucher_description: '',
    annulled_subvoucher: '',
    annulled_subvoucher_id: '',
    annulled_subvoucher_description: '',
    annulled_consecutive: '',
    annulled_register: '',
    annulled_date: '',
    annulled_value: '',
    annulled_status: '',
    annulment_reason: '',
  }

  const models = ref({ ...initialModelsValues })

  const setFormData = (payload?: ICancelledMovementShow) => {
    if (!payload) {
      models.value = { ...initialModelsValues }
      return
    }

    models.value = {
      business_id: payload.business.id?.toString() ?? '',
      business_code: payload.business.code ?? '',
      business_name: payload.business.name ?? '',
      structure_code: payload.business.structure_code ?? '',
      structure: payload.business.structure_name ?? '',
      office_id: payload.office?.id?.toString() ?? '',
      office_name: payload.office?.name ?? '',

      original_period: payload.original_movement.period ?? '',
      original_voucher_id:
        payload.original_movement.voucher_id?.toString() ?? '',
      original_voucher: payload.original_movement.voucher_number ?? '',
      original_voucher_description:
        payload.original_movement.voucher_description ?? '',
      original_subvoucher:
        payload.original_movement.sub_voucher_number?.toString() ?? '',
      original_subvoucher_id:
        payload.original_movement.sub_receipt_type_id?.toString() ?? '',
      original_subvoucher_description:
        payload.original_movement.sub_voucher_description ?? '',
      original_consecutive:
        payload.original_movement.consecutive?.toString() ?? '',
      original_register: payload.original_movement.registry?.toString() ?? '',
      original_date: payload.original_movement.date ?? '',
      original_value: payload.original_movement.amount?.formatted ?? '',
      original_status: payload.original_movement.status ?? '',

      annulled_period: payload.cancellation_movement.period ?? '',
      annulled_voucher: payload.cancellation_movement.voucher_number ?? '',
      annulled_voucher_description:
        payload.cancellation_movement.voucher_description ?? '',
      annulled_voucher_id:
        payload.cancellation_movement.voucher_id?.toString() ?? '',
      annulled_subvoucher_id:
        payload.cancellation_movement.sub_receipt_type_id?.toString() ?? '',
      annulled_subvoucher:
        payload.cancellation_movement.sub_voucher_number?.toString() ?? '',
      annulled_subvoucher_description:
        payload.cancellation_movement.sub_voucher_description ?? '',
      annulled_consecutive:
        payload.cancellation_movement.consecutive?.toString() ?? '',
      annulled_register:
        payload.cancellation_movement.registry?.toString() ?? '',
      annulled_date: payload.cancellation_movement.date ?? '',
      annulled_value: payload.cancellation_movement.amount?.formatted ?? '',
      annulled_status: payload.cancellation_movement.status ?? '',
      annulment_reason: payload.cancellation_movement.cancellation_reason ?? '',
    }
  }

  const cancelledTreasuryVaucher = () => {
    goToURL('CheckTreasuryReceiptList', undefined, {
      office_id: models.value.office_id,
      business_id: models.value.business_id,
      annulled_date: models.value.annulled_date,
      annulled_period: formatPeriod(models.value.annulled_period),
      annulled_voucher_id: models.value.annulled_voucher_id,
      annulled_voucher: models.value.annulled_voucher,
      annulled_voucher_description: models.value.annulled_voucher_description,
      annulled_subvoucher_id: models.value.annulled_subvoucher_id,
      annulled_subvoucher: models.value.annulled_subvoucher,
      annulled_consecutive: models.value.annulled_consecutive,
      structure: models.value.structure,
      annulled_status: Number('71'),
    })
  }

  const originalTreasuryVaucher = () => {
    goToURL('CheckTreasuryReceiptList', undefined, {
      office_id: models.value.office_id,
      business_id: models.value.business_id,
      original_voucher_id: models.value.original_voucher_id,
      original_date: models.value.original_date,
      original_period: formatPeriod(models.value.original_period),
      original_voucher: models.value.original_voucher,
      original_voucher_description: models.value.original_voucher_description,
      original_subvoucher: models.value.original_subvoucher,
      original_subvoucher_id: models.value.original_subvoucher_id,
      original_consecutive: models.value.original_consecutive,
      structure: models.value.structure,
      original_status: Number('71'),
    })
  }

  watch(data, (val) => setFormData(val ?? undefined), { immediate: true })

  return {
    models,
    setFormData,
    cancelledTreasuryVaucher,
    originalTreasuryVaucher,
  }
}

export default useTreasuryMovementsCancelled
