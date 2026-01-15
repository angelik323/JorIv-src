// Vue, pinia
import { useGoToUrl, useMainLoader, useUtils } from '@/composables'
import { storeToRefs } from 'pinia'
import { computed, onMounted, ref, watch } from 'vue'

// Router
import { useRoute } from 'vue-router'

// Interfaces
import {
  IContractClausesForm,
  IContractClausesResponse,
} from '@/interfaces/customs/derivative-contracting/ContractClauses'
import { ITabs } from '@/interfaces/global/Tabs'

// Stores
import { useContractClausesStore } from '@/stores'

const useContractClausesRead = () => {
  const route = useRoute()
  const searchId = +route.params.id
  const { _getByIdContractClauses, _clearData } = useContractClausesStore('v1')
  const { contract_clauses_response } = storeToRefs(
    useContractClausesStore('v1')
  )
  const { openMainLoader } = useMainLoader()
  const { goToURL } = useGoToUrl()
  const { defaultIconsLucide } = useUtils()

  const data_information_form = ref<IContractClausesForm | null>(null)

  const headerProps = {
    title: 'Ver cláusulas de contrato',
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
        label: 'Ver',
        route: 'ContractClausesRead',
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
      required: false,
    },
  ])

  const filteredTabs = computed(() => tabs.value.filter((tab) => tab.show))

  const tabActive = ref(filteredTabs.value[0].name)

  const tabActiveIdx = ref(
    filteredTabs.value.findIndex((tab) => tab.name === tabActive.value)
  )

  const goToList = () => {
    goToURL('ContractClausesList')
  }

  const setFormRead = (data: IContractClausesResponse) => {
    data_information_form.value = {
      clause_type_id: data.type.name ?? null,
      clausule: data.clausule,
      name: data.name,
      code: data.code,
    }
  }

  onMounted(async () => {
    _clearData()
    openMainLoader(true)
    await _getByIdContractClauses(searchId)
    openMainLoader(false)
  })

  watch(
    () => contract_clauses_response.value,
    (val) => {
      if (!val) return
      setFormRead(val)
    }
  )

  return {
    headerProps,
    filteredTabs,
    tabActive,
    tabActiveIdx,
    data_information_form,
    goToURL,
    goToList,
  }
}

export default useContractClausesRead
