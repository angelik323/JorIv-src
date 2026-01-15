import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'

import { useMainLoader } from '@/composables'
import { defaultIconsLucide } from '@/utils'

import { ITabs } from '@/interfaces/global'
import {
  IAccountStructureModel,
  IAccountStructureResponse,
  ICatalogLimitResponse,
} from '@/interfaces/customs'

import { useAccountStructuresStore, useResourceManagerStore } from '@/stores'

const useAccountStructureEdit = () => {
  const router = useRouter()
  const route = useRoute()
  const accountStructureId = +route.params.id
  const accountStructure = ref<IAccountStructureResponse>()

  const { _getResources, _resetKeys } = useResourceManagerStore('v1')

  const { openMainLoader } = useMainLoader()
  const {
    _updateAccountStructure,
    _getAccountStructure,
    accounting_catalog_type,
  } = useAccountStructuresStore('v1')

  const isAccountingCatalog = computed(
    () => models?.value?.type === accounting_catalog_type
  )

  const accountStructureForm = ref()

  const headerProps = {
    title: 'Editar estructura de cuenta',
    breadcrumbs: [
      { label: 'Inicio', route: 'HomeView' },
      { label: 'Contabilidad' },
      {
        label: 'Estructuras de cuentas',
        route: 'AccountStructureList',
      },
      { label: 'Editar' },
      { label: `${accountStructureId}` },
    ],
  }

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

  const validateForms = async () => {
    return accountStructureForm?.value?.validateForm()
  }

  const handleFormUpdate = () => {
    models.value = accountStructureForm.value.getFormData()
  }

  const onSubmit = async () => {
    if (await validateForms()) {
      openMainLoader(true)
      const payload = accountStructureForm.value.getFormData()
      if (await _updateAccountStructure(accountStructureId, payload)) {
        router.push({ name: 'AccountStructureList' })
      }

      setTimeout(() => {
        openMainLoader(false)
      }, 1000)
    }
  }

  const keys = [
    'account_structure_types',
    'catalog_limit_types',
    'catalog_limit_groups',
    'catalog_limit_natures',
  ]

  onMounted(async () => {
    openMainLoader(true)
    _getResources({ accounting: keys })
    _getAccountStructure(accountStructureId)
      .then((accountStructureInfo) => {
        accountStructure.value = accountStructureInfo || {
          id: 0,
          code: '',
          structure: '',
          type: {
            name: '',
            value: '',
          },
          status: {
            id: 0,
            name: '',
          },
          purpose: '',
          catalog_limits: [] as ICatalogLimitResponse[],
        }
      })
      .finally(() => {
        openMainLoader(false)
      })
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
    accountStructureForm,
    accountStructure,
    isAccountingCatalog,
    onSubmit,
    handleFormUpdate,
  }
}

export default useAccountStructureEdit
