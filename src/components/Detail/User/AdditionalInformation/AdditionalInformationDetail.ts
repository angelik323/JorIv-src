import { useAlert } from '@/composables'
import { useAdditionalInformationFormStore, useUserStore } from '@/stores'
import { storeToRefs } from 'pinia'
import { QTable } from 'quasar'
import { ref, toRaw } from 'vue'

export const useAdditionalInformationDetail = () => {
  const { showAlert } = useAlert()
  const { fileRowList } = storeToRefs(useAdditionalInformationFormStore())
  const { userData } = useUserStore()

  const viewerFileComponentRef = ref()

  const tableProps = ref({
    title: 'Listado de documentos anexos',
    loading: false,
    rows: fileRowList.value,
    columns: [
      {
        name: 'description',
        required: true,
        label: 'Descripción',
        align: 'left',
        field: 'description',
        sortable: false,
        style: {
          'white-space': 'pre-wrap',
          'max-width': '200px',
        },
      },
      {
        name: 'attach',
        required: true,
        label: 'Adjunto',
        align: 'center',
        field: 'attach',
        sortable: false,
      },
    ] as QTable['columns'],
  })

  const viewFile = async (fileProxy: File | null) => {
    if (!fileProxy) {
      return showAlert(`No hay archivo para mostrar`, 'error', undefined, 1000)
    }
    await viewerFileComponentRef.value.showFile(toRaw(fileProxy))
  }

  return { tableProps, viewerFileComponentRef, userData, viewFile }
}
