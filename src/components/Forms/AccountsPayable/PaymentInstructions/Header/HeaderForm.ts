// Core
import { onBeforeUnmount, ref, watch } from 'vue'
import { storeToRefs } from 'pinia'

// Interfaces
import { ActionType } from '@/interfaces/global'
import { IPaymentInstructionsHeaderForm } from '@/interfaces/customs/accounts-payable/PaymentInstructions'

// Composables
import { useUtils } from '@/composables'

// Stores
import { useResourceManagerStore } from '@/stores/resources-manager'
import { usePaymentRequestsStore } from '@/stores/accounts-payable/payment-requests'
import { useAccountsPayableResourceStore } from '@/stores/resources-manager/accounts-payable'
import { useThirdPartyResourceStore } from '@/stores/resources-manager/third-party'
import { useFicResourceStore } from '@/stores/resources-manager/fics'
import { useTrustBusinessResourceStore } from '@/stores/resources-manager/trust-business'
import { IPaymentRequestView } from '@/interfaces/customs/accounts-payable/PaymentRequests'

const useHeaderForm = (
  props: {
    action?: ActionType
    data?: IPaymentInstructionsHeaderForm | null
  },
  emit: Function
) => {
  // Composables
  const { isEmptyOrZero, formatCurrency } = useUtils()

  // Stores
  const { _getResources, _resetKeys } = useResourceManagerStore('v1')
  const { _getPaymentRequestById } = usePaymentRequestsStore()
  const { payment_request_numbers, payment_requests } = storeToRefs(
    useAccountsPayableResourceStore('v1')
  )
  const { third_parties } = storeToRefs(useThirdPartyResourceStore('v1'))
  const { offices } = storeToRefs(useFicResourceStore('v1'))
  const { business_trusts } = storeToRefs(useTrustBusinessResourceStore('v1'))

  // Refs
  const headerFormRef = ref()

  const models = ref<IPaymentInstructionsHeaderForm>({})

  watch(
    () => models.value.payment_request_id,
    async (val) => {
      models.value.office_id = null
      models.value.business_id = null
      models.value.supplier_id = null
      models.value.total_value = null
      models.value.iva_value = null

      if (!val) return

      const request = (await _getPaymentRequestById(
        val
      )) as IPaymentRequestView | null

      models.value.office_id = request?.office_id
      models.value.business_id = request?.detail?.business_id
      models.value.supplier_id = request?.supplier_id
      models.value.total_value = request?.total_value
      models.value.iva_value = request?.iva_value
      models.value.instruction_id = request?.instructions?.[0].id ?? null
    }
  )

  watch(
    () => models.value,
    (val) => {
      if (JSON.stringify(val) === JSON.stringify(props.data)) return
      emit('update:data', isEmptyOrZero(val) ? null : val)
    },
    { deep: true }
  )

  watch(
    () => props.data,
    async (val) => {
      if (val && props.data) models.value = props.data

      models.value.payment_request_id =
        models.value.detail?.payment_request_id ??
        models.value.payment_request_id
      models.value.business_id =
        models.value.detail?.business_id ?? models.value.business_id
    },
    { immediate: true }
  )

  // Para traer label correspondientes
  // Se hace asi por que a nivel de back es muy lento y aveces salia error por timeout
  // Se usa filtro por id y promise.all para que no tarde la carga de la informacion y no afecte el rendimiento
  watch(
    () => [
      models.value.office_id,
      models.value.business_id,
      models.value.supplier_id,
      models.value.payment_request_id,
    ],
    async ([office, business, supplier, paymentRequest]) => {
      if (!office && !business && !supplier && !paymentRequest) return

      const promises = []

      if (office) {
        promises.push(
          _getResources({ fics: ['offices'] }, `filter[id]=${office}`).then(
            () => (models.value.office_label = offices.value[0]?.label ?? null)
          )
        )
      }

      if (business) {
        promises.push(
          _getResources(
            { trust_business: ['business_trusts'] },
            `filter[id]=${business}`
          ).then(
            () =>
              (models.value.business_label =
                business_trusts.value[0]?.label ?? null)
          )
        )
      }

      if (supplier) {
        promises.push(
          _getResources(
            { third_party: ['third_parties'] },
            `fields[]=id,document&filter[id]=${supplier}&include=economicActivities,economicActivities.city,legalPerson,naturalPerson`
          ).then(
            () =>
              (models.value.supplier_label =
                third_parties.value[0]?.label ?? null)
          )
        )
      }

      if (paymentRequest) {
        promises.push(
          _getResources(
            { accounts_payable: ['payment_requests'] },
            `filter[id]=${paymentRequest}`
          ).then(
            () =>
              (models.value.payment_request_label =
                payment_requests.value[0]?.label ?? null)
          )
        )
      }

      await Promise.all(promises)
    }
  )

  onBeforeUnmount(() => {
    _resetKeys({ accounts_payable: ['payment_requests'] })
  })

  return {
    models,
    headerFormRef,

    // Selects
    payment_request_numbers,

    // Composables
    formatCurrency,
  }
}

export default useHeaderForm
