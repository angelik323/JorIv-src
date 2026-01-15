import { useLogin } from '@/stores'
import { storeToRefs } from 'pinia'
import { ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useQuasar } from 'quasar'
import { useMainLoader } from '@/composables'

export const useSideBarMenu = () => {
  const { menus } = storeToRefs(useLogin())
  const { _logoutAction } = useLogin()
  const { openMainLoader } = useMainLoader()
  const router = useRouter()
  const drawer = ref(false)
  const miniState = ref(false)
  const currentDropDown = ref<string>('')
  const currentRoute = ref<string>('dashboard')
  const notificationPanel = ref(false)

  const $q = useQuasar()

  const isActiveRoute = (identifier: string) =>
    currentRoute.value === identifier

  const drawerClick = (e: Event) => {
    if (miniState.value) {
      miniState.value = false
      e.stopPropagation()
    }
  }

  const dropdownSelected = (currentSelected: string) => {
    miniState.value = false
    currentDropDown.value = currentSelected
  }

  const updateRoute = (goToRoute: string) => {
    currentRoute.value = goToRoute
    currentDropDown.value = goToRoute
    router.replace({ name: goToRoute })
  }

  const logout = async () => {
    openMainLoader(true)
    await _logoutAction()
    openMainLoader(false)
    await router.push({ name: 'LoginView' })
  }

  const openPanelNotifications = () => {
    notificationPanel.value = !notificationPanel.value
  }

  watch(
    () => $q.screen.width,
    (val) => {
      if (val <= 621 && $q.screen.name == 'xs') {
        miniState.value = true
      }
    }
  )

  return {
    drawer,
    miniState,
    menus,
    currentDropDown,
    currentRoute,
    isActiveRoute,
    notificationPanel,

    drawerClick,
    dropdownSelected,
    updateRoute,
    logout,
    openPanelNotifications,
  }
}

export default useSideBarMenu
