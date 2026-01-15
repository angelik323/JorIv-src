//Vue-Pinia
import { computed, onMounted, onUnmounted, reactive, ref } from 'vue'
import { useRoute } from 'vue-router'
import { storeToRefs } from 'pinia'
//Composables
import { useMainLoader, useUtils } from '@/composables'
//Stores
import { useTypesOperationStore } from '@/stores'

export const useTypesOperationView = () => {
  const { openMainLoader } = useMainLoader()
  const route = useRoute()
  const { _getTypesOperationById } = useTypesOperationStore('v1')
  const { data_information_form } = storeToRefs(useTypesOperationStore('v1'))
  const { defaultIconsLucide } = useUtils()
  const headerProps = {
    title: 'Ver tipo de operación',
    breadcrumbs: [
      { label: 'Inicio', route: 'HomeView' },
      { label: 'Portafolio de inversiones', route: '' },
      { label: 'Tipos de operaciones', route: 'TypesOperationList' },
      { label: 'Ver', route: 'TypesOperationView' },
      { label: String(route.params.id), route: '' },
    ],
  }

  const models = ref({
    code: '',
    description: '',
    generates_fic_movement: false,
    fic_movement_code: null,
    operation_nature: '',
    accounting_origin: '',
    generates_papeleta: false,
    created_at: '',
    creator_data: '',
    updated_at: '',
    updated_data: '',
    operation_type: null,
  })

  const chunkArray = <T>(arr: T[], size: number): T[][] => {
    const result: T[][] = []
    for (let i = 0; i < arr.length; i += size) {
      result.push(arr.slice(i, i + size))
    }
    return result
  }

  const basicInfoFields = [
    {
      label: 'Código',
      value: () => models.value.code,
      fallback: 'No registrado',
    },
    {
      label: 'Descripción',
      value: () => models.value.description,
      fallback: 'No registrado',
    },
    {
      label: 'Genera movimiento FIC',
      value: () => (models.value.generates_fic_movement ? 'Sí' : 'No'),
      fallback: 'No registrado',
    },
    {
      label: 'Código movimiento FIC',
      value: () => models.value.fic_movement_code ?? 'No registrado',
      fallback: 'No registrado',
    },
  ]

  const operationFields = [
    {
      label: 'Tipo de operación',
      value: () => models.value.operation_type || 'No registrado',
      fallback: 'No registrado',
    },
    {
      label: 'Naturaleza operación',
      value: () => models.value.operation_nature,
      fallback: 'No registrado',
    },
    {
      label: 'Origen contabilidad',
      value: () => models.value.accounting_origin,
      fallback: 'No registrado',
    },
    {
      label: '¿Genera papeleta?',
      value: () => (models.value.generates_papeleta ? 'Sí' : 'No'),
      fallback: 'No registrado',
    },
  ]

  const historyFields = [
    {
      label: 'Fecha de creación',
      value: () => models.value.created_at,
      fallback: 'No registrado',
    },
    {
      label: 'Creado por',
      value: () => models.value.creator_data,
      fallback: 'No registrado',
    },
    //TODO: Se comenta parcialmente hasta que se defina si el editar va o no
    // {
    //   label: 'Modificación',
    //   value: () => models.value.updated_at,
    //   fallback: 'No registrado',
    // },
    // {
    //   label: 'Modificado por',
    //   value: () => models.value.updated_data,
    //   fallback: 'No registrado',
    // },
  ]

  const basicInfoRows = computed(() => chunkArray(basicInfoFields, 4))
  const operationRows = computed(() => chunkArray(operationFields, 4))
  const historyRows = computed(() => chunkArray(historyFields, 4))

  const tabs = reactive([
    {
      name: 'InformationForm',
      label: 'Datos Básicos',
      icon: defaultIconsLucide.listBulleted,
      outlined: true,
      disable: false,
      show: true,
      required: true,
    },
  ])

  onMounted(async () => {
    openMainLoader(true)
    await _getTypesOperationById(Number(route.params.id))
    if (data_information_form.value) {
      Object.assign(models.value, {
        code: data_information_form.value.code,
        description: data_information_form.value.description,
        generates_fic_movement:
          data_information_form.value.generates_fic_movement,
        fic_movement_code: data_information_form.value.fic_movement_code,
        operation_nature: data_information_form.value.operation_nature,
        accounting_origin: data_information_form.value.accounting_origin,
        generates_papeleta: data_information_form.value.generates_papeleta,
        created_at:
          data_information_form.value.operation_type_history?.created_at,
        creator_data:
          data_information_form.value.operation_type_history?.creator_data,
        updated_at:
          data_information_form.value.operation_type_history?.updated_at,
        updated_data:
          data_information_form.value.operation_type_history?.updated_data,
        operation_type: data_information_form.value.inversion_type_description,
      })
    }
    setTimeout(() => openMainLoader(false), 1200)
  })

  onUnmounted(() => {
    data_information_form.value = null
  })

  const activeTab = ref(tabs[0].name)
  const tabActiveIdx = ref(
    tabs.findIndex((tab) => tab.name === activeTab.value)
  )
  return {
    headerProps,
    tabs,
    activeTab,
    tabActiveIdx,
    basicInfoRows,
    operationRows,
    historyRows,
  }
}
