// Vue - Vue Router - Pinia - Quasar
import { onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { storeToRefs } from 'pinia'
import { QTable } from 'quasar'

// Interfaces
import { IBulkUploadTemplatesList } from '@/interfaces/customs/fics/BulkUploadTemplates'
import { IResource, ITabs } from '@/interfaces/global'

// Composables
import { useAlert, useGoToUrl, useMainLoader, useUtils } from '@/composables'

// Stores
import { useBulkUploadTemplatesStore } from '@/stores/fics/bulk-upload-templates'
import { useFicResourceStore } from '@/stores/resources-manager/fics'
import { useResourceManagerStore } from '@/stores/resources-manager'

const useBulkUploadTemplatesEdit = () => {
  const { openMainLoader } = useMainLoader()
  const { defaultIconsLucide } = useUtils()
  const { showAlert } = useAlert()
  const { goToURL } = useGoToUrl()
  const route = useRoute()

  const { monetary_operation_columns } = storeToRefs(useFicResourceStore('v1'))
  const { _getResources, _resetKeys } = useResourceManagerStore('v1')
  const { _getByIdBulkUploadTemplates, _updateBulkUploadTemplates } =
    useBulkUploadTemplatesStore('v1')

  const operation_columns = ref<IResource[]>([])
  const informationFormRef = ref()
  const alertModalRef = ref()

  const id = Array.isArray(route.params.id)
    ? route.params.id[0]
    : route.params.id

  const keys = { fics: ['monetary_operation_columns'] }

  const alertModalConfig = ref({
    title: 'Advertencia',
    description: '',
    entityId: null as number | null,
  })

  const headerProps = {
    title: 'Editar plantilla',
    breadcrumbs: [
      {
        label: 'Inicio',
        route: 'HomeView',
      },
      {
        label: 'Fics',
      },
      {
        label: 'Cargues masivos',
        route: 'FicsBulkUploadList',
      },
      {
        label: 'Plantillas de cargues masivos',
        route: 'BulkUploadTemplatesList',
      },
      {
        label: 'Editar',
        route: 'BulkUploadTemplatesEdit',
      },
      {
        label: id,
      },
    ],
  }

  const tabs: ITabs[] = [
    {
      name: 'information',
      label: 'Datos básicos',
      icon: defaultIconsLucide.bulletList,
      outlined: true,
      disable: true,
      show: true,
      required: true,
    },
  ]

  const tableProps = ref({
    title: 'Columnas de la plantilla',
    loading: false,
    columns: [
      {
        name: 'id',
        required: false,
        label: '#',
        align: 'left',
        field: 'id',
        sortable: true,
      },
      {
        name: 'id',
        required: false,
        label: 'Número de columna',
        align: 'left',
        field: 'id',
        sortable: true,
      },
      {
        name: 'name',
        required: false,
        label: 'Descripción',
        align: 'left',
        field: 'name',
        sortable: true,
      },
      {
        name: 'actions',
        required: true,
        label: 'Acciones',
        align: 'center',
        field: 'actions',
      },
    ] as QTable['columns'],
    rows: [] as IBulkUploadTemplatesList[],
    pages: [],
  })

  const tabActive = tabs[0].name
  const tabActiveIdx = 0

  const handleGoToBack = () =>
    goToURL('BulkUploadTemplatesList', undefined, { reload: true })

  const makeDataRequest = () => {
    return {
      optional_columns: tableProps.value.rows.map((r) => ({ id: r.id })),
    }
  }

  const validateForm = async () => {
    return (await informationFormRef.value?.validateForm()) ?? false
  }

  const handleSubmitForm = async () => {
    if (!(await validateForm())) {
      showAlert('El registro no pudo ser creado.', 'error')
      return
    }

    openMainLoader(true)
    const payload = makeDataRequest()
    const success = await _updateBulkUploadTemplates(payload, Number(id))

    if (success) {
      handleGoToBack()
    }
    openMainLoader(false)
  }

  const openAlertModal = async () => {
    alertModalConfig.value.description = setAlertModalDescription()
    await alertModalRef.value.openModal()
  }

  const setAlertModalDescription = () => {
    return `Agregar nueva columna`
  }

  const clearFields = () => {
    informationFormRef.value.models.selector_modal = ''
  }

  const addColumns = async () => {
    await alertModalRef.value.closeModal()

    const findItem = operation_columns.value.find(
      (item) => item.value === informationFormRef.value.models.selector_modal
    )

    clearFields()
    tableProps.value.rows = [
      ...tableProps.value.rows,
      {
        id: findItem?.id,
        colum_number: findItem?.id,
        name: findItem?.name,
      },
    ]
  }

  const deleteColumns = async (id: number) => {
    const rows = [...tableProps.value.rows]
    tableProps.value.rows = rows.filter((row) => row.id !== id)
  }

  const handleCloseModal = () => {
    clearFields()
    alertModalRef.value?.closeModal?.()
  }

  onMounted(async () => {
    await _getByIdBulkUploadTemplates(Number(id))
  })

  onBeforeUnmount(() => _resetKeys(keys))

  watch(
    () => monetary_operation_columns.value,
    () => {
      operation_columns.value = monetary_operation_columns.value
    },
    { deep: true }
  )

  watch(
    () => informationFormRef.value?.models.columns,
    () => {
      tableProps.value.rows = informationFormRef.value?.models.columns
    },
    { deep: true }
  )

  watch(
    () => informationFormRef.value?.models?.operation,
    async (val) => {
      if (val && val === 'Aportes') {
        await _getResources(
          keys,
          `filter[is_optional]=true&filter[operation_type]=contribution `
        )
      } else if (val && val === 'Retiros') {
        await _getResources(
          keys,
          `filter[is_optional]=true&filter[operation_type]=withdrawal  `
        )
      } else return
    }
  )

  return {
    tabs,
    tabActive,
    addColumns,
    tableProps,
    headerProps,
    tabActiveIdx,
    deleteColumns,
    alertModalRef,
    handleGoToBack,
    openAlertModal,
    handleSubmitForm,
    handleCloseModal,
    alertModalConfig,
    operation_columns,
    defaultIconsLucide,
    informationFormRef,
  }
}

export default useBulkUploadTemplatesEdit
