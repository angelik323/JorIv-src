import { reactive } from 'vue'
export const useDownloaderComponent = () => {
  // Downloader Parameters
  const downloaderConfig = reactive({
    title: '',
    isOpen: false,
    isLoading: false,
    loadingMessage: 'Descargando documento....',
    fileConfig: {
      url: '',
      type: '',
      mimeType: '',
      permission: true,
    },
  })

  // Downloader Actions
  const closeDownloader = () => {
    downloaderConfig.isOpen = false
  }

  const downloadViewPDF = (url: string) => {
    downloaderConfig.title = ''
    downloaderConfig.fileConfig.url = url
    downloaderConfig.fileConfig.mimeType = 'application/pdf'
    downloaderConfig.fileConfig.type = 'pdf'
    downloaderConfig.fileConfig.permission = false
    downloaderConfig.isOpen = true
  }

  return {
    downloaderConfig,
    closeDownloader,
    downloadViewPDF,
  }
}
