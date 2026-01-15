// Vue
import { ref, computed, watch } from 'vue'

// Quasar
import { QForm } from 'quasar'

// Pinia
import { storeToRefs } from 'pinia'

// Interfaces
import { ActionType } from '@/interfaces/global'
import {
  ISeizureManagementForm,
  ISeizureProcedure,
  PaymentOrderOptionExtra,
} from '@/interfaces/customs/seizures/Seizures'

// Constants
import {
  SeizureManagementTypes,
  LiftTypes,
} from '@/constants/resources/seizures'

// Stores
import { useAccountsPayableResourceStore } from '@/stores/resources-manager'

const useSeizuresFormManage = (props: {
  managementType: SeizureManagementTypes
  action: ActionType
  data?: ISeizureProcedure
}) => {
  const formRef = ref<QForm | null>(null)

  const { orpa_authorizations } = storeToRefs(
    useAccountsPayableResourceStore('v1')
  )

  const isViewMode = computed(() => props.action === 'view')
  const isReleasePermanent = computed(() => {
    if (formData.value.seizure_release_type_id === LiftTypes.PERMANENT) {
      formData.value.expiration_date = null
      return true
    }
    return false
  })

  const formData = ref<ISeizureManagementForm>({
    observation: '',
    official_number: null,
    official_date: null,
    support_document: null,

    payment_order_number: null,
    payment_order_id: null,
    payment_date: null,
    payment_value: null,
    payment_beneficiary: null,
    payment_status: null,

    seizure_release_type_id: null,
    expiration_date: null,
  })

  const fieldFlags = computed(() => {
    const base = {
      showObservation: true,
      showOfficial: true,
      showFile: true,
      fileRequired: false,
      showPaymentOrder: false,
      showLift: false,
    }

    switch (props.managementType) {
      case SeizureManagementTypes.ACTIVATE:
        return { ...base, fileRequired: true }

      case SeizureManagementTypes.FOLLOW_UP:
        return base

      case SeizureManagementTypes.PAYMENT_ORDER:
        return { ...base, showPaymentOrder: true }

      case SeizureManagementTypes.LIFT:
        return { ...base, showLift: true }

      case SeizureManagementTypes.CERTIFY_UNSEIZABLE:
        return base

      default:
        return base
    }
  })

  const hasFile = computed(() => !!formData.value.support_document)

  const onFileSelected = (files: File[]) => {
    if (isViewMode.value || !files?.length) return
    formData.value.support_document = files[0]
  }

  const removeFile = () => {
    if (isViewMode.value) return
    formData.value.support_document = null
  }

  const getPayload = (): FormData | null => {
    const payload = new FormData()

    payload.append('observation', formData.value.observation)

    if (formData.value.official_number) {
      payload.append('official_number', formData.value.official_number)
    }

    if (formData.value.official_date) {
      payload.append('official_date', formData.value.official_date)
    }

    if (formData.value.support_document) {
      payload.append('document', formData.value.support_document)
    }

    if (formData.value.payment_order_id) {
      payload.append(
        'payment_order_id',
        String(formData.value.payment_order_id)
      )
    }

    if (formData.value.seizure_release_type_id) {
      payload.append(
        'seizure_release_type_id',
        String(formData.value.seizure_release_type_id)
      )
    }

    if (formData.value.expiration_date) {
      payload.append('expiration_date', formData.value.expiration_date)
    }

    return payload
  }

  const resetForm = () => {
    formData.value = {
      observation: '',
      official_number: null,
      official_date: null,
      support_document: null,

      payment_order_number: null,
      payment_order_id: null,
      payment_date: null,
      payment_value: null,
      payment_beneficiary: null,
      payment_status: null,

      seizure_release_type_id: null,
      expiration_date: null,
    }
  }

  watch(
    () => formData.value.payment_order_id,
    (newId) => {
      if (isViewMode.value) return

      if (!newId) {
        formData.value.payment_date = null
        formData.value.payment_value = null
        formData.value.payment_beneficiary = null
        formData.value.payment_status = null
        return
      }

      const selectedOrder = orpa_authorizations.value.find(
        (o) => o.value === newId
      ) as
        | ((typeof orpa_authorizations.value)[number] & PaymentOrderOptionExtra)
        | undefined

      if (!selectedOrder) return

      formData.value.payment_date = selectedOrder.payment_date ?? null
      formData.value.payment_value = selectedOrder.payment_value ?? null
      formData.value.payment_beneficiary =
        selectedOrder.payment_beneficiary ?? null
      formData.value.payment_status = selectedOrder.payment_status ?? null
    }
  )

  watch(
    () => props.data,
    (newVal) => {
      if (!newVal) return

      const normalizedData: ISeizureManagementForm = {
        observation: newVal.observation ?? '',
        official_number: newVal.official_number ?? null,
        official_date: newVal.official_date ?? null,
        support_document: null,

        payment_order_number: null,
        payment_order_id: null,
        payment_date: null,
        payment_value: newVal.payment_amount ?? null,
        payment_beneficiary: null,
        payment_status: null,

        seizure_release_type_id: null,
        expiration_date: newVal.expiration_date ?? null,
      }

      Object.assign(formData.value, normalizedData)
    },
    { immediate: true }
  )

  return {
    formRef,
    formData,
    fieldFlags,
    hasFile,
    orpa_authorizations,
    isViewMode,
    isReleasePermanent,
    onFileSelected,
    removeFile,
    getPayload,
    resetForm,
  }
}

export default useSeizuresFormManage
