// vue | quasar | router
import { ref, onBeforeMount, onBeforeUnmount } from 'vue'
import { useRouter, useRoute } from 'vue-router'

// store
import { storeToRefs } from 'pinia'
import {
  useQualificationsMaintenanceStore,
  useResourceManagerStore,
} from '@/stores'

// composables
import { useAlert, useMainLoader } from '@/composables'

// utils
import { defaultIconsLucide } from '@/utils'
import { ITabs } from '@/interfaces/global'

const useQualificationsMaintenanceEdit = () => {
  const {
    _updateQualifications,
    _cleanQualificationsData,
    _getByIdQualifications,
  } = useQualificationsMaintenanceStore('v1')

  const { data_information_form } = storeToRefs(
    useQualificationsMaintenanceStore('v1')
  )
  const { _getResources, _resetKeys } = useResourceManagerStore('v1')
  const { showAlert } = useAlert()
  const router = useRouter()
  const { openMainLoader } = useMainLoader()
  const route = useRoute()
  const id = Array.isArray(route.params.id)
    ? route.params.id[0]
    : route.params.id

  // props
  const informationFormRef = ref()

  const headerProps = {
    title: 'Editar calificación emisor',
    breadcrumbs: [
      {
        label: 'Inicio',
        route: 'HomeView',
      },
      {
        label: 'Portafolio de inversiones',
      },
      {
        label: 'Mantenimiento calificación emisor',
        route: 'QualificationsMaintenanceList',
      },
      {
        label: 'Editar',
      },
      {
        label: id,
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

  const tabActive = ref(tabs.value[0].name)
  const tabActiveIdx = ref(
    tabs.value.findIndex((tab) => tab.name === tabActive.value)
  )

  const makeDataRequest = () => {
    const form = data_information_form.value

    return {
      cp_issuer_qualification_id: String(form?.cp_issuer_rating_new) ?? '',
      lp_issuer_qualification_id: String(form?.lp_issuer_rating_new) ?? '',
    }
  }

  // handlers / actions
  const validateForm = async () => {
    return (await informationFormRef.value?.validateForm()) ?? false
  }

  const onSubmit = async () => {
    if (!(await validateForm())) {
      showAlert('El registro no pudo ser actualizado.', 'error')
      return
    }

    openMainLoader(true)
    const payload = makeDataRequest()
    if (!payload) return
    const success = await _updateQualifications(payload, Number(id))

    if (success) {
      router.push({ name: 'QualificationsMaintenanceList' })
    }
    openMainLoader(false)
  }

  // lifecycle hooks
  const keys = {
    investment_portfolio: ['qualification_cp', 'qualification_lp'],
  }

  onBeforeMount(async () => {
    _cleanQualificationsData()
    openMainLoader(true)
    await Promise.all([_getResources(keys), _getByIdQualifications(Number(id))])
    openMainLoader(false)
  })

  onBeforeUnmount(() => {
    _resetKeys(keys)
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

export default useQualificationsMaintenanceEdit
