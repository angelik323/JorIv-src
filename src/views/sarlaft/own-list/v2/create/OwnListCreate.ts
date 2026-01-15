// Vue - router - quasar
import { computed, ref } from 'vue'

// Interfaces - constants
import {
  IOwnListThirdPartyFile,
  IOwnListImportThirdPartyRecord,
  IOwnListLoadedListItem,
} from '@/interfaces/customs/sarlaft/OwnList'
import { ITabs } from '@/interfaces/global'

// Composables
import { useMainLoader } from '@/components/loader/composable/useMainLoader'
import { useUtils } from '@/composables/useUtils'
import { useGoToUrl } from '@/composables/useGoToUrl'

// Stores
import { useOwnListStore } from '@/stores/sarlaft/own-list'

const useOwnListCreate = () => {
  const { openMainLoader } = useMainLoader()
  const { defaultIconsLucide } = useUtils()
  const { goToURL } = useGoToUrl()

  const ownListStore = useOwnListStore()

  const headerProps = {
    title: 'Crear listas propias',
    breadcrumbs: [
      {
        label: 'Inicio',
        route: 'HomeView',
      },
      {
        label: 'Sarlaft',
      },
      {
        label: 'Listas propias',
        route: 'SarlaftOwnList',
      },
      {
        label: 'Crear',
        route: 'SarlaftOwnListCreate',
      },
    ],
  }
  const tabs: ITabs[] = [
    {
      name: 'BasicData',
      label: 'Datos básicos',
      icon: defaultIconsLucide.listBulleted,
      outlined: true,
      show: true,
      required: true,
      disable: false,
    },
  ]

  const filesSelected = ref<IOwnListThirdPartyFile | null>(null)
  const fileProcessingStatus = ref<{
    statusId: number
    progress: number
  } | null>(null)

  const basicDataFormRef = ref()
  const loadedThirdPartyData = ref<IOwnListLoadedListItem[]>([])
  const loadedThirdPartyPages = ref({
    currentPage: 1,
    lastPage: 2,
  })

  const formIsValid = computed(() => {
    return (
      (basicDataFormRef.value?.isValid &&
        filesSelected.value?.statusId === 104 &&
        loadedThirdPartyData.value.length > 0) ??
      false
    )
  })

  const onFileAdded = async (_file: File) => {
    filesSelected.value = {
      name: _file.name,
      totalRegisters: 0,
      statusId: 20, // Loading
      progress: 0,
    }
    fileProcessingStatus.value = {
      statusId: 20,
      progress: 0,
    }
    await changeBarNumber(50)
    const { errors, ...response } = await ownListStore._importOwnList({
      file: _file,
      listName: basicDataFormRef.value?.formValues.name_list,
    })
    await changeBarNumber(100)

    filesSelected.value.key_data = response.key_data

    if (errors) {
      if (filesSelected.value) {
        filesSelected.value = {
          ...filesSelected.value,
          statusId: 30, // Error
          progress: 0,
          errorMessage: 'Error al cargar el archivo',
        }
        fileProcessingStatus.value = {
          statusId: 30,
          progress: 0,
        }
      }
      return
    }

    if (filesSelected.value) {
      filesSelected.value = {
        ...filesSelected.value,
        statusId: 104, // Success
        totalRegisters: response?.info_file?.total_number_records || 0,
        key_data: response.key_data,
      }
      fileProcessingStatus.value = {
        statusId: 104,
        progress: 1,
      }
      setThirdsList(response?.list_loaded || [])
    }
  }

  const onSubmit = async () => {
    const isValid = await basicDataFormRef.value?.validateForm()
    if (!isValid) return

    if (filesSelected.value?.key_data) {
      openMainLoader(true)
      await ownListStore
        ._confirmImport(filesSelected.value.key_data)
        .finally(() => {
          openMainLoader(false)
        })
      goToURL('SarlaftOwnList')
    }
  }

  const changeBarNumber = (targetPercentage: number): Promise<void> => {
    return new Promise((resolve) => {
      if (!filesSelected.value) {
        resolve()
        return
      }

      let current = (filesSelected.value.progress || 0) * 100
      const interval = setInterval(() => {
        if (!filesSelected.value || filesSelected.value.statusId !== 20) {
          clearInterval(interval)
          resolve()
          return
        }

        if (current >= targetPercentage) {
          clearInterval(interval)
          resolve()
          return
        }
        current++
        filesSelected.value.progress = current / 100
        if (fileProcessingStatus.value) {
          fileProcessingStatus.value.progress = current / 100
        }
      }, 70)
    })
  }

  const onRemoveFile = () => {
    filesSelected.value = null
    fileProcessingStatus.value = null
    setThirdsList([])
  }

  const onDownloadFileErrors = async () => {
    if (filesSelected.value?.key_data) {
      await ownListStore._downloadErrors(filesSelected.value.key_data)
    }
  }

  const onDownloadTemplate = async () => {
    await ownListStore._downloadTemplate()
  }

  const setThirdsList = (thirds: IOwnListImportThirdPartyRecord[]) => {
    loadedThirdPartyData.value = thirds.map((third, index) => ({
      id: index + 1,
      identificationType: third.type_identification,
      identificationNumber: third.identification_number,
      name: third.name,
    }))
  }

  return {
    headerProps,
    defaultIconsLucide,
    tabs,
    basicDataFormRef,
    formIsValid,
    loadedThirdPartyData,
    loadedThirdPartyPages,
    filesSelected,
    fileProcessingStatus,
    onSubmit,
    goToURL,
    onFileAdded,
    onRemoveFile,
    onDownloadFileErrors,
    onDownloadTemplate,
  }
}

export default useOwnListCreate
