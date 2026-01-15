import { onMounted, ref, computed } from 'vue'
import { QForm } from 'quasar'

import { useUtils } from '@/composables'

import {
  IAuthorizationFiduciaryCommissionsFormProps,
  IAuthorizationFiduciaryCommissionForm,
  Nullable,
} from '@/interfaces/customs'

const useInformationForm = (
  props: IAuthorizationFiduciaryCommissionsFormProps,
) => {
  const { formatCurrencyString } = useUtils()
  const formElementRef = ref<QForm | null>(null)

  const authorizationFiduciaryCommissionFormInitial: Nullable<IAuthorizationFiduciaryCommissionForm> =
    {
      business_id: null,
      business_code_snapshot: null,
      business_name_snapshot: null,
      commission_class_catalog: null,
      commission_type_catalog: null,
      periodicity: null,
      collection: null,
      status: null,
      settlement_date: null,
      base_amount: null,
      total_amount: null,
      iva_amount: null,
      observation: null,
      cancellation_date: null,
      cancellation_reason: null,
    }

  const models = ref<Nullable<IAuthorizationFiduciaryCommissionForm>>({
    ...authorizationFiduciaryCommissionFormInitial,
  })

  const businessName = computed<string>(() => {
    if (
      models.value.business_name_snapshot &&
      models.value.business_code_snapshot
    ) {
      return `${models.value.business_code_snapshot} - ${models.value.business_name_snapshot}`
    }
    if (models.value.business_name_snapshot) {
      return `${models.value.business_name_snapshot}`
    }

    return '-'
  })

  const fieldsTitleClass = computed<string>(() =>
    props.data ? 'text-black-90 ' : 'text-grey-7',
  )

  const clearForm = () => {
    models.value = { ...authorizationFiduciaryCommissionFormInitial }
  }

  const setFormValues = () => {
    clearForm()
    const data = props.data
    if (!data) return

    models.value.business_id = data.business_id ?? null
    models.value.business_code_snapshot = data.business_code_snapshot ?? null
    models.value.business_name_snapshot = data.business_name_snapshot ?? null
    models.value.commission_class_catalog =
      data.commission_class_catalog ?? null
    models.value.commission_type_catalog = data.commission_type_catalog ?? null
    models.value.periodicity = data.periodicity ?? null
    models.value.collection = data.collection ?? null
    models.value.status = data.status ?? null
    models.value.settlement_date = data.settlement_date ?? null
    models.value.base_amount = data.base_amount ?? null
    models.value.total_amount = data.total_amount ?? null
    models.value.iva_amount = data.iva_amount ?? null
    models.value.cancellation_date = data.cancellation_date ?? null
    models.value.cancellation_reason = data.cancellation_reason ?? null
    models.value.observation = data.observation ?? null
  }

  const handlerActionForm = (action: 'create' | 'edit' | 'view') => {
    if (action === 'view' || action === 'edit') {
      setFormValues()
    }
  }

  onMounted(async () => {
    handlerActionForm(props.action)
  })

  return {
    formElementRef,
    models,
    businessName,
    fieldsTitleClass,

    formatCurrencyString,
  }
}

export default useInformationForm
