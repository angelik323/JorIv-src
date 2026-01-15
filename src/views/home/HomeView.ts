import { useLogin } from '@/stores'
import { storeToRefs } from 'pinia'

const useHomeView = () => {
  const { isAdmin, loggedUser } = storeToRefs(useLogin())

  return {
    name: loggedUser.value?.user.name,
    isAdmin,
  }
}

export default useHomeView
