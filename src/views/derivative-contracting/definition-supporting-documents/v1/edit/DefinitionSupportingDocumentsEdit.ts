// Vue, Pinia
import { ref, watch, onMounted, onBeforeUnmount } from 'vue'
import { storeToRefs } from 'pinia'

// Router
import { useRoute } from 'vue-router'

// Composables
import { useGoToUrl, useMainLoader, useUtils } from '@/composables'

// Stores
import {
  useDefinitionSupportingDocumentsStore,
  useResourceManagerStore,
} from '@/stores'

// Interfaces
import {
  IDefinitionSupportingDocumentsForm,
  IDefinitionSupportingDocumentsResponse,
} from '@/interfaces/customs/derivative-contracting/DefinitionSupportingDocuments'
import { ITabs } from '@/interfaces/global/Tabs'

const useDefinitionDocumentsEdit = () => {
  const {
    _updateDefinitionDocuments,
    _getByIdDefinitionDocuments,
    _clearData,
  } = useDefinitionSupportingDocumentsStore('v1')
  const { definition_documents_response } = storeToRefs(
    useDefinitionSupportingDocumentsStore('v1')
  )

  const { openMainLoader } = useMainLoader()
  const { cleanEmptyFields, defaultIconsLucide } = useUtils()
  const { goToURL } = useGoToUrl()
  const { _getResources, _resetKeys } = useResourceManagerStore('v1')

  const keys = {
    derivative_contracting: [
      'definition_documentation_type',
      'definition_documentation_module',
      'definition_documentation_process',
      'definition_documentation_support',
      'definition_documentation_mandatory',
      'definition_documentation_file_retention',
      'definition_documentation_final_provision',
    ],
  }

  const keysAccounting = {
    accounting: ['account_chart_structure_code_accounting'],
  }

  // Data de formularios
  const data_information_form = ref<IDefinitionSupportingDocumentsForm | null>(
    null
  )

  // Referencias a formularios
  const basicDataFormRef = ref()

  const route = useRoute()
  const searchId = +route.params.id

  const headerProps = {
    title: 'Editar definición documento soporte',
    breadcrumbs: [
      {
        label: 'Inicio',
        route: 'HomeView',
      },
      {
        label: 'Contratación derivada',
        route: '',
      },
      {
        label: 'Definición documentos soporte',
        route: 'DefinitionSupportingDocumentsList',
      },
      {
        label: 'Editar',
        route: 'DefinitionSupportingDocumentsEdit',
      },
      {
        label: `${searchId}`,
      },
    ],
  }

  const tabs = ref<ITabs[]>([
    {
      name: 'basic_data',
      label: 'Datos básicos',
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

  const setFormEdit = (data: IDefinitionSupportingDocumentsResponse) => {
    data_information_form.value = {
      structure_id: data.structure_documental_code,
      structure: data.structure,
      purpose: data.purpose,
      document_code: data.document_code,
      type: data.type,
      module: data.module,
      name: data.name,
      process: data.process,
      support: data.support,
      general_file_retention: data.general_file_retention,
      mandatory: data.mandatory,
      final_provision: data.final_provision,
    }
  }

  // Datos básicos form
  const makeBaseInfoRequest = (
    data: IDefinitionSupportingDocumentsForm | null
  ) => {
    if (!data) return {}

    const request: Partial<IDefinitionSupportingDocumentsForm> = {
      name: data.name,
      type: data.type,
      module: data.module,
      process: data.process,
      support: data.support,
      mandatory: data.mandatory,
      general_file_retention: data.general_file_retention,
      final_provision: data.final_provision,
      document_code: data.document_code?.toString(),
      purpose: data.purpose,
      structure_id: data.structure_id,
      structure: data.structure,
    }
    return cleanEmptyFields(request)
  }

  const makeDataRequest = () => {
    const apiRequestBody: Partial<IDefinitionSupportingDocumentsForm> = {
      ...makeBaseInfoRequest(data_information_form.value),
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
    const success = await _updateDefinitionDocuments(payload, searchId)
    if (success) {
      goToURL('DefinitionSupportingDocumentsList')
    }
    openMainLoader(false)
  }

  watch(
    () => definition_documents_response.value,
    (val) => {
      if (!val) return
      setFormEdit(val)
    }
  )

  onMounted(async () => {
    _clearData()
    openMainLoader(true)
    await _getByIdDefinitionDocuments(searchId)
    await _getResources(keys)
    await _getResources(keysAccounting, '', 'v2')
    openMainLoader(false)
  })

  onBeforeUnmount(() => {
    _resetKeys(keys)
  })

  return {
    data_information_form,
    basicDataFormRef,
    headerProps,
    tabs,
    tabActive,
    tabActiveIdx,
    goToURL,
    onSubmit,
  }
}

export default useDefinitionDocumentsEdit
