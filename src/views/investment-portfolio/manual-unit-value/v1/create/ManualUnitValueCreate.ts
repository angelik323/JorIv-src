// vue | quasar | router
import { onBeforeMount, onUnmounted, ref } from 'vue'
import { useRouter } from 'vue-router'

// store
import { storeToRefs } from 'pinia'
import { useManualUnitValueStore, useResourceManagerStore } from '@/stores'

// composables
import { useAlert, useMainLoader } from '@/composables'

// utils
import { defaultIconsLucide } from '@/utils'
import { ITabs } from '@/interfaces/global'

const useManualUnitValueCreate = () => {
  const { _createManualUnitValue } = useManualUnitValueStore('v1')

  const { data_information_form } = storeToRefs(useManualUnitValueStore('v1'))
  const { showAlert } = useAlert()
  const router = useRouter()
  const { openMainLoader } = useMainLoader()
  const { _getResources, _resetKeys } = useResourceManagerStore('v1')

  // pros
  const informationFormRef = ref()

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

  const tabActive = ref(tabs.value[0].name)
  const tabActiveIdx = ref(
    tabs.value.findIndex((tab) => tab.name === tabActive.value)
  )

  const headerProps = {
    title: 'Crear manual valor unidad',
    breadcrumbs: [
      {
        label: 'Inicio',
        route: 'HomeView',
      },
      {
        label: 'Portafolio de inversiones',
      },
      {
        label: 'Registro manual valor unidad',
        route: 'ManualUnitValueList',
      },
      {
        label: 'Crear',
      },
    ],
  }

  // handlers / actions
  const makeDataRequest = () => {
    const form = data_information_form.value
    if (!form) return
    return {
      emitter_id: form.emitter_id,
      has_participations: form.has_participations,
      participation_description: form.participation_description,
      has_actions: form.has_actions,
      action_type: form.action_type,
      start_date: form.start_date,
      end_date: form.end_date,
      unit_value: form.unit_value,
    }
  }

  const validateForm = async () => {
    return (await informationFormRef.value?.validateForm()) ?? false
  }

  const onSubmit = async () => {
    if (!(await validateForm())) {
      showAlert('El registro no pudo ser creado.', 'error')
      return
    }

    openMainLoader(true)
    const payload = makeDataRequest()
    if (!payload) return
    const success = await _createManualUnitValue(payload)

    if (success) {
      router.push({ name: 'ManualUnitValueList' })
    }
    openMainLoader(false)
  }

  // lifecycle hooks
  const keys = { investment_portfolio: ['emitter', 'actions'] }
  onUnmounted(async () => {
    _resetKeys(keys)
  })

  onBeforeMount(async () => {
    await _getResources(keys)
  })

  return {
    informationFormRef,
    tabActiveIdx,
    headerProps,
    tabActive,
    tabs,
    onSubmit,
  }
}

export default useManualUnitValueCreate
