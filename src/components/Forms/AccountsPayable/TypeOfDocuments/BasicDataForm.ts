// Vue
import { ref, watch } from 'vue'
import { storeToRefs } from 'pinia'

// Composables
import { useRules, useUtils } from '@/composables'

// Interfaces
import { ActionType, IResource } from '@/interfaces/global'
import {
  ITypeOfDocumentForm,
  ITypeOfDocumentItem,
  Numbering,
  OperationType,
} from '@/interfaces/customs/accounts-payable/TypeOfDocuments'

// Stores
import { useAccountsPayableResourceStore } from '@/stores/resources-manager/accounts-payable'

// Constants
import { default_statuses } from '@/constants/resources'

const useBasicDataForm = (
  props: {
    action?: ActionType
    data?: ITypeOfDocumentForm | ITypeOfDocumentItem | null
  },
  emit: (e: 'update:data', v: ITypeOfDocumentForm | null) => void
) => {
  const { is_required,max_length,only_alphanumeric } = useRules()
  const { isEmptyOrZero } = useUtils()

  const basicDataFormRef = ref()

  const models = ref<ITypeOfDocumentForm>({
    name: null,
    numbering: null,
    document_type: null,
    operation_type: null,
    has_internal_consecutive: false,
    has_client_consecutive: false,
    has_order: false,
    has_other_references: false,
    has_legalization_date: false,
    has_expiration_date: false,
  })

  const toForm = (
    val: ITypeOfDocumentForm | ITypeOfDocumentItem
  ): ITypeOfDocumentForm => {
    const name = 'name' in val ? (val.name as string | null) ?? null : null
    const numbering =
      'numbering' in val ? (val.numbering as Numbering | null) ?? null : null
    const document_type =
      'document_type' in val
        ? (val.document_type as string | null) ?? null
        : null
    const operation_type =
      'operation_type' in val
        ? (val.operation_type as OperationType | null) ?? null
        : null

    const has_internal_consecutive =
      'has_internal_consecutive' in val
        ? Boolean(val.has_internal_consecutive)
        : false
    const has_client_consecutive =
      'has_client_consecutive' in val
        ? Boolean(val.has_client_consecutive)
        : false
    const has_order = 'has_order' in val ? Boolean(val.has_order) : false
    const has_other_references =
      'has_other_references' in val ? Boolean(val.has_other_references) : false
    const has_legalization_date =
      'has_legalization_date' in val
        ? Boolean(val.has_legalization_date)
        : false
    const has_expiration_date =
      'has_expiration_date' in val ? Boolean(val.has_expiration_date) : false

    return {
      name,
      numbering,
      document_type,
      operation_type,
      has_internal_consecutive,
      has_client_consecutive,
      has_order,
      has_other_references,
      has_legalization_date,
      has_expiration_date,
    }
  }

  const {
    document_types_numbering_type,
    document_types_operation_type,
    document_types,
  } = storeToRefs(useAccountsPayableResourceStore('v1'))

  const numberingOptions = ref<IResource[]>([])
  const operationTypeOptions = ref<IResource[]>([])
  const documentTypeOptions = ref<IResource[]>([])

  watch(
    () => document_types_numbering_type.value,
    (val) => {
      numberingOptions.value = Array.isArray(val)
        ? (val as unknown as IResource[])
        : []
    },
    { immediate: true }
  )

  watch(
    () => document_types_operation_type.value,
    (val) => {
      operationTypeOptions.value = Array.isArray(val)
        ? (val as unknown as IResource[])
        : []
    },
    { immediate: true }
  )

  watch(
    () => document_types.value,
    (val) => {
      documentTypeOptions.value = Array.isArray(val)
        ? (val as unknown as IResource[])
        : []
    },
    { immediate: true }
  )

  watch(
    () => models.value,
    (val) => {
      if (JSON.stringify(val) === JSON.stringify(props.data)) return
      emit('update:data', isEmptyOrZero(val) ? null : val)
    },
    { deep: true }
  )

  watch(
    () => props.data,
    (val) => {
      if (val) models.value = toForm(val)
    },
    { immediate: true }
  )

  const isEdit = ref<boolean>(props.action === 'edit')

  const readOnlyCode = ref<string>('')
  const readOnlyStatusId = ref<number | null>(null)

  watch(
    () => props.data,
    (d) => {
      const item = d as ITypeOfDocumentItem | null | undefined
      readOnlyCode.value = item?.code ?? ''
      readOnlyStatusId.value = item?.status?.id ?? null
    },
    { immediate: true }
  )

  const statusOptions = default_statuses as unknown as IResource[]

  return {
    basicDataFormRef,
    models,
    numberingOptions,
    documentTypeOptions,
    operationTypeOptions,
    isEdit,
    readOnlyCode,
    readOnlyStatusId,
    statusOptions,
    is_required,
    max_length,
    only_alphanumeric
  }
}

export default useBasicDataForm
