// Vue - Vue Router - Pinia
import { onBeforeUnmount, onMounted, ref } from 'vue'
import { storeToRefs } from 'pinia'

// Composables
import { useGoToUrl, useMainLoader, useUtils } from '@/composables'

// Interfaces
import { IMovementCodesInformationForm } from '@/interfaces/customs/fics/MovementCodes'
import { ITabs } from '@/interfaces/global'

// Stores
import { useMovementCodesStore } from '@/stores/fics/movement-codes'
import { useResourceManagerStore } from '@/stores/resources-manager'

const useMovementCodesCreate = () => {
  const { openMainLoader } = useMainLoader()
  const { defaultIconsLucide } = useUtils()
  const { goToURL } = useGoToUrl()

  const { data_information_form } = storeToRefs(useMovementCodesStore('v1'))
  const { _getResources, _resetKeys } = useResourceManagerStore('v1')
  const { _createMovementCodes, _setDataInformationForm } = useMovementCodesStore('v1')

  const informationFormRef = ref()

  const headerProps = {
    title: 'Crear código de movimiento',
    breadcrumbs: [
      {
        label: 'Inicio',
        route: 'HomeView',
      },
      {
        label: 'Fics',
      },
      {
        label: 'Códigos de Movimiento',
        route: 'MovementCodesList',
      },
      {
        label: 'Crear',
        route: 'MovementCodesCreate',
      },
    ],
  }

  const tabs: ITabs[] = [
    {
      name: 'information',
      label: 'Datos básicos',
      icon: defaultIconsLucide.bulletList,
      outlined: true,
      disable: false,
      show: true,
      required: true,
    },
  ]

  const tabActive = tabs[0].name
  const tabActiveIdx = 0

  const makeDataRequest = () => {
    const form = data_information_form.value

    if (!form) return null

    const payload: IMovementCodesInformationForm = {
      code: form.code ?? '',
      description: form.description ?? '',
      movement_type_id: form.movement_type_id ?? null,
      movement_type_description: form.movement_type_description ?? '',
      movement_class_id: form.movement_class_id ?? null,
      movement_class_description: form.movement_class_description ?? '',
      movement_nature_id: form.movement_nature_id ?? null,
      movement_nature_description: form.movement_nature_description ?? '',
      movement_group_id: form.movement_group_id ?? null,
      movement_group_description: form.movement_group_description ?? '',
      annulment_movement: form.annulment_movement ?? null,
      real_estate_movement: form.real_estate_movement ?? null,
      generate_accounting: form.generate_accounting ?? false,
      operation_class: form.operation_class ?? null,
      origin_module_id:
        form.origin_module_id != null ? String(form.origin_module_id) : null,
      origin_module_description: form.origin_module_description ?? '',
      consolidated_code: form.consolidated_code ?? '',
      distribution_code: form.distribution_code ?? '',
      withholding_base: form.withholding_base ?? '',
    }
    return payload
  }

  const onSubmit = async () => {
    const isValid = await informationFormRef.value?.validateForm()
    if (!isValid) return

    openMainLoader(true)

    const payload = makeDataRequest()

    const success = await _createMovementCodes(payload!)

    if (success) goToURL('MovementCodesList', undefined, { reload: true })

    setTimeout(() => openMainLoader(false), 1000)
  }
  const keys = {
    fics: ['movement_types_movement_codes', 'movement_classes_movement_codes'],
  }

  onMounted(async () => {
    _setDataInformationForm(null) 

    await _getResources(keys)
  })
  onBeforeUnmount(() => _resetKeys(keys))

  return {
    tabs,
    goToURL,
    onSubmit,
    tabActive,
    headerProps,
    tabActiveIdx,
    informationFormRef,
  }
}

export default useMovementCodesCreate
