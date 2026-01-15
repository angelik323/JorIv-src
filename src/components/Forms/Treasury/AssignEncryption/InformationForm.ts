import { computed, ref, watch } from 'vue'

import { ActionType } from '@/interfaces/global'
import {
  IAssignEncryptDocument,
  IAssignEncryptDocumentUpdatePayload,
} from '@/interfaces/customs'
import { useAssignEncryptStore, useTreasuryResourceStore } from '@/stores'
import { storeToRefs } from 'pinia'
import { useAlert, useS3Documents } from '@/composables'

const useAssignEncryptionForm = (props: {
  action: ActionType
  data?: IAssignEncryptDocument | null
}) => {
  const { _saveDocumentsS3 } = useS3Documents()
  const { showAlert } = useAlert()
  const { generateFileSign, createAssignEncryption } =
    useAssignEncryptStore('v1')
  const { types_encrypt } = storeToRefs(useTreasuryResourceStore('v1'))
  const fileSelected = ref<File | null>(null)
  const isFileUploaded = ref(false)
  const uploadedDocumentId = ref<number | null>(null)

  const models = ref<
    IAssignEncryptDocument & { document_id?: number; file?: File | null }
  >({
    id: 0,
    bank: '',
    description: '',
    type_format: '',
    apply_encrypt: false,
    path_key: '',
    type_encrypt: '',
    document_id: undefined,
    assign_encrypt_id: 0,
    type_format_id: 0,
    file: null,
  })

  const isEdit = computed(() => props.action === 'edit')

  const allowedExtensions = computed(() =>
    (types_encrypt.value ?? []).map((item) => String(item.value).toLowerCase())
  )

  const onFileSelected = (files: File[] | File | FileList | null) => {
    if (!files) return

    const file = Array.isArray(files)
      ? files[0]
      : files instanceof FileList
      ? files[0]
      : files

    if (!file) return

    const ext = file.name.split('.').pop()?.toLowerCase()

    if (!ext) {
      showAlert('Error: El archivo no tiene extensión válida', 'error')
      return
    }

    if (!allowedExtensions.value.includes(ext)) {
      showAlert(
        `Formato no permitido. Debe seleccionar un archivo con alguna de estas extensiones: ${allowedExtensions.value.join(
          ', '
        )}`,
        'warning',
        undefined,
        3000
      )
      return
    }

    fileSelected.value = file
    isFileUploaded.value = false
    uploadedDocumentId.value = null
  }

  const setFormData = () => {
    if (!props.data) return
    models.value.id = props.data.id ?? 0
    models.value.bank = props.data.bank ?? ''
    models.value.description = props.data.description ?? ''
    models.value.type_format = props.data.type_format ?? ''
    models.value.apply_encrypt = !!props.data.apply_encrypt
    models.value.path_key = props.data.path_key ?? ''
    models.value.type_encrypt = props.data.type_encrypt ?? ''
    models.value.type_format_id = props.data.type_format_id ?? 0

    if (props.data.path_key) {
      models.value.document_id = props.data.id
      uploadedDocumentId.value = props.data.id
      isFileUploaded.value = true
    }
  }

  const getFormDataForUpdate = async (): Promise<{
    payload: IAssignEncryptDocumentUpdatePayload | null
    isCreate: boolean
  }> => {
    if (!models.value.apply_encrypt) {
      return {
        payload: {
          apply_encrypt: false,
          bank_id: models.value.id,
          bank_structure_id: models.value.id,
          assign_encrypt_id: models.value.assign_encrypt_id,
          file: null,
        } as IAssignEncryptDocumentUpdatePayload,
        isCreate: false,
      }
    }

    if (!models.value.type_encrypt) {
      showAlert('Debe seleccionar un tipo de cifrado', 'warning')
      return { payload: null, isCreate: false }
    }

    if (!fileSelected.value) {
      showAlert('Debe seleccionar un archivo', 'warning')
      return { payload: null, isCreate: false }
    }

    const fileName = fileSelected.value.name.toLowerCase()

    const typeToExt: Record<string, string[]> = {
      pgp: ['.pgp'],
      gpg: ['.gpg'],
      zip: ['.zip'],
      'zip-pgp': ['.zip.pgp'],
      'zip-gpg': ['.zip.gpg'],
      asc: ['.asc'],
    }

    const typeEncrypt = models.value.type_encrypt?.toLowerCase()
    const validExts = typeToExt[typeEncrypt] ?? []

    const isValid = validExts.some((ext) => fileName.endsWith(ext))
    if (!isValid) {
      showAlert(
        `Error: El tipo de cifrado "${
          models.value.type_encrypt
        }" solo permite archivos con extensión: ${validExts.join(', ')}`,
        'error'
      )
      return { payload: null, isCreate: false }
    }

    const ext = fileName.split('.').pop()
    if (!ext) {
      showAlert('El archivo no tiene extensión válida', 'warning')
      return { payload: null, isCreate: false }
    }

    const signed = await generateFileSign({
      name: fileSelected.value.name,
      document_type: ext.toUpperCase(),
    })
    if (!signed) return { payload: null, isCreate: false }

    uploadedDocumentId.value = signed.document_id
    models.value.path_key = String(signed.file_path)

    await _saveDocumentsS3([signed.upload_url], [fileSelected.value])
    isFileUploaded.value = true

    const shouldCreate =
      !props.data?.path_key ||
      props.data.path_key === 'N/A' ||
      !props.data?.type_encrypt ||
      props.data.type_encrypt === 'N/A'

    if (shouldCreate) {
      const created = await createAssignEncryption({
        apply_encrypt: models.value.apply_encrypt,
        type_encrypt: models.value.type_encrypt,
        bank_id: models.value.id,
        bank_structure_id: models.value.id,
        assign_encrypt_id: models.value.assign_encrypt_id,
        file: {
          id: signed.document_id,
          is_validated: true,
          path: signed.file_path,
        },
      })

      if (created) {
        models.value.path_key = created.path_key
      }
    }

    return {
      payload: {
        apply_encrypt: models.value.apply_encrypt,
        type_encrypt: models.value.type_encrypt,
        bank_id: models.value.id,
        bank_structure_id: models.value.id,
        assign_encrypt_id: models.value.assign_encrypt_id,
        file: {
          id: signed.document_id,
          is_validated: true,
          path: models.value.path_key,
        },
      },
      isCreate: shouldCreate,
    }
  }

  const typesEncryptOptions = computed(() =>
    ((types_encrypt.value ?? []) as Array<{ value: string | number }>).map(
      (item) => ({
        label: String(item.value),
        value: item.value,
      })
    )
  )

  const hasChanges = computed(() => {
    if (!props.data) return false

    const typeChanged = models.value.type_encrypt !== props.data.type_encrypt
    const fileChanged =
      uploadedDocumentId.value !== props.data.id && isFileUploaded.value
    const applyEncryptChanged =
      models.value.apply_encrypt !== !!props.data.apply_encrypt

    return typeChanged || fileChanged || applyEncryptChanged
  })

  watch(
    () => props.data,
    (newData) => {
      if (newData) setFormData()
    },
    { immediate: true }
  )

  return {
    models,
    isEdit,
    typesEncryptOptions,
    hasChanges,
    allowedExtensions,
    onFileSelected,
    getFormDataForUpdate,
  }
}

export default useAssignEncryptionForm
