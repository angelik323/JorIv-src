// vue - quasar - pinia
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'

// Utils
import { defaultIconsLucide } from '@/utils'

// Composables
import { useAlert, useMainLoader, useRouteValidator } from '@/composables'

// Stores
import { useResourceManagerStore } from '@/stores/resources-manager'
import { useAccountingParametersMovementCodesStore } from '@/stores/trust-business/accounting-parameters-movement-codes'

// Interfaces
import {
  IAccountingParametersMovementCodes,
  IAccountingParametersMovementCodesParameter,
} from '@/interfaces/customs/trust-business/AccountingParametersMovementCodes'

import { ITabs } from '@/interfaces/global'

const useAccountingParametersMovementCodesCreate = () => {
  // imports
  const router = useRouter()
  const { validateRouter } = useRouteValidator()
  const { openMainLoader } = useMainLoader()
  const { showAlert } = useAlert()

  const {
    accounting_parameters_movement_codes_list,
    accounting_parameters_movement_codes_parameters_list,
    row_selected,
  } = storeToRefs(useAccountingParametersMovementCodesStore('v1'))

  const {
    _createAccountingParametersMovementCodes,
    _createAccountingParametersMovementCodesParameters,
    _getListAction,
  } = useAccountingParametersMovementCodesStore('v1')

  const { _getResources, _resetKeys } = useResourceManagerStore('v1')

  const keys = {
    trust_business: [
      'business_trust_types',
      'account_structures',
      'cost_centers_structures',

      //
      'params_good_class',
      'params_good_type',
      'params_nature',
      'params_auxiliary_type',

      //
      'receipt_types',
      'sub_receipt_types',
      'third_parties',
    ],
    accounting: ['budget_structures_generate'],
  }

  const keys2 = {
    trust_business: ['movement_codes&filter[has_ganerate_accounting]=true'],
  }
  const keysBudgetStructures = {
    accounting: ['budget_structures_generate'],
  }

  const headerProps = {
    title: 'Parámetros contables códigos movimientos',
    breadcrumbs: [
      {
        label: 'Inicio',
        route: 'HomeView',
      },
      {
        label: 'Negocios Fiduciarios',
      },
      {
        label: 'Parámetros contables códigos de movimiento',
        route: 'AccountingParametersMovementCodesCreate',
      },
      {
        label: 'Crear',
      },
    ],
  }

  const tabs = ref<ITabs[]>([
    {
      name: 'information',
      label: 'Datos básicos*',
      icon: defaultIconsLucide.bulletList,
      outlined: true,
      disable: true,
      show: true,
      required: false,
    },
  ])

  const makeDataRequest = (): IAccountingParametersMovementCodes[] => {
    return accounting_parameters_movement_codes_list.value.map(
      (item: IAccountingParametersMovementCodes) => {
        const { _uid, ...rest } = item
        const isPersisted = Boolean(
          item.id && item._uid && item.id === item._uid
        )

        return {
          ...rest,
          id: isPersisted ? item.id : null,
        }
      }
    )
  }

  const makeDataRequestParameters =
    (): IAccountingParametersMovementCodesParameter[] => {
      return accounting_parameters_movement_codes_parameters_list.value.map(
        (item: IAccountingParametersMovementCodesParameter) => {
          const { _uid, ...rest } = item
          const isPersisted = Boolean(item.id && _uid && item.id === _uid)

          return {
            ...rest,
            id: isPersisted ? item.id : null,
          }
        }
      )
    }

  const tabActive = ref('')

  const tabActiveIdx = ref(
    tabs.value.findIndex((tab) => tab.name === tabActive.value)
  )

  const formInformation = ref()

  const validateForm = async () => {
    return (await formInformation.value?.validateForm()) ?? false
  }

  onMounted(async () => {
    openMainLoader(true)
    await _getResources(keys)
    await _getResources(keys2)
    await _getResources(keysBudgetStructures, '', 'v2')
    openMainLoader(false)
    tabActive.value = tabs.value[0].name
  })

  onBeforeUnmount(() => {
    keys.trust_business.push('params_accounting_account')
    _resetKeys(keys)
    _resetKeys(keysBudgetStructures)
  })

  const handlerGoTo = (goURL: string) => {
    router.push({ name: goURL })
  }

  const onSubmit = async () => {
    const isValid = await validateForm()
    if (!isValid)
      return showAlert('Por favor, complete los campos requeridos', 'error')

    openMainLoader(true)
    try {
      const payload = makeDataRequest()
      const created = await _createAccountingParametersMovementCodes(payload)
      if (!created) return

      await _getListAction()

      const payloadParameters = makeDataRequestParameters()
      if (payloadParameters.length > 0 && row_selected.value) {
        const selectedRow =
          accounting_parameters_movement_codes_list.value.find(
            (row) =>
              row.accounting_structure_id ===
              row_selected.value?.accounting_structure_id &&
              row.cost_center_structure_id ===
              row_selected.value?.cost_center_structure_id &&
              row.business_type_id === row_selected.value?.business_type_id
          )
        if (!selectedRow?.id) return

        await _createAccountingParametersMovementCodesParameters(
          payloadParameters,
          selectedRow.id
        )
      }

      router.push({ name: 'AccountingParametersMovementCodesCreate' })
    } finally {
      openMainLoader(false)
    }
  }

  return {
    headerProps,
    tabs,
    tabActive,
    tabActiveIdx,
    formInformation,
    handlerGoTo,
    onSubmit,
    validateRouter,
  }
}

export default useAccountingParametersMovementCodesCreate
