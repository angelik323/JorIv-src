// Vue, pinia
import { ref, watch, onMounted, onBeforeUnmount } from 'vue'
import { storeToRefs } from 'pinia'

// Router
import { useRoute } from 'vue-router'

// Composables
import { useGoToUrl, useMainLoader, useUtils } from '@/composables'

// Stores
import { useResourceManagerStore } from '@/stores/resources-manager'
import { useContractClausesStore } from '@/stores/derivative-contracting'

// Interfaces
import {
  IContractClausesForm,
  IContractClausesResponse,
} from '@/interfaces/customs/derivative-contracting/ContractClauses'
import { ITabs } from '@/interfaces/global/Tabs'

const useContractClausesEdit = () => {
  const { _updateContractClauses, _getByIdContractClauses, _clearData } =
    useContractClausesStore('v1')
  const { contract_clauses_response } = storeToRefs(
    useContractClausesStore('v1')
  )
  const { _getResources, _resetKeys } = useResourceManagerStore('v1')

  const { openMainLoader } = useMainLoader()
  const { defaultIconsLucide, cleanEmptyFields } = useUtils()

  const { goToURL } = useGoToUrl()

  const keys = {
    derivative_contracting: ['clause_types'],
  }

  // Data de formularios
  const data_information_form = ref<IContractClausesForm | null>(null)

  // Referencias a formularios
  const basicDataFormRef = ref()

  const route = useRoute()
  const searchId = +route.params.id

  const headerProps = {
    title: 'Editar cláusulas de contrato',
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
        label: 'Editar',
        route: 'ContractClausesEdit',
      },
      {
        label: `${searchId}`,
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

  const setFormEdit = (data: IContractClausesResponse) => {
    data_information_form.value = {
      clause_type_id: data.type?.id,
      name: data.name,
      clausule: data.clausule,
      code: data.code,
    }
  }

  // Datos básicos form
  const makeBaseInfoRequest = (data: IContractClausesForm | null) => {
    if (!data) return {}

    const statusId = contract_clauses_response.value?.status.id
    const request: Partial<IContractClausesForm> = {
      clause_type_id: !data.WhichClause ? data.clause_type_id : null,
      name: data.name,
      clausule: data.clausule,
      code: data.code,
      status_id: statusId,
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
    const success = await _updateContractClauses(payload, searchId)
    if (success) goToURL('ContractClausesList')
    openMainLoader(false)
  }

  onMounted(async () => {
    _clearData()
    openMainLoader(true)
    await _getByIdContractClauses(searchId)
    await _getResources(keys, `filter[is_system]=true`)

    openMainLoader(false)
  })

  onBeforeUnmount(() => {
    _resetKeys(keys)
  })

  watch(
    () => contract_clauses_response.value,
    (val) => {
      if (!val) return
      setFormEdit(val)
    }
  )

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

export default useContractClausesEdit
