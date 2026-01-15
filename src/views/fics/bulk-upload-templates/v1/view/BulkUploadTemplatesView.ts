// Vue - Vue Router - Quasar
import { onMounted, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { QTable } from 'quasar'

// Interfaces
import { IBulkUploadTemplatesList } from '@/interfaces/customs/fics/BulkUploadTemplates'
import { ITabs } from '@/interfaces/global'

// Composables
import { useGoToUrl, useMainLoader, useUtils } from '@/composables'

// Stores
import { useBulkUploadTemplatesStore } from '@/stores/fics/bulk-upload-templates'

const useBulkUploadTemplatesView = () => {
  const { defaultIconsLucide } = useUtils()
  const { openMainLoader } = useMainLoader()
  const { goToURL } = useGoToUrl()
  const route = useRoute()

  const { _getByIdBulkUploadTemplates } = useBulkUploadTemplatesStore('v1')

  const informationFormRef = ref()

  const id = Array.isArray(route.params.id)
    ? route.params.id[0]
    : route.params.id

  const headerProps = {
    title: 'Ver plantilla',
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
        label: 'Ver',
        route: 'BulkUploadTemplatesView',
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
        name: 'index',
        required: false,
        label: 'Número de columna',
        align: 'left',
        field: () => '',
        sortable: false,
      },
      {
        name: 'name',
        required: false,
        label: 'Descripción',
        align: 'left',
        field: 'name',
        sortable: true,
      },
    ] as QTable['columns'],
    rows: [] as IBulkUploadTemplatesList[],
    pages: [],
  })

  const tabActive = tabs[0].name
  const tabActiveIdx = 0

  const handleGoToBack = () =>
    goToURL('BulkUploadTemplatesList', undefined, { reload: true })

  onMounted(async () => {
    openMainLoader(true)

    await _getByIdBulkUploadTemplates(Number(id))

    openMainLoader(false)
  })

  watch(
    () => informationFormRef.value?.models.columns,
    () => {
      tableProps.value.rows = informationFormRef.value?.models.columns
    },
    { deep: true }
  )
  return {
    tabs,
    tabActive,
    tableProps,
    headerProps,
    tabActiveIdx,
    handleGoToBack,
    informationFormRef,
  }
}

export default useBulkUploadTemplatesView
