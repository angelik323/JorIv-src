// Vue - pinia
import { ref, onUnmounted, onMounted, onBeforeUnmount } from 'vue'
import { storeToRefs } from 'pinia'

// Interfaces
import { ITabs } from '@/interfaces/global'
import {
  IMovementCodesBasicDataForm,
  IMovementCodesBasicDataResponse,
} from '@/interfaces/customs/budget/MovementCodes'

// Stores
import { useResourceManagerStore } from '@/stores/resources-manager'
import { useBudgetMovementCodesStore } from '@/stores/budget/movement-codes'

// Composable
import { useMainLoader, useUtils, useGoToUrl } from '@/composables'

export const useMovementCodesCreate = () => {
  const { openMainLoader } = useMainLoader()
  const { defaultIconsLucide } = useUtils()
  const { headerPropsDefault } = storeToRefs(useBudgetMovementCodesStore('v1'))
  const { data_movement_codes_form } = storeToRefs(
    useBudgetMovementCodesStore('v1')
  )
  const { _setDataMovementCodesForm, _createMovementCodes } =
    useBudgetMovementCodesStore('v1')

  const { _getResources, _resetKeys } = useResourceManagerStore('v1')

  const keys = {
    budget: ['code_movements', 'code_movements_validities'],
  }

  const { goToURL } = useGoToUrl()

  const headerProperties = {
    title: 'Crear códigos de movimiento',
    breadcrumbs: [
      ...headerPropsDefault.value.breadcrumbs,
      {
        label: 'Crear',
        route: 'BudgetMovementCodesCreate',
      },
    ],
  }

  const tabs = ref<ITabs[]>([
    {
      name: 'BasicDataMovementCodes',
      label: 'Datos básicos',
      icon: defaultIconsLucide.bulletList,
      outlined: true,
      disable: true,
      show: true,
      required: true,
    },
  ])

  const makeDataRequest = (): IMovementCodesBasicDataForm => {
    return {
      movement_code: data_movement_codes_form.value?.movement_code ?? '',
      movement_description:
        data_movement_codes_form.value?.movement_description ?? '',
      validity: data_movement_codes_form.value?.validity ?? '',
      is_derived_contract:
        data_movement_codes_form.value?.is_derived_contract ?? false,
      cancellation_code_id:
        data_movement_codes_form.value?.cancellation_code_id ?? null,
      balance_cancellation_code_id:
        data_movement_codes_form.value?.balance_cancellation_code_id ?? null,
    }
  }

  const tabActive = ref(tabs.value[0].name)

  const tabActiveIdx = ref(
    tabs.value.findIndex((tab) => tab.name === tabActive.value)
  )

  const movementCodesBasicData = ref()

  const validateForm = async () => {
    return (await movementCodesBasicData.value?.validateForm()) ?? false
  }

  onMounted(async () => {
    await _getResources(keys)
  })

  onBeforeUnmount(() => {
    _resetKeys(keys)
  })

  onUnmounted(() => {
    _setDataMovementCodesForm(null)
  })

  const onSubmit = async (): Promise<void> => {
    if (await validateForm()) {
      openMainLoader(true)
      const payload: IMovementCodesBasicDataResponse = makeDataRequest()
      if (await _createMovementCodes(payload)) {
        goToURL('BudgetMovementCodesList')
      }
      setTimeout(() => {
        openMainLoader(false)
      }, 1000)
    }
  }

  return {
    headerProperties,
    tabs,
    tabActive,
    tabActiveIdx,
    defaultIconsLucide,
    movementCodesBasicData,
    onSubmit,
    goToURL,
    _setDataMovementCodesForm,
  }
}
