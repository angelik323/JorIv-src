// Vue - Pinia - Quasar
import { onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { QTable } from 'quasar'

// Interfaces
import { IBulkUploadTemplatesList } from '@/interfaces/customs/fics/BulkUploadTemplates'
import { IResource, ITabs } from '@/interfaces/global'

// Composables
import { useAlert, useGoToUrl, useMainLoader, useUtils } from '@/composables'

// Stores
import { useBulkUploadTemplatesStore } from '@/stores/fics/bulk-upload-templates'
import { useTreasuryResourceStore } from '@/stores/resources-manager/treasury'
import { useFicResourceStore } from '@/stores/resources-manager/fics'
import { useResourceManagerStore } from '@/stores/resources-manager'

const useBulkUploadTemplatesCreate = () => {
  const { openMainLoader } = useMainLoader()
  const { defaultIconsLucide } = useUtils()
  const { showAlert } = useAlert()
  const { goToURL } = useGoToUrl()

  const { monetary_operation_columns } = storeToRefs(useFicResourceStore('v1'))
  const { means_of_payments, type_receive } = storeToRefs(
    useTreasuryResourceStore('v1')
  )
  const { _createBulkUploadTemplates } = useBulkUploadTemplatesStore('v1')
  const { _getResources, _resetKeys } = useResourceManagerStore('v1')
  const { data_information_form } = storeToRefs(
    useBulkUploadTemplatesStore('v1')
  )

  const operation_columns = ref<IResource[]>([])
  const informationFormRef = ref()
  const alertModalRef = ref()

  const alertModalConfig = ref({
    title: 'Advertencia',
    description: '',
    entityId: null as number | null,
  })

  const keys = {
    treasury: ['typeReceive', 'means_of_payments'],
  }
  const keysMonetaryOperation = {
    fics: ['monetary_operation_columns'],
  }

  const headerProps = {
    title: 'Crear plantilla de cargue masivos',
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
        label: 'Crear',
        route: 'BulkUploadTemplatesCreate',
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
    const form = data_information_form.value
    return {
      description: form?.description,
      operation: form?.operation,
      transaction_method_id: form?.transaction_method_id,
      optional_columns: tableProps.value.rows.map((r) => ({ id: r.id })),
    }
  }

  const validateForm = async () => {
    return (await informationFormRef.value?.validateForm()) ?? false
  }

  const handleSubmitForm = async () => {
    if (!(await validateForm())) return

    openMainLoader(true)
    const payload = makeDataRequest()
    const success = await _createBulkUploadTemplates(payload)

    if (success) {
      handleGoToBack()
    }
    openMainLoader(false)
  }

  const openAlertModal = async () => {
    if (!informationFormRef?.value.models?.operation) {
      showAlert('Seleccione un tipo de operación', 'warning', undefined, 2000)
      return
    }
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

  onBeforeUnmount(() => {
    _resetKeys(keys)
    _resetKeys(keysMonetaryOperation)
  })

  onMounted(async () => {
    await _getResources(keys)
  })

  watch(
    () => monetary_operation_columns.value,
    () => {
      operation_columns.value = monetary_operation_columns.value
    },
    { deep: true }
  )

  watch(
    () => informationFormRef.value?.models?.operation,
    async (val) => {
      if (val === 'Aportes') {
        await _getResources(
          keysMonetaryOperation,
          `filter[is_optional]=true&filter[operation_type]=contribution `
        )

        informationFormRef.value.models.transaction_method_id = ''
        informationFormRef.value.models.transaction_method_options =
          type_receive.value
      } else if (val === 'Retiros') {
        await _getResources(
          keysMonetaryOperation,
          `filter[is_optional]=true&filter[operation_type]=withdrawal  `
        )

        informationFormRef.value.models.transaction_method_id = ''
        informationFormRef.value.models.transaction_method_options =
          means_of_payments.value
      } else {
        informationFormRef.value.models.transaction_method_options = []
      }
    }
  )

  return {
    tabs,
    tabActive,
    addColumns,
    tableProps,
    headerProps,
    tabActiveIdx,
    alertModalRef,
    deleteColumns,
    openAlertModal,
    handleGoToBack,
    alertModalConfig,
    handleCloseModal,
    handleSubmitForm,
    informationFormRef,
    defaultIconsLucide,
    monetary_operation_columns,
  }
}

export default useBulkUploadTemplatesCreate
