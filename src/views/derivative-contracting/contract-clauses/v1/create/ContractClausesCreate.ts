// Vue, pinia
import { ref, onBeforeMount, onBeforeUnmount, onMounted } from 'vue'

// Composables
import { useGoToUrl, useMainLoader, useUtils } from '@/composables'

// Stores
import { useResourceManagerStore } from '@/stores/resources-manager'
import { useContractClausesStore } from '@/stores/derivative-contracting'

// Interfaces
import { IContractClausesForm } from '@/interfaces/customs/derivative-contracting/ContractClauses'
import { ITabs } from '@/interfaces/global/Tabs'

const useContractClausesCreate = () => {
  const { _createContractClauses, _clearData } = useContractClausesStore('v1')
  const { _getResources, _resetKeys } = useResourceManagerStore('v1')

  // Data de formularios
  const data_information_form = ref<IContractClausesForm | null>(null)

  // Referencias a formularios
  const basicDataFormRef = ref()

  const { openMainLoader } = useMainLoader()
  const { defaultIconsLucide, cleanEmptyFields } = useUtils()

  const { goToURL } = useGoToUrl()

  const keys = {
    derivative_contracting: ['clause_types'],
  }

  const headerProps = {
    title: 'Crear cláusulas de contrato',
    breadcrumbs: [
      {
        label: 'Inicio',
        route: 'HomeView',
      },
      {
        label: 'Contratación derivada',
        route: '',
      },
      {
        label: 'Cláusulas de contratos',
        route: 'ContractClausesList',
      },
      {
        label: 'Crear',
        route: 'ContractClausesCreate',
      },
    ],
  }

  const tabs = ref<ITabs[]>([
    {
      name: 'basic_data',
      label: 'Datos básicos',
      icon: defaultIconsLucide.bulletList,
      outlined: true,
      disable: true,
      show: true,
      required: true,
    },
  ])

  const tabActive = ref(tabs.value[0].name)
  const tabActiveIdx = ref(
    tabs.value.findIndex((tab) => tab.name === tabActive.value)
  )

  // Datos básicos form
  const makeBaseInfoRequest = (data: IContractClausesForm | null) => {
    if (!data) return {}

    const request: Partial<IContractClausesForm> = {
      name: data.name,
      clause_type_id: !data.WhichClause ? data.clause_type_id : null,
      clausule: data.clausule,
      status_id: 1,
      WhichClause: data.WhichClause,
    }
    return cleanEmptyFields(request)
  }

  const makeDataRequest = () => {
    const apiRequestBody: Partial<IContractClausesForm> = {
      ...makeBaseInfoRequest(data_information_form.value),
    }

    return apiRequestBody
  }

  const validateForms = async () => {
    let valid: boolean = false
    const forms = [basicDataFormRef]

    if (tabActiveIdx.value >= 0 && tabActiveIdx.value < forms.length) {
      try {
        valid =
          (await forms[tabActiveIdx.value]?.value?.validateForm()) ?? false
      } catch {
        valid = false
      }
    }
    return valid
  }

  const onSubmit = async () => {
    if (!(await validateForms())) return

    openMainLoader(true)
    const payload = makeDataRequest()
    const success = await _createContractClauses(payload)
    if (success) {
      goToURL('ContractClausesList')
    }
    openMainLoader(false)
  }

  onMounted(async () => {
    openMainLoader(true)
    await _getResources(keys, `filter[is_system]=true`)
    openMainLoader(false)
  })

  onBeforeUnmount(() => {
    _resetKeys(keys)
  })

  onBeforeMount(async () => {
    _clearData()
  })

  return {
    data_information_form,
    basicDataFormRef,
    headerProps,
    tabs,
    tabActive,
    tabActiveIdx,
    goToURL,
    onSubmit,
  }
}

export default useContractClausesCreate
