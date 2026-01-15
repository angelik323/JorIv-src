import { ref, watch, onMounted, computed, onBeforeUnmount } from 'vue'

// Composables
import { useGoToUrl, useMainLoader, useUtils } from '@/composables'

// Stores
import { useResourceManagerStore, useSupportingDocumentsStore } from '@/stores'

// Interfaces
import { ISupportingDocumentForm } from '@/interfaces/customs'
import { ITabs } from '@/interfaces/global'

const useSupportingDocumentsCreate = () => {
  const { _createSupportingDocuments, _clearData } =
    useSupportingDocumentsStore('v1')
  const { _getResources, _resetKeys } = useResourceManagerStore('v1')

  // Data de formularios
  const basic_data_form = ref<ISupportingDocumentForm | null>(null)

  // Referencias a formularios
  const basicDataFormRef = ref()

  const { cleanEmptyFields, defaultIconsLucide } = useUtils()
  const { openMainLoader } = useMainLoader()
  const { goToURL } = useGoToUrl()

  const headerProps = {
    title: 'Crear documento soporte',
    breadcrumbs: [
      {
        label: 'Inicio',
        route: 'HomeView',
      },
      {
        label: 'Facturación y cartera',
        route: '',
      },
      {
        label: 'Generar documentos soporte',
        route: 'SupportingDocumentsList',
      },
      {
        label: 'Crear',
        route: 'SupportingDocumentsCreate',
      },
    ],
  }

  const tabs = ref<ITabs[]>([
    {
      name: 'basic-data',
      label: 'Datos básicos',
      icon: defaultIconsLucide.bulletList,
      outlined: true,
      disable: true,
      show: true,
      required: true,
    },
  ])

  const tabActive = ref(tabs.value[0].name)
  const tabActiveIdx = ref(
    tabs.value.findIndex((tab) => tab.name === tabActive.value)
  )

  // Datos básicos form
  const makeBaseInfoRequest = (data: ISupportingDocumentForm | null) => {
    if (!data) return {}
    const request: Partial<ISupportingDocumentForm> = {
      // business
      business_trust_id: data.business_trust_id,
      business_code_snap: data.business_code_snap,
      business_name_snap: data.business_name_snap,
      type_document: data.type_document,
      document_number: data.document_number,
      // terceros
      third_party_billing_id: data.third_party_billing_id,
      third_party_address_snap: data.third_party_address_snap,
      third_party_phone_snap: data.third_party_phone_snap,
      third_party_email_snap: data.third_party_email_snap,
      third_party_type_document_snap: data.third_party_type_document_snap,
      third_party_document_snap: data.third_party_document_snap,
      third_party_name_snap: data.third_party_name_snap,
      // info
      production_date: data.production_date,
      payment_methods: data.payment_methods,
      description: data.description,
      // movement code
      movement_code_id: data.movement_code_id,
      movement_code_snap: data.movement_code_snap,
      movement_code_description: data.movement_code_description,
      generate_iva: data.generate_iva === 'si',
      iva_percentage: data.iva_percentage,
      generate_source_rete: data.generate_source_rete === 'si',
      rete_source_percentage: data.rete_source_percentage,
      generate_source_ica: data.generate_source_ica === 'si',
      rete_ica_percentage: data.rete_ica_percentage,
      generate_rete_iva: data.generate_rete_iva === 'si',
      rete_iva_percentage: data.rete_iva_percentage,

      base_amount: data.base_amount,
      base_iva: data.base_iva,
      rete_source: data.rete_source,
      rete_ica: data.rete_ica,
      rete_iva: data.rete_iva,
      total_amount: data.total_amount,
      days_for_pays: data.days_for_pays,
    }
    const cleanedRequest = cleanEmptyFields(request)

    return { ...cleanedRequest }
  }

  const makeDataRequest = () => {
    const apiRequestBody: Partial<ISupportingDocumentForm> = {
      ...makeBaseInfoRequest(basic_data_form.value),
    }

    return apiRequestBody
  }

  const validateForms = async () => {
    let valid: boolean = false
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

  const onSubmit = async () => {
    if (!(await validateForms())) return

    openMainLoader(true)
    const payload = makeDataRequest()
    const success = await _createSupportingDocuments(payload)
    if (success) {
      goToURL('SupportingDocumentsList')
    }
    openMainLoader(false)
  }

  const validateDataForm = computed<boolean>(() =>
    Boolean(
      !basic_data_form.value?.business_trust_id ||
        !basic_data_form.value?.third_party_billing_id ||
        !basic_data_form.value?.payment_methods ||
        !basic_data_form.value?.description ||
        !basic_data_form.value?.movement_code_id ||
        !basic_data_form.value?.base_amount
    )
  )

  watch(
    () => basic_data_form.value,
    (val) => {
      if (!val) return

      val.iva_percentage = val.generate_iva === 'si' ? 19 : 0
      val.rete_source_percentage =
        val.generate_source_rete === 'si' ? val.rete_source_percentage : 0
      val.rete_ica_percentage =
        val.generate_source_ica === 'si' ? val.rete_ica_percentage : 0
      val.rete_iva_percentage =
        val.generate_rete_iva === 'si' ? val.rete_iva_percentage : 0

      // Rete fuente
      val.rete_source =
        (Number(val.base_amount) * Number(val.rete_source_percentage)) / 100

      // Rete ICA
      val.rete_ica =
        (Number(val.base_amount) * Number(val.rete_ica_percentage)) / 100

      // Rete IVA
      val.rete_iva =
        (Number(val.base_iva) * Number(val.rete_iva_percentage)) / 100

      if (val.base_amount) {
        val.base_iva =
          (Number(val.base_amount) * Number(val.iva_percentage)) / 100
        val.total_amount =
          Number(val.base_amount) +
          Number(val.base_iva || 0) -
          (Number(val.rete_source || 0) +
            Number(val.rete_ica || 0) +
            Number(val.rete_iva || 0))
      }
    },
    { deep: true, immediate: true }
  )

  const keys = {
    trust_business: ['movement_codes', 'third_parties'],
    billing_collect: ['payment-methods'],
  }

  const keysToClear = {
    third_party: ['third_parties'],
    trust_business: ['business_trusts', 'movement_codes_parameters'],
    billing_collect: ['payment_methods'],
  }

  onBeforeUnmount(async () => {
    _clearData()
    _resetKeys(keysToClear)
  })

  onMounted(async () => {
    openMainLoader(true)
    await _getResources(keys)
    await _getResources(
      { third_party: ['third_parties'] },
      'include=documentType,naturalPerson,legalPerson,addresses,contacts&filter[is_customer]=1&fields[]=id,document,document_type_id'
    )
    await _getResources(
      { trust_business: ['business_trusts'] },
      'filter[effect]=true&can_manage=true'
    )
    openMainLoader(false)
  })

  return {
    basic_data_form,
    basicDataFormRef,
    headerProps,
    tabs,
    tabActive,
    tabActiveIdx,
    defaultIconsLucide,
    validateDataForm,

    onSubmit,
    goToURL,
  }
}

export default useSupportingDocumentsCreate
