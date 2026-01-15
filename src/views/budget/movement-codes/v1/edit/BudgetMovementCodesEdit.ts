// Vue - pinia
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { useRoute } from 'vue-router'
import { storeToRefs } from 'pinia'

// Interfaces
import { ITabs } from '@/interfaces/global'
import { IMovementCodesBasicDataResponse } from '@/interfaces/customs/budget/MovementCodes'

// Stores
import { useResourceManagerStore } from '@/stores/resources-manager'
import { useBudgetMovementCodesStore } from '@/stores/budget/movement-codes'

// Composable
import { useGoToUrl, useMainLoader, useUtils } from '@/composables'

export const useMovementCodesEdit = () => {
  const route = useRoute()
  const movementCodesId = Number(route.params.id)
  const { openMainLoader } = useMainLoader()
  const { defaultIconsLucide } = useUtils()

  const { headerPropsDefault } = storeToRefs(useBudgetMovementCodesStore('v1'))

  const { data_movement_codes_form, data_movement_codes_request } = storeToRefs(
    useBudgetMovementCodesStore('v1')
  )

  const {
    _getByIdMovementCodes,
    _updateMovementCodes,
    _setDataMovementCodesForm,
  } = useBudgetMovementCodesStore('v1')

  const { _getResources, _resetKeys } = useResourceManagerStore('v1')

  const keys = {
    budget: ['code_movements', 'code_movements_validities'],
  }

  const { goToURL } = useGoToUrl()

  const headerProperties = {
    title: 'Editar códigos de movimiento',
    breadcrumbs: [
      ...headerPropsDefault.value.breadcrumbs,
      {
        label: 'Editar',
        route: 'BudgetMovementCodesEdit',
      },
      {
        label: `${movementCodesId}`,
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

  const makeDataRequest = () => {
    return {
      movement_code: data_movement_codes_form.value?.movement_code ?? '',
      movement_description:
        data_movement_codes_form.value?.movement_description ?? '',
      validity: data_movement_codes_form.value?.validity ?? '',
      is_derived_contract:
        data_movement_codes_form.value?.is_derived_contract ?? false,
      cancellation_code_id:
        data_movement_codes_form.value?.cancellation_code_id,
      balance_cancellation_code_id:
        data_movement_codes_form.value?.balance_cancellation_code_id,
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
    openMainLoader(true)
    data_movement_codes_form.value = null
    await _getResources(keys)
    await _getByIdMovementCodes(movementCodesId)
    openMainLoader(false)
  })

  onBeforeUnmount(() => {
    _resetKeys(keys)
    _setDataMovementCodesForm(null)
  })

  const onSubmit = async () => {
    if (await validateForm()) {
      openMainLoader(true)
      const payload: IMovementCodesBasicDataResponse = makeDataRequest()
      if (await _updateMovementCodes(movementCodesId, payload)) {
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
    data_movement_codes_request,
    movementCodesBasicData,
    onSubmit,
    goToURL,
  }
}

export default useMovementCodesEdit
