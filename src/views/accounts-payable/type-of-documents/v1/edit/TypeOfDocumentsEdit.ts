// Vue - Pinia
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { useRoute } from 'vue-router'
import { storeToRefs } from 'pinia'

// Interfaces
import { ITabs } from '@/interfaces/global'
import {
  ITypeOfDocumentCreatePayload,
  ITypeOfDocumentForm,
  ITypeOfDocumentItem,
  Numbering,
  OperationType,
} from '@/interfaces/customs/accounts-payable/TypeOfDocuments'

// Composables
import { useGoToUrl, useMainLoader, useUtils } from '@/composables'

// Stores
import { useTypeOfDocumentsStore } from '@/stores/accounts-payable/type-of-documents'
import { useResourceManagerStore } from '@/stores/resources-manager'

const useTypeOfDocumentsEdit = () => {
  const { goToURL } = useGoToUrl()
  const { openMainLoader } = useMainLoader()
  const { defaultIconsLucide } = useUtils()

  const route = useRoute()
  const id = Number(route.params.id)

  const { _getResources, _resetKeys } = useResourceManagerStore('v1')
  const keys = {
    accounts_payable: [
      'document_types_numbering_type',
      'document_types_operation_type',
      'document_types',
    ],
  }

  const store = useTypeOfDocumentsStore('v1')
  const { type_of_document_form, type_of_document_response } =
    storeToRefs(useTypeOfDocumentsStore('v1'))
  const { _getTypeOfDocumentById, _updateTypeOfDocument, _setFormData } = store

  const basicDataFormRef = ref()

  const dataForForm = ref<ITypeOfDocumentItem | ITypeOfDocumentForm | null>(
    null
  )

  const headerProps = {
    title: 'Editar tipos de documento',
    breadcrumbs: [
      { label: 'Inicio', route: 'HomeView' },
      { label: 'Cuentas por pagar', route: '' },
      { label: 'Gestión de tipos de documento', route: 'TypeOfDocumentsList' },
      { label: 'Editar', route: 'TypeOfDocumentsEdit' },
      { label: `${id}` },
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
  const tabActiveIdx = ref(0)

  const toFormFromResponse = (raw: unknown): ITypeOfDocumentForm | null => {
    if (!raw || typeof raw !== 'object') return null
    const r = raw as Record<string, unknown>
    const strOrNull = (v: unknown) =>
      v === undefined || v === null || v === '' ? null : String(v)

    return {
      name: strOrNull(r.name),
      numbering: strOrNull(r.numbering) as Numbering | null,
      document_type: strOrNull(r.document_type),
      operation_type: strOrNull(r.operation_type) as OperationType | null,
      has_internal_consecutive: !!r.has_internal_consecutive,
      has_client_consecutive: !!r.has_client_consecutive,
      has_order: !!r.has_order,
      has_other_references: !!r.has_other_references,
      has_legalization_date: !!r.has_legalization_date,
      has_expiration_date: !!r.has_expiration_date,
    }
  }

  const buildDataForFormOnce = () => {
    const r = type_of_document_response.value
    const f = type_of_document_form.value

    const rRec: Record<string, unknown> = (r ?? {}) as unknown as Record<
      string,
      unknown
    >
    const fRec: Record<string, unknown> = (f ?? {}) as unknown as Record<
      string,
      unknown
    >

    dataForForm.value = { ...rRec, ...fRec } as unknown as ITypeOfDocumentItem
  }

  const handleEdit = async () => {
    const isValid = await basicDataFormRef.value?.validateForm?.()
    if (!isValid || !type_of_document_form.value) return

    openMainLoader(true)

    const f = type_of_document_form.value
    const payload: ITypeOfDocumentCreatePayload = {
      name: f.name!,
      numbering: f.numbering! as Numbering,
      document_type: f.document_type!,
      operation_type: f.operation_type! as OperationType,
      has_internal_consecutive: !!f.has_internal_consecutive,
      has_client_consecutive: !!f.has_client_consecutive,
      has_order: !!f.has_order,
      has_other_references: !!f.has_other_references,
      has_legalization_date: !!f.has_legalization_date,
      has_expiration_date: !!f.has_expiration_date,
    }

    const ok = await _updateTypeOfDocument(payload, id)
    if (ok) {
      goToURL('TypeOfDocumentsList')
    }
    setTimeout(() => openMainLoader(false), 300)
  }

  onMounted(async () => {
    openMainLoader(true)
    await Promise.all([_getResources(keys), _getTypeOfDocumentById(id)])
    const formFromResp = toFormFromResponse(type_of_document_response.value)
    if (formFromResp) _setFormData(formFromResp)
    buildDataForFormOnce()
    setTimeout(() => openMainLoader(false), 300)
  })

  onBeforeUnmount(() => {
    _resetKeys(keys)
  })

  return {
    headerProps,
    tabs,
    tabActive,
    tabActiveIdx,
    basicDataFormRef,
    dataForForm,
    type_of_document_form,
    type_of_document_response,
    handleEdit,
    goToURL,
    defaultIconsLucide,
    _setFormData,
  }
}

export default useTypeOfDocumentsEdit
