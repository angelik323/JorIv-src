import { ref } from 'vue'
import { useMainLoader } from '@/components/loader/composable/useMainLoader'
import { useLogin } from '@/stores'
import { storeToRefs } from 'pinia'

const useHeaderProfileComponent = () => {
  const { loggedUser } = storeToRefs(useLogin())
  // const { _updateMyProfilePhoto } = useLogin()
  const { openMainLoader } = useMainLoader()

  const urlBlob = ref<string | null>(null)

  const capturePhotoFromDevice = async (_: File) => {
    openMainLoader(true)
    // await _updateMyProfilePhoto({ photo: file })

    setTimeout(() => {
      openMainLoader(false)
    }, 2000)
  }
  return {
    urlBlob,
    loggedUser,
    banner: '@/assets/images/profile/banner.png',

    // Methods
    capturePhotoFromDevice,
  }
}

export default useHeaderProfileComponent
