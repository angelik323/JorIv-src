// Vue - pinia
import { ref, onMounted, onBeforeUnmount, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { useRouter } from 'vue-router'

// Interfaces
import { IFileField, IUploadedFile } from '@/interfaces/global/File'
import { ITabs } from '@/interfaces/global/Tabs'
import {
  IPaymentPlanBasicDataForm,
  IPaymentPlanResponse,
  IPaymentPlanToEdit,
} from '@/interfaces/customs/trust-business/PaymentPlan'

// Utils
import { defaultIconsLucide } from '@/utils'

// Composables
import { useS3Documents, useMainLoader, useUtils } from '@/composables'

// Stores
import { usePaymentPlanStore } from '@/stores/trust-business'
import { useResourceManagerStore } from '@/stores/resources-manager'

const usePaymentPlanEdit = () => {
  const {
    _getByIdPaymentPlan,
    _updatePaymentPlan,
    _signPaymentPlanFile,
    _clearData,
  } = usePaymentPlanStore('v1')
  const {
    headerPropsDefault,
    data_payment_plan_response,
    data_documents_form,
  } = storeToRefs(usePaymentPlanStore('v1'))

  const { _getResources, _resetKeys } = useResourceManagerStore('v1')
  const { _saveDocumentsS3, getExtensionFromMimeType } = useS3Documents()

  const { openMainLoader } = useMainLoader()
  const { toNumberOrNull } = useUtils()
  const router = useRouter()

  const keys = {
    trust_business: ['payment_plan_statuses'],
    finantial_obligations: ['financial_obligations'],
  }

  const paymentPlanId = Number(router.currentRoute.value.params.id)

  // Data de formularios
  const basic_data_form = ref<IPaymentPlanBasicDataForm | null>(null)

  // Referencias a formularios
  const basicDataFormRef = ref()

  const headerProperties = {
    title: 'Editar plan de pagos',
    breadcrumbs: [
      ...headerPropsDefault.value.breadcrumbs,
      {
        label: 'Editar',
        route: 'PaymentPlanEdit',
      },
      {
        label: paymentPlanId.toString(),
      },
    ],
  }

  const tabs = ref<ITabs[]>([
    {
      name: 'basic_data',
      label: 'Datos básicos*',
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

  const setFormEdit = (data: IPaymentPlanResponse) => {
    basic_data_form.value = {
      id: data.id,
      project: data.project?.name ?? null,
      project_stage: data.project_stage?.stage_number ?? null,
      business_trust: data.business_trust?.name ?? null,
      property: data.property?.nomenclature ?? null,
      buyers:
        Array.isArray(data.buyers) && data.buyers.length > 0
          ? data.buyers.map((b) => b.buyer.name).join(', ')
          : null,
      trust_mandate: data.fiduciary_mandate?.mandate_code || null,
      unit_value: toNumberOrNull(data.unit_value),
      value_finish: toNumberOrNull(data.value_finish),
      initial_fee_value: toNumberOrNull(data.initial_fee_value),
      subsidy_fee_value: toNumberOrNull(data.subsidy_fee_value),
      value_other_concepts: toNumberOrNull(data.value_other_concepts),
      fixed_value_initial_fee: toNumberOrNull(data.fixed_value_initial_fee),
      separation_value: toNumberOrNull(data.separation_value),
      financial_obligations: Number(data.financial_obligations) || null,
      financial_obligations_name:
        data.financial_obligation.obligation_number || null,
      credit_value: toNumberOrNull(data.financial_obligation.amount),
      term: Number(data.financial_obligation.quotas) || null,
      periodicity: data.financial_obligation.periodicity_type || null,
      effective_annual_rate: data.financial_obligation.interest_rate || null,
      payments_plan:
        data.payment_plan?.map((p) => ({
          id: p.id || null,
          installment_number: p.installment_number || null,
          initial_balance: toNumberOrNull(p.initial_balance),
          total_value: toNumberOrNull(p.total_value),
          late_interest: toNumberOrNull(p.late_interest),
          final_balance: toNumberOrNull(p.final_balance),
          capital_fee: toNumberOrNull(p.capital_fee),
          payment_date: p.payment_date || null,
          status: p.status.id || null,
        })) ?? null,
    }
  }

  const validateForms = async () => {
    let valid = false
    const forms = [basicDataFormRef]

    if (tabActiveIdx.value >= 0 && tabActiveIdx.value < forms.length) {
      try {
        valid =
          (await forms[tabActiveIdx.value]?.value?.validateForm()) ?? false
      } catch {
        valid = false
      }
    }
    return valid
  }

  // Gestion de documentos
  const handleDocumentsUpload = async (
    paymentPlanId: number,
    files: IFileField[]
  ): Promise<void> => {
    const uploadUrls: string[] = []
    const filesToUpload: IUploadedFile[] = []

    for (const fileField of files) {
      const file = fileField.file
      if (!file) continue

      const { success, uploadUrl } = await _signPaymentPlanFile(paymentPlanId, {
        name: file.name,
        document_type: getExtensionFromMimeType(file.type),
      })

      if (!success || !uploadUrl) continue

      uploadUrls.push(uploadUrl)
      filesToUpload.push(file)
    }

    if (!uploadUrls.length || !filesToUpload.length) return

    await _saveDocumentsS3(uploadUrls, filesToUpload)
  }

  //Basic data form
  const makeBaseInfoRequest = (data: IPaymentPlanBasicDataForm | null) => {
    if (!data) return {}

    const request: Partial<IPaymentPlanToEdit> = {
      unit_value: data.unit_value ?? null,
      value_finish: data.value_finish ?? null,
      initial_fee_value: data.initial_fee_value ?? null,
      subsidy_fee_value: data.subsidy_fee_value ?? null,
      value_other_concepts: data.value_other_concepts ?? null,
      fixed_value_initial_fee: data.fixed_value_initial_fee ?? null,
      separation_value: data.separation_value ?? null,
      financial_obligations: Number(data.financial_obligations),
    }

    return request
  }

  const makeDataRequest = () => {
    const apiRequestBody: Partial<IPaymentPlanToEdit> = {
      ...makeBaseInfoRequest(basic_data_form.value),
    }

    return apiRequestBody
  }

  const onSubmit = async () => {
    if (!(await validateForms())) return

    openMainLoader(true)

    const payload = makeDataRequest()
    const success = await _updatePaymentPlan(paymentPlanId, payload)

    if (success) {
      // Subida de nuevos documentos
      const documentFilesToUpload = data_documents_form.value?.documentFiles
      if (documentFilesToUpload?.length)
        await handleDocumentsUpload(paymentPlanId, documentFilesToUpload)

      router.push({ name: 'PaymentPlanList', query: { reload: 1 } })
    }

    openMainLoader(false)
  }

  const handlerGoTo = (goURL: string, id?: number) => {
    router.push({ name: goURL, params: { id } })
  }

  onMounted(async () => {
    _clearData()
    openMainLoader(true)
    await Promise.all([_getResources(keys), _getByIdPaymentPlan(paymentPlanId)])
    openMainLoader(false)
  })

  onBeforeUnmount(() => {
    _resetKeys(keys)
  })

  watch(
    () => data_payment_plan_response.value,
    (val) => {
      if (!val) return
      setFormEdit(val)
    }
  )

  return {
    data_payment_plan_response,
    basic_data_form,
    basicDataFormRef,
    headerProperties,
    tabs,
    tabActive,
    tabActiveIdx,
    onSubmit,
    handlerGoTo,
  }
}

export default usePaymentPlanEdit
