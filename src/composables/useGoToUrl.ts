import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'

type ParamsOrId = string | number | Record<string, any>

export const useGoToUrl = () => {
  const router = useRouter()
  const route = useRoute()

  const getUrlId = computed(() => route.params.id as string | undefined)
  const getUrlPath = computed(() => route.path)

  const goToURL = (
    name: string,
    paramsOrId?: ParamsOrId,
    query?: Record<string, any>
  ) => {
    const params =
      typeof paramsOrId === 'string' || typeof paramsOrId === 'number'
        ? { id: paramsOrId }
        : paramsOrId

    void router.push({ name, params, query })
  }

  return {
    goToURL,
    getUrlId,
    getUrlPath,
  }
}
