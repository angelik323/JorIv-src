// Vue - Vue Router - Pinia
import { ref, onBeforeMount, onBeforeUnmount } from 'vue'
import { useRoute } from 'vue-router'
import { storeToRefs } from 'pinia'

// Interfaces
import { IAccountingParametersMovementsForm } from '@/interfaces/customs/fics/AccountingParametersMovements'
import { ITabs } from '@/interfaces/global'

// Composables
import {
  useRouteValidator,
  useMainLoader,
  useGoToUrl,
  useUtils,
} from '@/composables'

// Stores
import { useAccountingParametersAccountingParametersMovementsStore } from '@/stores/fics/accounting-parameters/accounting-parameters-movements'

const useAccountingParametersMovementsCopy = () => {
  const { validateRouter } = useRouteValidator()
  const { openMainLoader } = useMainLoader()
  const { defaultIconsLucide } = useUtils()

  const { goToURL } = useGoToUrl()
  const route = useRoute()

  const {
    _createAccountingParametersMovements,
    _getByIdAccountingParametersMovements,
    _clearDataAccountingParametersMovements,
  } = useAccountingParametersAccountingParametersMovementsStore('v1')

  const {
    accounting_parameters_movements_form,
    accounting_parameters_movements_view,
  } = storeToRefs(
    useAccountingParametersAccountingParametersMovementsStore('v1')
  )

  const accountingParametersMovementsId = +route.params.id

  const accountingParametersMovementsFormRef = ref()

  const headerProps = {
    title: 'Agregar parámetro contable desde otro',
    breadcrumbs: [
      {
        label: 'Inicio',
        route: 'HomeView',
      },
      {
        label: 'Fics',
      },
      {
        label: 'Parámetros contabilidad',
        route: 'AccountingParametersList',
      },
      {
        label: 'Crear parámetro contable',
        route: 'AccountingParametersMovementsCreate',
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

  const tabActive = tabs[0].name
  const tabActiveIdx = 0

  const validateForm = async () => {
    return (
      (await accountingParametersMovementsFormRef.value?.validateForm()) ??
      false
    )
  }

  const onSubmit = async () => {
    if (!(await validateForm())) return

    openMainLoader(true)

    const payload =
      accounting_parameters_movements_form.value as IAccountingParametersMovementsForm
    const success = await _createAccountingParametersMovements(payload)

    if (success) handleGoToList()

    openMainLoader(false)
  }

  const handleGoToList = () => goToURL('AccountingParametersList')

  onBeforeMount(
    async () =>
      await _getByIdAccountingParametersMovements(
        accountingParametersMovementsId
      )
  )

  onBeforeUnmount(() => _clearDataAccountingParametersMovements())

  return {
    tabs,
    onSubmit,
    tabActive,
    headerProps,
    tabActiveIdx,
    handleGoToList,
    validateRouter,
    accountingParametersMovementsFormRef,
    accounting_parameters_movements_view,
  }
}

export default useAccountingParametersMovementsCopy
