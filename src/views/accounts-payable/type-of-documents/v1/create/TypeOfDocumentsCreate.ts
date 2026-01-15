// Core
import { onMounted, onBeforeUnmount, ref } from 'vue'

// Composables
import {
  useGoToUrl,
  useMainLoader,
  useRouteValidator,
  useUtils,
} from '@/composables'

// Interfaces
import { ITabs } from '@/interfaces/global'
import {
  ITypeOfDocumentForm,
  ITypeOfDocumentCreatePayload,
  Numbering,
  OperationType,
} from '@/interfaces/customs/accounts-payable/TypeOfDocuments'

// Stores
import { useTypeOfDocumentsStore } from '@/stores/accounts-payable/type-of-documents'
import { useResourceManagerStore } from '@/stores/resources-manager'

const useTypeOfDocumentsCreate = () => {
  const { openMainLoader } = useMainLoader()
  const { goToURL } = useGoToUrl()
  const { defaultIconsLucide } = useUtils()
  const { validateRouter } = useRouteValidator()

  const keys = ref<Record<string, string[]>>({
    accounts_payable: [
      'document_types_numbering_type',
      'document_types_operation_type',
      'document_types',
    ],
  })

  const basicDataFormRef = ref()
  const type_of_document_form = ref<ITypeOfDocumentForm | null>(null)

  const { _getResources, _resetKeys } = useResourceManagerStore('v1')
  const { _createTypeOfDocument } = useTypeOfDocumentsStore('v1')

  const headerProps = {
    title: 'Crear tipos de documento',
    breadcrumbs: [
      { label: 'Inicio', route: 'HomeView' },
      { label: 'Cuentas por pagar', route: '' },
      { label: 'Gestión de tipos de documento', route: 'TypeOfDocumentsList' },
      { label: 'Crear', route: 'TypeOfDocumentsCreate' },
    ],
  }

  const tabs = ref<ITabs[]>([
    {
      name: 'information',
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
    tabs.value.findIndex((t) => t.name === tabActive.value)
  )

  const makePayload = (
    form: ITypeOfDocumentForm
  ): ITypeOfDocumentCreatePayload => {
    const numbering = form.numbering as Numbering
    const operation_type = form.operation_type as OperationType
    const document_type =
      form.document_type as ITypeOfDocumentCreatePayload['document_type']

    return {
      name: form.name!,
      numbering,
      document_type,
      operation_type,
      has_internal_consecutive: !!form.has_internal_consecutive,
      has_client_consecutive: !!form.has_client_consecutive,
      has_order: !!form.has_order,
      has_other_references: !!form.has_other_references,
      has_legalization_date: !!form.has_legalization_date,
      has_expiration_date: !!form.has_expiration_date,
    }
  }

  const handleCreate = async () => {
    const isValid = await basicDataFormRef.value?.validateForm?.()
    if (!isValid) return
    if (!type_of_document_form.value) return

    const f = type_of_document_form.value
    if (!f.name || !f.numbering || !f.document_type || !f.operation_type) return

    openMainLoader(true)
    const payload = makePayload(f)
    const created = await _createTypeOfDocument(payload)
    if (created) {
      goToURL('TypeOfDocumentsList')
    }
    openMainLoader(false)
  }

  onMounted(async () => {
    await _getResources(keys.value)
  })

  onBeforeUnmount(() => _resetKeys(keys.value))

  return {
    headerProps,
    tabs,
    tabActive,
    tabActiveIdx,
    basicDataFormRef,
    type_of_document_form,
    handleCreate,
    goToURL,
    validateRouter,
  }
}

export default useTypeOfDocumentsCreate
