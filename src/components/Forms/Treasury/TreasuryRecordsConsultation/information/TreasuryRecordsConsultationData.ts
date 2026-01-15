//Interfaces
import { useGoToUrl, useUtils } from '@/composables'
import { ITreasuryRecordsConsultationList } from '@/interfaces/customs'
//vue
import { computed, onMounted, ref } from 'vue'

const useTreasuryRecordsConsultation = (props: {
  data?: ITreasuryRecordsConsultationList | null
}) => {
  const { goToURL } = useGoToUrl()
  const { formatPeriod } = useUtils()

  const models = ref({
    authorizer_name: '',
    beneficiary_bank: '',
    business_name: '',
    business_id: 0,
    cash_flow_name: '',
    cost_center_name: '',
    method_payment_description: '',
    name_office: '',
    office_id: '',
    origin_bank_account_name: '',
    origin_business_name: '',
    payer_bank_account: '',
    type_movement_code: '',
    register: null,
    record_id: '',
    beneficiary_nit: '',
    investment_plans_id: '',
    original_status: '',
    original_voucher_id: '',
    original_date: '',
    original_subvoucher_id: '',
    original_consecutive: '',
    original_period: '',
  })

  const isTreasuryVoucherDisabled = computed(() => {
    const selected = models.value
    if (!selected) return true

    const requiredFields = [
      selected?.office_id,
      selected?.business_id,
      selected?.original_voucher_id,
      selected?.original_subvoucher_id,
      selected?.original_date,
      selected?.original_consecutive,
      selected?.original_period,
    ]

    const hasMissingFields = requiredFields.some(
      (field) => field === null || field === undefined || field === ''
    )

    return hasMissingFields
  })

  const sendInformationToVoucherTreausury = () => {
    goToURL('CheckTreasuryReceiptList', undefined, {
      office_id: models.value.office_id,
      business_id: models.value.business_id,
      original_status: Number('71'),
      original_voucher_id: models.value.original_voucher_id,
      original_subvoucher_id: models.value.original_subvoucher_id,
      original_date: models.value.original_date,
      original_consecutive: models.value.original_consecutive,
      original_period: formatPeriod(models.value.original_period),
    })
  }

  onMounted(async () => {
    const data = props.data
    if (!data) return

    models.value.name_office = data.office_id
      ? `${data.office_id} - ${data.name_office}`
      : ''
    models.value.office_id = data.office_id?.toString() ?? ''
    models.value.business_name =
      data.business_trust?.business_code && data.business_trust?.name
        ? `${data.business_trust?.business_code} - ${data.business_trust?.name}`
        : ''
    models.value.business_id = Number(data.business_trust?.id)
    models.value.payer_bank_account = data.bank
      ? `${data.bank.code} - ${data.bank.description}`
      : ''
    models.value.cost_center_name = data.cost_center?.code
    models.value.origin_business_name =
      data.origin_detail?.business_trust?.business_code &&
      data.origin_detail?.business_trust?.name
        ? `${data.origin_detail?.business_trust?.business_code} - ${data.origin_detail?.business_trust?.name}`
        : ''
    models.value.type_movement_code =
      data.movement?.code && data.movement?.description
        ? `${data.movement?.code} - ${data.movement?.description}`
        : ''
    models.value.method_payment_description =
      data.method_payment?.code && data.method_payment?.description
        ? `${data.method_payment?.code} - ${data.method_payment?.description}`
        : ''
    models.value.origin_bank_account_name = data.bank_account.account_number
    models.value.cash_flow_name = data.cash_flow?.code
    models.value.original_voucher_id =
      data.movement.receipt_types.id?.toString() ?? ''
    models.value.original_subvoucher_id =
      data.movement.sub_receipt_types.id?.toString() ?? ''
    models.value.investment_plans_id = data.investment_plan?.code ?? ''
    models.value.original_date = data.date
    models.value.original_consecutive =
      data.authorization?.accounting_consecutive ?? ''
    models.value.beneficiary_nit =
      data.third_party?.document && data.third_party?.name
        ? `${data.third_party?.document} - ${data.third_party?.name}`
        : ''
    models.value.original_period = data.treasury_movement?.period ?? ''
    models.value.authorizer_name = data.authorization_by
      ? `${data.authorization_by?.name} ${data.authorization_by?.last_name}`
      : ''
    models.value.beneficiary_bank =
      data.beneficiary_bank?.code && data.beneficiary_bank?.description
        ? `${data.beneficiary_bank?.code} - ${data.beneficiary_bank?.description}`
        : ''
    models.value.record_id = data.authorization
      ? String(data.authorization?.voucher_id)
      : ''
  })

  return {
    models,
    isTreasuryVoucherDisabled,
    sendInformationToVoucherTreausury,
  }
}

export default useTreasuryRecordsConsultation
