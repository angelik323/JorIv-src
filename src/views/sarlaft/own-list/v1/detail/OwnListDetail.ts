// Vue - router - quasar
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'

// Interfaces - constants
import {
  IOwnListThirdPartyFile,
  IOwnListForm,
  IOwnListLoadedListItem,
} from '@/interfaces/customs/sarlaft/OwnList'
import { sarlaft_file_processing_status_success } from '@/constants/resources/sarlaft'
import { ITabs } from '@/interfaces/global'

// Composables
import { useMainLoader } from '@/components/loader/composable/useMainLoader'
import { useUtils } from '@/composables/useUtils'
import { useGoToUrl } from '@/composables/useGoToUrl'

// Store
import { useOwnListStore } from '@/stores/sarlaft/own-list'

const useOwnListDetail = () => {
  const { params } = useRoute()
  const ownListStore = useOwnListStore()
  const { defaultIconsLucide } = useUtils()
  const { goToURL } = useGoToUrl()
  const { openMainLoader } = useMainLoader()

  const headerProps = {
    title: 'Detalle listas propias',
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
        label: 'Detalle',
        route: 'SarlaftOwnListDetail',
      },
      {
        label: params.id as string,
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
  const fileProcessingStatus = sarlaft_file_processing_status_success

  const formData = ref<IOwnListForm>({
    code: '',
    name_list: '',
  })
  const initialFile = ref<IOwnListThirdPartyFile | null>(null)
  const loadedListData = ref<IOwnListLoadedListItem[]>([])

  const loadData = async () => {
    openMainLoader(true)
    const response = await ownListStore._getOwnListDetail(params.id as string)
    if (response) {
      formData.value = response.basic_data
      initialFile.value = {
        id: 1,
        name: response.info_file.file_name,
        totalRegisters: response.info_file.total_number_records,
        key_data: '',
      }
      loadedListData.value = response.list_loaded.map((item) => {
        return {
          id: item.id,
          identificationType: item.type_identification,
          identificationNumber: item.identification_number,
          name: item.name,
        }
      })
    }
    openMainLoader(false)
  }

  onMounted(() => {
    loadData()
  })

  return {
    headerProps,
    defaultIconsLucide,
    tabs,
    formData,
    initialFile,
    fileProcessingStatus,
    loadedListData,
    goToURL,
  }
}

export default useOwnListDetail
