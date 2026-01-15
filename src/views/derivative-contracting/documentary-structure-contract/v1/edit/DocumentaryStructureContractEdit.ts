// Vue - Pinia - Router - Quasar
import { ref, onBeforeMount, onBeforeUnmount } from 'vue'
import { useRoute } from 'vue-router'

// Composables
import { useMainLoader, useUtils, useGoToUrl } from '@/composables'

// Interfaces
import { ITabs } from '@/interfaces/global'
import {
  IDocumentaryStructureContractForm,
  IDocumentaryStructureContractAnnexedDocumentList,
} from '@/interfaces/customs/derivative-contracting/DocumentaryStructureContract'

// Stores
import { useResourceManagerStore } from '@/stores/resources-manager'
import { useDocumentaryStructureContractStore } from '@/stores/derivative-contracting/documentary-structure-contract'

const useDocumentaryStructureContractEdit = () => {
  const route = useRoute()
  const { openMainLoader } = useMainLoader()
  const { defaultIconsLucide } = useUtils()
  const { goToURL } = useGoToUrl()

  const { _getResources, _resetKeys } = useResourceManagerStore('v1')

  const store = useDocumentaryStructureContractStore('v1')
  const { _getByIdAction, _updateAction } = store

  const keys = {
    derivative_contracting: [
      'contract_type_id_name',
      'contract_document_structure_taxable_base_unit',
      'contract_document_structure_stage',
      'definition_documentation_mandatory',
      'available_document_types',
    ],
  }

  const documentaryStructureContractId = +route.params.id

  const informationFormRef = ref()
  const basicDataForm = ref<IDocumentaryStructureContractForm | null>(null)
  const annexedDocumentList =
    ref<IDocumentaryStructureContractAnnexedDocumentList>([])

  const headerProps = {
    title: 'Editar estructura de documentos contractuales',
    breadcrumbs: [
      {
        label: 'Inicio',
        route: 'HomeView',
      },
      {
        label: 'Contratación derivada',
      },
      {
        label: 'Estructura documental del contrato',
        route: 'DocumentaryStructureContractList',
      },
      {
        label: 'Editar',
        route: 'DocumentaryStructureContractEdit',
      },
    ],
  }

  const tabs = ref<ITabs[]>([
    {
      name: 'basic_data',
      label: 'Datos básicos',
      icon: defaultIconsLucide.bulletList,
      outlined: true,
      disable: false,
      show: true,
      required: true,
    },
  ])

  const tabActive = ref(tabs.value[0].name)
  const tabActiveIdx = ref(
    tabs.value.findIndex((tab) => tab.name === tabActive.value)
  )

  const setDataToForm = (data: IDocumentaryStructureContractForm) => {
    if (!data) return
    basicDataForm.value = {
      ...data,
    }
  }

  const validateForm = async () => {
    return (await informationFormRef.value?.validateForm()) ?? false
  }

  const makeDataRequest = (): IDocumentaryStructureContractForm => {
    if (!basicDataForm.value) {
      return {} as IDocumentaryStructureContractForm
    }

    return {
      ...basicDataForm.value,
      attachments: annexedDocumentList.value,
    }
  }

  const onSubmit = async () => {
    if (!(await validateForm())) return
    openMainLoader(true)
    const payload = makeDataRequest()
    const success = await _updateAction(payload, documentaryStructureContractId)
    if (success) {
      goToURL('DocumentaryStructureContractList')
    }
    openMainLoader(false)
  }

  onBeforeMount(async () => {
    openMainLoader(true)
    const responseBasicData = await _getByIdAction(
      documentaryStructureContractId
    )
    if (responseBasicData) {
      await setDataToForm(responseBasicData)
    }
    await _getResources(keys)
    openMainLoader(false)
  })

  onBeforeUnmount(() => {
    _resetKeys(keys)
  })

  return {
    headerProps,
    tabs,
    tabActive,
    tabActiveIdx,
    informationFormRef,
    basicDataForm,
    annexedDocumentList,
    documentaryStructureContractId,

    goToURL,
    onSubmit,
  }
}

export default useDocumentaryStructureContractEdit
