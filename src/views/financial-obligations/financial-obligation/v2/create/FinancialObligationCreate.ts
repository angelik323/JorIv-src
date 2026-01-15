// vue - quasar
import { onBeforeMount, onBeforeUnmount, onUnmounted, ref } from 'vue'
import { storeToRefs } from 'pinia'

// stores
import { useFinancialObligationStore } from '@/stores/financial-obligations/financial-obligation'
import { useTreasuryResourceStore } from '@/stores/resources-manager/treasury'
import { useTrustBusinessResourceStore } from '@/stores/resources-manager/trust-business'
import { useFinantialObligationResourceStore } from '@/stores/resources-manager/finantial-obligations'

// interfaces
import { ITabs } from '@/interfaces/customs/Tab'
import {
  IFinancialObligationFormV2,
  IFinancialObligationDocument,
  IFinancialObligationCreateV2,
} from '@/interfaces/customs/financial-obligations/v2/FinancialObligation'

// composables
import { useAlert, useGoToUrl, useMainLoader, useUtils } from '@/composables'

const { defaultIconsLucide, cleanEmptyFields } = useUtils()

const useFinancialObligationCreate = () => {
  // composables
  const { showAlert } = useAlert()
  const { goToURL } = useGoToUrl()

  // loader
  const { openMainLoader } = useMainLoader()

  // imports
  const { getResources: getTreasuryResources } = useTreasuryResourceStore('v1')
  const { banks_initial_balance } = storeToRefs(useTreasuryResourceStore('v1'))
  const {
    getResources: getTrustBusinessResources,
    resetKeys: resetTrustBusinessKeys,
  } = useTrustBusinessResourceStore('v1')
  const { getResources: getFinantialObligationResourcesV2 } =
    useFinantialObligationResourceStore('v2')
  const {
    calculation_methods,
    base_calculations,
    quota_types,
    amortization_types,
  } = storeToRefs(useFinantialObligationResourceStore('v2'))

  const { headerPropsDefault } = storeToRefs(useFinancialObligationStore('v2'))
  const {
    _createFinancialObligation,
    _addFinancialObligationDocument,
    _uploadAttachmentsTemp,
  } = useFinancialObligationStore('v2')

  // keys
  const trust_business_keys = ['business_trusts']
  const treasury_keys = ['banks', 'third_party_nit']
  const financial_obligation_keys_v2 = [
    'credit_types',
    'periodicities',
    'factors',
    'calculation_methods',
    'base_calculations',
    'quota_types',
    'amortization_types',
  ]

  // breadcrumb
  const headerPropsCreate = {
    title: 'Crear obligación financiera',
    breadcrumbs: [
      ...headerPropsDefault.value.breadcrumbs,
      ...[
        {
          label: 'Crear',
          route: 'FinancialObligationCreate',
        },
      ],
    ],
  }

  // form refs
  const formBasicData = ref()
  const formDocuments = ref()

  // init data children
  const getBasicDataFormData = ref<IFinancialObligationFormV2 | null>(null)
  const getDocumentsFormData = ref<IFinancialObligationDocument[]>([])

  // set data children
  const setBasicDataFormData = (data: IFinancialObligationFormV2 | null) => {
    getBasicDataFormData.value = data
  }

  const setDocumentsFormData = (data: IFinancialObligationDocument[]) => {
    getDocumentsFormData.value = data
  }

  // tabs
  const tabs: ITabs[] = [
    {
      name: 'basic_data',
      label: 'Datos básicos*',
      icon: defaultIconsLucide.bulletList,
      outlined: true,
      disable: true,
      show: true,
      required: false,
    },
    {
      name: 'documents',
      label: 'Documentos soporte',
      icon: defaultIconsLucide.file,
      outlined: true,
      disable: true,
      show: true,
      required: false,
    },
  ]

  const [initialTab] = tabs
  const tabActive = ref(initialTab.name)

  const tabActiveIdx = ref(tabs.indexOf(initialTab))

  const validateForms = async () => {
    let valid: boolean = false
    const forms = [formBasicData, formDocuments]

    if (tabActiveIdx.value >= 0 && tabActiveIdx.value < forms.length) {
      valid = (await forms[tabActiveIdx.value]?.value?.validateForm()) ?? false
    }
    return valid
  }

  const nextTab = async () => {
    if (await validateForms()) {
      tabActiveIdx.value = tabActiveIdx.value + 1
      tabActive.value = tabs[tabActiveIdx.value].name
    }
  }

  const backTab = () => {
    tabActiveIdx.value = tabActiveIdx.value - 1
    tabActive.value = tabs[tabActiveIdx.value].name
  }

  // actions
  const makeDataRequest = (): IFinancialObligationCreateV2 => {
    const formData = getBasicDataFormData.value!

    // Obtener labels de los recursos
    const calculationMethodLabel =
      calculation_methods.value.find(
        (item) => item.value === formData.calculation_method_id
      )?.label ?? ''
    const calculationBaseLabel =
      base_calculations.value.find(
        (item) => item.value === formData.calculation_base_id
      )?.label ?? ''
    const quotaTypeLabel =
      quota_types.value.find((item) => item.value === formData.quota_type_id)
        ?.label ?? ''
    const amortizationTypeLabel =
      amortization_types.value.find(
        (item) => item.value === formData.amortization_type_id
      )?.label ?? ''

    // Obtener bank_name de los recursos
    const bankName =
      formData.bank_name ||
      banks_initial_balance.value.find(
        (item) => item.value === formData.bank_id
      )?.label ||
      ''

    return cleanEmptyFields(
      {
        obligation_number: formData.obligation_number,
        business_trust_id: formData.business_trust_id,
        business_trust_name: formData.business_trust_name,
        business_trust_code: formData.business_trust_code,
        titular_id: formData.titular_id,
        titular_name: formData.titular_name,
        titular_nit: formData.titular_nit,
        bank_id: formData.bank_id,
        bank_name: bankName,
        credit_type_id: formData.credit_type_id,
        amount: formData.amount,
        interest_rate: formData.interest_rate,
        factor_id: formData.factor_id,
        periodicity_id: formData.periodicity_id,
        quotas: formData.quotas,
        payment_day: formData.payment_day,
        alert_days: formData.alert_days,
        payment_plan_configuration: {
          calculation_method: calculationMethodLabel,
          calculation_base: Number(calculationBaseLabel) || 360,
          quota_type: quotaTypeLabel,
          amortization_type: amortizationTypeLabel,
          start_date: formData.start_date,
        },
      },
      true
    ) as IFinancialObligationCreateV2
  }

  const onSubmit = async () => {
    if (!(await validateForms())) return

    openMainLoader(true)

    const payload: IFinancialObligationCreateV2 = makeDataRequest()
    const payloadWithAttachments: IFinancialObligationCreateV2 & {
      attachments_cache_key?: string
    } = { ...payload }

    if (getDocumentsFormData.value && getDocumentsFormData.value.length > 0) {
      const files = getDocumentsFormData.value
        .map((f) => f.file)
        .filter((f) => !!f) as File[]
      if (files.length > 0) {
        const uploadTempResult = await _uploadAttachmentsTemp(files)
        if (uploadTempResult && uploadTempResult.attachments_cache_key) {
          payloadWithAttachments.attachments_cache_key =
            uploadTempResult.attachments_cache_key
        }
      }
    }

    const { success, id: obligationId } = await _createFinancialObligation(
      payloadWithAttachments
    )

    if (success && obligationId) {
      const usedCacheKey = payloadWithAttachments.attachments_cache_key
      if (!usedCacheKey) {
        if (
          getDocumentsFormData.value &&
          getDocumentsFormData.value.length > 0
        ) {
          await handleDocumentsUpload(obligationId, getDocumentsFormData.value)
        }
      }

      openMainLoader(false)
      showAlert('Registro creado exitosamente', 'success', undefined, 3000)
      goToURL('FinancialObligationList')
      return
    }

    openMainLoader(false)
  }

  const handleDocumentsUpload = async (
    obligationId: number,
    files: IFinancialObligationDocument[]
  ): Promise<void> => {
    for (const fileField of files) {
      const file = fileField.file
      if (!file) continue

      await _addFinancialObligationDocument(obligationId, file)
    }
  }

  // lifecycles
  onBeforeMount(async () => {
    openMainLoader(true)

    await getTreasuryResources(`?keys[]=${treasury_keys.join('&keys[]=')}`)
    await getFinantialObligationResourcesV2(
      `?keys[]=${financial_obligation_keys_v2.join('&keys[]=')}`
    )
    await getTrustBusinessResources(
      `?keys[]=${trust_business_keys.join('&keys[]=')}`
    )

    openMainLoader(false)
  })

  onBeforeUnmount(async () => {
    resetTrustBusinessKeys(trust_business_keys as never[])
  })

  onUnmounted(() => {
    getBasicDataFormData.value = null
    getDocumentsFormData.value = []
  })

  return {
    headerPropsCreate,
    tabs,
    defaultIconsLucide,
    tabActive,
    tabActiveIdx,
    formBasicData,
    formDocuments,
    getBasicDataFormData,
    getDocumentsFormData,

    nextTab,
    backTab,
    onSubmit,
    goToURL,
    setBasicDataFormData,
    setDocumentsFormData,
  }
}

export default useFinancialObligationCreate
