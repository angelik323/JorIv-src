// Vue, Pinia 
import { useGoToUrl, useMainLoader, useUtils } from '@/composables'

// Interfaces
import {
  IDefinitionSupportingDocumentsForm,
  IDefinitionSupportingDocumentsResponse,
} from '@/interfaces/customs/derivative-contracting/DefinitionSupportingDocuments'
import { ITabs } from '@/interfaces/global/Tabs'

// Store
import { useDefinitionSupportingDocumentsStore } from '@/stores'
import { storeToRefs } from 'pinia'

// Composables
import { computed, onMounted, ref, watch } from 'vue'

// Router
import { useRoute } from 'vue-router'

const useDefinitionSupportingDocumentsRead = () => {
  const route = useRoute()
  const searchId = +route.params.id
  const { _getByIdDefinitionDocuments, _clearData } =
    useDefinitionSupportingDocumentsStore('v1')
  const { definition_documents_response } = storeToRefs(
    useDefinitionSupportingDocumentsStore('v1')
  )
  const { openMainLoader } = useMainLoader()
  const { defaultIconsLucide } = useUtils()
  const { goToURL } = useGoToUrl()

  const data_information_form = ref<IDefinitionSupportingDocumentsForm | null>(
    null
  )

  const headerProps = {
    title: 'Ver definición documentos soporte',
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
        label: 'Ver',
        route: 'DefinitionSupportingDocumentsRead',
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

  const filteredTabs = computed(() => tabs.value.filter((tab) => tab.show))

  const tabActive = ref(filteredTabs.value[0].name)

  const tabActiveIdx = ref(
    filteredTabs.value.findIndex((tab) => tab.name === tabActive.value)
  )

  const goToList = () => {
    goToURL('DefinitionSupportingDocumentsList')
  }

  const setFormRead = (data: IDefinitionSupportingDocumentsResponse) => {
    data_information_form.value = {
      structure_id: `${data.structure_documental_code} - ${data.purpose}`,
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

  onMounted(async () => {
    _clearData()
    openMainLoader(true)
    await _getByIdDefinitionDocuments(searchId)
    openMainLoader(false)
  })

  watch(
    () => definition_documents_response.value,
    (val) => {
      if (!val) return
      setFormRead(val)
    }
  )

  return {
    headerProps,
    filteredTabs,
    tabActive,
    tabActiveIdx,
    data_information_form,
    goToList,
  }
}

export default useDefinitionSupportingDocumentsRead
