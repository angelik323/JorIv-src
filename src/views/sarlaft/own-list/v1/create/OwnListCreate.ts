// Vue - router - quasar
import { computed, ref } from 'vue'

// Interfaces - constants
import {
  IOwnListThirdPartyFile,
  IOwnListImportThirdPartyRecord,
  IOwnListLoadedListItem,
} from '@/interfaces/customs/sarlaft/OwnList'
import { ITabs } from '@/interfaces/global'
import { sarlaft_file_processing_status_default } from '@/constants/resources/sarlaft'

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
  const basicDataFormRef = ref()
  const loadedThirdPartyData = ref<IOwnListLoadedListItem[]>([])
  const loadedThirdPartyPages = ref({
    currentPage: 1,
    lastPage: 2,
  })
  const fileProcessingStatus = ref<{
    statusId: number
    progress: number
  }>(sarlaft_file_processing_status_default)

  const formIsValid = computed(() => {
    return (
      (basicDataFormRef.value?.isValid &&
        filesSelected &&
        loadedThirdPartyData.value.length > 0) ??
      false
    )
  })

  const onFileAdded = async (_file: File) => {
    try {
      fileProcessingStatus.value = { ...sarlaft_file_processing_status_default }
      setFileSelected(_file, 0)

      const { errors, ...response } = await ownListStore._importOwnList({
        file: _file,
        listName: basicDataFormRef.value?.formValues.name_list,
      })
      await changeBarNumber(100)

      if (errors) {
        setFileUploadStatus('error')
        return
      }

      setFileUploadStatus('success')
      setFileSelected(
        _file,
        response.info_file?.total_number_records || 0,
        response.key_data
      )
      setThirdsList(response.list_loaded || [])
    } catch (error) {
      setFileUploadStatus('error')
    }
  }

  const onSubmit = async () => {
    const isValid = await basicDataFormRef.value?.validateForm()
    if (!isValid) return

    openMainLoader(true)
    await ownListStore
      ._confirmImport(filesSelected.value?.key_data as string)
      .finally(() => {
        openMainLoader(false)
      })
    goToURL('SarlaftOwnList')
  }

  const changeBarNumber = (targetPercentage: number): Promise<void> => {
    return new Promise((resolve) => {
      let current = fileProcessingStatus.value?.progress * 100
      const interval = setInterval(() => {
        if (
          current >= targetPercentage &&
          fileProcessingStatus.value?.progress
        ) {
          clearInterval(interval)
          resolve()
          return
        }
        current++
        fileProcessingStatus.value.progress = current / 100
      }, 50)
    })
  }

  const onRemoveFile = () => {
    filesSelected.value = null
    setThirdsList([])
  }

  const setFileSelected = (
    file: File,
    totalRegisters: number,
    keyData?: string
  ) => {
    filesSelected.value = {
      id: 1,
      name: file.name,
      totalRegisters: totalRegisters,
      key_data: keyData,
    }
  }

  const setFileUploadStatus = (status: 'pending' | 'success' | 'error') => {
    switch (status) {
      case 'pending':
        fileProcessingStatus.value.statusId = 20
        break
      case 'success':
        fileProcessingStatus.value.statusId = 104
        break
      case 'error':
        fileProcessingStatus.value.statusId = 30
        break
    }
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
    fileProcessingStatus,
    filesSelected,
    onSubmit,
    goToURL,
    onFileAdded,
    onRemoveFile,
  }
}

export default useOwnListCreate
