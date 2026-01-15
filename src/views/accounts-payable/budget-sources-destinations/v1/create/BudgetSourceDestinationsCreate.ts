// Vue
import { onBeforeUnmount, ref } from 'vue'

// Interfaces
import { ITabs } from '@/interfaces/global'
import {
  IBudgetSourcesDestinationsForm,
  IBudgetFlowRequest,
} from '@/interfaces/customs/accounts-payable/BudgetSourcesDestinations'

// Composables
import { useGoToUrl, useMainLoader, useUtils } from '@/composables'

// Stores
import { useBudgetSourcesDestinationsStore } from '@/stores/accounts-payable/budget-sources-destinations'
import { useResourceManagerStore } from '@/stores'

export const useBudgetSourceDestinationsCreate = () => {
  const { goToURL } = useGoToUrl()
  const { openMainLoader } = useMainLoader()

  const { defaultIconsLucide, cleanEmptyFields } = useUtils()

  const { _createAction } = useBudgetSourcesDestinationsStore('v1')

  const { _resetKeys } = useResourceManagerStore('v1')

  const basicDataFormRef = ref()
  const basic_data_form = ref<IBudgetSourcesDestinationsForm | null>(null)

  const headerProps = {
    title: 'Crear fuente y destino',
    breadcrumbs: [
      { label: 'Inicio', route: 'HomeView' },
      { label: 'Cuentas por pagar', route: '' },
      {
        label: 'Fuentes y destinos',
        route: 'BudgetSourceDestinationsList',
      },
      {
        label: 'Crear',
        route: 'BudgetSourceDestinationsCreate',
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
      required: false,
    },
  ]

  const tabActive = tabs[0].name
  const tabActiveIdx = 0

  const makeBaseInfoRequest = (data: IBudgetSourcesDestinationsForm | null) => {
    if (!data) return {}

    const request = {
      source_module: data.source_module ?? null,
      source_process: data.source_process ?? null,
      source_reference_id: Number(data.source_reference_id) || null,
      source_description: data.source_description ?? null,
      destination_module: data.destination_module ?? null,
      destination_process: data.destination_process ?? null,
      destination_reference_id: Number(data.destination_reference_id) || null,
      destination_description: data.destination_description ?? null,
    }

    return cleanEmptyFields(request, true)
  }

  const makeDataRequest = () => {
    const apiRequestBody: Partial<IBudgetFlowRequest> = {
      ...makeBaseInfoRequest(basic_data_form.value),
    }

    return apiRequestBody
  }

  const onSubmit = async () => {
    if (!(await basicDataFormRef.value?.validateForm())) return

    openMainLoader(true)

    const payload = makeDataRequest()
    const success = await _createAction(payload as IBudgetFlowRequest)

    if (success) {
      goToURL('BudgetSourceDestinationsList')
    }

    openMainLoader(false)
  }

  const resourceKeys = {
    accounts_payable: [
      'sources_destinations_modules',
      'sources_destinations_processes',
      'sources_destinations_code_movements',
    ],
  }

  onBeforeUnmount(() => _resetKeys(resourceKeys))

  return {
    headerProps,
    tabs,
    tabActive,
    tabActiveIdx,
    basicDataFormRef,
    basic_data_form,
    onSubmit,
    goToURL,
  }
}

export default useBudgetSourceDestinationsCreate
