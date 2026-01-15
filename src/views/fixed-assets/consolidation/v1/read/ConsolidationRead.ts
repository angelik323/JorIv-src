// vue -quasar -pinia
import { onBeforeMount, onUnmounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'

// interfaces
import { ITabs } from '@/interfaces/customs/Tab'
import {
  IConsolidationDocumentsForm,
  IConsolidationInformationForm,
  IFileConsolidation,
} from '@/interfaces/customs/fixed-assets/v1/Consolidation'

// composables
import { useMainLoader } from '@/components/loader/composable/useMainLoader'
import { useUtils } from '@/composables/useUtils'

// stores
import { useConsolidationStore } from '@/stores/fixed-assets/consolidation'

const useConsolidationRead = () => {
  // router
  const router = useRouter()
  const route = useRoute()
  const searchId = +route.params.id

  // loader
  const { openMainLoader } = useMainLoader()

  const { headerPropsDefault } = storeToRefs(useConsolidationStore('v1'))

  const { _getByIdConsolidation } = useConsolidationStore('v1')
  const { defaultIconsLucide, getFileFromS3 } = useUtils()

  // breadcrumb
  const headerPropsCreate = {
    title: 'Ver englobe',
    breadcrumbs: [
      ...headerPropsDefault.value.breadcrumbs,
      ...[
        {
          label: 'Ver',
          route: 'ConsolidationRead',
        },
        {
          label: `${searchId}`,
        },
      ],
    ],
  }

  // refs
  const isLoading = ref(true)
  const responseData = ref()

  // form refs
  const formInformation = ref()
  const formDocuments = ref()

  // init data children
  const getInformationFormData = ref<IConsolidationInformationForm | null>(null)
  const getDocumentsFormData = ref<IConsolidationDocumentsForm[]>([])

  // set data children
  const setInformationFormData = (
    data: IConsolidationInformationForm | null
  ) => {
    getInformationFormData.value = data
  }

  const setDocumentsFormData = (data: IConsolidationDocumentsForm[]) => {
    getDocumentsFormData.value = data
  }

  // tabs
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
    {
      name: 'documents',
      label: 'Documentos',
      icon: defaultIconsLucide.file,
      outlined: true,
      disable: true,
      show: true,
      required: false,
    },
  ])

  const [initialTab] = tabs.value
  const tabActive = ref(initialTab.name)

  const tabActiveIdx = ref(tabs.value.indexOf(initialTab))

  const nextTab = async () => {
    tabActiveIdx.value = tabActiveIdx.value + 1
    tabActive.value = tabs.value[tabActiveIdx.value].name
  }

  const backTab = () => {
    tabActiveIdx.value = tabActiveIdx.value - 1
    tabActive.value = tabs.value[tabActiveIdx.value].name
  }

  // actions
  const onSubmit = async () => {
    return goToList()
  }

  const goToList = () => {
    router.push({ name: 'ConsolidationList' })
  }

  // lifecycles
  onBeforeMount(async () => {
    isLoading.value = true
    openMainLoader(true)

    responseData.value = await _getByIdConsolidation(searchId)
    isLoading.value = false

    setTimeout(() => {
      openMainLoader(false)
    }, 5000)
  })

  onUnmounted(() => {
    responseData.value = null
    getInformationFormData.value = null
    getDocumentsFormData.value = []
    isLoading.value = false
  })

  // watches
  watch(
    () => responseData.value,
    async (val) => {
      if (!val) return

      setInformationFormData(val)

      if (val.consolidated_fixed_asset?.documents) {
        try {
          const documentsBase = val.consolidated_fixed_asset.documents.map(
            (item: IFileConsolidation) => ({
              ...item,
              file: undefined,
              is_new: false,
              to_delete: false,
            })
          )

          getDocumentsFormData.value = documentsBase

          const filesWithBlobs = await Promise.all(
            val.consolidated_fixed_asset.documents.map(
              async (item: IFileConsolidation) => {
                try {
                  const fileBlob = await getFileFromS3(
                    item.s3_file_path ?? '',
                    item.original_name ?? item.name ?? ''
                  )

                  return {
                    ...item,
                    file: fileBlob,
                    is_new: false,
                    to_delete: false,
                  }
                } catch (error) {
                  return {
                    ...item,
                    file: undefined,
                    is_new: false,
                    to_delete: false,
                  }
                }
              }
            )
          )

          // Actualizar con los archivos descargados
          getDocumentsFormData.value = filesWithBlobs
        } catch (error) {}
      } else {
        getDocumentsFormData.value = []
      }
    },
    { deep: true, immediate: true }
  )

  return {
    // refs
    responseData,
    isLoading,
    headerPropsCreate,
    tabs,
    tabActive,
    tabActiveIdx,
    formInformation,
    formDocuments,
    getInformationFormData,
    getDocumentsFormData,
    defaultIconsLucide,

    // functions
    nextTab,
    backTab,
    onSubmit,
    setInformationFormData,
    setDocumentsFormData,
    goToList,
  }
}

export default useConsolidationRead
