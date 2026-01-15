// Vue
import { computed, ref, watch } from 'vue'
import { QTable } from 'quasar'

// Interfaces
import {
  IDocumentsFormAdditions,
  IDataTableDocuments,
  IBasicDataFormAdditions,
} from '@/interfaces/customs/derivative-contracting/RegisterAdditions'
import { ActionType } from '@/interfaces/global'

// Composables
import { useUtils } from '@/composables'

// Stores
import { useRegisterAdditionsStore } from '@/stores'
import { storeToRefs } from 'pinia'

const useDocumentForm = (
  props: {
    data: IDocumentsFormAdditions | null
    basic_data: IBasicDataFormAdditions | null
    action: ActionType
  },
  emit: Function
) => {
  const { register_additions_response } = storeToRefs(
    useRegisterAdditionsStore('v1')
  )
  const { attach_documents } = storeToRefs(useRegisterAdditionsStore('v1'))

  const { defaultIconsLucide, isEmptyOrZero, formatDate } = useUtils()

  const formDocument = ref()

  const initialModelsValues: IDocumentsFormAdditions = {
    attached_documents: [],
  }
  const models = ref<typeof initialModelsValues>({ ...initialModelsValues })

  const dataUpload = computed<IDataTableDocuments[]>(() => {
    const responseDocs =
      register_additions_response.value?.document_attachments ?? []
    const baseList = attach_documents.value ?? []
    const userList = models.value.attached_documents ?? []

    return baseList.map((e) => {
      const userItem = userList.find((u) => String(u.id) === String(e.id))
      if (userItem) return userItem

      const doc =
        responseDocs.find(
          (d) => String(d.contract_attachment_id) === String(e.id)
        ) ?? null

      return {
        position: 0,
        class: 'mt-1',
        title: e.annex_document?.name ?? 'Sin definir',
        subtitle: '',
        required: e.mandatory == 'Obligatorio',
        file:
          props.action !== 'create'
            ? doc
              ? {
                  url: doc.attachment?.full_path,
                  name: doc.attachment?.original_name,
                  file_type: doc.attachment?.file_type,
                  contract_attachment_id: doc.contract_attachment_id,
                  attachment_id: doc.attachment_id,
                }
              : null
            : null,
        id: e.id,
      }
    })
  })

  const _setValueModel = () => {
    if (!props.data) return
    models.value = { ...props.data }
  }

  const handleFileChange = async (file: File | object | null, name: string) => {
    if (!file) return

    // clone the current list
    const newList = [...dataUpload.value]

    const index = newList.findIndex((doc) => doc.title === name)
    if (index === -1) return

    newList[index] = {
      ...newList[index],
      file, // add the actual File object
    }

    // update the model so the UI stays in sync
    models.value.attached_documents = newList
  }

  const tablePropsDocuments = ref({
    loading: false,
    columns: [
      {
        name: 'id',
        field: 'id',
        required: false,
        label: '#',
        align: 'center',
        sortable: true,
      },
      {
        name: 'date',
        field: 'date',
        required: true,
        label: 'Fecha de carga',
        align: 'left',
        sortable: true,
        format: (val) => formatDate(val, 'YYYY-MM-DD'),
      },
      {
        name: 'name',
        field: 'name',
        required: true,
        label: 'Nombre',
        align: 'left',
        sortable: true,
      },
      {
        name: 'actions',
        field: 'actions',
        required: true,
        label: 'Acciones',
        align: 'center',
        sortable: true,
      },
    ] as QTable['columns'],
    rows: computed(() => models.value.attached_documents ?? []),
  })

  const downloadFile = async (file: { url: string; name: string }) => {
    if (!file.url) return
    await useUtils().downloadFile(file.url, file.name)
  }

  watch(
    () => props.data,
    (val) => {
      if (!val) return
      _setValueModel()
    },
    { deep: true, immediate: true }
  )

  watch(
    models,
    (val) => {
      if (JSON.stringify(val) === JSON.stringify(props.data)) return
      emit('update:data', isEmptyOrZero(val) ? null : val)
    },
    { deep: true }
  )

  return {
    dataUpload,
    formDocument,
    tablePropsDocuments,
    defaultIconsLucide,
    handleFileChange,
    downloadFile,
  }
}

export default useDocumentForm
