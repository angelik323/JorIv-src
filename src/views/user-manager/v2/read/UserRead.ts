import { onMounted, onUnmounted, reactive, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
// Composables & utils:
import { useMainLoader } from '@/components/loader/composable/useMainLoader'
// Stores:
import { useUserModuleStore } from '@/stores'

export const useReadUserView = () => {
  // Utils
  const route = useRoute()
  const router = useRouter()
  const { openMainLoader } = useMainLoader()
  // Stores
  const { _getUserById } = useUserModuleStore('v1')
  const { user_data } = storeToRefs(useUserModuleStore('v1'))

  // Variables
  const id = ref()

  const headerProps = reactive({
    title: 'Ver usuario',
    subtitle: '',
    breadcrumbs: [
      {
        label: 'Inicio',
        route: 'HomeView',
      },
      {
        label: 'Usuarios',
        route: 'ListUserView',
      },
      {
        label: 'Ver usuario',
      },
    ],
    showBackBtn: true,
  })

  const setDefaultValues = () => {
    user_data.value = null
  }

  const goToView = async (route: string, id?: number) => {
    await router.push({ name: route, params: { id } })
  }

  const getUser = async () => {
    await _getUserById(id.value)
  }

  onMounted(async () => {
    openMainLoader(true)
    id.value = route.params.id
    setDefaultValues()
    await getUser()
    openMainLoader(false)
  })

  onUnmounted(() => {
    setDefaultValues()
  })

  return {
    headerProps,

    // Methods
    goToView,
  }
}
