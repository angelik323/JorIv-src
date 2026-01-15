import { onMounted } from 'vue'
import { useAlert } from '@/composables'

const useButtonFileComponent = (emit: any) => {
  let fileInput: HTMLInputElement
  const { showAlert } = useAlert()

  const handleFileUpload = () => {
    if (fileInput.files) {
      if (fileInput.files.length > 1) {
        showAlert(
          'Solo puede seleccionar un archivo',
          'negative',
          undefined,
          4000
        )
      } else {
        if (fileInput.files.length === 1) {
          emit('setFile', fileInput.files[0])
        }
      }
    }
  }

  const openWindowUploadFile = () => {
    fileInput.click()
  }

  onMounted(() => {
    fileInput = document.getElementById('fileInput') as HTMLInputElement
    fileInput.addEventListener('change', handleFileUpload)
  })

  return {
    openWindowUploadFile,
    handleFileUpload,
  }
}

export default useButtonFileComponent
