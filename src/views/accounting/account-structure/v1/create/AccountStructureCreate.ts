import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { QTable } from 'quasar'

import { useMainLoader } from '@/composables'
import { defaultIconsLucide } from '@/utils'

import { IAccountStructureModel } from '@/interfaces/customs'
import { ITabs } from '@/interfaces/global'

import { useAccountStructuresStore, useResourceManagerStore } from '@/stores'

const useAccountStructureCreate = () => {
  const router = useRouter()
  const { openMainLoader } = useMainLoader()

  const { _createAccountStructure, accounting_catalog_type } =
    useAccountStructuresStore('v1')

  const { _getResources, _resetKeys } = useResourceManagerStore('v1')

  const isAccountingCatalog = computed(
    () => models?.value?.type === accounting_catalog_type
  )

  const accountStructureForm = ref()

  const headerProps = {
    title: 'Crear estructura de cuenta',
    breadcrumbs: [
      { label: 'Inicio', route: 'HomeView' },
      { label: 'Contabilidad' },
      {
        label: 'Estructuras de cuentas',
        route: 'AccountStructureList',
      },
      {
        label: 'Crear',
        route: 'AccountStructureCreate',
      },
    ],
  }

  const tabs = ref<ITabs[]>([
    {
      name: 'information',
      label: 'Datos básicos',
      icon: defaultIconsLucide.bulletList,
      outlined: true,
      disable: false,
      show: true,
      required: false,
    },
  ])

  const filteredTabs = computed(() => tabs.value.filter((tab) => tab.show))

  const tabActive = ref(filteredTabs.value[0].name)

  const tabActiveIdx = ref(
    filteredTabs.value.findIndex((tab) => tab.name === tabActive.value)
  )

  const models = ref<IAccountStructureModel>({
    structure: '',
    purpose: '',
    type: '',
    status_id: 1,
    catalog_limits: [],
  })

  const alertModalRef = ref()

  const accountStructuresTableProps = ref({
    title: 'Ver estructura',
    loading: false,
    columns: [
      {
        name: 'level',
        required: false,
        label: 'Nivel',
        align: 'left',
        field: 'value',
        sortable: true,
      },
      {
        name: 'structure',
        required: false,
        label: 'Estructura',
        align: 'left',
        field: 'label',
        sortable: true,
      },
    ] as QTable['columns'],
    rows: [
      { value: '1', label: '0' },
      { value: '2', label: '0.0' },
      { value: '3', label: '0.0.00' },
      { value: '4', label: '0.0.00.00' },
      { value: '5', label: '0.0.00.00.00' },
      { value: 'N', label: '0.0.00.00.00...' },
    ],
    pages: {
      currentPage: ref(1),
      lastPage: ref(1),
    },
  })

  const validateForms = async () => {
    return accountStructureForm?.value?.validateForm()
  }

  const handleFormUpdate = () => {
    models.value = accountStructureForm.value.getFormData()
  }

  const onSubmit = async () => {
    if (await validateForms()) {
      openMainLoader(true)
      const payload = models.value
      if (await _createAccountStructure(payload)) {
        router.push({ name: 'AccountStructureList' })
      }

      setTimeout(() => {
        openMainLoader(false)
      }, 1000)
    }
  }

  const openStructuresModal = () => {
    alertModalRef.value.openModal()
  }

  const keys = [
    'account_structure_types',
    'catalog_limit_types',
    'catalog_limit_groups',
    'catalog_limit_natures',
  ]

  onMounted(async () => {
    _getResources({ accounting: keys })
  })

  onBeforeUnmount(() => {
    _resetKeys({ accounting: keys })
  })

  return {
    headerProps,
    filteredTabs,
    tabActive,
    tabActiveIdx,
    models,
    alertModalRef,
    accountStructuresTableProps,
    accountStructureForm,
    isAccountingCatalog,
    onSubmit,
    openStructuresModal,
    handleFormUpdate,
  }
}

export default useAccountStructureCreate
