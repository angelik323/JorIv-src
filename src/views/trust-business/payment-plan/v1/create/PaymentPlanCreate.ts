// Vue - pinia
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { storeToRefs } from 'pinia'
import { useRouter } from 'vue-router'

// Interfaces
import { IFileField, IUploadedFile } from '@/interfaces/global'
import { ITabs } from '@/interfaces/global/Tabs'
import { TrustBusinessTypeID } from '@/interfaces/global/TrustBusiness'
import {
  IPaymentPlanBasicDataForm,
  IPaymentPlanToCreate,
} from '@/interfaces/customs/trust-business/PaymentPlan'

// Utils
import { defaultIconsLucide } from '@/utils'

// Composables
import { useS3Documents, useMainLoader } from '@/composables'

// Stores
import { usePaymentPlanStore } from '@/stores/trust-business/payment-plan'
import { useResourceManagerStore } from '@/stores/resources-manager'

const usePaymentPlanCreate = () => {
  const { _createPaymentPlan, _signPaymentPlanFile, _clearData } =
    usePaymentPlanStore('v1')
  const { headerPropsDefault, data_documents_form } = storeToRefs(
    usePaymentPlanStore('v1')
  )

  const { _getResources, _resetKeys } = useResourceManagerStore('v1')
  const { _saveDocumentsS3, getExtensionFromMimeType } = useS3Documents()

  const { openMainLoader } = useMainLoader()
  const router = useRouter()

  // Data de formularios
  const basic_data_form = ref<IPaymentPlanBasicDataForm | null>(null)

  // Referencias a formularios
  const basicDataFormRef = ref()

  const headerProperties = {
    title: 'Crear plan de pagos',
    breadcrumbs: [
      ...headerPropsDefault.value.breadcrumbs,
      {
        label: 'Crear',
        route: 'PaymentPlanCreate',
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

  const nextTab = async () => {
    if (!(await validateForms())) return
    tabActiveIdx.value = tabActiveIdx.value + 1
    tabActive.value = tabs.value[tabActiveIdx.value].name
  }

  const backTab = () => {
    tabActiveIdx.value = tabActiveIdx.value - 1
    tabActive.value = tabs.value[tabActiveIdx.value].name
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

  // Basic data form
  const makeBaseInfoRequest = (data: IPaymentPlanBasicDataForm | null) => {
    if (!data) return {}

    const request: Partial<IPaymentPlanToCreate> = {
      project_id: Number(data.project),
      project_stage_id: Number(data.project_stage),
      business_trust_id: Number(data.business_trust),
      unit_value: data.unit_value ?? null,
      value_finish: data.value_finish ?? null,
      initial_fee_value: data.initial_fee_value ?? null,
      subsidy_fee_value: data.subsidy_fee_value ?? null,
      value_other_concepts: data.value_other_concepts ?? null,
      fixed_value_initial_fee: data.fixed_value_initial_fee ?? null,
      separation_value: data.separation_value ?? null,
      financial_obligations: Number(data.financial_obligations),
      payments_plan: data.payments_plan,
    }

    return request
  }

  const makeDataRequest = () => {
    const apiRequestBody: Partial<IPaymentPlanToCreate> = {
      ...makeBaseInfoRequest(basic_data_form.value),
    }

    return apiRequestBody
  }

  const onSubmit = async () => {
    if (!(await validateForms())) return

    const property = Number(basic_data_form.value?.property)
    if (!property) return

    openMainLoader(true)

    const payload = makeDataRequest()
    const paymentPlanId = await _createPaymentPlan(property, payload)

    if (paymentPlanId) {
      // Subida de documentos
      const documentFiles = data_documents_form.value?.documentFiles
      if (documentFiles?.length)
        await handleDocumentsUpload(paymentPlanId, documentFiles)

      router.push({ name: 'PaymentPlanList', query: { reload: 1 } })
    }

    openMainLoader(false)
  }

  const keys = {
    trust_business: [
      'business_trust_real_estate_project',
      'project_stage',
      'payment_plan_statuses',
    ],
    finantial_obligations: ['financial_obligations'],
  }

  onMounted(async () => {
    _clearData()
    openMainLoader(true)

    await Promise.all([
      _getResources(
        { trust_business: ['business_trusts'] },
        `filter[business_type_id]=${TrustBusinessTypeID.FIDUCIA_INMOBILIARIA}`
      ),
      _getResources(keys),
    ])

    openMainLoader(false)
  })

  onBeforeUnmount(() => {
    _resetKeys({
      trust_business: [...keys.trust_business, 'business_trusts'],
      finantial_obligations: [...keys.finantial_obligations],
    })
  })

  return {
    basic_data_form,
    basicDataFormRef,
    headerProperties,
    tabs,
    tabActive,
    tabActiveIdx,
    defaultIconsLucide,
    nextTab,
    backTab,
    onSubmit,
  }
}

export default usePaymentPlanCreate
