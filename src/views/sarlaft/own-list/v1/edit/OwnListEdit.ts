// Vue - router - quasar
import { computed, ref, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'

// Interfaces
import { ITabs } from '@/interfaces/global'
import {
  IOwnListForm,
  IOwnListLoadedListItem,
  IOwnListThirdPartyFile,
  IOwnListUpdateNewRecord,
} from '@/interfaces/customs/sarlaft/OwnList'

// Composables
import { useMainLoader } from '@/components/loader/composable/useMainLoader'
import { useUtils } from '@/composables/useUtils'
import { useGoToUrl } from '@/composables/useGoToUrl'

// Stores
import { useOwnListStore } from '@/stores/sarlaft/own-list'

const useOwnListEdit = () => {
  const { params } = useRoute()

  const { defaultIconsLucide } = useUtils()
  const ownListStore = useOwnListStore()
  const { goToURL } = useGoToUrl()
  const { openMainLoader } = useMainLoader()

  const headerProps = {
    title: 'Editar listas propias',
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
        label: 'Editar',
        route: 'SarlaftOwnListEdit',
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

  const basicDataFormRef = ref()
  const alertModalRef = ref()
  const formData = ref<IOwnListForm>({
    code: '',
    name_list: '',
  })
  const openDialog = ref(false)
  const initialFile = ref<IOwnListThirdPartyFile | null>(null)
  const fileProcessingStatus = ref<{
    statusId: number
    progress: number
  } | null>({
    statusId: 104,
    progress: 1,
  })
  const loadedListData = ref<IOwnListLoadedListItem[]>([])
  const addThirdFormRef = ref()
  const deletedIds = ref<number[]>([])
  const newRecords = ref<IOwnListUpdateNewRecord[]>([])

  const formIsValid = computed(() => {
    return (
      (basicDataFormRef.value?.isValid && loadedListData.value.length > 0) ??
      false
    )
  })

  watch(openDialog, (val) => {
    if (val) {
      alertModalRef.value?.openModal()
    } else {
      alertModalRef.value?.closeModal()
    }
  })

  const loadData = async () => {
    openMainLoader(true)
    const response = await ownListStore._getOwnListDetail(params.id as string)
    if (response) {
      formData.value = response.basic_data
      loadedListData.value = response.list_loaded.map((item) => {
        return {
          id: item.id,
          identificationType: item.type_identification,
          identificationNumber: item.identification_number,
          name: item.name,
        }
      })
      initialFile.value = {
        id: 1,
        name: response.info_file.file_name,
        totalRegisters: response.info_file.total_number_records,
      }
    }
    openMainLoader(false)
  }

  const onAddManualEntry = () => {
    addThirdFormRef.value?.resetForm()
    openDialog.value = true
  }

  const onConfirmAddEntry = async () => {
    const isValid = await addThirdFormRef.value?.validateForm()
    if (!isValid) return

    const formValues = addThirdFormRef.value?.formValues

    loadedListData.value.push({
      identificationType: formValues.identificationType,
      identificationNumber: formValues.identificationNumber,
      name: formValues.name,
    })

    newRecords.value.push({
      name: formValues.name,
      identification_number: formValues.identificationNumber,
      type_identification: formValues.identificationType,
    })

    openDialog.value = false
  }

  const onDeleteRow = (row: IOwnListLoadedListItem) => {
    if (row.id) {
      deletedIds.value.push(row.id)
    } else {
      newRecords.value = newRecords.value.filter(
        (item) => item.identification_number !== row.identificationNumber
      )
    }
    loadedListData.value = loadedListData.value.filter(
      (item) => item.identificationNumber !== row.identificationNumber
    )
  }

  const onSubmit = async () => {
    const isValid = await basicDataFormRef.value?.validateForm()
    if (!isValid) return
    const payload = {
      id_to_delete: deletedIds.value,
      new_list: newRecords.value,
      list_name: basicDataFormRef.value?.formValues.name_list,
    }
    openMainLoader(true)
    const response = await ownListStore._updateOwnList(
      params.id as string,
      payload
    )
    openMainLoader(false)
    if (response) {
      goToURL('SarlaftOwnList')
    }
  }

  onMounted(() => {
    loadData()
  })

  return {
    onSubmit,
    goToURL,
    onAddManualEntry,
    onConfirmAddEntry,
    onDeleteRow,
    headerProps,
    defaultIconsLucide,
    tabs,
    basicDataFormRef,
    formData,
    initialFile,
    fileProcessingStatus,
    formIsValid,
    loadedListData,
    openDialog,
    addThirdFormRef,
    alertModalRef,
  }
}

export default useOwnListEdit
