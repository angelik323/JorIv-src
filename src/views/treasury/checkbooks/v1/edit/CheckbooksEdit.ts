import { ICheckbookToEdit } from '@/interfaces/customs'
import { ITabs } from '@/interfaces/global'
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { storeToRefs } from 'pinia'
import { useRoute, useRouter } from 'vue-router'
import { defaultIconsLucide } from '@/utils'
import { useMainLoader } from '@/composables'
import { useCheckbooksStore, useResourceManagerStore } from '@/stores'

const useCheckbooksEdit = () => {
  const { _updateCheckbook, _getByIdCheckbook, _clearData } =
    useCheckbooksStore('v1')
  const { data_information_form, data_response } = storeToRefs(
    useCheckbooksStore('v1')
  )

  const router = useRouter()
  const route = useRoute()
  const searchId = +route.params.id

  const { _getResources, _resetKeys } = useResourceManagerStore('v1')
  const { openMainLoader } = useMainLoader()

  const keys = {
    treasury: [
      'business_trust',
      'banks_record_expenses',
      'bank_account',
      'reason_return_status',
    ],
  }

  const headerProps = {
    title: 'Editar chequera',
    breadcrumbs: [
      {
        label: 'Inicio',
        route: 'HomeView',
      },
      {
        label: 'Tesorería',
      },
      {
        label: 'Chequeras',
        route: 'CheckbooksList',
      },
      {
        label: 'Editar',
      },
      {
        label: `${searchId}`,
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

  const makeDataRequest = (): ICheckbookToEdit => {
    const form = data_information_form.value
    if (!form) throw new Error('El formulario de chequera no está disponible.')

    return {
      business_trust_id: form.business_trust_id ?? 0,
      bank_id: form.bank_id ?? 0,
      bank_account_id: form.bank_account_id ?? 0,
      range_from: form.range_from?.toString() ?? null,
      range_to: form.range_to?.toString() ?? null,
      assignment_date: form.assignment_date ?? '',
      status_id: form.status_id ?? 1,
    }
  }

  // Referencias a formularios
  const informationFormRef = ref()

  const validateForm = async () => {
    return (await informationFormRef.value?.validateForm()) ?? false
  }

  const onSubmit = async () => {
    if (!(await validateForm())) return

    openMainLoader(true)

    try {
      const payload = makeDataRequest()
      const success = await _updateCheckbook(payload, searchId)

      if (success) {
        router.push({ name: 'CheckbooksList' })
      }
    } finally {
      openMainLoader(false)
    }
  }

  onMounted(async () => {
    _clearData()
    openMainLoader(true)
    await Promise.all([_getResources(keys), _getByIdCheckbook(searchId)])
    openMainLoader(false)
  })

  onBeforeUnmount(() => {
    _resetKeys(keys)
  })

  return {
    data_response,
    headerProps,
    tabs,
    tabActive,
    tabActiveIdx,
    informationFormRef,
    onSubmit,
  }
}

export default useCheckbooksEdit
